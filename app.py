from flask import Flask, request, jsonify
import requests
from geopy.distance import geodesic
from firebase_admin import firestore, initialize_app, credentials
from google.cloud import secretmanager
from flask_cors import CORS
import json
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Function to get secret from Google Cloud Secret Manager
def get_secret(project_id, secret_id):
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/latest"
    response = client.access_secret_version(name=name)
    secret_string = response.payload.data.decode("UTF-8")
    return json.loads(secret_string)

# Set your Google Cloud project ID
project_id = "701140997749"  # Replace with your actual project ID

# Retrieve the Firebase service account key from Secret Manager
service_account_key = get_secret(project_id, "firebase-service-account-key")

# Initialize Firebase Admin SDK
cred = credentials.Certificate(service_account_key)
initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# NOAA stations with their coordinates
stations = {
    'Sewells Point': {'id': '8638610', 'coords': (36.95, -76.33)},
    'Naval Station Norfolk': {'id': 'cb0402', 'coords': (36.95, -76.30)},
    'South Craney Island': {'id': '8638595', 'coords': (36.92, -76.32)}
}

def fetch_noaa_data(station_id, product, range_hours=12):
    base_url = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter"
    params = {
        'range': range_hours,
        'station': station_id,
        'product': product,
        'units': 'metric',
        'time_zone': 'lst_ldt',
        'application': 'web_services',
        'format': 'json'
    }
    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        data = response.json()
        if 'data' in data:
            return data['data']
    return None

@app.route('/stations', methods=['GET'])
def get_stations():
    user_coords = (float(request.args.get('lat')), float(request.args.get('lon')))
    nearby_stations = sorted(stations.keys(), key=lambda s: geodesic(user_coords, stations[s]['coords']).miles)
    return jsonify(nearby_stations)

@app.route('/data', methods=['GET'])
def get_data():
    station_name = request.args.get('station')
    station_id = stations[station_name]['id']
    product = request.args.get('product')
    data = fetch_noaa_data(station_id, product)
    return jsonify(data)

@app.route('/api/alerts', methods=['POST'])
def create_alert():
    dat
