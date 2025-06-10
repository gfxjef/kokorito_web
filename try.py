import os
import json
from flask import Flask, jsonify
import pymysql
from dotenv import load_dotenv

# Load environment variables from a .env file if present
load_dotenv()

# Database connection settings from environment
DB_HOST = os.getenv('DB_HOST')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_PORT = int(os.getenv('DB_PORT', 3306))

# Initialize Flask app
app = Flask(__name__)


def get_schema_and_data():
    """
    Connects to the MySQL database and retrieves
    the schema and all data for each table.
    Returns a dict with table metadata and rows.
    """
    conn = pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        port=DB_PORT,
        cursorclass=pymysql.cursors.DictCursor
    )

    schema_json = {}
    try:
        with conn.cursor() as cursor:
            # Get list of tables
            cursor.execute(
                "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = %s",
                (DB_NAME,)
            )
            tables = [row['TABLE_NAME'] for row in cursor.fetchall()]

            for table in tables:
                # Get column metadata
                cursor.execute(
                    "SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE, IS_NULLABLE "
                    "FROM information_schema.columns "
                    "WHERE table_schema = %s AND table_name = %s",
                    (DB_NAME, table)
                )
                columns = cursor.fetchall()

                # Get all data from table
                cursor.execute(f"SELECT * FROM `{table}`")
                rows = cursor.fetchall()

                schema_json[table] = {
                    "columns": columns,
                    "rows": rows
                }
    finally:
        conn.close()

    return schema_json


@app.route('/schema', methods=['GET'])
def schema_endpoint():
    """API endpoint to return the database schema and data as JSON."""
    data = get_schema_and_data()
    return jsonify(data)


if __name__ == '__main__':
    # Run the app on port 5000 by default
    app.run(host='0.0.0.0', port=5000, debug=True)