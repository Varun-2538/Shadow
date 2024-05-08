import os
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from spatial import generate_spatial_analysis
from beatwise import generate_beatwise_analysis
import traceback

# Create Flask app instance
app = Flask(__name__)

# Enable CORS for all routes and domains
CORS(app)

# Get the project directory
project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Get the parent directory

# Construct the file path for the CSV file
csv_file_path = os.path.join(project_dir, 'models', 'dataset', 'updated_ml_model_ready_dataset.csv')

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
@app.route('/spatial_analysis', methods=['POST'])
def spatial_analysis():
    try:
        data = request.json
        app.logger.debug('Received data: %s', data)  # or use print(f"Received data: {data}")

        analysis_text = data.get('analysis_text', '')
        district = data.get('district', '')
        police_station = data.get('police_station', '')

        if not analysis_text:
            return jsonify({'error': 'Analysis text is required'}), 400
        
        print("Received analysis text:", analysis_text)
        # Generate crime analysis using LLM function

        spatial_analysis = generate_spatial_analysis(analysis_text, district, police_station, data)
        print("Returning analysis result:", spatial_analysis)


        return jsonify({'analysis': spatial_analysis}), 200
    except Exception as e:
        app.logger.error('Failed to generate analysis: %s\n%s', str(e), traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    
    
@app.route('/beatwise_analysis', methods=['POST'])
def beatwise_analysis():
    try:
        data = request.json
        app.logger.debug('Received data: %s', data)  # or use print(f"Received data: {data}")

        analysis_text = data.get('analysis_text', '')
        district = data.get('district', '')
        police_station = data.get('police_station', '')

        if not analysis_text:
            return jsonify({'error': 'Analysis text is required'}), 400
        
        print("Received analysis text:", analysis_text)
        # Generate crime analysis using LLM function

        beatwise_analysis = generate_beatwise_analysis(analysis_text, district, police_station, data)
        print("Returning analysis result:", beatwise_analysis)


        return jsonify({'analysis': beatwise_analysis}), 200
    except Exception as e:
        app.logger.error('Failed to generate analysis: %s\n%s', str(e), traceback.format_exc())
        return jsonify({'error': str(e)}), 500

# Run the Flask app in debug mode on port 8000
if __name__ == '__main__':
    app.run(debug=True, port=8000)