import csv
import requests
from flask import Flask, jsonify

app = Flask(__name__)

path = r'heatmap-frontend\dataset\updated_ml_model_ready_dataset.csv'

def read_csv_file(file_path):
    data = []
    with open(file_path, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            data.append(dict(row))
    return data

@app.route('/data', methods=['GET'])
def get_data():
    data = read_csv_file('your_file.csv')  # replace 'your_file.csv' with your actual file path
    response = requests.post('http://localhost:3000/data', json=data)  # replace with your Node.js backend URL
    return response.content

if __name__ == "__main__":
    app.run(debug=True)