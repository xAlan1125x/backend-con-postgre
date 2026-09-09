import type { Request, Response, NextFunction } from "express";
import type { CrearCategoriaDto, ActualizarCategoriaDto } from "./categoria.dto.js";
import { CategoriaService } from "./categoria.service.js";

export class CategoriaController {
  constructor(private readonly service: CategoriaService) {}

  obtenerTodas = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("[CATEGORIA CONTROLLER] obtenerTodas() - Iniciando lectura de todas las categorías");
      const categorias = await this.service.obtenerTodas();
      console.log("[CATEGORIA CONTROLLER] obtenerTodas() - Se obtuvieron", categorias.length, "categorías");
      res.json({ data: categorias });
    } catch (err) {
      next(err);
    }
  };

  obtenerPorId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      console.log("[CATEGORIA CONTROLLER] obtenerPorId() - Buscando categoría con ID:", id);
      const categoria = await this.service.obtenerPorId(id);
      console.log("[CATEGORIA CONTROLLER] obtenerPorId() - Categoría encontrada:", categoria.nombre);
      res.json({ data: categoria });
    } catch (err) {
      next(err);
    }
  };

  crear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("[CATEGORIA CONTROLLER] crear() - Recibida solicitud para crear categoría:", req.body.nombre);
      const dto: CrearCategoriaDto = req.body;
      const nueva = await this.service.crear(dto);
      console.log("[CATEGORIA CONTROLLER] crear() - Categoría creada con ID:", nueva.id);
      res.status(201).json({ data: nueva });
    } catch (err) {
      next(err);
    }
  };

  actualizar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      console.log("[CATEGORIA CONTROLLER] actualizar() - Actualizando categoría con ID:", id);
      const dto: ActualizarCategoriaDto = req.body;
      const actualizada = await this.service.actualizar(id, dto);
      console.log("[CATEGORIA CONTROLLER] actualizar() - Categoría actualizada:", actualizada?.nombre);
      res.json({ data: actualizada });
    } catch (err) {
      next(err);
    }
  };

  eliminar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      console.log("[CATEGORIA CONTROLLER] eliminar() - Eliminando categoría con ID:", id);
      await this.service.eliminar(id);
      console.log("[CATEGORIA CONTROLLER] eliminar() - Categoría eliminada exitosamente");
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
