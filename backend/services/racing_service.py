"""
Racing service - manages cars, training, and races with secret flags
Each car has 10 hidden flags (t0...t9) that are NEVER exposed to the frontend
"""
import random
import hashlib
import json
from datetime import datetime
from typing import Dict, List, Optional, Tuple
# XRP imports (for future payment integration)
# from xrpl.clients import JsonRpcClient
# from xrpl.wallet import Wallet
# from xrpl.models.transactions import Payment
# from xrpl.utils import xrp_to_drops

class Car:
    """Represents a racing car with secret flags representing car attributes"""
    
    # Car attributes mapping (for reference, never exposed to frontend)
    ATTRIBUTE_NAMES = [
        'tyres',        # 0: Tyre quality
        'brakes',       # 1: Brake performance
        'engine',       # 2: Engine power
        'aerodynamics', # 3: Aerodynamic efficiency
        'suspension',   # 4: Suspension quality
        'transmission', # 5: Transmission efficiency
        'fuel_system',  # 6: Fuel system optimization
        'electronics',  # 7: Electronic systems
        'chassis',      # 8: Chassis rigidity
        'cooling'       # 9: Cooling system
    ]
    
    def __init__(self, car_id: str, wallet_address: str):
        self.car_id = car_id
        self.wallet_address = wallet_address
        # Secret flags: 10 random integers between 1-999 (NEVER exposed)
        # Each flag represents a car attribute (tyres, brakes, engine, etc.)
        self.flags = [random.randint(1, 999) for _ in range(10)]
        self.training_count = 0
        self.created_at = datetime.utcnow().isoformat()
        self.last_trained = None
        self.last_speed = None  # Cached speed value
        
    def calculate_speed(self) -> float:
        """
        Calculate speed using secret formula based on flags
        Formula: speed = weighted sum of flags with secret weights
        """
        # Secret weights for each flag (never exposed)
        weights = [0.15, 0.12, 0.10, 0.08, 0.11, 0.09, 0.13, 0.07, 0.08, 0.07]
        speed = sum(f * w for f, w in zip(self.flags, weights))
        self.last_speed = speed
        return speed
    
    def train(self, attribute_indices: Optional[List[int]] = None) -> dict:
        """
        Train the car: randomly adjust specified flags by ±20
        
        Args:
            attribute_indices: List of attribute indices to train (0-9)
                              If None or empty, trains all attributes
        
        Returns:
            dict with changes made (for logging, not for frontend)
        """
        if attribute_indices is None or len(attribute_indices) == 0:
            # Train all attributes
            attribute_indices = list(range(10))
        
        changes = {}
        for i in attribute_indices:
            if 0 <= i < 10:
                old_value = self.flags[i]
                delta = random.randint(-20, 20)
                new_value = max(1, min(999, self.flags[i] + delta))
                self.flags[i] = new_value
                changes[self.ATTRIBUTE_NAMES[i]] = {
                    'old': old_value,
                    'delta': delta,
                    'new': new_value
                }
        
        self.training_count += 1
        self.last_trained = datetime.utcnow().isoformat()
        
        return changes
    
    def to_dict_safe(self) -> dict:
        """
        Convert car to dictionary WITHOUT exposing flags or speed
        """
        return {
            'car_id': self.car_id,
            'wallet_address': self.wallet_address,
            'training_count': self.training_count,
            'created_at': self.created_at,
            'last_trained': self.last_trained
        }

class RacingService:
    """Service to manage cars and races"""
    
    # Destination address for car payments (could be a treasury/pool address)
    PAYMENT_DESTINATION = "rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY"  # Testnet faucet as placeholder
    TESTNET_URL = "https://s.altnet.rippletest.net:51234"
    
    def __init__(self):
        # In-memory storage (in production, use a database)
        self.cars: Dict[str, Car] = {}  # car_id -> Car
        self.garage: Dict[str, List[str]] = {}  # wallet_address -> [car_ids]
        self.races: List[dict] = []
        # self.client = JsonRpcClient(self.TESTNET_URL)  # Commented out for now
    
    def _process_payment(self, wallet_seed: str, amount_xrp: float) -> Tuple[bool, str]:
        """
        Process XRP payment from user wallet
        Returns: (success, transaction_hash or error_message)
        
        NOTE: Temporarily disabled to avoid asyncio issues.
        TODO: Implement proper async payment processing
        """
        # Temporary: Skip actual payment processing
        # In production, this should process real XRP transactions
        return True, f"MOCK-TX-{random.randint(100000, 999999)}"
        
        # try:
        #     # Create wallet from seed
        #     wallet = Wallet.from_seed(wallet_seed)
        #     
        #     # Create payment transaction
        #     payment = Payment(
        #         account=wallet.classic_address,
        #         destination=self.PAYMENT_DESTINATION,
        #         amount=xrp_to_drops(amount_xrp)
        #     )
        #     
        #     # Sign and submit transaction
        #     response = safe_sign_and_submit_transaction(payment, wallet, self.client)
        #     
        #     # Check transaction result
        #     tx_result = response.result.get('meta', {}).get('TransactionResult')
        #     if tx_result == 'tesSUCCESS':
        #         tx_hash = response.result.get('hash', '')
        #         return True, tx_hash
        #     else:
        #         return False, f"Transaction failed: {tx_result}"
        #         
        # except Exception as e:
        #     return False, f"Payment error: {str(e)}"
        
    def _generate_car_id(self, wallet_address: str) -> str:
        """Generate unique car ID"""
        timestamp = datetime.utcnow().timestamp()
        data = f"{wallet_address}{timestamp}{random.random()}"
        hash_id = hashlib.sha256(data.encode()).hexdigest()[:12]
        return f"CAR-{hash_id}"
    
    def create_car(self, wallet_address: str, wallet_seed: str) -> Tuple[bool, Optional[Car], str]:
        """
        Create a new car with random hidden flags
        Cost: 1 XRP (payment processed here)
        Returns: (success, car, message)
        """
        # Process payment first
        payment_success, payment_result = self._process_payment(wallet_seed, 1.0)
        
        if not payment_success:
            return False, None, f"Payment failed: {payment_result}"
        
        # Payment successful, create car
        car_id = self._generate_car_id(wallet_address)
        car = Car(car_id, wallet_address)
        
        self.cars[car_id] = car
        
        if wallet_address not in self.garage:
            self.garage[wallet_address] = []
        self.garage[wallet_address].append(car_id)
        
        return True, car, f"Car created successfully. Payment tx: {payment_result}"
    
    def get_garage(self, wallet_address: str) -> List[Car]:
        """Get all cars for a wallet address"""
        car_ids = self.garage.get(wallet_address, [])
        return [self.cars[cid] for cid in car_ids if cid in self.cars]
    
    def get_car(self, car_id: str) -> Optional[Car]:
        """Get a specific car"""
        return self.cars.get(car_id)
    
    def train_car(self, car_id: str, wallet_address: str, wallet_seed: str, attribute_indices: Optional[List[int]] = None) -> Tuple[bool, str, Optional[Car], Optional[dict]]:
        """
        Train a car (costs 1 XRP, payment processed here)
        Training CREATES A NEW CAR based on the selected car with modified attributes
        
        Args:
            car_id: The car ID to use as base for training
            wallet_address: Owner's wallet address
            wallet_seed: Owner's wallet seed for payment
            attribute_indices: List of attribute indices to train (0-9)
                              None or empty list = train all attributes
        
        Returns: (success, message, new_car, changes_info)
        """
        base_car = self.cars.get(car_id)
        
        if not base_car:
            return False, "Car not found", None, None
        
        if base_car.wallet_address != wallet_address:
            return False, "You don't own this car", None, None
        
        # Process payment first
        payment_success, payment_result = self._process_payment(wallet_seed, 1.0)
        
        if not payment_success:
            return False, f"Payment failed: {payment_result}", None, None
        
        # Payment successful, create new car
        new_car_id = self._generate_car_id(wallet_address)
        new_car = Car(new_car_id, wallet_address)
        
        # Copy flags from base car
        new_car.flags = base_car.flags.copy()
        new_car.training_count = base_car.training_count  # Inherit training count
        
        # Apply training to specified attributes of the NEW car
        changes = new_car.train(attribute_indices)
        
        # Store the new car
        self.cars[new_car_id] = new_car
        
        if wallet_address not in self.garage:
            self.garage[wallet_address] = []
        self.garage[wallet_address].append(new_car_id)
        
        # Prepare info about what was trained (attribute names only, not values)
        if attribute_indices:
            trained_attrs = [new_car.ATTRIBUTE_NAMES[i] for i in attribute_indices if 0 <= i < 10]
            attr_msg = f"Trained: {', '.join(trained_attrs)}"
        else:
            attr_msg = "Trained: All attributes"
        
        return True, f"New car created from training (Training #{new_car.training_count}). {attr_msg}. Payment tx: {payment_result}", new_car, changes
    
    def test_speed(self, car_id: str, wallet_address: str) -> Tuple[bool, bool, str]:
        """
        Test car speed - FREE, only returns if speed improved (not the actual value)
        Returns: (success, improved, message)
        """
        car = self.cars.get(car_id)
        
        if not car:
            return False, False, "Car not found"
        
        if car.wallet_address != wallet_address:
            return False, False, "You don't own this car"
        
        if car.training_count == 0:
            return True, False, "Train your car first before testing"
        
        # Calculate current speed
        current_speed = car.calculate_speed()
        
        # Compare with last known speed (or use a baseline)
        if car.last_speed is None:
            car.last_speed = current_speed
            return True, False, "Baseline speed recorded"
        
        improved = current_speed > car.last_speed
        car.last_speed = current_speed
        
        return True, improved, "Speed test completed"
    
    def enter_race(self, car_id: str, wallet_address: str) -> Tuple[bool, Optional[dict]]:
        """
        Enter a race (costs 1 XRP, validated by caller)
        Returns: (success, race_result)
        """
        car = self.cars.get(car_id)
        
        if not car:
            return False, None
        
        if car.wallet_address != wallet_address:
            return False, None
        
        # Simulate race with 3-7 AI opponents
        num_opponents = random.randint(3, 7)
        
        # Calculate car's speed
        player_speed = car.calculate_speed()
        
        # Generate AI opponents with random speeds
        opponents = []
        for i in range(num_opponents):
            ai_id = f"AI-{i+1}"
            ai_speed = random.uniform(30, 70)  # AI speeds between 30-70
            opponents.append({'id': ai_id, 'speed': ai_speed})
        
        # Add player to race
        all_racers = [{'id': car_id, 'speed': player_speed, 'is_player': True}]
        all_racers.extend([{**opp, 'is_player': False} for opp in opponents])
        
        # Sort by speed (highest wins)
        all_racers.sort(key=lambda x: x['speed'], reverse=True)
        
        # Find player's rank
        player_rank = next(i + 1 for i, r in enumerate(all_racers) if r.get('is_player'))
        
        winner_id = all_racers[0]['id']
        prize_awarded = winner_id == car_id
        
        race_id = f"RACE-{datetime.utcnow().timestamp()}"
        
        race_result = {
            'race_id': race_id,
            'car_id': car_id,
            'your_rank': player_rank,
            'winner_car_id': winner_id,
            'total_participants': len(all_racers),
            'prize_awarded': prize_awarded,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        self.races.append(race_result)
        
        return True, race_result

# Global service instance
racing_service = RacingService()
