import os
import re

from huggingface_hub import InferenceClient  # type: ignore
from dotenv import load_dotenv  # type: ignore

load_dotenv()
print("Environment Keys Loaded:", os.getenv('HUGGINGFACE_API_PREDICTION'))  # This should print your API key if loaded correctly

# Load the text generation model from Hugging Face Hub
hf_api_key = os.getenv('HUGGINGFACE_API_PREDICTION')
if not hf_api_key:
    raise ValueError("Hugging Face API Key not set in environment variable")
text_generation_client = InferenceClient(token=hf_api_key, model="mistralai/Mixtral-8x7B-Instruct-v0.1")

# Define a function to format prompts for the model
def format_prompt_for_model(user_prompt, district, unitname, data):
    """
    Formats a prompt for the text generation model, providing context and instructions.

    Args:
        user_prompt: The specific text prompt to be processed by the model.
        district: The name of the district.
        unitname: The name of the police station
        data: The crime-related data to be analyzed.

    Returns:
        A formatted prompt string that includes system context, user context, and the provided data.
    """

    # Create prompt sections for system context and user context
    system_context_prompt = (
        "As an expert crime analyst, delve deeply into the relationships and interconnections between various crime-related fields such as victim demographics (sex, caste, address, profession), accused demographics (sex, caste, address, profession), total crime frequency in an area, latitude, longitude, and time of occurrence (day/week/month)."
        "Explore how aspects like the location (latitude and longitude), the nature of the crime (crime type), the characteristics of victims and accused (demographics), and the time of occurrence intersect and influence one another. Uncover how these factors might contribute to specific crime trends or hotspots."
        "Consider how socio-economic conditions, cultural dynamics, law enforcement practices, or other contextual factors such as festivals could be shaping these patterns. Weave together these different threads, offering insights that explain why these correlations exist and how they contribute to the overall crime landscape."
        "Pay particular attention to how different sections of the analysis are interconnected. For example, explore how the location, crime type, and time of occurrence relate to the victim and accused demographics, and vice versa. Reveal the hidden patterns that emerge when these fields are considered in conjunction with one another."
        "Additionally, make crime predictions for specific areas based on the identified correlations and patterns. These predictions should consider factors such as victim and accused demographics, crime types, locations, and time frames, as well as any potential influences from festivals or other events."
        "If the victim or accused count for specific demographic groups is dangerously high or common, highlight this as a potential risk factor or concern in your analysis."
        "DO NOT EXCEED MORE THAN 500 WORDS"
)

    user_context_prompt = (
        f"I am providing you with data on various crime-related fields in the {district} district and {unitname} unit name. Please provide an analysis on this data and identify any potential connections or correlations between these fields, as per the guidelines provided in the system context prompt. Based on your analysis, make crime predictions for specific areas."
        f"The data is as follows:\n\n{data}"
)

    # Combine all prompt sections into a single formatted prompt
    combined_prompt = f"<s>[SYS] {system_context_prompt} [/SYS]\n[INST] {user_context_prompt} [/INST]"
    return combined_prompt


def generate_prediction_analysis(analysis_text, district, unitname, data):
    """
    Generates text using the loaded model, with options for controlling the output.

    Args:
        analysis_text: The specific text prompt to be processed by the model.

    Returns:
        The generated text as a string.
    """

    # Set model parameters for text generation
    generation_parameters = dict(
        temperature=0.5,  # Controls randomness of generated text
        max_new_tokens=1024,  # Maximum number of tokens to generate
        top_p=0.96,  # Likelihood of selecting common words
        repetition_penalty=1.0,  # Discourages repetition
        do_sample=True,
        seed=42,
    )

    # Format the prompt for the model
    model_ready_prompt = format_prompt_for_model(analysis_text, district, unitname, data)

    # Generate text using the model
    generated_text_stream = text_generation_client.text_generation(
        model_ready_prompt,
        **generation_parameters,
        stream=True,
        details=True,
        return_full_text=True,
    )

    # Combine generated text segments into a final output string
    final_output_text = ""
    for text_segment in generated_text_stream:
        final_output_text += text_segment.token.text

    return final_output_text
