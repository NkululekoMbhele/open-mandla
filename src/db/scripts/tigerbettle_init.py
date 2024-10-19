import json
import os
import subprocess
from datetime import datetime

# Paths for the TigerBeetle data directory and JSON files
DATA_DIR = './tigerbeetle_data/'
ACCOUNTS_FILE = os.path.join(DATA_DIR, 'accounts.json')
TRANSFERS_FILE = os.path.join(DATA_DIR, 'transfers.json')

# Ensure the data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# User balances schema (TigerBeetle Account)
user_balances = [
    {
        "id": 1,  # Unique account ID (can be incremented)
        "ledger": 1,  # The ledger the account belongs to (optional)
        "code": 1,  # Account code (can be used for different types of accounts)
        "user_data": {"user_id": "123", "phone_number": "+1234567890", "asset": "USD"},  # User metadata
        "debits_posted": 0,  # Initial debit balance
        "credits_posted": 1000,  # Initial credit balance (e.g., user deposit)
        "timestamp": int(datetime.now().timestamp())
    }
]

# Transaction table schema (TigerBeetle Transfers)
transactions = [
    {
        "id": 1,  # Unique transaction ID
        "debit_account_id": 1,  # Source account for the transfer
        "credit_account_id": 2,  # Destination account for the transfer
        "ledger": 1,  # Ledger the transfer belongs to
        "code": 1,  # Code indicating transaction type (e.g., transfer, deposit)
        "amount": 500,  # Amount being transferred
        "timestamp": int(datetime.now().timestamp())
    }
]

# Save the accounts (user balances) JSON to a file
with open(ACCOUNTS_FILE, 'w') as f:
    json.dump(user_balances, f, indent=4)

# Save the transfers (transactions) JSON to a file
with open(TRANSFERS_FILE, 'w') as f:
    json.dump(transactions, f, indent=4)

# Function to initialize the TigerBeetle DB and create accounts and transfers
def initialize_tigerbeetle():
    # Command to initialize the TigerBeetle DB
    init_command = [
        "docker", "run", "--rm", "--name", "mm_txns_db", "-v", f"{DATA_DIR}:/data",
        "ghcr.io/tigerbeetle/tigerbeetle:latest", "init", "--directory", "/data"
    ]

    # Run the command to initialize the TigerBeetle DB
    print("Initializing TigerBeetle DB...")
    subprocess.run(init_command)

    # Create accounts (user balances)
    create_accounts_command = [
        "docker", "run", "--rm", "-v", f"{DATA_DIR}:/data",
        "ghcr.io/tigerbeetle/tigerbeetle:latest", "create", "accounts", "--input", "/data/accounts.json", "--directory", "/data"
    ]
    print("Creating accounts...")
    subprocess.run(create_accounts_command)

    # Create transfers (transactions)
    create_transfers_command = [
        "docker", "run", "--rm", "-v", f"{DATA_DIR}:/data",
        "ghcr.io/tigerbeetle/tigerbeetle:latest", "create", "transfers", "--input", "/data/transfers.json", "--directory", "/data"
    ]
    print("Creating transfers...")
    subprocess.run(create_transfers_command)

# Run the initialization
initialize_tigerbeetle()

print("TigerBeetle DB initialized with accounts and transfers.")
