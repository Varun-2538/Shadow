# Shadow - Predictive Crime Analysis

## Introduction
Shadow is a comprehensive web application that enables law enforcement agencies to gain valuable insights into crime patterns and trends within the state of Karnataka. This application leverages the power of the Mistral Large Language Model (LLM) to analyze various crime data, providing police officers with a deep understanding of the underlying factors and potential drivers of criminal activities.

## Demo of project
[Youtube](https://www.youtube.com/watch?v=7YnW6HfLGhQ)

## Getting Started

1. Clone the repository: `git clone https://github.com/Varun-2538/Shadow`
2. Install dependencies:
   - Frontend: `cd heatmap-frontend && npm install`
   - Backend: `cd heatmap-backend && npm install`
   - Python: `cd models && pip install -r requirements.txt`
3. Start the development server:
   - Backend: `node server.js`
   - Python: `python app.py`
   - Frontend: `npm start`
4. Open your web browser and navigate to `http://localhost:3000` to access the Predictive Crime Analysis application.

## How the project looks
![image](https://github.com/Varun-2538/Shadow/assets/110900686/e4cede45-cf83-46aa-8481-a0d9a42b34ec)

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

4. **Temporal Analysis (Future Improvement)**:
   - This feature, planned for future development, will incorporate time-series analysis to identify patterns and trends in crime data over time.
   - The analysis will consider factors such as holidays, elections, and other events that may influence crime rates.

5. **Beatwise Analysis (Future Improvement)**:
   - This feature, also planned for future development, will compare the crime data and patterns across different police stations.
   - It will provide insights into the specific crime types and focus areas of each police station, enabling more efficient resource allocation and targeted interventions.

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
