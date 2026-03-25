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

app.get ("/api/select", async (req, res) => {
  try{
     
    const areas = await pool.query(
      'SELECT "IdArea" FROM "Area"'
    );

    const estados = await pool.query(
      'SELECT "IdEstado",  "TipoEstado" FROM "Estados"'
    );
    
    const documento = await pool.query(
      'SELECT "IdTipoDocumento" FROM "Tipo Documento"'
    );

    const marca = await pool.query(
      'SELECT "IdMarca" FROM "Marca"'
    );
 
    res.json({
      areas: areas.rows,
      estados: estados.rows,
      documento: documento.rows,
      marca: marca.rows
    });
  } catch (err){
    console.error(err);
    res.status(500).json({error: "Error al obtener datos"})
  }
})
app.put("/api/usuario/:id", async (req,res)=> {
  const {id} = req.params;
  const {TipoDocumento, NumeroDocumento, Contacto, Estado, Correo, Area, Cargo, NombreUsuario} = req.body;

  try{
    const result = await pool.query(
      'UPDATE "Usuarios" SET "TipoDocumento" = $1, "NumeroDocumento" = $2, "Contacto" = $3, "Estado" = $4, "Correo" = $5, "Area"= $6, "Cargo"= $7, "NombreUsuario"=$8 WHERE "IdUsuario" = $9 RETURNING *',
      [TipoDocumento, NumeroDocumento, Contacto, Estado, Correo, Area, Cargo, NombreUsuario, id]
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
      'SELECT * FROM "Usuarios" WHERE "IdUsuario" = $1', [id]
    );

    if(result.rows.length === 0)
      return res.status (400).json({error: "Usuario no encontrado"})
    res.json(result.rows[0]);
  } catch (err){
    console.error(err);
    res.status(500).json({error: "Error al buscar el personal"});
  }
});

app.put("/api/equipo/:id", async (req,res)=> {
  const {id} = req.params;
  const {Marca, MAC, Serial, Estado, TipoPc, Descripcion} = req.body;

  try{
    const result = await pool.query(
      'UPDATE "Computadoras" SET "Marca" = $1, "MAC" = $2, "Serial" = $3, "Estado" = $4, "TipoPc" = $5, "Descripcion"= $6  WHERE "IDPc" = $7 RETURNING *',
      [Marca, MAC, Serial, Estado, TipoPc, Descripcion, id]
    );
    if(result.rows.length === 0)
      return res.status (400).json({error: "Equipo no encontrado"})
    res.json(result.rows[0]);
  } catch (err){
    console.error(err);
    res.status(500).json({error: "Error al buscar el Equipo"});
  }
});
app.get("/api/equipo/:id", async (req, res) =>{
  const {id} = req.params;
  try{
    const result = await pool.query(
      'SELECT * FROM "Computadoras" WHERE "IDPc" = $1', [id]
    );

    if(result.rows.length === 0)
      return res.status (400).json({error: "Equipo no encontrado"})
    res.json(result.rows[0]);
  } catch (err){
    console.error(err);
    res.status(500).json({error: "Error al buscar el Equipo"});
  }
});
app.get("/api/equipos/buscar", async (req, res) => {
  try{
    const {q} = req.query;
    if (!q) return res.status(400).json ({error: "Falta información de busqueda"});

    const result = await pool.query(
      'SELECT * FROM "Computadoras" WHERE "IDPc" ILIKE $1 OR "Serial" ILIKE $1',
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (err){
    console.error(err);
    res.status(500).json({error: "Error al buscar el Equipo"});
  }
})
app.get("/api/buscar", async (req, res) => {
  try{
    const {q} = req.query;
    if (!q) return res.status(400).json ({error: "Falta información de busqueda"});

    const result = await pool.query(
      'SELECT * FROM "Usuarios" WHERE "NombresApellidos" ILIKE $1 OR "NombreUsuario" ILIKE $1',
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (err){
    console.error(err);
    res.status(500).json({error: "Error al buscar el personal"});
  }
});
app.post("/api/personal", async (req, res) => {

  const {NombresApellidos, TipoDocumento, NumeroDocumento, Contacto, Estado, Correo, Area, Cargo, NombreUsuario, Contraseña} = req.body;
  
  try {

    await pool.query (
      'INSERT INTO "Usuarios" ("NombresApellidos", "TipoDocumento","NumeroDocumento", "Contacto", "Estado", "Correo", "Area", "Cargo", "NombreUsuario", "Contraseña") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
      [NombresApellidos, TipoDocumento, NumeroDocumento, Contacto, Estado, Correo, Area, Cargo, NombreUsuario, Contraseña]
    );


    res.json ({mensaje: "Personal registrado exitosamente"});
  } catch (error){
    console.error(error);
    res.status(500).json({ error: "Error al registrar datos"});
  }
});
app.post("/api/equipos", async (req, res)=>{
  const {IDPc, MAC, Serial, Marca, Descripcion, Estado, TipoPc} = req.body;

  try {

    await pool.query(
      'INSERT INTO "Computadoras" ("IDPc", "MAC","Serial", "Marca", "Descripcion", "EstadoComputadora", "TipoPc") VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [IDPc, MAC, Serial, Marca, Descripcion, Estado, TipoPc]
    );

    res.json ({mensaje: "Equipo Registrado exitosamente"});

  } catch (error){
    console.error(error);
    res.status(500).json({ error: "Error al registrar datos"});
  }
});

app.post("/api/login", async (req, res) => {

  const { Usuario, Contraseña } = req.body;

  try {

    const result = await pool.query(
      'SELECT * FROM "Usuarios" WHERE "NombreUsuario"=$1 AND "Contraseña"=$2',
      [Usuario, Contraseña]
    );

    if (result.rows.length > 0) {
      const usuario = result.rows[0];


      res.json({
        mensaje: "Login exitoso",
        usuarioID: usuario.IdUsuario,
        nombre: usuario.NombreUsuario
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