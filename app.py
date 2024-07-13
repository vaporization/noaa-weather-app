from flask import Flask, request, jsonify
import requests
from geopy.distance import geodesic

app = Flask(__name__)

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
    user_coords = (request.args.get('lat'), request.args.get('lon'))
    nearby_stations = sorted(stations.keys(), key=lambda s: geodesic(user_coords, stations[s]['coords']).miles)
    return jsonify(nearby_stations)

@app.route('/data', methods=['GET'])
def get_data():
    station_name = request.args.get('station')
    station_id = stations[station_name]['id']
    product = request.args.get('product')
    data = fetch_noaa_data(station_id, product)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
