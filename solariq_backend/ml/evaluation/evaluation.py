from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

def evaluate_model(model_name, y_true, y_pred):
    mae = mean_absolute_error(y_true, y_pred)
    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_true, y_pred)
    
    return {
        "model": model_name,
        "mae": mae,
        "mse": mse,
        "rmse": rmse,
        "r2_score": r2
    }

def print_evaluation(metrics):
    print(f"\n--- Evaluation: {metrics['model']} ---")
    print(f"R² Score: {metrics['r2_score']:.4f}")
    print(f"MAE:      {metrics['mae']:.4f}")
    print(f"MSE:      {metrics['mse']:.4f}")
    print(f"RMSE:     {metrics['rmse']:.4f}")
    print("--------------------------------------")
