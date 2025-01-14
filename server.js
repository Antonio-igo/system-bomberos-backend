const express = require("express");
const cors = require("cors"); // Importa cors
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: "https://system-bomberos.vercel.app", // Reemplaza con la URL de tu frontend
    optionsSuccessStatus: 200,
  };
  
app.use(cors(corsOptions));
  
//app.use(cors());

app.get("/", (req, res) => {
    res.send("Backend del Sistema de Bomberos funcionando.");
  });
  

  app.get("/api/distance-matrix", async (req, res) => {
    const { origins, destinations } = req.query;
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  
    if (!origins || !destinations) {
      return res.status(400).send("Faltan parámetros 'origins' o 'destinations'.");
    }
  
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json`,
        {
          params: {
            origins,
            destinations,
            key: API_KEY,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error("Error en Distance Matrix API:", error.message);
      res.status(500).send("Error al consultar la API de cálculo de distancias.");
    }
  });
  

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
