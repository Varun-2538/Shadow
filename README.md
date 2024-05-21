# Shadow - Predictive Crime Analysis

## Introduction
Shadow is a comprehensive web application that enables law enforcement agencies to gain valuable insights into crime patterns and trends within the state of Karnataka. This application leverages the power of the Mistral Large Language Model (LLM) to analyze various crime data, providing police officers with a deep understanding of the underlying factors and potential drivers of criminal activities.

## Final working of project
[Youtube](https://www.youtube.com/watch?v=G2smwmfNvpk)

## Getting Started

1. Clone the repository: `git clone https://github.com/Varun-2538/Shadow`
2. Install dependencies:
   - Frontend: `cd heatmap-frontend && npm install --legacy-peer-deps`
   - Backend: `cd heatmap-backend && npm install`
   - Python: `cd models && pip install -r requirements.txt`
3. Set up Environment Variables:
   - Using the `.env.example` file, create a `.env` file in your models folder.
   - You can get your `env` from huggingface. 
5. Start the development server:
   - Backend: `node server.js`
   - Python: `python app.py`/`uvicorn app:app --reload`
   - Frontend: `npm start`
6. Open your web browser and navigate to `http://localhost:3000` to access the Predictive Crime Analysis application.

## How the project looks
![Landing Page](https://github.com/Varun-2538/Shadow/assets/110900686/b7b283a0-4f52-4bf1-8ff3-78a2aaa95151)
![Spatial Analysis](https://github.com/Varun-2538/Shadow/assets/110900686/95f5dae9-1e85-4422-8ed6-718924c79015)

![Beat-wise Analysis](https://github.com/Varun-2538/Shadow/assets/110900686/3ffea486-b6d5-4515-8af0-70501f192483)
![Temporal Analysis](https://github.com/Varun-2538/Shadow/assets/110900686/dc4a9dd4-2143-48e7-a82a-773cb364437a)
![Crime Prediction](https://github.com/Varun-2538/Shadow/assets/110900686/52f7f801-9af6-43e9-8bc9-d5a0c5b87946)
![Data Entry](https://github.com/Varun-2538/Shadow/assets/110900686/ff6fb077-ffce-40ae-9c19-7c281c4cbcbf)

## Key Features

1. **Spatial Analysis**:
   - Officers can select specific districts and police stations within the state of Karnataka.
   - The application displays a heatmap visualization on a Leaflet map, highlighting the geographic hotspots of criminal activity.

2. **Graphical Data Representation**:
   - The application presents the crime data in an easy-to-understand graphical format, including charts and graphs.
   - This visual representation allows police officers, to quickly identify patterns and trends in the data.

3. **Mistral LLM Analysis**:
   - The Mistral LLM, a state-of-the-art natural language processing model, is integrated into the application to perform advanced data analysis.
   - The LLM-powered analysis compares and contrasts the various crime data fields, uncovering potential connections and providing insights into the possible reasons for the criminal activities in specific areas.

4. **Temporal Analysis**:
   - This feature will incorporate time-series analysis to identify patterns and trends in crime data over time.
   - The analysis will consider factors such as holidays, elections, and other events that may influence crime rates.

5. **Beatwise Analysis**:
   - This feature will compare the crime data and patterns across different police stations.
   - It will provide insights into the specific crime types and focus areas of each police station, enabling more efficient resource allocation and targeted interventions.
6. **Crime Prediction**
   - This feature forecasts potential crimes based on specified month ranges or time ranges for given districts and units.
   - It correlates historical data with current trends to provide precise predictions, aiding proactive crime prevention.
7. **Deployment Plan**:
   - This feature suggests optimized deployment strategies for police officers based on crime prediction data.
   - It aims to maximize resource allocation efficiency and combat anticipated criminal activities effectively.

## Technology Stack

### Frontend
- React.js
- Leaflet Map API
- TailwindCSS
- Chart.js

### Backend
- Node.js
- Express.js
- Flask

### Data Analysis
- Hugging Face
- NumPy
- Pandas
- Mistral LLM

## License
This project is licensed under the [Apache License](https://github.com/Varun-2538/Shadow/blob/main/LICENSE)
