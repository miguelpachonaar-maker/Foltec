const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_ytMd4jev1HZz@ep-shiny-wave-a8ahba2g-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: {
    rejectUnauthorized: false
  }
});

app.post("/api/personal", async (req, res) => {

  const {Nombre, Documento, Celular, Estado, Correo, Area, Cargo, Usuario, Contraseña} = req.body;
  
  try {
    await pool.query ("BEGIN")

    await pool.query (
      "INSERT INTO personal (nombre, documento, celular, estado, correo, area, cargo, usuario, contraseña) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [Nombre, Documento, Celular, Estado, Correo, Area, Cargo, Usuario, Contraseña]
    );

    await pool.query (
      "INSERT INTO usuarios (usuario, contraseña) VALUES ($1,$2)",
      [Usuario, Contraseña]
    );

    await pool.query("COMMIT");

    res.json ({mensaje: "Personal registrado exitosamente"});
  } catch (error){
    await pool.query ("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "Error al registrar datos"});
  }
});

app.post("/api/login", async (req, res) => {

  const { Usuario, Contraseña } = req.body;

  try {

    const result = await pool.query(
      "SELECT * FROM usuarios WHERE usuario=$1 AND contraseña=$2",
      [Usuario, Contraseña]
    );

    if (result.rows.length > 0) {
      const usuario = result.rows[0];


      res.json({
        mensaje: "Login exitoso",
        usuarioID: usuario.id,
        nombre: usuario.usuario
      });

    } else {

      res.status(401).json({
        mensaje: "Usuario o contraseña incorrectos"
      });

    }

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error del servidor"
    });

  }

});

app.listen(4000, () => {
  console.log("Servidor backend corriendo en puerto 4000");
});