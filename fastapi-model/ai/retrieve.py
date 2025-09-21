"""
Retriever that supports both faiss-cpu and faiss-gpu installations.

Usage:
- If you have no GPU or want the simplest route: `pip install faiss-cpu`
- If you have CUDA and want GPU acceleration: `pip install faiss-gpu` (or install via conda channels)

This code will:
- Try to use the requested device (use_gpu=True). If faiss was not built with GPU support it will fall back to CPU and print a warning.
- Ensure embeddings are float32 and contiguous (required by FAISS).
- Be robust to common shape/dtype issues.

Notes:
- FAISS Python module name is `faiss` in both `faiss-cpu` and `faiss-gpu` distributions.
- If `faiss` cannot be imported at all, the code raises a helpful ImportError suggesting installation commands.
"""

import json
import os
import warnings
from typing import List

import numpy as np
from sentence_transformers import SentenceTransformer

# Try importing faiss and provide a helpful error message if it's missing.
try:
    import faiss
except Exception as e:  # ImportError or other import-time errors
    raise ImportError(
        "FAISS Python module not found.\n"
        "If you want CPU-only support run: pip install faiss-cpu\n"
        "If you want GPU support (and have CUDA) try: pip install faiss-gpu\n"
        "Alternatively, consider installing via conda: conda install -c pytorch faiss-cpu\n"
        f"Original import error: {e}"
    )


class Retriever:
    def __init__(
        self,
        model_name: str = "all-MiniLM-L6-v2",
        data_dir: str = "data",
        embeddings_filename: str = "embed.npy",
        json_filename: str = "college_data.json",
        use_gpu: bool = False,
        gpu_device: int = 0,
    ):
        """Create a Retriever backed by FAISS.

        Args:
            model_name: sentence-transformers model name
            data_dir: directory containing embeddings and json
            embeddings_filename: .npy file with precomputed embeddings
            json_filename: json file with the documents
            use_gpu: attempt to use faiss-gpu (if available). Falls back to CPU if not available.
            gpu_device: which GPU device to use if GPU is requested (0, 1, ...)
        """
        DATA_DIR = data_dir
        EMBEDDINGS_PATH = os.path.join(DATA_DIR, embeddings_filename)
        JSON_DATA_PATH = os.path.join(DATA_DIR, json_filename)

        try:
            print("Retriever: Loading embedding model...")
            self.model = SentenceTransformer(model_name)

            print(
                f"Retriever: Loading pre-computed embeddings from {EMBEDDINGS_PATH} ..."
            )
            self.embeddings = np.load(EMBEDDINGS_PATH)

            # Ensure embeddings shape and dtype are what faiss expects
            if self.embeddings.ndim == 1:
                # single vector saved; make it 2D
                self.embeddings = self.embeddings.reshape(1, -1)

            # FAISS requires float32
            if self.embeddings.dtype != np.float32:
                print("Retriever: casting embeddings to float32...")
                self.embeddings = self.embeddings.astype("float32")

            # Make contiguous
            if not self.embeddings.flags["C_CONTIGUOUS"]:
                self.embeddings = np.ascontiguousarray(self.embeddings)

            print(f"Retriever: Loading data from {JSON_DATA_PATH} ...")
            with open(JSON_DATA_PATH, "r") as f:
                self.college_data = json.load(f)

            d = self.embeddings.shape[1]
            print(f"Retriever: Creating FAISS index (dimension={d})...")

            # Create a CPU index first
            cpu_index = faiss.IndexFlatL2(d)

            # If user wants GPU, attempt to move index to GPU
            self._is_gpu_index = False
            if use_gpu:
                try:
                    # Check that FAISS has GPU support
                    if not hasattr(faiss, "StandardGpuResources"):
                        raise AttributeError(
                            "faiss has no attribute 'StandardGpuResources' (no GPU support compiled)"
                        )

                    print("Retriever: Initializing FAISS GPU resources...")
                    self._gpu_res = faiss.StandardGpuResources()
                    print(f"Retriever: Moving index to GPU device {gpu_device}...")
                    self.index = faiss.index_cpu_to_gpu(
                        self._gpu_res, gpu_device, cpu_index
                    )
                    self._is_gpu_index = True
                except Exception as e:
                    warnings.warn(
                        f"Requested GPU index but failed to initialize GPU support: {e} -- falling back to CPU index.",
                        RuntimeWarning,
                    )
                    self.index = cpu_index
            else:
                self.index = cpu_index

            # Add embeddings
            print("Retriever: Adding embeddings to FAISS index...")
            self.index.add(self.embeddings)

            print("Retriever initialized successfully.")

        except FileNotFoundError as e:
            print(
                f"Error initializing Retriever: {e}. Did you run embeddings.py first?"
            )
            raise
        except Exception as e:
            print(f"Unexpected error initializing Retriever: {e}")
            raise

    def find_similar_colleges(self, query: str, top_k: int = 5) -> List[dict]:
        """Return top_k most similar college records for the input query."""
        query_embedding = self.model.encode([query])

        # Ensure dtype and contiguity
        if query_embedding.dtype != np.float32:
            query_embedding = query_embedding.astype("float32")
        if not query_embedding.flags["C_CONTIGUOUS"]:
            query_embedding = np.ascontiguousarray(query_embedding)

        # Ensure top_k is not larger than the number of vectors in the index
        n_vectors = (
            self.index.ntotal
            if hasattr(self.index, "ntotal")
            else (self.embeddings.shape[0])
        )
        k = min(top_k, max(1, n_vectors))

        distances, indices = self.index.search(query_embedding, k)

        # FAISS returns -1 for empty results; filter them
        results = []
        for idx in indices[0]:
            if idx == -1:
                continue
            results.append(self.college_data[idx])

        return results
