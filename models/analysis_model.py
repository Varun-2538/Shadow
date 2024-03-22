from huggingface_hub import InferenceClient
import os
import re

text_generation_client = InferenceClient("mistralai/Mixtral-8x7B-Instruct-v0.1")


def format_prompt_for_model(user_prompt):
    """
    Formats a prompt for the text generation model, providing context and instructions.
    Args:
        user_prompt: The specific text prompt to be processed by the model.
    Returns:
        A formatted prompt string that includes system context and instructions.
    """

    system_context_prompt = (
    "You are a crime data analyst tasked with examining crime statistics and identifying patterns, trends, and potential correlations between different fields in the data provided."
    "Your role is to closely examine the frequencies and percentages of various crime characteristics in a specific district."
    "Using your analytical skills, you should identify any potential connections or relationships between these different data fields based solely on the numerical information given, without making assumptions or creating hypothetical stories."
    "If certain categories like age groups, ethnicities, or crime types appear to be over-represented in the data, you should point out those numerical disparities objectively."
    "Your goal is to provide an insightful quantitative analysis of the data, highlighting any statistically significant correlations or patterns that emerge from the numbers themselves."
    )
    user_context_prompt = (
        "I am providing you with the top 3 frequencies of certain crime-related fields in the district of Bagalkot. Please analyze this data and identify any potential connections or correlations between these fields. Propose explanations or reasons for the identified links based on your knowledge and experience as a crime detective.\n\n"
        "The data is as follows:\n\n"
        "1) 50% of all crimes committed in the Bagalkot district are murders.\n"
        "2) 35% of all crimes committed in the Bagalkot district are by individuals from the Muslim community.\n"
        "3) 45% of all crimes committed in the Bagalkot district are by individuals aged 25-30 years old."
    )

    example_prompt = (
        "Based on the provided data, a potential connection could be that a significant portion of the murders in the Bagalkot district are committed by individuals from the Muslim community aged 25-30 years old. "
        "This hypothesis is supported by the high frequencies of murders (50%), crimes committed by the Muslim community (35%), and crimes committed by individuals aged 25-30 (45%). "
        "A possible explanation for this interconnection could be that socioeconomic factors or religious/cultural influences within the Muslim community in the 25-30 age group might be driving individuals towards involvement in organized crime groups or activities that lead to violent crimes like murder. "
        "Alternatively, the high murder rate among this specific demographic could be a result of targeted violence by other groups or criminal organizations against individuals from the Muslim community aged 25-30. "
        "However, further investigation is needed to validate these hypotheses and identify the root causes and interconnected factors behind these crime trends."
    )

    combined_prompt = f"<s>[SYS] {system_context_prompt} [/SYS]\n[INST] {user_context_prompt} [/INST]\n[Example] {example_prompt} [/Example]"
    return combined_prompt


def generate_crime_analysis(
    prompt,
    creativity_level=0.3,  # Controls the randomness of the generated text
    max_tokens_to_generate=512,
    top_p_filtering_ratio=0.96,  # Controls the likelihood of selecting common words
    repetition_penalty=1.0,
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

    creativity_level = float(creativity_level)
    if creativity_level < 1e-2:
        creativity_level = 1e-2
    top_p_filtering_ratio = float(top_p_filtering_ratio)

    generation_parameters = dict(
        temperature=creativity_level,
        max_new_tokens=max_tokens_to_generate,
        top_p=top_p_filtering_ratio,
        repetition_penalty=repetition_penalty,
        do_sample=True,
        seed=42,
    )

    model_ready_prompt = format_prompt_for_model(prompt)

    generated_text_stream = text_generation_client.text_generation(
        model_ready_prompt,
        **generation_parameters,
        stream=True,
        details=True,
        return_full_text=True,
    )

    final_output_text = ""
    for text_segment in generated_text_stream:
        final_output_text += text_segment.token.text

    return final_output_text
