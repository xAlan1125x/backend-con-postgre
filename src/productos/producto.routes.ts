import { Router } from "express";
import { ProductoService } from "./producto.service.js";
import { ProductoController } from "./producto.controller.js";

export function crearProductoRouter(service: ProductoService): Router {
  console.log("[PRODUCTO ROUTES] Inicializando router de productos");
  const router = Router();
  const controller = new ProductoController(service);

  router.get("/", controller.obtenerTodos);
  router.get("/:id", controller.obtenerPorId);
  router.post("/", controller.crear);
  router.put("/:id", controller.actualizar);
  router.delete("/:id", controller.eliminar);

  return router;
}
