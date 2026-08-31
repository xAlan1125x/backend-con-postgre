import type { CrearCategoriaDto, ActualizarCategoriaDto } from "./categoria.dto.js";
import { CategoriaRepository } from "./categoria.repository.js";
import { AppError } from "../errors/app-error.js";

export class CategoriaService {
  constructor(private readonly repository: CategoriaRepository) {}

  obtenerTodas() {
    console.log("[CATEGORIA SERVICE] obtenerTodas() - Solicitando todas las categorías al repositorio");
    const resultado = this.repository.obtenerTodas();
    console.log("[CATEGORIA SERVICE] obtenerTodas() - Retornando", resultado.length, "categorías");
    return resultado;
  }

  obtenerPorId(id: number) {
    console.log("[CATEGORIA SERVICE] obtenerPorId() - Validando y buscando categoría con ID:", id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, "INVALID_ID", "El identificador no es válido");
    }
    const categoria = this.repository.buscarPorId(id);
    if (!categoria) {
      console.log("[CATEGORIA SERVICE] obtenerPorId() - Categoría no encontrada para ID:", id);
      throw new AppError(404, "CATEGORY_NOT_FOUND", "La categoría no existe");
    }
    console.log("[CATEGORIA SERVICE] obtenerPorId() - Categoría encontrada:", categoria.nombre);
    return categoria;
  }

  crear(dto: CrearCategoriaDto) {
    console.log("[CATEGORIA SERVICE] crear() - Validando datos para crear categoría:", dto.nombre);
    if (!dto.nombre || dto.nombre.trim().length < 3) {
      throw new AppError(422, "INVALID_NAME", "El nombre debe tener al menos 3 caracteres");
    }
    console.log("[CATEGORIA SERVICE] crear() - Datos válidos, guardando en repositorio");
    const resultado = this.repository.guardar(dto);
    console.log("[CATEGORIA SERVICE] crear() - Categoría creada con ID:", resultado.id);
    return resultado;
  }

  actualizar(id: number, dto: ActualizarCategoriaDto) {
    console.log("[CATEGORIA SERVICE] actualizar() - Actualizando categoría ID:", id);
    this.obtenerPorId(id);
    const resultado = this.repository.actualizar(id, dto);
    console.log("[CATEGORIA SERVICE] actualizar() - Categoría actualizada:", resultado?.nombre);
    return resultado;
  }

  eliminar(id: number) {
    console.log("[CATEGORIA SERVICE] eliminar() - Eliminando categoría ID:", id);
    this.obtenerPorId(id);
    const resultado = this.repository.eliminar(id);
    console.log("[CATEGORIA SERVICE] eliminar() - Categoría eliminada exitosamente");
    return resultado;
  }
}