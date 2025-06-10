import mysql.connector
import os
from typing import Optional
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

class DatabaseConnection:
    """Clase para manejar la conexión a la base de datos MySQL"""
    
    def __init__(self):
        self.config = {
            'host': os.getenv('DB_HOST'),
            'database': os.getenv('DB_NAME'),
            'user': os.getenv('DB_USER'),
            'password': os.getenv('DB_PASSWORD'),
            'port': int(os.getenv('DB_PORT', 3306))
        }
        self._connection = None
    
    def connect(self):
        """Establece conexión con la base de datos"""
        try:
            self._connection = mysql.connector.connect(**self.config)
            return self._connection
        except mysql.connector.Error as error:
            print(f"Error al conectar a la base de datos: {error}")
            return None
    
    def disconnect(self):
        """Cierra la conexión con la base de datos"""
        if self._connection and self._connection.is_connected():
            self._connection.close()
    
    def execute_query(self, query: str, params: Optional[tuple] = None, fetch_all: bool = True, return_id: bool = False):
        """
        Ejecuta una consulta y retorna los resultados
        
        Args:
            query: Consulta SQL a ejecutar
            params: Parámetros para la consulta
            fetch_all: Si True retorna todos los resultados, si False retorna uno
            return_id: Si True retorna el ID del último registro insertado (para INSERT)
        
        Returns:
            Lista de resultados, resultado único, o ID insertado según los parámetros
        """
        connection = self.connect()
        if not connection:
            return None
        
        try:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(query, params or ())
            
            # Para operaciones INSERT/UPDATE/DELETE
            if query.strip().upper().startswith(('INSERT', 'UPDATE', 'DELETE')):
                connection.commit()
                
                if return_id and query.strip().upper().startswith('INSERT'):
                    # Retornar el ID del último registro insertado
                    last_id = cursor.lastrowid
                    cursor.close()
                    return last_id
                else:
                    # Para UPDATE/DELETE retornar filas afectadas
                    affected_rows = cursor.rowcount
                    cursor.close()
                    return affected_rows
            
            # Para operaciones SELECT
            else:
                if fetch_all:
                    results = cursor.fetchall()
                else:
                    results = cursor.fetchone()
                
                cursor.close()
                return results
            
        except mysql.connector.Error as error:
            print(f"Error ejecutando consulta: {error}")
            print(f"Query: {query}")
            print(f"Params: {params}")
            # Rollback en caso de error
            if connection.is_connected():
                connection.rollback()
            return None
        finally:
            self.disconnect()

# Instancia global de la conexión
db = DatabaseConnection() 