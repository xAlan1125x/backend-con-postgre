# Guía para la Unidad 3: utilizar PostgreSQL

Sí. En tu proyecto, la unidad 3 consiste en reemplazar SQLite por PostgreSQL. Actualmente la conexión está centralizada en `src/database/sqlite.ts`, y los repositorios ejecutan SQL usando `better-sqlite3`.

Como el proyecto se llama `servidor-prisma-postgre`, te recomiendo hacerlo con **Prisma + PostgreSQL**.

## 1. Verificá qué te pide la unidad

Hay dos posibilidades:

- PostgreSQL usando SQL directamente con `pg`.
- PostgreSQL usando Prisma como ORM.

Si en la consigna aparece “Prisma”, “schema.prisma” o “migraciones”, usá la segunda opción.

## 2. Instalá Prisma

Desde la carpeta principal del proyecto, no desde `.git`:

```powershell
cd "E:\Programacion\Actividades de segundo año\Segundo cuatrimestre\servidor-prisma-postgre"

npm install prisma @prisma/client
npx prisma init --datasource-provider postgresql
```

Esto debería crear:

```text
prisma/schema.prisma
.env
```

## 3. Creá la base de datos PostgreSQL

Podés hacerlo desde pgAdmin o `psql`.

Por ejemplo:

```sql
CREATE DATABASE servidor_prisma;
```

Después, en `.env`, configurá la conexión:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/servidor_prisma"
```

No subas `.env` a Git.

## 4. Pasá las tablas a `schema.prisma`

Tus tablas actuales están definidas en `src/database/sqlite.ts`:

- `categorias`
- `productos`
- relación `productos.categoria_id -> categorias.id`

En `schema.prisma` deberías representar esa misma estructura. Conceptualmente:

```prisma
model Categoria {
  id          Int        @id @default(autoincrement())
  nombre      String
  descripcion String?
  productos   Producto[]

  @@map("categorias")
}

model Producto {
  id          Int       @id @default(autoincrement())
  nombre      String
  precio      Float
  categoriaId Int?

  categoria Categoria? @relation(fields: [categoriaId], references: [id])

  @@map("productos")
}
```

Observá especialmente:

- `@id` identifica la clave primaria.
- `@default(autoincrement())` reemplaza `AUTOINCREMENT`.
- `@relation` reemplaza la clave foránea.
- `@@map` conserva los nombres de tus tablas existentes.

Luego ejecutá:

```powershell
npx prisma migrate dev --name crear-tablas
```

Para visualizar los datos:

```powershell
npx prisma studio
```

## 5. Creá el cliente de Prisma

En lugar de `src/database/sqlite.ts`, creá un archivo para inicializar Prisma, por ejemplo:

```text
src/database/prisma.ts
```

Ese archivo debe exportar una instancia de `PrismaClient`.

La idea es que los repositorios dejen de importar:

```ts
import db from "../database/sqlite.js";
```

y pasen a importar el cliente Prisma.

## 6. Modificá primero un repositorio

Empezá por `src/productos/producto.repository.ts`.

La transformación conceptual sería:

| SQLite actual | Prisma |
|---|---|
| `SELECT * FROM productos` | `prisma.producto.findMany()` |
| `SELECT ... WHERE id = ?` | `prisma.producto.findUnique(...)` |
| `INSERT INTO productos` | `prisma.producto.create(...)` |
| `UPDATE productos` | `prisma.producto.update(...)` |
| `DELETE FROM productos` | `prisma.producto.delete(...)` |

Importante: Prisma trabaja de forma **asíncrona**. Por eso tus métodos deberán devolver:

```ts
Promise<Producto[]>
```

en lugar de:

```ts
Producto[]
```

Ese cambio se propaga hacia:

- `src/productos/producto.service.ts`
- `src/productos/producto.controller.ts`
- `src/productos/producto.routes.ts`

Los controladores y servicios deberán usar `await`.

## 7. Repetí el proceso con categorías

Después de hacer funcionar productos, repetí lo mismo en `src/categorias/categoria.repository.ts`.

No cambies toda la arquitectura: mantené la separación actual:

```text
routes -> controller -> service -> repository -> database
```

Solo cambia la implementación de la capa repository.

## 8. Probá progresivamente

Te conviene avanzar en este orden:

1. Crear la base PostgreSQL.
2. Configurar `.env`.
3. Crear los modelos Prisma.
4. Ejecutar la migración.
5. Probar `prisma studio`.
6. Migrar `ProductoRepository`.
7. Probar los endpoints de productos.
8. Migrar `CategoriaRepository`.
9. Probar los endpoints de categorías.
10. Ejecutar los tests existentes.

Los tests unitarios actuales usan mocks, por ejemplo en `tests/productos.test.ts`, por lo que probablemente no necesiten conectarse a PostgreSQL. Más adelante podrías agregar pruebas de integración específicas para comprobar la base real.

La idea central es: **no reemplaces toda la aplicación; reemplazá SQLite por Prisma en la capa de persistencia y adaptá el código a operaciones asíncronas**.
