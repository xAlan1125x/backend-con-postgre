import express from "express";
import { CategoriaRepository } from "./categorias/categoria.repository.js";
import { CategoriaService } from "./categorias/categoria.service.js";
import { crearCategoriaRouter } from "./categorias/categoria.routes.js";
import { ProductoRepository } from "./productos/producto.repository.js";
import { ProductoService } from "./productos/producto.service.js";
import { crearProductoRouter } from "./productos/producto.routes.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { PedidoService } from "./pedidos/pedido.service.js";
import { crearPedidoRouter } from "./pedidos/pedido.routes.js";
import { openApiSpecification } from "./swagger.js";
import swaggerUi from "swagger-ui-express";
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
app.use("/api/pedidos", crearPedidoRouter(new PedidoService()));
app.get("/api/openapi.json", (_req, res) => res.json(openApiSpecification));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiSpecification));
app.use(errorHandler);
