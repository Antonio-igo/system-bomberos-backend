const express = require("express");
const cors = require("cors"); // Importa cors
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: "https://system-bomberos.vercel.app", // Reemplaza con la URL de tu frontend
    //origin: "http://localhost:3000", // Reemplaza con la URL de tu frontend
    optionsSuccessStatus: 200,
  };
  
app.use(cors(corsOptions));
  
//app.use(cors());

app.get("/", (req, res) => {
    res.send("Backend del Sistema de Bomberos funcionando.");
  });
  

  app.get("/api/distance-matrix", async (req, res) => {
    const { origin, destinations } = req.query;
  
    if (!origin || !destinations) {
      return res.status(400).json({ error: "Faltan parámetros 'origin' o 'destinations'." });
    }
  console.log("Parámetros recibidos:", { origin, destinations });

    try {
      const response = await axios.get("https://maps.googleapis.com/maps/api/distancematrix/json", {
        params: {
          origins: origin,
          destinations,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });
      console.log("Parámetros recibidos:", { origin, destinations });
      res.json(response.data);
    } catch (error) {
      console.error("Error en Distance Matrix API:", error.message);
      res.status(500).json({ error: "Error al consultar la Distance Matrix API." });
    }
  });
  
  // Endpoint para obtener las rutas
  app.get("/api/directions", async (req, res) => {
    const { origin, destination } = req.query;
  
    if (!origin || !destination) {
      return res.status(400).json({ error: "Faltan parámetros 'origin' o 'destination'." });
    }
  
    try {
      const response = await axios.get("https://maps.googleapis.com/maps/api/directions/json", {
        params: {
          origin,
          destination,
          mode: "driving", // Define el modo de transporte
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });
  
      console.log("Respuesta de Directions API:", response.data);
  
      if (!response.data.routes || response.data.routes.length === 0) {
        throw new Error("No se encontraron rutas.");
      }
  
      // Devuelve la respuesta completa
      res.json(response.data);
    } catch (error) {
      console.error("Error en Directions API:", error.message);
      res.status(500).json({ error: "Error al consultar la Directions API." });
    }
  });
  
  

  app.get("/api/geocode", async (req, res) => {
    const { address } = req.query;
  
    if (!address) {
      return res.status(400).json({ error: "Falta el parámetro 'address'." });
    }
  
    try {
      const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });
      console.log("Parámetros recibidos para geocodificación:", { address });
      console.log("Respuesta de la API de Geocoding:", response.data);

      res.json(response.data);
    } catch (error) {
      console.error("Error en Geocoding API:", error.message);
      res.status(500).json({ error: "Error al consultar la Geocoding API." });
    }
  });
  
  
  

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
