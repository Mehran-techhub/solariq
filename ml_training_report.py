# -*- coding: utf-8 -*-
"""
Standalone Solar Energy ML Training & Evaluation Script
=======================================================
Trains 4 models on solar dataset, prints accuracy metrics,
feature importance, correlation heatmap, and saves the best model.
Run:  python ml_training_report.py
"""
import os, sys, json, warnings
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf8', buffering=1)
warnings.filterwarnings("ignore")

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# ── Paths ──────────────────────────────────────────────────────────────
BASE = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE, "solariq_backend", "ml", "data", "dataset.csv")
MODEL_OUT = os.path.join(BASE, "solariq_backend", "ml_models", "solar_model.pkl")

# ── 1. Load or generate dataset ────────────────────────────────────────
print("=" * 60)
print("SOLAR ENERGY ML TRAINING REPORT")
print("=" * 60)

if os.path.exists(DATA_PATH):
    df = pd.read_csv(DATA_PATH)
    print(f"\nLoaded dataset: {df.shape[0]} rows, {df.shape[1]} columns")
else:
    print(f"\nDataset not found at {DATA_PATH}")
    print("Generating synthetic dataset for training...")
    np.random.seed(42)
    n = 10000
    hour = np.random.randint(0, 24, n)
    irradiance = np.where((hour >= 6) & (hour <= 18),
                          np.random.uniform(0, 1200, n), 0)
    temp = np.random.uniform(10, 45, n) - irradiance * 0.005
    humidity = np.random.uniform(10, 90, n) + irradiance * 0.01
    cloud_cover = np.clip(np.random.uniform(0, 100, n) - irradiance * 0.03, 0, 100)
    wind_speed = np.random.uniform(0, 20, n)
    pressure = np.random.uniform(990, 1025, n)
    day = np.random.randint(1, 31, n)
    month = np.random.randint(1, 13, n)
    noise = np.random.normal(0, 0.1, n)
    generation = np.maximum(0, irradiance * 0.005 + temp * 0.02 - cloud_cover * 0.01 + wind_speed * 0.01 + noise)
    generation = np.clip(generation, 0, 6)
    df = pd.DataFrame({
        "temperature": temp, "humidity": humidity, "cloud_cover": cloud_cover,
        "wind_speed": wind_speed, "pressure": pressure, "irradiance": irradiance,
        "hour": hour, "day": day, "month": month,
        "solar_energy_generation": generation
    })
    os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
    df.to_csv(DATA_PATH, index=False)
    print(f"Generated {n} synthetic rows and saved to {DATA_PATH}")

print(f"\nFirst 5 rows:\n{df.head().to_string()}")
print(f"\nFirst 5 rows:\n{df.head().to_string()}")

print(f"\n--- Basic Statistics ---")
print(df.describe().to_string())

print(f"\n--- Missing Values ---")
print(df.isnull().sum().to_string())

# ── 2. Preprocessing (mirrors SolarDataPreprocessor) ────────────────────
target = "solar_energy_generation"
feature_cols = ['temperature', 'humidity', 'cloud_cover', 'wind_speed', 'pressure', 'irradiance', 'hour', 'month']

print(f"\nFeatures ({len(feature_cols)}): {feature_cols}")
print(f"Target: {target}")

# Drop duplicates
before = len(df)
df = df.drop_duplicates()
print(f"Dropped {before - len(df)} duplicate rows.")

# IQR outlier removal on irradiance (same as preprocessor)
Q1 = df['irradiance'].quantile(0.25)
Q3 = df['irradiance'].quantile(0.75)
IQR = Q3 - Q1
mask = ~((df['irradiance'] < (Q1 - 1.5 * IQR)) | (df['irradiance'] > (Q3 + 1.5 * IQR)))
df = df[mask]
print(f"After IQR outlier removal: {len(df)} rows")

# Impute missing values with median
from sklearn.impute import SimpleImputer
imputer = SimpleImputer(strategy="median")
X = df[feature_cols].copy()
y = df[target].copy()
X_imputed = pd.DataFrame(imputer.fit_transform(X), columns=feature_cols)

print(f"\nTarget range: {y.min():.2f} - {y.max():.2f} (mean {y.mean():.2f})")

# ── 3. Correlation analysis ────────────────────────────────────────────
corr_df = X_imputed.copy()
corr_df[target] = y.values
corr = corr_df.corr()[target].sort_values(ascending=False)
print("\n--- Correlation with Target ---")
for col, val in corr.items():
    print(f"  {col:20s}  {val:+.4f}")

# Save correlation chart
fig, ax = plt.subplots(figsize=(10, 6))
colors = ["#d62728" if v < 0 else "#2ca02c" for v in corr.values]
ax.barh(corr.index, corr.values, color=colors)
ax.set_title("Feature Correlation with Solar Energy Generation")
ax.set_xlabel("Correlation Coefficient")
plt.tight_layout()
chart_path = os.path.join(BASE, "correlation_chart.png")
plt.savefig(chart_path, dpi=100)
print(f"\nCorrelation chart saved -> {chart_path}")

# ── 4. Scale & split ──────────────────────────────────────────────────
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_imputed)
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)
print(f"\nTrain: {X_train.shape[0]} samples | Test: {X_test.shape[0]} samples")

# ── 5. Define models & hyperparameter grid ─────────────────────────────
models = {
    "Linear Regression":      LinearRegression(),
    "Decision Tree":          DecisionTreeRegressor(random_state=42),
    "Random Forest":          RandomForestRegressor(random_state=42, n_jobs=-1),
    "Gradient Boosting":      GradientBoostingRegressor(random_state=42),
}

param_grids = {
    "Random Forest": {
        "n_estimators": [50, 100, 200],
        "max_depth":    [10, 20, None],
    },
}

# ── 6. Train & evaluate ────────────────────────────────────────────────
results = []
best_model = None
best_model_name = None
best_r2 = -float("inf")

print("\n" + "=" * 60)
print("MODEL TRAINING & EVALUATION")
print("=" * 60)

for name, model in models.items():
    print(f"\n==> {name}")

    if name in param_grids:
        print(f"   GridSearchCV params: {param_grids[name]}")
        search = GridSearchCV(model, param_grids[name], cv=5, scoring="r2", n_jobs=-1)
        search.fit(X_train, y_train)
        fitted = search.best_estimator_
        print(f"   Best params: {search.best_params_}")
    else:
        fitted = model
        fitted.fit(X_train, y_train)

    y_pred = fitted.predict(X_test)

    r2  = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)

    # MAPE (avoid division by zero)
    mask = y_test != 0
    mape = np.mean(np.abs((y_test[mask] - y_pred[mask]) / y_test[mask])) * 100 if mask.any() else 0

    results.append({
        "model": name, "r2": r2, "mae": mae, "mse": mse, "rmse": rmse, "mape": mape
    })

    print(f"   R²  = {r2:.4f}")
    print(f"   MAE = {mae:.4f}  kW")
    print(f"   RMSE= {rmse:.4f}  kW")
    print(f"   MAPE= {mape:.2f} %")

    if r2 > best_r2:
        best_r2 = r2
        best_model = fitted
        best_model_name = name

# ── 7. Results table ───────────────────────────────────────────────────
print("\n" + "=" * 60)
print("FINAL RESULTS (sorted by R²)")
print("=" * 60)
results.sort(key=lambda r: -r["r2"])
print(f"{'Model':<22} {'R²':>8} {'MAE':>8} {'RMSE':>8} {'MAPE':>8}")
print("-" * 56)
for r in results:
    print(f"{r['model']:<22} {r['r2']:>8.4f} {r['mae']:>8.4f} {r['rmse']:>8.4f} {r['mape']:>8.2f}")

# Save results JSON
results_path = os.path.join(BASE, "ml_results.json")
with open(results_path, "w") as f:
    json.dump(results, f, indent=2)
print(f"\nResults saved -> {results_path}")

# ── 8. Feature Importance ──────────────────────────────────────────────
print("\n" + "=" * 60)
print("FEATURE IMPORTANCE")
print("=" * 60)

if hasattr(best_model, "feature_importances_"):
    importance = sorted(
        zip(feature_cols, best_model.feature_importances_),
        key=lambda x: -x[1]
    )
    for feat, imp in importance:
        print(f"  {feat:20s}  {imp:.4f}  ({imp*100:.1f}%)")

    # Save importance chart
    fig, ax = plt.subplots(figsize=(10, 5))
    labels, vals = zip(*importance)
    ax.barh(labels, vals, color="forestgreen")
    ax.set_xlabel("Importance")
    ax.set_title(f"Feature Importance — {best_model_name}")
    ax.invert_yaxis()
    plt.tight_layout()
    imp_path = os.path.join(BASE, "feature_importance.png")
    plt.savefig(imp_path, dpi=100)
    print(f"\nFeature importance chart -> {imp_path}")
else:
    print(f"  {best_model_name} does not provide feature_importances_")

# ── 9. Save best model ─────────────────────────────────────────────────
os.makedirs(os.path.dirname(MODEL_OUT), exist_ok=True)

import joblib
metadata = {
    "model": best_model_name,
    "r2_score": best_r2,
    "features": feature_cols,
    "train_samples": len(X_train),
    "test_samples": len(X_test),
}
joblib.dump({"model": best_model, "metadata": metadata}, MODEL_OUT)
print(f"\n[OK] Best model ({best_model_name}) saved -> {MODEL_OUT}")
print(f"  R² = {best_r2:.4f}")
print(f"\n[OK] Training complete. Charts saved to project root.")
