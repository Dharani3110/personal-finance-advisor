from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from ml_utils import DataPreprocessor, PredictionModel
import traceback

app = Flask(__name__)
CORS(app)

# Initialize models
preprocessor = DataPreprocessor()
predictor = PredictionModel()


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict spending by category from Excel file
    
    Expected: multipart/form-data with file
    Returns: JSON with predictions by category
    """
    try:
        print(f"Request received: {request.method}")
        print(f"Files in request: {request.files.keys()}")
        
        # Check if file is present
        if 'file' not in request.files:
            print("ERROR: No file provided in request")
            return jsonify({'error': 'No file provided in request. Make sure to upload a file.'}), 400
        
        file = request.files['file']
        print(f"File received: {file.filename}")
        
        # Check if file has a name
        if not file.filename:
            print("ERROR: File has no filename")
            return jsonify({'error': 'File must have a name'}), 400
        
        # Check file extension
        if not file.filename.lower().endswith('.xlsx'):
            print(f"ERROR: Invalid file type: {file.filename}")
            return jsonify({'error': f'Invalid file type: {file.filename}. Please upload .xlsx file only.'}), 400
        
        # Read Excel file
        try:
            df = pd.read_excel(file, sheet_name=0)
            print(f"Excel file read successfully. Shape: {df.shape}")
            print(f"Columns found: {list(df.columns)}")
        except Exception as e:
            print(f"ERROR reading Excel: {str(e)}")
            return jsonify({'error': f'Failed to read Excel file: {str(e)}'}), 400
        
        # Preprocess data
        try:
            category_spending = preprocessor.preprocess(df)
            print(f"Preprocessing successful. Categories found: {list(category_spending.keys())}")
        except ValueError as e:
            print(f"ERROR preprocessing: {str(e)}")
            return jsonify({'error': f'Data error: {str(e)}'}), 400
        
        if not category_spending:
            print("ERROR: No valid transaction data found")
            return jsonify({'error': 'No valid transaction data found in the file'}), 400
        
        # Generate predictions
        predictions = predictor.predict(category_spending)
        print(f"Predictions generated: {predictions}")
        
        # Sort by category name for consistency
        sorted_predictions = {k: predictions[k] for k in sorted(predictions.keys())}
        
        return jsonify({
            'predictions': sorted_predictions,
            'message': 'Predictions generated successfully'
        }), 200
    
    except Exception as e:
        print(f"ERROR: Unexpected error: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'}), 200


if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
