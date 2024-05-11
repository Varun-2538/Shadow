import os
import re

from huggingface_hub import InferenceClient  # type: ignore
from dotenv import load_dotenv  # type: ignore

load_dotenv()
print("Environment Keys Loaded:", os.getenv('HUGGINGFACE_API_BEATWISE'))  # This should print your API key if loaded correctly

# Load the text generation model from Hugging Face Hub
hf_api_key = os.getenv('HUGGINGFACE_API_BEATWISE')
if not hf_api_key:
    raise ValueError("Hugging Face API Key not set in environment variable")
text_generation_client = InferenceClient(token=hf_api_key, model="mistralai/Mixtral-8x7B-Instruct-v0.1")

# Define a function to format prompts for the model
def format_prompt_for_model(user_prompt, district, unitname, beat_name, data):
    """
    Formats a prompt for the text generation model, providing context and instructions.

    Args:
        user_prompt: The specific text prompt to be processed by the model.
        district: The name of the district.
        unitname: The name of the police station
        beat_name: The name of the beat of the police station
        data: The crime-related data to be analyzed.

    Returns:
        A formatted prompt string that includes system context, user context, and the provided data.
    """

    # Create prompt sections for system context and user context
    system_context_prompt = (
        "As an expert crime analyst, delve deeply into the relationships and interconnections between various crime-related fields such as place_of_offense, act_section, fir_type, latitude, longitude, Crime_Type, victim_profession, victim_caste, accused_profession, and accused_caste. Don't treat them as independent observations, but rather as interrelated factors that shed light on underlying patterns of criminal behavior."
        "Explore how aspects like the location (place_of_offense, latitude, and longitude), the nature of the crime (act_section, fir_type, and Crime_Type), and the characteristics of victims and accused (profession and caste) intersect and influence one another. Uncover how these factors might contribute to specific crime trends or hotspots."
        "Consider how socio-economic conditions, cultural dynamics, law enforcement practices, or other contextual factors could be shaping these patterns. Weave together these different threads, offering insights that explain why these correlations exist and how they contribute to the overall crime landscape."
        "Pay particular attention to how different sections of the analysis are interconnected. For example, explore how the location and crime type relate to the victim and accused characteristics, and vice versa. Reveal the hidden patterns that emerge when these fields are considered in conjunction with one another."
        "Based on your comprehensive analysis, propose targeted improvement plans for the specific beat to reduce the crimes being committed. These improvement plans should address the interconnected factors contributing to the criminal activity in that area and provide specific, data-driven recommendations tailored to the unique characteristics and patterns identified in your analysis."
        "DO NOT EXCEED MORE THAN 500 WORDS"
    )

    user_context_prompt = (
        f"I am providing you with the top frequencies of certain crime-related fields in the {district} district, {unitname} unit name and {beat_name} beat name. Please provide an analysis on this data and identify any potential connections or correlations between these fields. Propose explanations or reasons for the identified links based on your knowledge and experience as a crime detective.\n\n"
        f"The data is as follows:\n\n{data}"
    )

    # Combine all prompt sections into a single formatted prompt
    combined_prompt = f"<s>[SYS] {system_context_prompt} [/SYS]\n[INST] {user_context_prompt} [/INST]"
    return combined_prompt


def generate_beatwise_analysis(analysis_text, district, unitname, beat_name, data):
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
    model_ready_prompt = format_prompt_for_model(analysis_text, district, unitname, beat_name, data)

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
