from flask import Flask, jsonify, request
from datetime import datetime
from flask_cors import CORS
import boto3
import json
import requests

app = Flask(__name__)
CORS(app, origins=["https://eu-semnez.webapp.link", "https://auth.eu-semnez.webapp.link"] )

REDIRECT_URI = 'https://eu-semnez.webapp.link/callback'
TOKEN_URI = 'https://auth.eu-semnez.webapp.link/oauth2/token'

@app.route('/', methods = ['GET'])
def check():
    return jsonify(status = 'running'), 200

@app.route('/gettoken', methods = ['POST'])
def getToken():
    code = request.args.get('code', default = '', type = str)
    if not code :
        return jsonify(ok = 'false', status = 'code missing'), 404
    ssm = boto3.client('ssm', 'eu-west-1')
    clientid_key = ssm.get_parameter(
        Name='cognito_eusemnez_client_id',WithDecryption=False
    )
    client_id = clientid_key['Parameter']['Value']
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    payload = {
        'grant_type': 'authorization_code',
        'client_id': client_id,
        'code': code,
        'redirect_uri': REDIRECT_URI
        }
    try:
        r = requests.post(TOKEN_URI, data=payload)
        response = r.json()
    except:
        return jsonify(ok = 'false', status = r.text, cognito_response = r.status_code), 405
    if not 'access_token' in response:
        return jsonify(ok = 'false', status = 'authorization failed'), 401
    date = datetime.utcnow().timestamp()
    reply = {
        'ok': 'true',
        'access_token': response['access_token'],
        'date': date,
        'expires_in': response['expires_in']
    }
    return jsonify(reply), 200



if __name__ == '__main__':
    app.run()
