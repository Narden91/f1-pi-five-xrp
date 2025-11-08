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
    Cost: 1 XRP (payment processed here via blockchain)
    """
    try:
        success, car, message = racing_service.create_car(request.wallet_address, request.wallet_seed)
        
        if not success:
            logger.warning(f"Car creation failed for {request.wallet_address}: {message}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message
            )
        
        logger.info(f"Created car {car.car_id} for {request.wallet_address}. Payment: {message}")
        return car.to_dict_safe()
    except HTTPException:
        raise
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
    Train a car - randomly adjusts hidden flags by ±20
    Cost: 1 XRP (payment processed here via blockchain)
    
    Can train specific attributes or all:
    - attribute_indices: None or [] = train all 10 attributes
    - attribute_indices: [0, 1] = train only tyres and brakes
    - attribute_indices: [2] = train only engine
    
    Attributes: 0=tyres, 1=brakes, 2=engine, 3=aerodynamics, 4=suspension,
                5=transmission, 6=fuel_system, 7=electronics, 8=chassis, 9=cooling
    """
    try:
        success, message, car, changes = racing_service.train_car(
            request.car_id,
            request.wallet_address,
            request.wallet_seed,
            request.attribute_indices
        )
        
        if not success:
            logger.warning(f"Training failed for car {request.car_id}: {message}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message
            )
        
        # Get names of trained attributes
        if request.attribute_indices:
            trained_attrs = [car.ATTRIBUTE_NAMES[i] for i in request.attribute_indices if 0 <= i < 10]
        else:
            trained_attrs = car.ATTRIBUTE_NAMES.copy()
        
        logger.info(f"Trained car {request.car_id} -> New car {car.car_id} - Training #{car.training_count} - Attributes: {trained_attrs}")
        
        return {
            'success': True,
            'car_id': car.car_id,
            'training_count': car.training_count,
            'message': message,
            'payment_required': True,
            'trained_attributes': trained_attrs
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
    Returns the actual speed value and whether it improved
    """
    try:
        success, improved, message, speed_value = racing_service.test_speed(
            request.car_id,
            request.wallet_address
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message
            )
        
        logger.info(f"Speed test for car {request.car_id}: speed={speed_value:.2f} km/h, improved={improved}")
        
        return {
            'success': True,
            'car_id': request.car_id,
            'improved': improved,
            'message': message,
            'speed': speed_value
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
    Cost: 1 XRP (payment processed here via blockchain)
    Winner receives 100 XRP prize
    Returns only rank and winner, NOT speed values or flags
    """
    try:
        success, race_result = racing_service.enter_race(
            request.car_id,
            request.wallet_address,
            request.wallet_seed
        )
        
        if not success:
            error_msg = race_result.get('message', 'Failed to enter race') if race_result else 'Failed to enter race'
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )
        
        logger.info(f"Race completed - Car {request.car_id} placed #{race_result['your_rank']} - Payment: {race_result.get('payment_tx', 'N/A')}")
        
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
