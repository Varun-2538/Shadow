import os
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from analysis_model import generate_crime_analysis

# Create Flask app instance
app = Flask(__name__)

# Enable CORS for all routes and domains
CORS(app)

# Get the project directory
project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Get the parent directory

# Construct the file path for the CSV file
csv_file_path = os.path.join(project_dir, 'dataset', 'updated_ml_model_ready_dataset.csv')

# Load crime data from CSV
df = pd.read_csv(csv_file_path)
# Filter rows with zero latitude or longitude (optional, adjust for your data)
df = df[(df['latitude'] != 0) & (df['longitude'] != 0)]

# API endpoint for retrieving crime data (GET request)
@app.route('/data', methods=['GET'])
def get_data():
    # Extract pagination parameters from the query string
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=100, type=int)

    # Calculate start and end index for data slice based on pagination
    start = (page - 1) * per_page
    end = start + per_page

    # Get the data slice as dictionary records
    data = df[start:end].to_dict(orient='records')

    # Handle missing values by converting them to None
    for record in data:
        for key, value in record.items():
            if pd.isnull(value):
                record[key] = None

    # Return JSON response containing the data
    return jsonify(data)

# API endpoint for generating crime analysis (POST request)
@app.route('/crime_analysis', methods=['POST'])
def crime_analysis():
    try:
        # Get JSON data from the request
        data = request.json

        # Extract analysis text from JSON (error handling for missing text)
        analysis_text = data.get('analysis_text', '')
        if not analysis_text:
            return jsonify({'error': 'Analysis text is required'}), 400  # Bad Request

        # Generate crime analysis using LLM function
        crime_analysis = generate_crime_analysis(analysis_text)

        # Return JSON response containing the generated analysis
        return jsonify({'analysis': crime_analysis}), 200  # Success
    except Exception as e:
        # Handle unexpected errors
        return jsonify({'error': str(e)}), 500  # Internal Server Error

# Run the Flask app in debug mode on port 8000
if __name__ == '__main__':
    app.run(debug=True, port=8000)