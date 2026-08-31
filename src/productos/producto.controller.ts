import type { Request, Response, NextFunction } from "express";
import type { CrearProductoDto, ActualizarProductoDto } from "./producto.dto.js";
import { ProductoService } from "./producto.service.js";

export class ProductoController {
  constructor(private readonly service: ProductoService) {}

  obtenerTodos = (_req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("[PRODUCTO CONTROLLER] obtenerTodos() - Iniciando lectura de todos los productos");
      const productos = this.service.obtenerTodos();
      console.log("[PRODUCTO CONTROLLER] obtenerTodos() - Se obtuvieron", productos.length, "productos");
      res.json({ data: productos });
    } catch (err) {
      next(err);
    }
  };

  obtenerPorId = (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      console.log("[PRODUCTO CONTROLLER] obtenerPorId() - Buscando producto con ID:", id);
      const producto = this.service.obtenerPorId(id);
      console.log("[PRODUCTO CONTROLLER] obtenerPorId() - Producto encontrado:", producto.nombre);
      res.json({ data: producto });
    } catch (err) {
      next(err);
    }
  };

  crear = (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("[PRODUCTO CONTROLLER] crear() - Recibida solicitud para crear producto:", req.body.nombre);
      const dto: CrearProductoDto = req.body;
      const nuevo = this.service.crear(dto);
      console.log("[PRODUCTO CONTROLLER] crear() - Producto creado con ID:", nuevo.id);
      res.status(201).json({ data: nuevo });
    } catch (err) {
      next(err);
    }
  };

  actualizar = (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      console.log("[PRODUCTO CONTROLLER] actualizar() - Actualizando producto con ID:", id);
      const dto: ActualizarProductoDto = req.body;
      const actualizado = this.service.actualizar(id, dto);
      console.log("[PRODUCTO CONTROLLER] actualizar() - Producto actualizado:", actualizado?.nombre);
      res.json({ data: actualizado });
    } catch (err) {
      next(err);
    }
  };

  eliminar = (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      console.log("[PRODUCTO CONTROLLER] eliminar() - Eliminando producto con ID:", id);
      this.service.eliminar(id);
      console.log("[PRODUCTO CONTROLLER] eliminar() - Producto eliminado exitosamente");
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
