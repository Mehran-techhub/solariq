import pandas as pd
import numpy as np
import os
import joblib
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler

class SolarDataPreprocessor:
    def __init__(self):
        self.imputer = SimpleImputer(strategy='median')
        self.scaler = StandardScaler()
        self.features = ['temperature', 'humidity', 'cloud_cover', 'wind_speed', 'pressure', 'irradiance', 'hour', 'month']
        
    def preprocess_train(self, df):
        print("Starting preprocessing...")
        
        initial_len = len(df)
        df = df.drop_duplicates()
        print(f"Removed {initial_len - len(df)} duplicate rows.")
        
        Q1 = df['irradiance'].quantile(0.25)
        Q3 = df['irradiance'].quantile(0.75)
        IQR = Q3 - Q1
        df = df[~((df['irradiance'] < (Q1 - 1.5 * IQR)) | (df['irradiance'] > (Q3 + 1.5 * IQR)))]
        
        X = df[self.features]
        y = df['solar_energy_generation']
        
        X_imputed = self.imputer.fit_transform(X)
        X_scaled = self.scaler.fit_transform(X_imputed)
        
        return X_scaled, y.values, df
        
    def preprocess_inference(self, df):
        X = df[self.features]
        X_imputed = self.imputer.transform(X)
        X_scaled = self.scaler.transform(X_imputed)
        return X_scaled
        
    def save(self, directory):
        os.makedirs(directory, exist_ok=True)
        joblib.dump(self.imputer, os.path.join(directory, 'imputer.pkl'))
        joblib.dump(self.scaler, os.path.join(directory, 'scaler.pkl'))
        print(f"Preprocessor saved to {directory}")

    @classmethod
    def load(cls, directory):
        obj = cls()
        obj.imputer = joblib.load(os.path.join(directory, 'imputer.pkl'))
        obj.scaler = joblib.load(os.path.join(directory, 'scaler.pkl'))
        return obj
