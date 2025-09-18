"""import os
import json
from ai.base import AIPlatform
import google.generativeai as genai
import logging
from google.generativeai.types import GenerationConfig
import pandas as pd

# Configure logging
logging.basicConfig(level=logging.INFO)


class Gemini(AIPlatform):
    def __init__(self, api_key: str, system_prompt: str = None):

        self.api_key = api_key
        self.system_prompt = system_prompt
        genai.configure(api_key=self.api_key)
        self.generation_config = GenerationConfig(
            max_output_tokens=8192,
        )
        self.model = genai.GenerativeModel("gemini-1.5-pro-latest",
                                           generation_config=self.generation_config
                                           )

    def chat(self, prompt: str, dataset_path: str = None) -> str:

        full_prompt = prompt

        if self.system_prompt:
            full_prompt = f"{self.system_prompt}\n\n{full_prompt}"


        if dataset_path:
            try:
                df=pd.read_csv(dataset_path)

                # Format the dataset for the prompt
                dataset = df.to_dict(orient='records')
                dataset_str = json.dumps(dataset, indent=2)
                full_prompt = f"{full_prompt}\n\nHere is the dataset you should use for recommendations:\n\n{dataset_str}"

                logging.info(f"Successfully loaded and added dataset from {dataset_path} to the prompt.")
            except FileNotFoundError:
                logging.error(f"Dataset file not found at {dataset_path}")
                return "Error: Dataset file not found. Please check the file path."
            except json.JSONDecodeError:
                logging.error(f"Error decoding JSON from {dataset_path}. Please check the file's format.")
                return "Error: Invalid JSON format in dataset file."
            except Exception as e:
                logging.error(f"An unexpected error occurred while processing the dataset: {e}")
                return "Error: An unexpected error occurred while processing the dataset."

        try:

            print("----------- FINAL PROMPT SENT TO GEMINI -----------")
            print(full_prompt)
            print("-------------------------------------------------")
            # -----------------------------------------------------
            logging.info("Sending request to Gemini API...")
            response = self.model.generate_content(full_prompt)
            logging.info("Received response from Gemini API.")
            return response.text
        except Exception as e:
            logging.error(f"Error calling Gemini API: {e}")
            return f"Error: An error occurred while generating the response: {e}"
"""