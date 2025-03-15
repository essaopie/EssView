from flask import Flask, render_template, request, jsonify
import json
from flask_socketio import SocketIO
from model_service import analyzeimage
from flask_cors import CORS

socketio = SocketIO()

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/danger',methods=["POST"])
def sendDangerNotification():
    if request.is_json:
        data = request.get_json()
        message = data.get('danger')
        socketio.emit('danger_notification',message)
        return jsonify({"status":"send"})
    else:
        return jsonify({"status":"failed"})

@app.route('/message',methods=["POST"])
def sendMessage():
    if request.is_json:
        data = request.get_json()
        message = data.get('message')
        socketio.emit('guard_message',message)
        return jsonify({"status":"send"})
    else:
        return jsonify({"status":"failed"})

@socketio.on('connect')
def handle_connection(data):
    socketio.emit('connect_response',"Połączono")

@socketio.on('cameraview')
def manageImageTransfer(data):
    results=analyzeimage(data)
    json_data = json.dumps(results, ensure_ascii=False, indent=4)
    socketio.emit('results',json_data)


if __name__ == '__main__':
    socketio.run(app,debug=True)


'''

iosocket
connect - polacz sie
connect_response - info czy sie polaczyles
cameriaview - wyslij base64 obrazek
results - otrzymujesz tempArray ze wszystkimi informacjami
guard_message - wiadomosc od opiekuna ktora odbiera uzytkownik
danger_notification - wiadomosc ktora otrzymuje guard
http
/danger [post] wysylasz {danger:"twoj podopieczny dlugo jest na drodze"}
/message [post] wysylasz {message:"zwroc uwage na obiekty.."}


'''

