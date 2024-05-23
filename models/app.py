import os
import pandas as pd
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from spatial import generate_spatial_analysis
from beatwise import generate_beatwise_analysis
from prediction import generate_crime_prediction
from deployment import generate_deployment_plan
import traceback

# Create FastAPI app instance
app = FastAPI()

# Enable CORS for all routes and domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://shadow-gallants.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

class AnalysisRequest(BaseModel):
    analysis_text: str
    district: str
    police_station: str = None
    unitname: str = None
    beat_name: str = None

# API endpoint for retrieving crime data (GET request)
@app.get("/data")
async def get_data(page: int = 1, per_page: int = 100):
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

    return data

# API endpoint for generating spatial analysis (POST request)
@app.post("/spatial_analysis")
async def spatial_analysis(request: AnalysisRequest):
    try:
        analysis_text = request.analysis_text
        district = request.district
        police_station = request.police_station

        if not analysis_text:
            raise HTTPException(status_code=400, detail="Analysis text is required")
        
        spatial_analysis_result = generate_spatial_analysis(analysis_text, district, police_station, request.dict())
        return {"analysis": spatial_analysis_result}
    except Exception as e:
        traceback_str = traceback.format_exc()
        return {"error": str(e), "traceback": traceback_str}

# API endpoint for generating beatwise analysis (POST request)
@app.post("/beatwise_analysis")
async def beatwise_analysis(request: AnalysisRequest):
    try:
        analysis_text = request.analysis_text
        district = request.district
        unitname = request.unitname
        beat_name = request.beat_name

        if not analysis_text:
            raise HTTPException(status_code=400, detail="Analysis text is required")
        
        beatwise_analysis_result = generate_beatwise_analysis(analysis_text, district, unitname, beat_name, request.dict())
        return {"analysis": beatwise_analysis_result}
    except Exception as e:
        traceback_str = traceback.format_exc()
        return {"error": str(e), "traceback": traceback_str}
    
# API endpoint for generating crime prediction (POST request)
@app.post("/crime_prediction")
async def crime_prediction(request: AnalysisRequest):
    try:
        analysis_text = request.analysis_text
        district = request.district
        unitname = request.unitname
        
        if not analysis_text:
            raise HTTPException(status_code=400, detail="Analysis text is required")
        
        crime_prediction_result = generate_crime_prediction(analysis_text, district, unitname, request.dict())
        return {"analysis": crime_prediction_result}
    except Exception as e:
        traceback_str = traceback.format_exc()
        return {"error": str(e), "traceback": traceback_str}
    
#API endpoint for generating deployment plan (POST Request)
@app.post("deployment_plan")
async def deployment_plan(request: AnalysisRequest):
    try:
        analysis_text = request.analysis_text
        district = request.district
        unitname = request.unitname
        
        if not analysis_text:
            raise HTTPException(status_code=400, detail = "Analysis text is required")
        
        deployment_plan_result = generate_deployment_plan(analysis_text, district, unitname, request.dict())
        return {"analysis": deployment_plan_result}
    except Exception as e:
        traceback_str = traceback.format_exc()
        return {"error": str[e], "traceback": traceback_str}

# API endpoint for reading CSV (GET request)
@app.get("/read_csv")
async def read_csv():
    try:
        # Read the CSV data
        with open(csv_file_path, 'r') as csv_file:
            reader = pd.read_csv(csv_file)
            data = reader.to_dict(orient='records')
        data = [row for row in data if not '0' in row.values()]

        return data
    except Exception as e:
        traceback_str = traceback.format_exc()
        return {"error": str(e), "traceback": traceback_str}

# Run the FastAPI app in debug mode on port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")