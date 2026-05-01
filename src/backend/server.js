import express from "express";
import cors from "cors";
import pkg from "pg";
import ExcelJS from "exceljs";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, ".env") });

const { Pool } = pkg;

const app = express();

app.use(cors());
app.use(express.json());

if (!process.env.DATABASE_URL) {
  console.error(
    "Falta DATABASE_URL. Crea un archivo .env en la raíz del proyecto (o en src/backend) con tu cadena de Neon."
  );
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function usuarioTienePermiso(idUsuario, codigoPermiso) {
  const id = Number(idUsuario);
  if (!Number.isInteger(id)) return false;
  const r = await pool.query(
    `SELECT 1 FROM "Usuarios" u
     INNER JOIN "RolPermiso" rp ON u."IdRol" = rp."IdRol"
     INNER JOIN "Permiso" p ON rp."IdPermiso" = p."IdPermiso"
     WHERE u."IdUsuario" = $1 AND p."Codigo" = $2`,
    [id, codigoPermiso]
  );
  return r.rows.length > 0;
}

function normalizarFilaUsuario(row) {
  if (!row || typeof row !== "object") return row;
  const nombreRol =
    row.NombreRol ?? row.nombrerol ?? row.nombre_rol ?? null;
  return { ...row, NombreRol: nombreRol };
}

app.get("/reporte", async (req, res) =>{

try{
  const idSesion =
    req.query.idSesion != null && req.query.idSesion !== ""
      ? Number(req.query.idSesion)
      : NaN;
  if (!Number.isInteger(idSesion)) {
    return res
      .status(400)
      .json({ error: "Falta idSesion en la URL del reporte" });
  }
  if (!(await usuarioTienePermiso(idSesion, "reportes.exportar"))) {
    return res.status(403).json({ error: "Sin permiso para exportar reportes" });
  }

  const asignados = await pool.query( 
    `SELECT u."NombreUsuario", u."NombresApellidos", c."IDPc", c."Serial", a."FechaAsignacion" FROM "Asignacion" a JOIN "Usuarios" u ON  a."IdUsuario" = u."IdUsuario" JOIN "Computadoras" c ON a."IDPc" = c."IDPc" WHERE a."FechaDevolucion" IS NULL` 
  );

  const devueltos = await pool.query (
    `SELECT u."NombreUsuario", u."NombresApellidos", c."IDPc", c."Serial", d."FechaDevolucion" FROM "Devolucion" d JOIN "Usuarios" u ON  d."IdUsuario" = u."IdUsuario" JOIN "Computadoras" c ON d."IDPc" = c."IDPc"`     
  );

  const usuarios = await pool.query (
    `SELECT * FROM "Usuarios"`
  );

  const equipos = await pool.query (
    `SELECT * FROM "Computadoras"`
  );

  const Libro = new ExcelJS.Workbook();

  const HAsignados = Libro.addWorksheet('Asignados');
  HAsignados.columns = [
    {header: 'Usuario', key: 'NombreUsuario', width: 20},
    {header: 'Nombre Empleado', key: 'NombresApellidos', width: 30},
    {header: 'ID PC', key: 'IDPc', width: 20},
    {header: 'Serial PC', key: 'Serial', width: 20},
    {header: 'Fecha Asignación', key: 'FechaAsignacion', width: 20},
  ];
  asignados.rows.forEach(row => HAsignados.addRow(row));

  const HDevueltos = Libro.addWorksheet('Devoluciones');
  HDevueltos.columns = [
    {header: 'Usuario', key: 'NombreUsuario', width: 20},
    {header: 'Nombre Empleado', key: 'NombresApellidos', width: 30},
    {header: 'ID PC', key: 'IDPc', width: 20},
    {header: 'Serial PC', key: 'Serial', width: 20},
    {header: 'Fecha Devolución', key: 'FechaDevolucion', width: 20},
  ];
  devueltos.rows.forEach(row => HDevueltos.addRow(row));

  const HUsuarios = Libro.addWorksheet('Usuarios');
  HUsuarios.columns = [
    {header: 'Usuario', key: 'NombreUsuario', width: 20},
    {header: 'Nombre Empleado', key: 'NombresApellidos', width: 30},
    {header: 'Tipo Documento', key: 'TipoDocumento', width: 20},
    {header: 'Documento', key: 'NumeroDocumento', width: 20},
    {header: 'Correo', key: 'Correo', width: 30},
    {header: 'Contacto', key: 'Contacto', width: 20},
    {header: 'Cargo', key: 'Cargo', width: 20},
    {header: 'Area', key: 'Area', width: 20},
    {header: 'Estado', key: 'Estado', width: 20},
  ];
  usuarios.rows.forEach(row => HUsuarios.addRow(row));

  const HComputadoras = Libro.addWorksheet('Equipos');
  HComputadoras.columns = [
    {header: 'ID PC', key: 'IDPc', width: 20},
    {header: 'Serial PC', key: 'Serial', width: 20},
    {header: 'MAC PC', key: 'MAC', width: 20},
    {header: 'Tipo PC', key: 'TipoPc', width: 20},
    {header: 'Marca PC', key: 'Marca', width: 20},
    {header: 'Descripcion PC', key: 'Descripcion', width: 20},
    {header: 'Estado', key: 'Estado', width: 20},
  ];
  equipos.rows.forEach(row => HComputadoras.addRow(row));

  [HAsignados, HDevueltos, HUsuarios, HComputadoras].forEach ((ws) => {
    const Filas = ws.rowCount;
    const Columnas = ws.columnCount;

    if (Filas > 1 && Columnas > 0) {
  const lastColumnLetter = ws.getColumn(Columnas).letter;
      ws.addTable({
        name: `Tabla_${ws.name}`,
        ref: 'A1',
        headerRow: true,
        style: {
          theme:'TableStyleMedium9',
          showRowStripes: true,
        },
        columns: ws.columns.map(col => ({
          name: col.header
        })),
        rows : ws.getRows(2, Filas -1).map(row =>
          row.values.slice(1)
        ),
        });
      }
  });

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=Reporte.xlsx'
  );

  await Libro.xlsx.write(res);
  res.end();
} catch (error){
  console.error(error);
  res.status(500).send('Error generando el reporte');
}

})

app.get("/api/sesion/:id/permisos", async (req, res) => {
  const id =
    req.params.id != null && req.params.id !== ""
      ? Number(req.params.id)
      : NaN;
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Id de usuario inválido" });
  }
  try {
    const result = await pool.query(
      `SELECT r."Nombre" AS "nombreRol",
        COALESCE(
          (SELECT json_agg(p."Codigo" ORDER BY p."Codigo")
           FROM "RolPermiso" rp2
           JOIN "Permiso" p ON rp2."IdPermiso" = p."IdPermiso"
           WHERE rp2."IdRol" = u."IdRol"),
          '[]'::json
        ) AS permisos
       FROM "Usuarios" u
       LEFT JOIN "Rol" r ON u."IdRol" = r."IdRol"
       WHERE u."IdUsuario" = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    let permisos = result.rows[0].permisos;
    if (typeof permisos === "string") {
      try {
        permisos = JSON.parse(permisos);
      } catch {
        permisos = [];
      }
    }
    if (!Array.isArray(permisos)) permisos = [];

    const fila = result.rows[0];
    const nombreRol =
      fila.nombreRol ?? fila.nombrerol ?? fila.NombreRol ?? null;

    res.json({
      nombreRol,
      permisos,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener permisos" });
  }
});

app.post ("/api/devolver", async (req, res) =>{
  const { IDPc, EstadoEntrega, fecha, Observaciones, IdUsuarioSesion } = req.body;
  try {
    const idSesion =
      IdUsuarioSesion != null && IdUsuarioSesion !== ""
        ? Number(IdUsuarioSesion)
        : NaN;
    if (!Number.isInteger(idSesion)) {
      return res.status(400).json({ error: "Sesión no válida" });
    }
    if (!(await usuarioTienePermiso(idSesion, "equipos.asignar"))) {
      return res.status(403).json({ error: "Sin permiso para devolver equipos" });
    }

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

  const {IDUsuario, fecha, IDPc, Observaciones, IdUsuarioSesion} = req.body;
  try{
    const idSesion =
      IdUsuarioSesion != null && IdUsuarioSesion !== ""
        ? Number(IdUsuarioSesion)
        : NaN;
    if (!Number.isInteger(idSesion)) {
      return res.status(400).json({ error: "Sesión no válida" });
    }
    if (!(await usuarioTienePermiso(idSesion, "equipos.asignar"))) {
      return res.status(403).json({ error: "Sin permiso para asignar equipos" });
    }

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
  try {
    const {
      NombresApellidos,
      TipoDocumento,
      NumeroDocumento,
      Contacto,
      Estado,
      Correo,
      Area,
      Cargo,
      NombreUsuario,
      Contraseña,
      IdRol,
      IdUsuarioSesion,
    } = req.body;

    const idRolNum = IdRol != null && IdRol !== "" ? Number(IdRol) : NaN;
    if (!Number.isInteger(idRolNum)) {
      return res.status(400).json({ error: "Debe seleccionar un rol válido" });
    }

    const idSesion = IdUsuarioSesion != null && IdUsuarioSesion !== ""
      ? Number(IdUsuarioSesion)
      : NaN;
    if (!Number.isInteger(idSesion)) {
      return res.status(400).json({ error: "Sesión no válida para registrar personal" });
    }

    const puedeRegistrar = await pool.query(
      `SELECT 1 FROM "Usuarios" u
       JOIN "RolPermiso" rp ON u."IdRol" = rp."IdRol"
       JOIN "Permiso" p ON rp."IdPermiso" = p."IdPermiso"
       WHERE u."IdUsuario" = $1 AND p."Codigo" = 'usuarios.registrar'`,
      [idSesion]
    );
    if (puedeRegistrar.rows.length === 0) {
      return res.status(403).json({
        error: "No tiene permiso para registrar usuarios",
      });
    }

    const hash = await bcrypt.hash(Contraseña, 10);

    await pool.query(
      `INSERT INTO "Usuarios" (
        "NombresApellidos", "TipoDocumento", "NumeroDocumento", "Contacto", "Estado",
        "Correo", "Area", "Cargo", "NombreUsuario", "Contraseña", "IdRol"
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        NombresApellidos,
        TipoDocumento,
        NumeroDocumento,
        Contacto,
        Estado,
        Correo,
        Area,
        Cargo,
        NombreUsuario,
        hash,
        idRolNum,
      ]
    );

    res.json({ mensaje: "Personal registrado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar datos" });
  }
});

app.get("/api/roles", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT "IdRol", "Nombre", "Descripcion" FROM "Rol" ORDER BY "Nombre"`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener roles" });
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
        `SELECT u.*, CASE WHEN c."IDPc" IS NULL THEN 'Sin Equipo' ELSE c."IDPc" END AS "Equipo",
        r."Nombre" AS "NombreRol"
        FROM "Usuarios" u
        LEFT JOIN "Asignacion" a ON u."IdUsuario" = a."IdUsuario" AND a."FechaDevolucion" IS NULL
        LEFT JOIN "Computadoras" c ON a."IDPc" = c."IDPc"
        LEFT JOIN "Rol" r ON u."IdRol" = r."IdRol"`
    );
    res.json(result.rows.map(normalizarFilaUsuario));
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
  const {
    IdUsuarioSesion,
    IdRol,
    TipoDocumento,
    NumeroDocumento,
    Contacto,
    Estado,
    Correo,
    Area,
    Cargo,
    NombreUsuario,
  } = req.body;

  try{
    const idSesion =
      IdUsuarioSesion != null && IdUsuarioSesion !== ""
        ? Number(IdUsuarioSesion)
        : NaN;
    if (!Number.isInteger(idSesion)) {
      return res.status(400).json({ error: "Sesión no válida" });
    }
    if (!(await usuarioTienePermiso(idSesion, "usuarios.registrar"))) {
      return res.status(403).json({ error: "Sin permiso para editar usuarios" });
    }

    const idRolNum =
      IdRol != null && IdRol !== "" ? Number(IdRol) : NaN;
    if (!Number.isInteger(idRolNum)) {
      return res.status(400).json({ error: "Debe seleccionar un rol válido" });
    }
    const rolExiste = await pool.query(
      'SELECT 1 FROM "Rol" WHERE "IdRol" = $1',
      [idRolNum]
    );
    if (rolExiste.rows.length === 0) {
      return res.status(400).json({ error: "El rol no existe" });
    }

    const result = await pool.query(
      `UPDATE "Usuarios" SET "TipoDocumento" = $1, "NumeroDocumento" = $2, "Contacto" = $3, "Estado" = $4, "Correo" = $5, "Area"= $6, "Cargo"= $7, "NombreUsuario"=$8, "IdRol" = $9 WHERE "IdUsuario" = $10 RETURNING *`,
      [
        TipoDocumento,
        NumeroDocumento,
        Contacto,
        Estado,
        Correo,
        Area,
        Cargo,
        NombreUsuario,
        idRolNum,
        id,
      ]
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
  const {
    IdUsuarioSesion,
    Marca,
    MAC,
    Serial,
    Estado,
    TipoPc,
    Descripcion,
  } = req.body;

  try{
    const idSesion =
      IdUsuarioSesion != null && IdUsuarioSesion !== ""
        ? Number(IdUsuarioSesion)
        : NaN;
    if (!Number.isInteger(idSesion)) {
      return res.status(400).json({ error: "Sesión no válida" });
    }
    if (!(await usuarioTienePermiso(idSesion, "equipos.registrar"))) {
      return res.status(403).json({ error: "Sin permiso para editar equipos" });
    }

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
      `SELECT c.*, CASE  WHEN a."IDPc" IS NULL THEN 'Disponible' ELSE 'Asignado' END AS "Asignacion" FROM "Computadoras" c LEFT JOIN "Asignacion" a ON c."IDPc" =  a."IDPc" AND a."FechaDevolucion" IS NULL WHERE c."IDPc" ILIKE $1 OR c."Serial" ILIKE $1`,
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
      `SELECT u.*, CASE WHEN c."IDPc" IS NULL THEN 'Sin Equipo' ELSE c."IDPc" END AS "Equipo",
      r."Nombre" AS "NombreRol"
      FROM "Usuarios" u
      LEFT JOIN "Asignacion" a ON u."IdUsuario" = a."IdUsuario" AND a."FechaDevolucion" IS NULL
      LEFT JOIN "Computadoras" c ON a."IDPc" = c."IDPc"
      LEFT JOIN "Rol" r ON u."IdRol" = r."IdRol"
      WHERE u."NombresApellidos" ILIKE $1 OR u."NombreUsuario" ILIKE $1 `,
      [`%${q}%`]
    );

    res.json(result.rows.map(normalizarFilaUsuario));
  } catch (err){
    console.error(err);
    res.status(500).json({error: "Error al buscar el personal"});
  }
});


app.post("/api/equipos", async (req, res)=>{
  const {
    IdUsuarioSesion,
    IDPc,
    MAC,
    Serial,
    Marca,
    Descripcion,
    Estado,
    TipoPc,
  } = req.body;

  try {
    const idSesion =
      IdUsuarioSesion != null && IdUsuarioSesion !== ""
        ? Number(IdUsuarioSesion)
        : NaN;
    if (!Number.isInteger(idSesion)) {
      return res.status(400).json({ error: "Sesión no válida" });
    }
    if (!(await usuarioTienePermiso(idSesion, "equipos.registrar"))) {
      return res.status(403).json({ error: "Sin permiso para registrar equipos" });
    }

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
      `SELECT u.*,
        COALESCE(
          (SELECT json_agg(p."Codigo" ORDER BY p."Codigo")
           FROM "RolPermiso" rp
           JOIN "Permiso" p ON rp."IdPermiso" = p."IdPermiso"
           WHERE rp."IdRol" = u."IdRol"),
          '[]'::json
        ) AS permisos
       FROM "Usuarios" u
       WHERE LOWER(TRIM(u."NombreUsuario")) = LOWER(TRIM($1))
       LIMIT 1`,
      [Usuario]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        mensaje: "Usuario o contraseña incorrectos",
      });
    }

    const usuario = result.rows[0];
    const Valido = await bcrypt.compare(Contraseña, usuario.Contraseña);

    if (!Valido) {
      return res.status(401).json({
        mensaje: "Usuario o contraseña incorrectos",
      });
    }

    let permisos = usuario.permisos;
    if (typeof permisos === "string") {
      try {
        permisos = JSON.parse(permisos);
      } catch {
        permisos = [];
      }
    }
    if (!Array.isArray(permisos)) {
      permisos = [];
    }

    res.json({
      mensaje: "Login exitoso",
      usuarioID: usuario.IdUsuario,
      nombre: usuario.NombreUsuario,
      idRol: usuario.IdRol,
      permisos,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error del servidor",
    });
  }
});

app.listen(4000, () => {
  console.log("Servidor backend corriendo en puerto 4000");
});