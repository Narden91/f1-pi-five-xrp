"""Payment service for XRP transactions"""
import xrpl
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
from xrpl.models.transactions import Payment
from xrpl.transaction import submit_and_wait
from xrpl.utils import xrp_to_drops
from typing import Dict, Any
from config import settings

class PaymentService:
    """Service for managing XRP payments"""
    
    def __init__(self):
        self.testnet_url = settings.TESTNET_URL
    
    def send_payment(
        self, 
        sender_seed: str, 
        destination: str, 
        amount: float,
        memo: str = None
    ) -> Dict[str, Any]:
        """
        Send XRP payment
        
        Args:
            sender_seed: Sender wallet seed
            destination: Destination address
            amount: Amount in XRP
            memo: Optional memo for the transaction
            
        Returns:
            Dictionary containing transaction result
        """
        client = JsonRpcClient(self.testnet_url)
        sender_wallet = Wallet.from_seed(sender_seed)
        
        # Create payment transaction
        payment_tx = Payment(
            account=sender_wallet.address,
            amount=xrp_to_drops(amount),
            destination=destination,
        )
        
        # Add memo if provided
        if memo:
            payment_tx.memos = [
                xrpl.models.transactions.Memo(
                    memo_data=memo.encode('utf-8').hex()
                )
            ]
        
        # Submit and wait for validation
        response = submit_and_wait(payment_tx, client, sender_wallet)
        
        result_data = {
            "status": "success",
            "transaction_hash": response.result.get('hash'),
            "result": response.result.get('meta', {}).get('TransactionResult'),
            "validated": response.result.get('validated', False),
        }
        
        # Add fee if available
        if 'Fee' in response.result:
            result_data['fee'] = response.result['Fee']
        
        return result_data
    
    def get_transaction_history(self, address: str, limit: int = 10) -> list:
        """
        Get transaction history for an address
        
        Args:
            address: XRP Ledger address
            limit: Maximum number of transactions to retrieve
            
        Returns:
            List of transactions
        """
        client = JsonRpcClient(self.testnet_url)
        
        tx_request = xrpl.models.requests.AccountTx(
            account=address,
            ledger_index_min=-1,
            ledger_index_max=-1,
            limit=limit
        )
        
        response = client.request(tx_request)
        return response.result.get('transactions', [])
