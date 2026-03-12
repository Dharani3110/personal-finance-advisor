import pandas as pd
import os

# Sample transaction data - 80 rows (all 8 categories)
dates = pd.date_range('2023-01-01', periods=80, freq='D')
categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Education', 'Health', 'Housing', 'Shopping'] * 10
debits = [50, 100, 75, 200, 150, 80, 1200, 120] * 10
credits = [0] * 80

data = {
    'Date': dates,
    'Category': categories,
    'Debit': debits,
    'Credit': credits
}

df = pd.DataFrame(data)
output_path = os.path.join(os.path.dirname(__file__), 'sample_transactions.xlsx')
df.to_excel(output_path, index=False)
print(f"Sample file created: {output_path}")
