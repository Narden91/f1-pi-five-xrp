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
