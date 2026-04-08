import random
import json
import time
from datetime import datetime, timezone

# ─── Configuration ────────────────────────────────────────────
INTERSECTION_ID = "INT_001"
LANES = ["north", "south", "east", "west"]
SIMULATION_INTERVAL = 2  # seconds between each snapshot

# ─── Time Multiplier ──────────────────────────────────────────
def get_traffic_multiplier():
    """
    Returns a multiplier based on simulated hour of day.
    This makes traffic feel realistic instead of purely random.
    """
    hour = datetime.now().hour  # 0 to 23

    if 8 <= hour <= 10:
        return 2.5   # Morning rush hour
    elif 17 <= hour <= 19:
        return 3.0   # Evening rush hour — heaviest traffic
    elif 23 <= hour or hour <= 5:
        return 0.3   # Late night — very low traffic
    else:
        return 1.0   # Normal hours

# ─── Lane Data Generator ──────────────────────────────────────
def generate_lane_data(multiplier):
    """
    Generates data for all 4 lanes.
    vehicle_count is scaled by the time multiplier.
    One lane randomly gets a green signal (simplified logic for now).
    Emergency is rare — 5% chance on any lane.
    """
    lanes = {}
    green_lane = random.choice(LANES)  # Only one lane is green at a time

    for lane in LANES:
        base_count = random.randint(1, 20)
        vehicle_count = int(base_count * multiplier)

        lanes[lane] = {
            "vehicle_count": vehicle_count,
            "signal_state": "green" if lane == green_lane else "red",
            "emergency": random.random() < 0.05  # 5% chance
        }

    return lanes

# ─── Snapshot Builder ─────────────────────────────────────────
def generate_snapshot():
    """
    Builds the full intersection snapshot matching our schema exactly.
    """
    multiplier = get_traffic_multiplier()

    snapshot = {
        "intersection_id": INTERSECTION_ID,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "lanes": generate_lane_data(multiplier)
    }

    return snapshot

# ─── Main Loop ────────────────────────────────────────────────
if __name__ == "__main__":
    print("🚦 Traffic Simulator Started...\n")

    while True:
        snapshot = generate_snapshot()
        print(json.dumps(snapshot, indent=2))
        print("-" * 50)
        time.sleep(SIMULATION_INTERVAL)