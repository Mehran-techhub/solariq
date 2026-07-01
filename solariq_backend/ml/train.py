import os
import sys
import warnings
warnings.filterwarnings("ignore")

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from datetime import datetime

from app import create_app
from extensions import db
import sqlalchemy as sa


MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ml_models")
MODEL_PATH = os.path.join(MODEL_DIR, "solar_model.pkl")
FEATURES = ["temperature", "humidity", "cloud_cover", "irradiance", "hour", "month", "day"]


def load_training_data():
    app = create_app()
    with app.app_context():
        rows = db.session.execute(sa.text("""
            SELECT temperature, humidity, cloud_cover, irradiance, actual_output, record_date
            FROM solar_records
            WHERE temperature IS NOT NULL
              AND irradiance IS NOT NULL
              AND actual_output IS NOT NULL
              AND actual_output > 0
        """)).fetchall()

    if not rows:
        print("No training data found in solar_records.")
        print("Train the model after adding real solar_records data.")
        return None

    data = []
    for r in rows:
        try:
            dt = r.record_date
            if dt:
                data.append({
                    "temperature": float(r.temperature),
                    "humidity": float(r.humidity or 50),
                    "cloud_cover": float(r.cloud_cover or 20),
                    "irradiance": float(r.irradiance),
                    "actual_output": float(r.actual_output),
                    "hour": dt.hour,
                    "month": dt.month,
                    "day": dt.day,
                })
        except (ValueError, TypeError):
            continue

    if len(data) < 10:
        print(f"Only {len(data)} valid records. Insufficient training data (minimum 10 required).")
        return None

    return pd.DataFrame(data)


def train():
    os.makedirs(MODEL_DIR, exist_ok=True)

    print("Loading training data...")
    df = load_training_data()
    if df is None:
        print("Training aborted: no valid data available.")
        return

    print(f"Dataset: {len(df)} real samples, {len(FEATURES)} features")

    X = df[FEATURES]
    y = df["actual_output"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training RandomForest model...")
    model = RandomForestRegressor(
        n_estimators=150,
        max_depth=15,
        min_samples_leaf=3,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    print(f"\nModel Performance:")
    print(f"  MAE:  {mae:.3f} kW")
    print(f"  RMSE: {rmse:.3f} kW")
    print(f"  R\u00b2:   {r2:.3f}")

    feature_importance = sorted(zip(FEATURES, model.feature_importances_), key=lambda x: -x[1])
    print(f"\nFeature Importance:")
    for name, importance in feature_importance:
        print(f"  {name}: {importance:.3f}")

    metadata = {
        "trained_at": datetime.now().isoformat(),
        "samples": len(df),
        "features": FEATURES,
        "r2_score": round(r2, 3),
        "mae": round(mae, 3),
        "feature_importance": dict(feature_importance),
    }

    joblib.dump({"model": model, "metadata": metadata}, MODEL_PATH)
    print(f"\nModel saved to: {MODEL_PATH}")
    print("Training complete!")


if __name__ == "__main__":
    train()
