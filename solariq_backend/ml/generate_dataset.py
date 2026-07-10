import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta

def generate_synthetic_data(num_samples=10000):
    np.random.seed(42)
    
    # Time features
    dates = [datetime(2023, 1, 1) + timedelta(hours=i) for i in range(num_samples)]
    hours = [d.hour for d in dates]
    days = [d.day for d in dates]
    months = [d.month for d in dates]
    
    # Environmental features
    temperature = np.random.normal(loc=25, scale=10, size=num_samples) # 5 to 45 C
    humidity = np.random.uniform(low=10, high=90, size=num_samples) # 10% to 90%
    cloud_cover = np.random.uniform(low=0, high=100, size=num_samples)
    wind_speed = np.random.uniform(low=0, high=20, size=num_samples)
    pressure = np.random.uniform(low=990, high=1025, size=num_samples)
    
    # Calculate Solar Irradiance based on hour and cloud cover
    # Irradiance peaks at noon, zero at night (before 6 or after 18)
    irradiance = np.zeros(num_samples)
    for i in range(num_samples):
        h = hours[i]
        if 6 <= h <= 18:
            base_irr = np.sin((h - 6) * np.pi / 12) * 1000  # Peak 1000 W/m^2
            # Clouds reduce irradiance
            irr = base_irr * (1 - (cloud_cover[i] / 200))
            # Temperature also affects (high temp slight drop)
            irradiance[i] = max(0, irr + np.random.normal(0, 50))
    
    # Target: Solar Energy Generation (kWh)
    # Assumes a base 5kW system for generation
    generation = (irradiance * 0.005) * (1 - 0.004 * (temperature - 25))
    generation = np.maximum(0, generation + np.random.normal(0, 0.2, num_samples))
    # Zero generation at night
    generation = np.where((np.array(hours) < 6) | (np.array(hours) > 18), 0, generation)
    
    df = pd.DataFrame({
        "temperature": temperature,
        "humidity": humidity,
        "cloud_cover": cloud_cover,
        "wind_speed": wind_speed,
        "pressure": pressure,
        "irradiance": irradiance,
        "hour": hours,
        "day": days,
        "month": months,
        "solar_energy_generation": generation
    })
    
    # Inject some noise and missing values to demonstrate preprocessing
    # Missing values
    missing_indices = np.random.choice(num_samples, size=int(num_samples*0.02), replace=False)
    df.loc[missing_indices, "temperature"] = np.nan
    df.loc[missing_indices[:len(missing_indices)//2], "humidity"] = np.nan
    
    # Outliers
    outlier_indices = np.random.choice(num_samples, size=int(num_samples*0.01), replace=False)
    df.loc[outlier_indices, "irradiance"] = 1500 + np.random.uniform(0, 500, size=len(outlier_indices))

    os.makedirs(os.path.join(os.path.dirname(__file__), "data"), exist_ok=True)
    csv_path = os.path.join(os.path.dirname(__file__), "data", "dataset.csv")
    df.to_csv(csv_path, index=False)
    print(f"Generated synthetic dataset with {num_samples} samples at {csv_path}")

if __name__ == "__main__":
    generate_synthetic_data()
