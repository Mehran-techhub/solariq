from flask import current_app

from models.simulation import Simulation
from repositories.simulation_repository import SimulationRepository


class SimulationService:
    @staticmethod
    def run(user_id, appliances):
        solar_capacity = current_app.config.get("SOLAR_CAPACITY_W", 5200)
        total_wattage = sum(int(a.get("wattage", 0)) for a in appliances)

        if total_wattage == 0:
            solar_share = 100.0
        else:
            solar_share = min(88.0, (solar_capacity / (total_wattage + 1000)) * 100)

        grid_share = round(100 - solar_share, 1)
        solar_share = round(solar_share, 1)
        estimated_cost = round((grid_share * 0.5 * 30), 0)

        records = []
        for app_item in appliances:
            name = app_item.get("name") or app_item.get("appliance_name", "Appliance")
            wattage = int(app_item.get("wattage", 0))
            records.append(
                Simulation(
                    user_id=user_id,
                    appliance_name=name,
                    wattage=wattage,
                    solar_share=solar_share,
                    grid_share=grid_share,
                    estimated_cost=estimated_cost,
                )
            )
        if records:
            SimulationRepository.create_batch(records)

        return {
            "solar_share": solar_share,
            "grid_share": grid_share,
            "estimated_cost": estimated_cost,
            "total_wattage": total_wattage,
            "solar_capacity_kw": round(solar_capacity / 1000, 1),
        }
