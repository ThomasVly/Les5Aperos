"""
Service de stockage abstrait pour les contacts.
- Production: Azure Blob Storage
- Développement: Stockage fichier local
"""
import os
import json
from datetime import datetime
from pathlib import Path

# Configuration
IS_PRODUCTION = os.environ.get('FLASK_ENV', 'development') == 'production'
BASE_DIR = Path(__file__).resolve().parent.parent

# Import conditionnel Azure Blob Storage
if IS_PRODUCTION:
    try:
        from azure.storage.blob import BlobServiceClient
        AZURE_BLOB_AVAILABLE = True
    except ImportError:
        AZURE_BLOB_AVAILABLE = False
        print("Warning: azure-storage-blob not installed, falling back to local storage")
else:
    AZURE_BLOB_AVAILABLE = False


class StorageService:
    """Service de stockage abstrait"""
    
    def __init__(self):
        self.is_production = IS_PRODUCTION and AZURE_BLOB_AVAILABLE
        
        if self.is_production:
            connection_string = os.environ.get('AZURE_STORAGE_CONNECTION_STRING')
            container_name = os.environ.get('AZURE_STORAGE_CONTAINER_NAME', 'contacts')
            
            if not connection_string:
                raise ValueError("AZURE_STORAGE_CONNECTION_STRING is required in production")
            
            self.blob_service_client = BlobServiceClient.from_connection_string(connection_string)
            self.container_name = container_name
            
            # Créer le container s'il n'existe pas
            try:
                self.container_client = self.blob_service_client.get_container_client(container_name)
                if not self.container_client.exists():
                    self.container_client.create_container()
            except Exception as e:
                print(f"Warning: Could not create container: {e}")
                self.container_client = self.blob_service_client.get_container_client(container_name)
        else:
            # Mode local
            self.contacts_dir = BASE_DIR / 'contacts'
            self.contacts_dir.mkdir(exist_ok=True)
    
    def save_contact(self, data: dict) -> dict:
        """
        Sauvegarde un contact.
        
        Args:
            data: Dictionnaire avec nom, email, sujet, message
            
        Returns:
            dict avec status et message
        """
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        contact_data = {
            'timestamp': datetime.now().isoformat(),
            'nom': data.get('nom'),
            'email': data.get('email'),
            'sujet': data.get('sujet'),
            'message': data.get('message')
        }
        
        if self.is_production:
            return self._save_to_blob(contact_data, timestamp)
        else:
            return self._save_to_file(contact_data, timestamp)
    
    def _save_to_blob(self, contact_data: dict, timestamp: str) -> dict:
        """Sauvegarde dans Azure Blob Storage"""
        try:
            blob_name = f"contact_{timestamp}.json"
            blob_client = self.container_client.get_blob_client(blob_name)
            
            content = json.dumps(contact_data, ensure_ascii=False, indent=2)
            blob_client.upload_blob(content, overwrite=True)
            
            return {
                'status': 'success',
                'message': 'Votre message a été envoyé avec succès !',
                'blob_name': blob_name
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Erreur lors de la sauvegarde: {str(e)}'
            }
    
    def _save_to_file(self, contact_data: dict, timestamp: str) -> dict:
        """Sauvegarde en fichier local (dev)"""
        try:
            filename = self.contacts_dir / f'contact_{timestamp}.json'
            
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(contact_data, f, ensure_ascii=False, indent=2)
            
            return {
                'status': 'success',
                'message': 'Votre message a été envoyé avec succès !',
                'filename': str(filename)
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Erreur lors de la sauvegarde: {str(e)}'
            }
    
    def list_contacts(self) -> list:
        """Liste tous les contacts (pour admin)"""
        contacts = []
        
        if self.is_production:
            try:
                blobs = self.container_client.list_blobs()
                for blob in blobs:
                    blob_client = self.container_client.get_blob_client(blob.name)
                    content = blob_client.download_blob().readall()
                    contacts.append(json.loads(content))
            except Exception as e:
                print(f"Error listing contacts: {e}")
        else:
            for file in self.contacts_dir.glob('contact_*.json'):
                try:
                    with open(file, 'r', encoding='utf-8') as f:
                        contacts.append(json.load(f))
                except Exception as e:
                    print(f"Error reading {file}: {e}")
        
        return sorted(contacts, key=lambda x: x.get('timestamp', ''), reverse=True)


# Instance singleton
storage_service = StorageService()
