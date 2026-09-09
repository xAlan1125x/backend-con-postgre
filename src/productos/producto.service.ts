import type { CrearProductoDto, ActualizarProductoDto } from "./producto.dto.js";
import { ProductoRepository } from "./producto.repository.js";
import { AppError } from "../errors/app-error.js";

export class ProductoService {
  constructor(private readonly repository: ProductoRepository) {}

  async obtenerTodos() {
    console.log("[PRODUCTO SERVICE] obtenerTodos() - Solicitando todos los productos al repositorio");
    const resultado = await this.repository.obtenerTodos();
    console.log("[PRODUCTO SERVICE] obtenerTodos() - Retornando", resultado.length, "productos");
    return resultado;
  }

  async obtenerPorId(id: number) {
    console.log("[PRODUCTO SERVICE] obtenerPorId() - Validando y buscando producto con ID:", id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, "INVALID_ID", "Identificador inválido");
    }
    const producto = await this.repository.buscarPorId(id);
    if (!producto) {
      console.log("[PRODUCTO SERVICE] obtenerPorId() - Producto no encontrado para ID:", id);
      throw new AppError(404, "PRODUCT_NOT_FOUND", "Producto no encontrado");
    }
    console.log("[PRODUCTO SERVICE] obtenerPorId() - Producto encontrado:", producto.nombre);
    return producto;
  }

  async crear(dto: CrearProductoDto) {
    console.log("[PRODUCTO SERVICE] crear() - Validando datos para crear producto:", dto.nombre);
    if (!dto.nombre || dto.precio <= 0) {
      throw new AppError(422, "INVALID_DATA", "Datos del producto no válidos");
    }
    console.log("[PRODUCTO SERVICE] crear() - Datos válidos, guardando en repositorio");
    const resultado = await this.repository.guardar(dto);
    console.log("[PRODUCTO SERVICE] crear() - Producto creado con ID:", resultado.id);
    return resultado;
  }

  async actualizar(id: number, dto: ActualizarProductoDto) {
    console.log("[PRODUCTO SERVICE] actualizar() - Actualizando producto ID:", id);
    await this.obtenerPorId(id);
    const resultado = await this.repository.actualizar(id, dto);
    console.log("[PRODUCTO SERVICE] actualizar() - Producto actualizado:", resultado?.nombre);
    return resultado;
  }

  async eliminar(id: number) {
    console.log("[PRODUCTO SERVICE] eliminar() - Eliminando producto ID:", id);
    await this.obtenerPorId(id);
    const resultado = await this.repository.eliminar(id);
    console.log("[PRODUCTO SERVICE] eliminar() - Producto eliminado exitosamente");
    return resultado;
  }
}