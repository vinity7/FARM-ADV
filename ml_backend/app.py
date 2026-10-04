from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
# Enable CORS so your React frontend can communicate with this API
CORS(app)

# Load the trained ML model
model = pickle.load(open('crop_model.pkl', 'rb'))

@app.route('/')
def home():
    return "Crop Recommendation API is Running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        # Extract features from the request
        features = [
            data.get('N'),
            data.get('P'),
            data.get('K'),
            data.get('temperature'),
            data.get('humidity'),
            data.get('ph'),
            data.get('rainfall')
        ]
        
        # Convert to numpy array and reshape for prediction
        final_features = [np.array(features)]
        
        # Make prediction
        prediction = model.predict(final_features)
        
        return jsonify({
            'success': True,
            'recommended_crop': prediction[0]
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

if __name__ == '__main__':
    # Run the Flask app on port 5001 to avoid conflicting with your Node server on 5000
    app.run(port=5001, debug=True)
