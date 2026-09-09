import { Router } from "express";
import { PedidoController } from "./pedido.controller.js";
import { PedidoService } from "./pedido.service.js";
export function crearPedidoRouter(service) {
    const router = Router();
    const controller = new PedidoController(service);
    router.post("/", controller.checkout);
    return router;
}
