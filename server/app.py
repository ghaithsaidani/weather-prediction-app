from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import pickle
from utils import preprocess_input

app = Flask(__name__)
CORS(app) # This will enable CORS for all routes

# Load the model
model = pickle.load(open('weather-model.sav', 'rb'))

# Define the prediction route
@app.route('/predict/', methods=['POST'])
@cross_origin(origin='http://localhost:4200/')
def predict():
    data = request.json
    try:
        processed_data = preprocess_input(data)
        
        prediction = model.predict(processed_data)
        
        return jsonify({'prediction': prediction[0]})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
