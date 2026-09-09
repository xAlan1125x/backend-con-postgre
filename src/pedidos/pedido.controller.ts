import type { Request, Response, NextFunction } from "express";
import { PedidoService } from "./pedido.service.js";
import type { CrearPedidoDto } from "./pedido.dto.js";

export class PedidoController {
  constructor(private readonly service: PedidoService) {}

  checkout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: CrearPedidoDto = req.body;
      const pedido = await this.service.checkout(dto);
      res.status(201).json({ data: pedido });
    } catch (error) {
      next(error);
    }
  };
}
