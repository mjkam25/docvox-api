# Étape 1 : Choisir l'image de base
FROM python:3.11-slim  # <- Version légère de Python

# Étape 2 : Créer le dossier de travail
WORKDIR /app  # <- Dossier dans le conteneur

# Étape 3 : Copier les fichiers nécessaires
COPY requirements.txt .  # <- Fichier des dépendances
COPY main.py .           # <- Ton code principal

# Étape 4 : Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt  # <- Installe tout

# Étape 5 : Lancer l'application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]  # <- Commande de démarrage