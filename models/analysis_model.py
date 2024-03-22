from huggingface_hub import InferenceClient
import os
import re

# Load the text generation model from Hugging Face Hub
text_generation_client = InferenceClient("mistralai/Mixtral-8x7B-Instruct-v0.1")

# Define a function to format prompts for the model
def format_prompt_for_model(user_prompt):
    """
    Formats a prompt for the text generation model, providing context and instructions.

    Args:
        user_prompt: The specific text prompt to be processed by the model.

    Returns:
        A formatted prompt string that includes system context, user context, and an example.
    """

    # Create prompt sections for system context, user context, and an example
    system_context_prompt = (
        "You are an experienced crime detective tasked with analyzing data..."  # Explain the task and role
    )
    user_context_prompt = (
        "Please analyze this crime data and identify potential connections..."  # Provide specific data and instructions
    )
    example_prompt = (
        "Based on the provided data, a potential connection could be..."  # Offer an illustrative example
    )

    # Combine all prompt sections into a single formatted prompt
    combined_prompt = f"<s>[SYS] {system_context_prompt} [/SYS]\n[INST] {user_context_prompt} [/INST]\n[Example] {example_prompt} [/Example]"
    return combined_prompt

# Define a function to generate text using the model
def generate_crime_analysis(
    prompt,
    creativity_level=0.3,  # Controls randomness of generated text
    max_tokens_to_generate=512,  # Maximum number of tokens to generate
    top_p_filtering_ratio=0.96,  # Likelihood of selecting common words
    repetition_penalty=1.0,  # Discourages repetition
):
    """
    Generates text using the loaded model, with options for controlling the output.

    Args:
        prompt: The formatted prompt string to be used for text generation.
        creativity_level: Controls the randomness of the generated text (higher = more creative).
        max_tokens_to_generate: The maximum number of tokens to generate.
        top_p_filtering_ratio: Controls the likelihood of selecting common words (higher = less surprising).
        repetition_penalty: Discourages the model from repeating itself.

    Returns:
        The generated text as a string.
    """

    # Set model parameters for text generation
    generation_parameters = dict(
        temperature=creativity_level,
        max_new_tokens=max_tokens_to_generate,
        top_p=top_p_filtering_ratio,
        repetition_penalty=repetition_penalty,
        do_sample=True,
        seed=42,
    )

    # Format the prompt for the model
    model_ready_prompt = format_prompt_for_model(prompt)

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
