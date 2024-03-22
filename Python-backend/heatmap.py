from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes and domains

# Load data
df = pd.read_csv(r"E:\ksp\Gallants-KSP\heatmap-backend\updated_ml_model_ready_dataset.csv")
# Filter rows where either latitude or longitude is zero
df = df[(df['latitude'] != 0) & (df['longitude'] != 0)]

@app.route('/data', methods=['GET'])
def get_data():
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=100, type=int)  # Adjust per_page to suit your needs
    start = (page - 1) * per_page
    end = start + per_page
    data = df[start:end].to_dict(orient='records')

    for record in data:
        for key, value in record.items():
            if pd.isnull(value):
                record[key] = None

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=8000)