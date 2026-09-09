import type { Request, Response, NextFunction } from "express";
import type { CrearProductoDto, ActualizarProductoDto } from "./producto.dto.js";
import { ProductoService } from "./producto.service.js";

export class ProductoController {
  constructor(private readonly service: ProductoService) {}

  obtenerTodos = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("[PRODUCTO CONTROLLER] obtenerTodos() - Iniciando lectura de todos los productos");
      const productos = await this.service.obtenerTodos();
      console.log("[PRODUCTO CONTROLLER] obtenerTodos() - Se obtuvieron", productos.length, "productos");
      res.json({ data: productos });
    } catch (err) {
      next(err);
    }
  };

  obtenerPorId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      console.log("[PRODUCTO CONTROLLER] obtenerPorId() - Buscando producto con ID:", id);
      const producto = await this.service.obtenerPorId(id);
      console.log("[PRODUCTO CONTROLLER] obtenerPorId() - Producto encontrado:", producto.nombre);
      res.json({ data: producto });
    } catch (err) {
      next(err);
    }
  };

  crear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("[PRODUCTO CONTROLLER] crear() - Recibida solicitud para crear producto:", req.body.nombre);
      const dto: CrearProductoDto = req.body;
      const nuevo = await this.service.crear(dto);
      console.log("[PRODUCTO CONTROLLER] crear() - Producto creado con ID:", nuevo.id);
      res.status(201).json({ data: nuevo });
    } catch (err) {
      next(err);
    }
  };

  actualizar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      console.log("[PRODUCTO CONTROLLER] actualizar() - Actualizando producto con ID:", id);
      const dto: ActualizarProductoDto = req.body;
      const actualizado = await this.service.actualizar(id, dto);
      console.log("[PRODUCTO CONTROLLER] actualizar() - Producto actualizado:", actualizado?.nombre);
      res.json({ data: actualizado });
    } catch (err) {
      next(err);
    }
  };

  eliminar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      console.log("[PRODUCTO CONTROLLER] eliminar() - Eliminando producto con ID:", id);
      await this.service.eliminar(id);
      console.log("[PRODUCTO CONTROLLER] eliminar() - Producto eliminado exitosamente");
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
