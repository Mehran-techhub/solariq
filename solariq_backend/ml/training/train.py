import os
import sys
import pandas as pd
import numpy as np
import joblib

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from preprocessing.preprocessing import SolarDataPreprocessor
from evaluation.evaluation import evaluate_model, print_evaluation

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'dataset.csv')
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')
PIPELINES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'pipelines')
FINAL_MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model.pkl')

def train_pipeline():
    print("Loading dataset...")
    df = pd.read_csv(DATA_PATH)
    
    preprocessor = SolarDataPreprocessor()
    X, y, df_clean = preprocessor.preprocess_train(df)
    
    preprocessor.save(PIPELINES_DIR)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    models = {
        "Linear Regression": LinearRegression(),
        "Decision Tree": DecisionTreeRegressor(random_state=42),
        "Random Forest": RandomForestRegressor(random_state=42, n_jobs=-1),
        "Gradient Boosting": GradientBoostingRegressor(random_state=42)
    }
    
    param_grids = {
        "Random Forest": {
            "n_estimators": [50, 100],
            "max_depth": [10, 20, None]
        }
    }
    
    best_model_name = None
    best_model = None
    best_r2 = -float('inf')
    evaluation_results = []
    
    print("Training and evaluating models...")
    for name, model in models.items():
        print(f"\nTraining {name}...")
        
        if name in param_grids:
            print(f"Running GridSearchCV for {name}...")
            search = GridSearchCV(model, param_grids[name], cv=3, scoring='r2', n_jobs=-1)
            search.fit(X_train, y_train)
            fitted_model = search.best_estimator_
            print(f"Best parameters for {name}: {search.best_params_}")
        else:
            fitted_model = model
            fitted_model.fit(X_train, y_train)
            
        y_pred = fitted_model.predict(X_test)
        metrics = evaluate_model(name, y_test, y_pred)
        print_evaluation(metrics)
        evaluation_results.append(metrics)
        
        if metrics["r2_score"] > best_r2:
            best_r2 = metrics["r2_score"]
            best_model = fitted_model
            best_model_name = name
            
    print(f"\nBest Model Selected: {best_model_name} with R²: {best_r2:.4f}")
    
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(best_model, FINAL_MODEL_PATH)
    print(f"Final model saved to {FINAL_MODEL_PATH}")
    
    if hasattr(best_model, "feature_importances_"):
        importance = best_model.feature_importances_
        print("\nFeature Importance:")
        for f, imp in zip(preprocessor.features, importance):
            print(f"  {f}: {imp:.4f}")

if __name__ == "__main__":
    train_pipeline()
