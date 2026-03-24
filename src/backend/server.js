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


app.put("/api/usuario/:id", async (req,res)=> {
  const {id} = req.params;
  const {documento, celular, estado, correo, area, cargo, usuario} = req.body;

  try{
    const result = await pool.query(
      "UPDATE personal SET documento = $1, celular = $2, estado = $3, correo = $4, area= $5, cargo= $6, usuario=$7 WHERE id = $8 RETURNING *",
      [documento, celular, estado, correo, area, cargo, usuario, id]
    );
    if(result.rows.length === 0)
      return res.status (400).json({error: "Usuario no encontrado"})
    res.json(result.rows[0]);
  } catch (err){
    console.error(err);
    res.status(500).json({error: "Error al buscar el personal"});
  }
});
app.get("/api/usuario/:id", async (req, res) =>{
  const {id} = req.params;
  try{
    const result = await pool.query(
      "SELECT * FROM personal WHERE id = $1", [id]
    );

    if(result.rows.length === 0)
      return res.status (400).json({error: "Usuario no encontrado"})
    res.json(result.rows[0]);
  } catch (err){
    console.error(err);
    res.status(500).json({error: "Error al buscar el personal"});
  }
});

app.get("/api/buscar", async (req, res) => {
  try{
    const {q} = req.query;
    if (!q) return res.status(400).json ({error: "Falta información de busqueda"});

    const result = await pool.query(
      "SELECT * FROM personal WHERE nombre ILIKE $1 OR usuario ILIKE $1",
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (err){
    console.error(err);
    res.status(500).json({error: "Error al buscar el personal"});
  }
})
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