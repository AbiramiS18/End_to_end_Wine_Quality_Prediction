# Wine Quality Prediction App

This project is a full-stack web application that predicts wine quality based on physicochemical features. 

## Features

- **Machine Learning** model built using Random Forest
- **FastAPI** backend
- **React.js** frontend
- **Dynamic Dashboard** with visualizations (Recharts)
- **Prediction Output** with quality labels (Low, Medium, High)

## ML Model

Trained on UCI's Wine Quality dataset using Random Forest. Input features include acidity, sugar, sulphates, etc.

## Tech Stack

- Frontend: React + Recharts + Ant Design
- Backend: FastAPI
- Model: Scikit-learn, Pandas, Joblib
- Hosting: GitHub (code)

## How to Run

### Backend (FastAPI)
```bash
cd backend
uvicorn main:app --reload
