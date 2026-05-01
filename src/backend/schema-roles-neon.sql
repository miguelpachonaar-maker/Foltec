-- Neon SQL Editor | base: neondb | esquema: public
-- Tu tabla "Usuarios" ya tiene FK a Area, Estados y "Tipo Documento"; no se tocan.
-- Este script crea Rol / Permiso / RolPermiso y solo AÑADE "Usuarios"."IdRol" (FK a Rol).

CREATE TABLE IF NOT EXISTS "Rol" (
  "IdRol" SERIAL PRIMARY KEY,
  "Nombre" VARCHAR(100) NOT NULL UNIQUE,
  "Descripcion" TEXT
);

CREATE TABLE IF NOT EXISTS "Permiso" (
  "IdPermiso" SERIAL PRIMARY KEY,
  "Codigo" VARCHAR(100) NOT NULL UNIQUE,
  "Descripcion" TEXT
);

CREATE TABLE IF NOT EXISTS "RolPermiso" (
  "IdRol" INTEGER NOT NULL REFERENCES "Rol"("IdRol") ON DELETE CASCADE,
  "IdPermiso" INTEGER NOT NULL REFERENCES "Permiso"("IdPermiso") ON DELETE CASCADE,
  PRIMARY KEY ("IdRol", "IdPermiso")
);

ALTER TABLE "Usuarios" ADD COLUMN IF NOT EXISTS "IdRol" INTEGER REFERENCES "Rol"("IdRol");

INSERT INTO "Permiso" ("Codigo", "Descripcion") VALUES
  ('usuarios.registrar', 'Puede crear nuevos usuarios desde el formulario')
ON CONFLICT ("Codigo") DO NOTHING;

INSERT INTO "Rol" ("Nombre", "Descripcion") VALUES
  ('Administrador', 'Acceso completo; puede registrar usuarios.'),
  ('Operador', 'Uso general; no puede registrar nuevos usuarios.')
ON CONFLICT ("Nombre") DO NOTHING;

INSERT INTO "RolPermiso" ("IdRol", "IdPermiso")
SELECT r."IdRol", p."IdPermiso"
FROM "Rol" r
CROSS JOIN "Permiso" p
WHERE r."Nombre" = 'Administrador' AND p."Codigo" = 'usuarios.registrar'
ON CONFLICT ("IdRol", "IdPermiso") DO NOTHING;

UPDATE "Usuarios" u
SET "IdRol" = (SELECT "IdRol" FROM "Rol" WHERE "Nombre" = 'Administrador' LIMIT 1)
WHERE u."IdRol" IS NULL;

ALTER TABLE "Usuarios" ALTER COLUMN "IdRol" SET NOT NULL;
