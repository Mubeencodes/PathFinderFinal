# ai/ollamas.py
import logging
import time
from typing import List, Optional

import ollama

# Replace with your project's AIPlatform base import if different
from ai.base import AIPlatform
from fastapi.concurrency import run_in_threadpool

__all__ = ["Ollama", "OllamaPlatform"]


class Ollama(AIPlatform):
    """
    Ollama client wrapper.

    - Default: lazy connection (no network calls during import).
    - If you want the app to fail fast on startup when Ollama is unreachable,
      initialize with connect_on_init=True.
    """

    def __init__(
        self,
        model: str = "mistral",
        host: str = "http://127.0.0.1:11434",
        connect_on_init: bool = False,
        max_retries: int = 3,
        backoff_base: float = 0.5,
    ):
        self.requested_model = model
        self.host = host
        self.max_retries = max_retries
        self.backoff_base = backoff_base

        # set later by _connect_and_validate
        self.client: Optional[ollama.Client] = None
        self.active_model: Optional[str] = None

        if connect_on_init:
            # This will raise ConnectionError if it fails repeatedly.
            self._connect_and_validate()

    # ---------- Sync helpers (run inside threadpool) ----------

    def _create_client(self) -> ollama.Client:
        return ollama.Client(host=self.host)

    def _list_models_sync(self, client: ollama.Client) -> List[str]:
        """
        Call client.list() and return a list of model names.
        Supports new ollama versions where .list() returns objects.
        """
        raw = client.list()
        if raw is None:
            return []

        # Case 1: Newer clients: a container with .models list
        if hasattr(raw, "models"):
            return [m.model for m in raw.models]

        # Case 2: Already a list
        if isinstance(raw, list):
            out = []
            for item in raw:
                if hasattr(item, "model"):  # object style
                    out.append(item.model)
                elif isinstance(item, str):
                    out.append(item)
                elif isinstance(item, dict):
                    out.append(item.get("name") or item.get("id") or str(item))
                else:
                    out.append(str(item))
            return out

        # Case 3: dict (older client shapes)
        if isinstance(raw, dict):
            if "models" in raw and isinstance(raw["models"], list):
                return [
                    m.get("name") or m.get("id") or str(m)
                    for m in raw["models"]
                    if isinstance(m, dict)
                ]
            return list(raw.keys())

        # Fallback
        return [str(raw)]

    def _choose_model_from_available(self, available: List[str]) -> Optional[str]:
        if not available:
            return None
        if self.requested_model in available:
            return self.requested_model
        # case-insensitive match
        lower_map = {m.lower(): m for m in available}
        if self.requested_model.lower() in lower_map:
            return lower_map[self.requested_model.lower()]
        # fallback to first
        logging.warning(
            "Requested model '%s' not found on Ollama; falling back to '%s'.",
            self.requested_model,
            available[0],
        )
        return available[0]

    def _connect_and_validate(self):
        """
        Try to create an ollama.Client and pick an active model.
        Raises ConnectionError on persistent failures.
        """
        last_exc: Optional[Exception] = None
        for attempt in range(1, self.max_retries + 1):
            try:
                client = self._create_client()
                available = self._list_models_sync(client)
                chosen = self._choose_model_from_available(available)
                if chosen is None:
                    logging.warning(
                        "Connected to Ollama at %s but couldn't enumerate models. "
                        "Will keep requested model '%s' and try at runtime.",
                        self.host,
                        self.requested_model,
                    )
                    self.client = client
                    self.active_model = self.requested_model
                else:
                    self.client = client
                    self.active_model = chosen
                    logging.info(
                        "Connected to Ollama at %s; using model '%s' (requested '%s').",
                        self.host,
                        self.active_model,
                        self.requested_model,
                    )
                return
            except Exception as exc:
                last_exc = exc
                wait = self.backoff_base * (2 ** (attempt - 1))
                logging.warning(
                    "Attempt %d/%d to connect to Ollama failed: %s; retrying in %.2fs",
                    attempt,
                    self.max_retries,
                    exc,
                    wait,
                )
                time.sleep(wait)
        logging.error("Exhausted %d connection attempts to Ollama.", self.max_retries)
        raise ConnectionError("Could not connect to Ollama") from last_exc

    # ---------- Async-facing methods ----------

    async def _ensure_client_async(self):
        """
        Ensure the client exists; if not, call the blocking connect in a threadpool.
        """
        if self.client and self.active_model:
            return
        await run_in_threadpool(self._connect_and_validate)

    async def chat(self, prompt: str, model: Optional[str] = None) -> str:
        """
        Send prompt to Ollama and return a text string.
        Optionally specify a transient `model` to use for this call.
        """
        model_to_use = model or self.active_model or self.requested_model

        # lazy connect if necessary
        await self._ensure_client_async()

        # If user requested a different model for this call, verify availability
        if model and model != self.active_model:

            def sync_check_model():
                available = self._list_models_sync(self.client)
                for m in available:
                    if m.lower() == model.lower():
                        return m
                return None

            chosen = await run_in_threadpool(sync_check_model)
            if chosen:
                model_to_use = chosen
            else:
                logging.warning(
                    "Transient requested model '%s' not available. Using '%s'.",
                    model,
                    self.active_model,
                )
                model_to_use = self.active_model

        def sync_generate():
            # call generate in a tolerant way across client versions
            try:
                return self.client.generate(
                    model=model_to_use, prompt=prompt, stream=False
                )
            except TypeError:
                return self.client.generate(
                    prompt=prompt, model=model_to_use, stream=False
                )

        raw = await run_in_threadpool(sync_generate)

        if raw is None:
            return ""
        if isinstance(raw, str):
            return raw
        if isinstance(raw, dict):
            for k in ("response", "text", "output", "results"):
                if k in raw:
                    val = raw[k]
                    if isinstance(val, list):
                        return "\n".join(map(str, val))
                    return str(val)
            # return first string-like value found
            for v in raw.values():
                if isinstance(v, str):
                    return v
            return str(raw)
        # Handle objects with attributes (Ollama dataclass style)
        if hasattr(raw, "response"):
            return str(raw.response)
        if hasattr(raw, "text"):
            return str(raw.text)
        return str(raw)


OllamaPlatform = Ollama
