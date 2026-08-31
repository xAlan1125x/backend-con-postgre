import express from "express";
import { CategoriaRepository } from "./categorias/categoria.repository.js";
import { CategoriaService } from "./categorias/categoria.service.js";
import { crearCategoriaRouter } from "./categorias/categoria.routes.js";
import { ProductoRepository } from "./productos/producto.repository.js";
import { ProductoService } from "./productos/producto.service.js";
import { crearProductoRouter } from "./productos/producto.routes.js";
import { errorHandler } from "./middlewares/error-handler.js";

export const app = express();
app.use(express.json());

// Inyección de dependencias (Punto 8)
const categoriaRepo = new CategoriaRepository();
const categoriaService = new CategoriaService(categoriaRepo);

const productoRepo = new ProductoRepository();
const productoService = new ProductoService(productoRepo);

// Rutas versionadas (Punto 12)
app.use("/api/v1/categorias", crearCategoriaRouter(categoriaService));
app.use("/api/v1/productos", crearProductoRouter(productoService));

app.use(errorHandler);