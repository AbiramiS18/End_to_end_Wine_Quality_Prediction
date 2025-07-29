# src/preprocess.py

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import pandas as pd

def label_quality(row):
    if row <= 5:
        return 0  # Low
    elif row == 6:
        return 1  # Medium
    else:
        return 2  # High

def preprocess(df):
    # Drop missing values
    df.dropna(inplace=True)

    # Encode wine type if present
    if 'type' in df.columns:
        df['type'] = df['type'].map({'red': 0, 'white': 1})
    
    # Map wine quality to Low (0), Medium (1), High (2)
    df['quality'] = df['quality'].apply(label_quality)
    print("Class distribution after quality remapping:\n", df['quality'].value_counts())

    # Features and target
    X = df.drop(['quality'], axis=1)
    y = df['quality']

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Feature scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    return X_train_scaled, X_test_scaled, y_train, y_test, scaler
