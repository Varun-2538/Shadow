from huggingface_hub import InferenceClient # type: ignore
import os
import re
from dotenv import load_dotenv # type: ignore

load_dotenv()
print("Environment Keys Loaded:", os.getenv('HUGGINGFACE_API_SPATIAL'))  # This should print your API key if loaded correctly

# Load the text generation model from Hugging Face Hub
hf_api_key = os.getenv('HUGGINGFACE_API_SPATIAL')
if not hf_api_key:
    raise ValueError("Hugging Face API Key not set in environment variable")
text_generation_client = InferenceClient(token=hf_api_key, model= "mistralai/Mixtral-8x7B-Instruct-v0.1")

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
        "As an expert crime detective, delve deeply into the relationships and interconnections between various crime-related fields. Don't treat them as independent observations, but rather as interrelated factors that shed light on underlying patterns of criminal behavior. Uncover how aspects like age, location, profession, and crime type intersect and influence one another. "
        "For example, if certain age groups are predominantly involved in specific crime types, explore how their profession or location might contribute to this trend. Go beyond surface-level observations to identify complex interdependencies. Consider how socio-economic conditions, cultural dynamics, or enforcement practices could be shaping these patterns. "
        "Weave together these different threads, offering insights that explain why these correlations exist and how they contribute to the overall crime landscape. Your goal is to provide a comprehensive analysis that not only identifies these connections but also proposes hypotheses to understand root causes and facilitate more effective crime prevention strategies. "
        "Pay particular attention to how different sections of the analysis are interconnected. For example, explore how age and crime type relate to location and profession, and vice versa. Reveal the hidden patterns that emerge when these fields are considered in conjunction with one another."
        "DO NOT EXCEED MORE THAN 300 WORDS"
    )


    user_context_prompt = (
        f"I am providing you with the top frequencies of certain crime-related fields in the {district} district and {police_station} police station. Please provide an analysis on this data and identify any potential connections or correlations between these fields. Propose explanations or reasons for the identified links based on your knowledge and experience as a crime detective.\n\n"
        f"The data is as follows:\n\n{data}"
    )

    # Combine all prompt sections into a single formatted prompt
    combined_prompt = f"<s>[SYS] {system_context_prompt} [/SYS]\n[INST] {user_context_prompt} [/INST]"
    return combined_prompt

def generate_spatial_analysis(analysis_text, district, police_station, data):
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
    
    final_output_text = final_output_text.replace('**', '')
    final_output_text = final_output_text.replace('</s>', '')

    return final_output_text