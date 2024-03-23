from huggingface_hub import InferenceClient
import os
import re

# Load the text generation model from Hugging Face Hub
text_generation_client = InferenceClient("mistralai/Mixtral-8x7B-Instruct-v0.1")

# Define a function to format prompts for the model
def format_prompt_for_model(user_prompt, district, police_station, data):
    """
    Formats a prompt for the text generation model, providing context and instructions.

    Args:
        user_prompt: The specific text prompt to be processed by the model.
        district: The name of the district.
        police_station: The name of the police station.
        data: The crime-related data to be analyzed.

    Returns:
        A formatted prompt string that includes system context, user context, and the provided data.
    """

    # Create prompt sections for system context and user context
    system_context_prompt = (
        "You are an experienced crime detective tasked with analyzing data and finding interconnections and correlations between different crime-related fields for a specific district and police station. "
        "Your role is to closely examine the provided information, which contains the top three frequencies of certain crime characteristics in the given district and police station. "
        "Using your analytical skills and knowledge of criminal behavior patterns, you should identify potential links or connections between these fields, and how multiple fields might be correlated or interdependent within the context of the specified district and police station. "
        "If the data indicates that a particular age group, ethnicity, or crime type dominates the statistics, you should not only propose a possible explanation or reason for this connection but also explore how it might be linked to or influenced by other fields specific to the given district and police station. "
        "Your goal is to provide insightful analysis and hypotheses that could aid in further investigation or understanding the underlying factors and interconnections contributing to the crime trends in the specified district and police station."
    )
    
    user_context_prompt = (
        f"I am providing you with the top frequencies of certain crime-related fields in the {district} district and {police_station} police station. Please analyze this data and identify any potential connections or correlations between these fields. Propose explanations or reasons for the identified links based on your knowledge and experience as a crime detective.\n\n"
        f"The data is as follows:\n\n{data}"
    )

    # Combine all prompt sections into a single formatted prompt
    combined_prompt = f"<s>[SYS] {system_context_prompt} [/SYS]\n[INST] {user_context_prompt} [/INST]"
    return combined_prompt

def generate_crime_analysis(analysis_text, district, police_station, data):
    """
    Generates text using the loaded model, with options for controlling the output.

    Args:
        analysis_text: The specific text prompt to be processed by the model.

    Returns:
        The generated text as a string.
    """

    # Set model parameters for text generation
    generation_parameters = dict(
        temperature=0.3,  # Controls randomness of generated text
        max_new_tokens=1024,  # Maximum number of tokens to generate
        top_p=0.96,  # Likelihood of selecting common words
        repetition_penalty=1.0,  # Discourages repetition
        do_sample=True,
        seed=42,
    )

    # Format the prompt for the model
    model_ready_prompt = format_prompt_for_model(analysis_text, district, police_station, data)
    
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