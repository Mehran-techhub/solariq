from app import create_app
app = create_app()
with app.app_context():
    from services.prediction_service import PredictionService

    data = {
        'date': '2026-06-30',
        'time': '13:00',
        'temperature': 31,
        'humidity': 45,
        'cloud_cover': 12,
        'solar_irradiance': 850,
        'wind_speed': 8,
        'panel_capacity': 5.0,
        'panel_type': 'Monocrystalline',
        'panel_count': 1,
        'installation_angle': 30,
        'battery_capacity': 5.0,
        'battery_current': 2.1,
        'location': 'Islamabad',
    }
    result = PredictionService.calculate(data)
    print('=== PREDICTION RESULT ===')
    for k, v in sorted(result.items()):
        if k in ('appliances', 'curve_data'):
            print(f'  {k}: ({type(v).__name__}) len={len(v)}')
        else:
            print(f'  {k}: {v}')

    print('\nEnergy insight:', result['energy_insight'])
    print('Weather explanation:', result['weather_explanation'])
    print('Maintenance status:', result['maintenance_status'])

    print('\n=== APPLIANCES ===')
    for a in result['appliances'][:6]:
        print(f'  {a["name"]:30s} {a["can_run"]:8s} {a["duration"]}')

    print('\nALL OK')
