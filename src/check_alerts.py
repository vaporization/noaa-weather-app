import time
import smtplib
from email.message import EmailMessage
from firebase_admin import firestore, initialize_app

initialize_app()

db = firestore.client()

def check_alerts():
    alerts = db.collection('alerts').stream()

    for alert in alerts:
        alert_data = alert.to_dict()
        user_id = alert_data['userId']
        station_id = alert_data['stationId']
        conditions = alert_data['conditions']
        last_alert_sent = alert_data.get('lastAlertSent')

        # Fetch current data for the station
        current_data = fetch_station_data(station_id)

        if should_send_alert(current_data, conditions, last_alert_sent):
            send_email_alert(user_id, conditions, current_data)
            db.collection('alerts').document(alert.id).update({
                'lastAlertSent': firestore.SERVER_TIMESTAMP
            })

def should_send_alert(current_data, conditions, last_alert_sent):
    # Implement logic to check if conditions are met and if 6 hours have passed since the last alert
    pass

def fetch_station_data(station_id):
    # Fetch current data from the NOAA API for the given station
    pass

def send_email_alert(user_id, conditions, current_data):
    # Send an email alert to the user
    pass

# Run the check every 60 minutes
while True:
    check_alerts()
    time.sleep(3600)
