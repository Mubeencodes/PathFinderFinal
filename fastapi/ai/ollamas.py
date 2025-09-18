import ollama
from ai.base import AIPlatform
import logging

class Ollama(AIPlatform):
    def __init__(self, model: str = "mistral"):
        self.model = model
        self.client = ollama.Client()
        logging.info(f"OllamaPlatform initialized with model: {self.model}")

    def chat(self, prompt: str) -> str:
        try:
            logging.info(f"Sending prompt to Ollama model: {self.model}")
            response_data = self.client.generate(model=self.model, prompt=prompt, stream=False)
            logging.info("Received response from Ollama.")
            return response_data.get("response", "Error: No 'response' key in Ollama's output.")
        except Exception as e:
            logging.error(f"Error communicating with Ollama server: {e}")
            return f"Error: Could not connect to the Ollama server. Please ensure it is running."