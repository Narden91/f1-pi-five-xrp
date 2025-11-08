"""Pydantic models for request/response validation"""
from pydantic import BaseModel, Field, validator
from typing import Optional

class WalletCreateRequest(BaseModel):
    """Request model for wallet creation"""
    seed: str = Field(default="", description="Optional seed for wallet import")
    
    @validator('seed')
    def validate_seed(cls, v):
        if v and len(v) < 10:
            raise ValueError('Seed must be at least 10 characters if provided')
        return v

class WalletResponse(BaseModel):
    """Response model for wallet operations"""
    address: str
    seed: str
    public_key: str
    
class BalanceResponse(BaseModel):
    """Response model for balance queries"""
    address: str
    balance_xrp: float
    balance_drops: str
    
class PaymentRequest(BaseModel):
    """Request model for payment transactions"""
    sender_seed: str = Field(..., description="Sender wallet seed")
    destination: str = Field(..., description="Destination XRP address")
    amount: float = Field(..., gt=0, description="Amount in XRP (must be positive)")
    
    @validator('destination')
    def validate_destination(cls, v):
        if not v.startswith('r'):
            raise ValueError('Invalid XRP address format')
        if len(v) < 25 or len(v) > 35:
            raise ValueError('XRP address length invalid')
        return v

class PaymentResponse(BaseModel):
    """Response model for payment transactions"""
    status: str
    transaction_hash: Optional[str] = None
    result: Optional[str] = None
    validated: bool
    fee: Optional[str] = None
    
class HealthResponse(BaseModel):
    """Response model for health check"""
    status: str
    testnet_connected: bool
    ledger: Optional[int] = None
    network: str
    
class ErrorResponse(BaseModel):
    """Response model for errors"""
    detail: str
    error_type: Optional[str] = None

# Racing Game Models
class CarCreateRequest(BaseModel):
    """Request model for creating a new car"""
    wallet_address: str = Field(..., description="Owner's wallet address")
    wallet_seed: str = Field(..., description="Owner's wallet seed for payment")
    
    @validator('wallet_address')
    def validate_wallet_address(cls, v):
        if not v.startswith('r'):
            raise ValueError('Invalid XRP address format')
        return v

class CarResponse(BaseModel):
    """Response model for car data (no flags exposed)"""
    car_id: str
    wallet_address: str
    training_count: int
    created_at: str
    last_trained: Optional[str] = None
    
class GarageResponse(BaseModel):
    """Response model for garage (list of cars)"""
    wallet_address: str
    cars: list[CarResponse]
    total_cars: int

class TrainCarRequest(BaseModel):
    """Request model for training a car"""
    car_id: str
    wallet_address: str
    wallet_seed: str = Field(..., description="Owner's wallet seed for payment")
    attribute_indices: Optional[list[int]] = None  # None or empty = train all, otherwise train specific indices (0-9)
    
class TrainCarResponse(BaseModel):
    """Response model for training result"""
    success: bool
    car_id: str
    training_count: int
    message: str
    payment_required: bool = True
    trained_attributes: Optional[list[str]] = None  # Names of trained attributes (not values)
    speed: Optional[float] = None  # New car's speed after training
    
class TestSpeedRequest(BaseModel):
    """Request model for speed test"""
    car_id: str
    wallet_address: str
    
class TestSpeedResponse(BaseModel):
    """Response model for speed test"""
    success: bool
    car_id: str
    improved: bool
    message: str
    speed: Optional[float] = None  # Actual speed value in km/h

class EnterRaceRequest(BaseModel):
    """Request model for entering a race"""
    car_id: str
    wallet_address: str
    wallet_seed: str = Field(..., description="Owner's wallet seed for payment (1 XRP entry fee)")
    
class RaceResponse(BaseModel):
    """Response model for race results"""
    success: bool
    race_id: str
    car_id: str
    your_rank: int
    winner_car_id: str
    total_participants: int
    prize_awarded: bool
    message: str

class SellCarRequest(BaseModel):
    """Request model for selling a car"""
    car_id: str
    wallet_address: str
    
class SellCarResponse(BaseModel):
    """Response model for selling a car"""
    success: bool
    message: str
    refund_amount: float
