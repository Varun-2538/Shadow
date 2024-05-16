import os
import pandas as pd
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from spatial import generate_spatial_analysis
from beatwise import generate_beatwise_analysis
import traceback

# Create FastAPI app instance
app = FastAPI()

# Enable CORS for all routes and domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get the project directory
project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Construct the file path for the CSV file
csv_file_path = os.path.join(project_dir, 'models', 'dataset', 'updated_ml_model_ready_dataset.csv')

# Load crime data from CSV
df = pd.read_csv(csv_file_path)
# Filter rows with zero latitude or longitude (optional, adjust for your data)
df = df[(df['latitude'] != 0) & (df['longitude'] != 0)]

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

    # Return JSON response containing the data
    return JSONResponse(content=data)

# API endpoint for generating crime analysis (POST request)
@app.post("/spatial_analysis")
async def spatial_analysis(request: Request):
    try:
        data = await request.json()
        analysis_text = data.get('analysis_text', '')
        district = data.get('district', '')
        police_station = data.get('police_station', '')

        if not analysis_text:
            raise HTTPException(status_code=400, detail="Analysis text is required")

        spatial_analysis_result = generate_spatial_analysis(analysis_text, district, police_station, data)
        return JSONResponse(content={'analysis': spatial_analysis_result})
    except Exception as e:
        traceback_str = ''.join(traceback.format_exception(None, e, e.__traceback__))
        return JSONResponse(content={'error': str(e), 'traceback': traceback_str}, status_code=500)

@app.post("/beatwise_analysis")
async def beatwise_analysis(request: Request):
    try:
        data = await request.json()
        analysis_text = data.get('analysis_text', '')
        district = data.get('district', '')
        unitname = data.get('unitname', '')
        beat_name = data.get('beat_name', '')

        if not analysis_text:
            raise HTTPException(status_code=400, detail="Analysis text is required")

        beatwise_analysis_result = generate_beatwise_analysis(analysis_text, district, unitname, beat_name, data)
        return JSONResponse(content={'analysis': beatwise_analysis_result})
    except Exception as e:
        traceback_str = ''.join(traceback.format_exception(None, e, e.__traceback__))
        return JSONResponse(content={'error': str(e), 'traceback': traceback_str}, status_code=500)

# Run the FastAPI app (use uvicorn to run this script)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")