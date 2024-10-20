import os
import subprocess
import time
import psycopg2

from psycopg2 import sql
from dotenv import load_dotenv

load_dotenv()


#  docker compose -f local-setup/docker-compose.yaml build app  
# Configuration
POSTGRES_CONTAINER_NAME = os.getenv('POSTGRES_CONTAINER_NAME')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')
POSTGRES_USER = os.getenv('POSTGRES_USER')
POSTGRES_DB = os.getenv('POSTGRES_DB')
POSTGRES_PORT = os.getenv('POSTGRES_PORT')
POSTGRES_PORT = os.getenv('POSTGRES_PORT')

TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')
ASSETS = os.getenv('ASSETS')


SQL_DIR = './src/db/scripts/'  # Directory where the SQL files are located
TABLE_TXN_FILE = 'TABLE_TXN.sql'  # SQL file for transactions table schema
TABLE_BALANCES_FILE = 'TABLE_BALANCES.sql'  # SQL file for user balances table schema
TABLE_USERS_FILE = 'TABLE_USERS.sql'  # SQL file for user balances table schema
TABLE_SESSION = 'TABLE_SESSION.sql'  # SQL file for user balances table schema
QUERY_DEFAULT_USER = f"""
    INSERT INTO user_details (user_id, phone_number, user_name, country)
    VALUES ('12345', '{TWILIO_PHONE_NUMBER}', 'Account Admin', 'ZA');
"""

QUERY_DEFAULT_BALANCE = """
    INSERT INTO user_balances (user_id, asset, amount)
    VALUES ('12345', '{ASSET}', 0.0);
"""

# Docker command to run PostgreSQL container
docker_run_command = [
    'docker', 'run', '--rm', '--name', POSTGRES_CONTAINER_NAME,
    '-e', f'POSTGRES_PASSWORD={POSTGRES_PASSWORD}',
    '-e', f'POSTGRES_USER={POSTGRES_USER}',
    '-e', f'POSTGRES_DB={POSTGRES_DB}',
    '-p', f'{POSTGRES_PORT}:5432',
    'postgres'
]
docker_run_command = [
    'docker', 'compose', 'up', "-d",
]

# Wait time to ensure the container is fully started
WAIT_TIME = 30//4

def start_postgres_container():
    """Start a PostgreSQL container using Docker."""
    print("Starting PostgreSQL container...")
    subprocess.run(docker_run_command)
    print(f"PostgreSQL container '{POSTGRES_CONTAINER_NAME}' is starting...")

    # Wait for the container to be ready
    print("Waiting for PostgreSQL container to be ready...")
    time.sleep(WAIT_TIME)
    print("PostgreSQL container started successfully.")

def execute_sql_script(cursor, file_path):
    """Execute an SQL script to create schema in PostgreSQL."""
    with open(file_path, 'r') as f:
        sql_script = f.read()
        cursor.execute(sql_script)
        print(f"Executed SQL script: {file_path}")

def execute_sql_string(cursor, sql_string):
    """Execute an SQL script to create schema in PostgreSQL."""
    cursor.execute(sql_string)
    print(f"Executed SQL script: {sql_string}")

def create_schemas():
    """Create the schemas using the SQL files."""
    # Connect to the PostgreSQL container
    conn = psycopg2.connect(
        dbname=POSTGRES_DB,
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        host='127.0.0.1',
        # host='localhost',
        port=POSTGRES_PORT
    )
    
    try:
        cursor = conn.cursor()

        # Execute SQL scripts for tables
        print("Creating tables based on SQL files...")
        execute_sql_script(cursor, os.path.join(SQL_DIR, TABLE_TXN_FILE))
        execute_sql_script(cursor, os.path.join(SQL_DIR, TABLE_BALANCES_FILE))
        execute_sql_script(cursor, os.path.join(SQL_DIR, TABLE_USERS_FILE))
        execute_sql_script(cursor, os.path.join(SQL_DIR, TABLE_SESSION))
        execute_sql_string(cursor, QUERY_DEFAULT_USER)
        for asset in ASSETS.split(","):
            execute_sql_string(cursor, QUERY_DEFAULT_BALANCE.format(ASSET=asset))


        # Commit the changes
        conn.commit()
        print("Tables created successfully.")

    except Exception as e:
        print(f"Error occurred: {e}")
    finally:
        # Close the connection
        cursor.close()
        conn.close()

def main():
    # Step 1: Start PostgreSQL in Docker
    print("Start PostgreSQL in Docker")
    start_postgres_container()

    # Step 2: Create tables by executing SQL scripts
    print("Creating tables based on SQL files...")
    create_schemas()

    print("PostgreSQL setup completed.")

if __name__ == '__main__':
    main()
