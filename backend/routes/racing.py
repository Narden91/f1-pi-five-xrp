"""Racing routes for car management and racing"""
from fastapi import APIRouter, HTTPException, status
from models import (
    CarCreateRequest, CarResponse, GarageResponse,
    TrainCarRequest, TrainCarResponse,
    TestSpeedRequest, TestSpeedResponse,
    EnterRaceRequest, RaceResponse
)
from services.racing_service import racing_service
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/race", tags=["racing"])

@router.post("/car/create", response_model=CarResponse, status_code=status.HTTP_201_CREATED)
async def create_car(request: CarCreateRequest):
    """
    Create a new car with 10 hidden flags
    Cost: 10 XRP (payment should be validated before calling this)
    """
    try:
        car = racing_service.create_car(request.wallet_address)
        logger.info(f"Created car {car.car_id} for {request.wallet_address}")
        return car.to_dict_safe()
    except Exception as e:
        logger.error(f"Error creating car: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create car: {str(e)}"
        )

@router.get("/garage/{wallet_address}", response_model=GarageResponse)
async def get_garage(wallet_address: str):
    """
    Get all cars for a wallet address
    Returns car info WITHOUT exposing secret flags
    """
    try:
        cars = racing_service.get_garage(wallet_address)
        return {
            'wallet_address': wallet_address,
            'cars': [car.to_dict_safe() for car in cars],
            'total_cars': len(cars)
        }
    except Exception as e:
        logger.error(f"Error fetching garage: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch garage: {str(e)}"
        )

@router.post("/train", response_model=TrainCarResponse)
async def train_car(request: TrainCarRequest):
    """
    Train a car - randomly adjusts hidden flags by ±<20
    Cost: 1 XRP (payment should be validated before calling this)
    """
    try:
        success, message, car = racing_service.train_car(
            request.car_id,
            request.wallet_address
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message
            )
        
        logger.info(f"Trained car {request.car_id} - Training #{car.training_count}")
        
        return {
            'success': True,
            'car_id': car.car_id,
            'training_count': car.training_count,
            'message': message,
            'payment_required': True
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error training car: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to train car: {str(e)}"
        )

@router.post("/test", response_model=TestSpeedResponse)
async def test_speed(request: TestSpeedRequest):
    """
    Test car speed - FREE
    Returns only whether speed improved, NOT the actual speed value
    """
    try:
        success, improved, message = racing_service.test_speed(
            request.car_id,
            request.wallet_address
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message
            )
        
        logger.info(f"Speed test for car {request.car_id}: improved={improved}")
        
        return {
            'success': True,
            'car_id': request.car_id,
            'improved': improved,
            'message': message
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error testing speed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to test speed: {str(e)}"
        )

@router.post("/enter", response_model=RaceResponse)
async def enter_race(request: EnterRaceRequest):
    """
    Enter a race with your car
    Cost: 1 XRP (payment should be validated before calling this)
    Winner receives 100 XRP prize
    Returns only rank and winner, NOT speed values or flags
    """
    try:
        success, race_result = racing_service.enter_race(
            request.car_id,
            request.wallet_address
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to enter race"
            )
        
        logger.info(f"Race completed - Car {request.car_id} placed #{race_result['your_rank']}")
        
        return {
            'success': True,
            'race_id': race_result['race_id'],
            'car_id': race_result['car_id'],
            'your_rank': race_result['your_rank'],
            'winner_car_id': race_result['winner_car_id'],
            'total_participants': race_result['total_participants'],
            'prize_awarded': race_result['prize_awarded'],
            'message': f"You placed #{race_result['your_rank']}! {'🎉 You won!' if race_result['prize_awarded'] else ''}"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error entering race: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to enter race: {str(e)}"
        )
