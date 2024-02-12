# Importar las librerías necesarias
from flask import Flask, request, jsonify
from transformers import pipeline

# Crear una instancia de Flask
app = Flask(__name__)

# Crear una instancia del modelo de transformers
model = pipeline("text-generation")


# Definir una ruta para la API
@app.route("/api", methods=["POST"])
def api():
  # Recibir el input del cliente
  data = request.get_json()
  input = data["input"]

  # Ejecutar la librería de transformers con el input
  output = next(model(input))[0]["generated_text"]

  # Retornar la respuesta al cliente en formato JSON
  return jsonify({"output": output})
