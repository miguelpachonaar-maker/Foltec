import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;


const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_ytMd4jev1HZz@ep-shiny-wave-a8ahba2g-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: {
    rejectUnauthorized: false
  }
});

app.post ("/api/devolver", async (req, res) =>{
  const { IDPc, EstadoEntrega, fecha, Observaciones, } = req.body;
  try {
    // 🔍 1. Obtener asignación activa
    const asignacion = await pool.query(
      `SELECT * FROM "Asignacion"
       WHERE "IDPc" = $1 AND "FechaDevolucion" IS NULL`,
      [IDPc]
    );

    if (asignacion.rows.length === 0) {
      return res.status(400).json({ error: "El equipo no está asignado" });
    }
    const asignacionActiva = asignacion.rows[0];

    await pool.query(
      `INSERT INTO "Devolucion" 
      ("IDPc", "IdUsuario",  "FechaDevolucion", "EstadoEntrega", "Observaciones")
      VALUES ($1, $2, $3, $4, $5)`,
      [
        IDPc,
        asignacionActiva.IdUsuario,
        fecha,
        EstadoEntrega,
        Observaciones,
      ]
    );

    await pool.query(
      `UPDATE "Asignacion"
       SET "FechaDevolucion" = $1
       WHERE "IDPc" = $2 AND "FechaDevolucion" IS NULL`,
      [fecha, IDPc]
    );

    await pool.query(
      `UPDATE "Computadoras"
       SET "Estado" = 'Activo'
       WHERE "IDPc" = $1`,
      [IDPc]
    );
    res.json({ mensaje: "Equipo devuelto correctamente" });
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al devolver el equipo" });
  }
});
app.post ("/api/asignar", async (req, res) =>{

  const {IDUsuario, fecha, IDPc, Observaciones} = req.body;
  try{
    await pool.query(
      'INSERT INTO "Asignacion" ("IdUsuario", "FechaAsignacion", "IDPc","Observaciones") VALUES ($1, $2, $3, $4)',
      [IDUsuario, fecha, IDPc, Observaciones]
    );

    res.json ({mensaje:"Asignación registrada exitosamente"});
  } catch (err){
    console.error(err);
    res.status(500).json({ error: "Error al registrar datos"});
  }
})
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

app.get ("/api/computadoras/disponibles", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.* FROM "Computadoras" c LEFT JOIN "Asignacion" a ON c."IDPc" = a."IDPc" AND a."FechaDevolucion" IS NULL WHERE a."IDPc" IS NULL AND c."Estado" != 'Reparacion' AND c."Estado" != 'Inactivo'`
    );
    res.json(result.rows);
  }catch (err){
    console.error(err);
    res.status(500).json({error: "Error al obtener el equipo"})
}
  
})
app.get("/api/asignacion/cedula/:cedula", async (req, res) => {
  try{
    const {cedula} =req.params;

    const result = await pool.query(
      'SELECT "IdUsuario", "NombresApellidos" FROM "Usuarios" WHERE "NumeroDocumento" = $1', [cedula]
    );
    if(result.rows.length === 0)
      return res.status (400).json({error: "Usuario no encontrado"})
    res.json(result.rows[0]);

  }catch (err){
    console.error(err);
    res.status(500).json({error: "Error al obtener el usuario"})
}
})
app.get("/api/equipos", async (req, res)=> {
  try{
    const result = await pool.query(
     `SELECT c.*, CASE WHEN c."Estado" = 'Inactivo' THEN 'INACTIVO' WHEN c."Estado" = 'Reparacion' THEN 'Disponible-Reparación' WHEN a."IDPc" IS NULL THEN 'Disponible' ELSE 'Asignado' END AS "Asignacion" FROM "Computadoras"c LEFT JOIN "Asignacion" a ON c."IDPc" =  a."IDPc" AND a."FechaDevolucion" IS NULL`
    );
    res.json(result.rows);
  }catch (err){
    console.error(err);
    res.status(500).json({error: "Error al obtener equipos"})
  }
})
app.get("/api/usuarios", async (req, res)=> {
  try{
    const result = await pool.query(
        `SELECT u.*, CASE WHEN c."IDPc" IS NULL THEN 'Sin Equipo' ELSE c."IDPc" END AS "Equipo" FROM "Usuarios" u LEFT JOIN "Asignacion" a ON u."IdUsuario" = a."IdUsuario" AND a."FechaDevolucion" IS NULL
 LEFT JOIN "Computadoras" c ON a."IDPc" = c."IDPc"`
    );
    res.json(result.rows);
  }catch (err){
    console.error(err);
    res.status(500).json({error: "Error al obtener usuarios"})
  }
})
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
      marca: marca.rows,
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
      `SELECT c.*,  CASE WHEN a."IdUsuario" IS NULL THEN 'Sin Usuario' ELSE u."NombreUsuario" END AS "ASIGNACION" FROM "Computadoras" c LEFT JOIN "Asignacion" a ON c."IDPc" = a."IDPc" AND a."FechaDevolucion" IS NULL LEFT JOIN "Usuarios" u ON a."IdUsuario" = u."IdUsuario" WHERE c."IDPc" = $1`, [id]
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
      `SELECT * FROM "Usuarios" WHERE "NombresApellidos" ILIKE $1 OR "NombreUsuario" ILIKE $1 `,
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
      'INSERT INTO "Computadoras" ("IDPc", "MAC","Serial", "Marca", "Descripcion", "Estado", "TipoPc") VALUES ($1,$2,$3,$4,$5,$6,$7)',
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
      console.log("Password BD:", usuario.Contraseña);
console.log("Ingresado:", Contraseña);
      const Valido = await bcrypt.compare(
        Contraseña,
        usuario.Contraseña
      );

      if(!Valido){
        return res.status(401).json({
        mensaje: "Usuario o contraseña incorrectos"
      });
      }


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