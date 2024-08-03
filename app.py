import os
import json
from flask import Flask, request, jsonify
import requests
from firebase_admin import firestore, initialize_app, credentials
from google.cloud import secretmanager
from flask_cors import CORS
import logging

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up logging
logging.basicConfig(level=logging.INFO)

# Function to get secret from Google Cloud Secret Manager
def get_secret(project_id, secret_id):
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/latest"
    response = client.access_secret_version(name=name)
    secret_string = response.payload.data.decode("UTF-8")
    return json.loads(secret_string)

# Set your Google Cloud project ID
project_id = "701140997749"  # Replace with your actual project ID

# Retrieve the Firebase service account key from the file specified by GOOGLE_APPLICATION_CREDENTIALS
service_account_file_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
if service_account_file_path:
    if not os.path.exists(service_account_file_path):
        raise FileNotFoundError(f"Service account file not found: {service_account_file_path}")
    with open(service_account_file_path) as f:
        service_account_key = json.load(f)
else:
    raise ValueError("The GOOGLE_APPLICATION_CREDENTIALS environment variable is not set or is empty.")

# Initialize Firebase Admin SDK
cred = credentials.Certificate(service_account_key)
initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# NOAA stations with their IDs
stations = {
    'Sewells Point': '8638610',
    'Naval Station Norfolk': 'cb0402',
    'South Craney Island': '8638595'
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
    return jsonify(list(stations.keys()))

@app.route('/data', methods=['GET'])
def get_data():
    station_name = request.args.get('station')
    station_id = stations.get(station_name)
    if not station_id:
        return jsonify({"error": "Station not found"}), 404
    product = request.args.get('product')
    data = fetch_noaa_data(station_id, product)
    return jsonify(data)

@app.route('/api/alerts', methods=['POST'])
def create_alert():
    logging.info("Received request to create alert")
    try:
        data = request.get_json()
        logging.info(f"Alert data: {data}")
        db.collection('alerts').add(data)
        return jsonify({"success": True}), 201
    except Exception as e:
        logging.error(f"Error creating alert: {e}")
        return jsonify({"error": "Failed to create alert"}), 500

@app.route('/api/alerts/<user_id>', methods=['GET'])
def get_alerts(user_id):
    logging.info(f"Fetching alerts for user: {user_id}")
    try:
        alerts = db.collection('alerts').where('userId', '==', user_id).stream()
        alerts_list = [alert.to_dict() for alert in alerts]
        return jsonify(alerts_list), 200
    except Exception as e:
        logging.error(f"Error fetching alerts: {e}")
        return jsonify({"error": "Failed to fetch alerts"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
