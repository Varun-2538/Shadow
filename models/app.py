import os
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from spatial import generate_spatial_analysis
from beatwise import generate_beatwise_analysis
from prediction import generate_crime_prediction
from deployment import generate_deployment_plan
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
df = pd.read_csv(csv_file_path, low_memory=False)

# Print column names for debugging
# print("Column names:", df.columns)

# Filter rows with zero latitude or longitude (optional, adjust for your data)
if 'latitude' in df.columns and 'longitude' in df.columns:
    df = df[(df['latitude'] != 0) & (df['longitude'] != 0)]
else:
    raise KeyError("The required columns 'latitude' and 'longitude' are not present in the CSV file")

# API endpoint for retrieving crime data (GET request)
@app.route("/data", methods=['GET'])
def get_data():
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 100))

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

        return jsonify(data)
    except Exception as e:
        traceback_str = traceback.format_exc()
        return jsonify({"error": str(e), "traceback": traceback_str}), 500

# API endpoint for generating spatial analysis (POST request)
@app.route("/spatial_analysis", methods=['POST'])
def spatial_analysis():
    try:
        data = request.json
        analysis_text = data.get('analysis_text')
        district = data.get('district')
        police_station = data.get('police_station')

        if not analysis_text:
            return jsonify({"error": "Analysis text is required"}), 400

        spatial_analysis_result = generate_spatial_analysis(analysis_text, district, police_station, data)
        return jsonify({"analysis": spatial_analysis_result})
    except Exception as e:
        traceback_str = traceback.format_exc()
        return jsonify({"error": str(e), "traceback": traceback_str}), 500

# API endpoint for generating beatwise analysis (POST request)
@app.route("/beatwise_analysis", methods=['POST'])
def beatwise_analysis():
    try:
        data = request.json
        analysis_text = data.get('analysis_text')
        district = data.get('district')
        unitname = data.get('unitname')
        beat_name = data.get('beat_name')

        if not analysis_text:
            return jsonify({"error": "Analysis text is required"}), 400

        beatwise_analysis_result = generate_beatwise_analysis(analysis_text, district, unitname, beat_name, data)
        return jsonify({"analysis": beatwise_analysis_result})
    except Exception as e:
        traceback_str = traceback.format_exc()
        return jsonify({"error": str(e), "traceback": traceback_str}), 500

# API endpoint for generating crime prediction (POST request)
@app.route("/crime_prediction", methods=['POST'])
def crime_prediction():
    try:
        data = request.json
        analysis_text = data.get('analysis_text')
        district = data.get('district')
        unitname = data.get('unitname')

        if not analysis_text:
            return jsonify({"error": "Analysis text is required"}), 400

        crime_prediction_result = generate_crime_prediction(analysis_text, district, unitname, data)
        return jsonify({"analysis": crime_prediction_result})
    except Exception as e:
        traceback_str = traceback.format_exc()
        return jsonify({"error": str(e), "traceback": traceback_str}), 500

# API endpoint for generating deployment plan (POST request)
@app.route("/deployment_plan", methods=['POST'])
def deployment_plan():
    try:
        data = request.json
        analysis_text = data.get('analysis_text')
        district = data.get('district')
        unitname = data.get('unitname')

        if not analysis_text:
            return jsonify({"error": "Analysis text is required"}), 400

        deployment_plan_result = generate_deployment_plan(analysis_text, district, unitname, data)
        return jsonify({"analysis": deployment_plan_result})
    except Exception as e:
        traceback_str = traceback.format_exc()
        return jsonify({"error": str(e), "traceback": traceback_str}), 500

# API endpoint for reading CSV (GET request)
@app.route("/read_csv", methods=['GET'])
def read_csv():
    try:
        # Read the CSV data
        with open(csv_file_path, 'r') as csv_file:
            reader = pd.read_csv(csv_file)
            data = reader.to_dict(orient='records')
        data = [row for row in data if not '0' in row.values()]

        return jsonify(data)
    except Exception as e:
        traceback_str = traceback.format_exc()
        return jsonify({"error": str(e), "traceback": traceback_str}), 500

# Run the Flask app in debug mode on port 8000
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)