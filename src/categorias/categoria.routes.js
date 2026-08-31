import { Router } from "express";
import { CategoriaService } from "./categoria.service.js";
import { CategoriaController } from "./categoria.controller.js";
export function crearCategoriaRouter(service) {
    console.log("[CATEGORIA ROUTES] Inicializando router de categorías");
    const router = Router();
    const controller = new CategoriaController(service);
    router.get("/", controller.obtenerTodas);
    router.get("/:id", controller.obtenerPorId);
    router.post("/", controller.crear);
    router.put("/:id", controller.actualizar);
    router.delete("/:id", controller.eliminar);
    return router;
}
