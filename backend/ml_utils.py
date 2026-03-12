import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
import joblib
import os

class DataPreprocessor:
    """Preprocess transaction data for ML predictions"""
    
    def __init__(self):
        self.required_columns = ['Date', 'Category', 'Debit', 'Credit']
    
    def validate_columns(self, df):
        """Validate that required columns exist"""
        missing = [col for col in self.required_columns if col not in df.columns]
        if missing:
            raise ValueError(f"Missing required columns: {', '.join(missing)}")
    
    def preprocess(self, df):
        """
        Preprocess transaction data
        
        Returns: dict with category -> list of spending amounts
        """
        self.validate_columns(df)
        
        # Convert Date to datetime
        df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
        
        # Fill missing values
        df['Debit'] = pd.to_numeric(df['Debit'], errors='coerce').fillna(0)
        df['Credit'] = pd.to_numeric(df['Credit'], errors='coerce').fillna(0)
        df['Category'] = df['Category'].fillna('Other')
        
        # Use Debit as spending amount
        df['Amount'] = df['Debit']
        
        # Group by category
        category_spending = {}
        for category, group in df.groupby('Category'):
            amounts = group['Amount'].values
            amounts = amounts[amounts > 0]  # Only positive amounts
            if len(amounts) > 0:
                category_spending[category] = amounts.tolist()
        
        return category_spending


class PredictionModel:
    """Simple ML model for spending prediction"""
    
    def __init__(self):
        self.models = {}
        self.scalers = {}
    
    def predict_category(self, spending_history):
        """
        Predict next month spending for a category
        
        Args:
            spending_history: list of historical spending amounts
        
        Returns:
            predicted spending for next month
        """
        if not spending_history or len(spending_history) < 2:
            return sum(spending_history) if spending_history else 0
        
        # Simple prediction: average with slight trend adjustment
        history = np.array(spending_history)
        
        # Calculate average
        avg = np.mean(history)
        
        # Calculate trend (recent vs old)
        mid = len(history) // 2
        recent_avg = np.mean(history[mid:])
        old_avg = np.mean(history[:mid])
        
        trend_factor = 1.0
        if old_avg > 0:
            trend_factor = recent_avg / old_avg
        
        # Predict: average adjusted by trend
        prediction = avg * trend_factor
        
        # Add some variance for realistic prediction
        std = np.std(history) if len(history) > 1 else 0
        prediction = max(prediction, avg * 0.8)  # Don't drop too low
        
        return round(prediction, 2)
    
    def predict(self, category_spending):
        """
        Generate predictions for all categories
        
        Args:
            category_spending: dict with category -> list of amounts
        
        Returns:
            dict with category -> predicted amount
        """
        predictions = {}
        for category, history in category_spending.items():
            predictions[category] = self.predict_category(history)
        
        return predictions
