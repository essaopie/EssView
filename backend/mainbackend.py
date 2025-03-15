from flask import Flask, render_template, request, jsonify
import json
from flask_socketio import SocketIO
from model_service import analyzeimage

socketio = SocketIO()

app = Flask(__name__)
socketio = SocketIO(app)

tempArray={
    1:{
  "ValidRoad":"pavement",
  "ObjectsInfront": [{
    "object":"person",
    "distance":"2",
    "danger":"small"
  }],
  "ObjectsOnRight": {
      "object":"person",
    "distance":"2",
    "danger":"small"
  },
  "ObjectsOnLeft":{
      "object":"person",
    "distance":"2",
    "danger":"small"
  }
  },
      2:{
  "ValidRoad":"road",
  "ObjectsInfront": [{
    "object":"person",
    "distance":"2",
    "danger":"small"
  }],
  "ObjectsOnRight": {
      "object":"person",
    "distance":"2",
    "danger":"small"
  },
  "ObjectsOnLeft":{
      "object":"person",
    "distance":"2",
    "danger":"small"
  }
  }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/stepwidth',methods=["POST"])
def setStepWidth():

    if request.is_json:

        data = request.get_json()
        mode = data.get('stepwidth')

        return jsonify({"message": "received"}), 200
    else:
        return jsonify({"error": "Request must be JSON"}), 400

@app.route('/try',methods=["POST"])
def essaop():
    results=analyzeimage('esa')
    json_data = json.dumps(results, ensure_ascii=False, indent=4)
    return results
@app.route('/mode',methods=["POST"])
def manageMode():

    if request.is_json:

        data = request.get_json()
        mode = data.get('mode')

        return jsonify({"message": "received"}), 200
    else:
        return jsonify({"error": "Request must be JSON"}), 400


@app.route('/danger',methods=["POST"])
def sendDanger():
    if request.is_json:

        data = request.get_json()
        mode = data.get('danger')

        return jsonify({"message": "received"}), 200
    else:
        return jsonify({"error": "Request must be JSON"}), 400



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

http
/test [get] pobiera liste ktora dostaniesz pod results dla testu
/danger [post] wysylasz {dange:"small albo medium albo hard"}
/stepwidth [post] wysylasz {stepwidth:1.5}
/mode [post] wysylasz {mode:"indoor albo outdoor albo ocr"}


'''
