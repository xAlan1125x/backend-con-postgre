import type { Producto } from "./producto.entity.js";
import type { CrearProductoDto, ActualizarProductoDto } from "./producto.dto.js";
import db from "../database/sqlite.js";

export class ProductoRepository {
  obtenerTodos(): Producto[] {
    console.log("[PRODUCTO REPOSITORY] obtenerTodos() - Ejecutando query SELECT * FROM productos");
    const resultado = db.prepare("SELECT * FROM productos").all() as Producto[];
    console.log("[PRODUCTO REPOSITORY] obtenerTodos() - Query completada, registros obtenidos:", resultado.length);
    return resultado;
  }

  buscarPorId(id: number): Producto | undefined {
    console.log("[PRODUCTO REPOSITORY] buscarPorId() - Buscando producto con ID:", id);
    const resultado = db.prepare("SELECT * FROM productos WHERE id = ?").get(id) as Producto | undefined;
    if (!resultado) {
      console.log("[PRODUCTO REPOSITORY] buscarPorId() - No se encontró producto con ID:", id);
    } else {
      console.log("[PRODUCTO REPOSITORY] buscarPorId() - Encontrado producto:", resultado.nombre);
    }
    return resultado;
  }

  guardar(dto: CrearProductoDto): Producto {
    console.log("[PRODUCTO REPOSITORY] guardar() - Insertando nuevo producto:", dto.nombre);
    const stmt = db.prepare("INSERT INTO productos (nombre, precio, categoria_id) VALUES (?, ?, ?)");
    const result = stmt.run(dto.nombre, dto.precio, dto.categoria_id);
    const producto = { id: Number(result.lastInsertRowid), ...dto };
    console.log("[PRODUCTO REPOSITORY] guardar() - Producto insertado con ID:", producto.id);
    return producto;
  }

  actualizar(id: number, dto: ActualizarProductoDto): Producto | undefined {
    console.log("[PRODUCTO REPOSITORY] actualizar() - Actualizando producto ID:", id);
    const actual = this.buscarPorId(id);
    if (!actual) return undefined;

    const nombre = dto.nombre ?? actual.nombre;
    const precio = dto.precio ?? actual.precio;
    const categoria_id = dto.categoria_id ?? actual.categoria_id;

    console.log("[PRODUCTO REPOSITORY] actualizar() - Ejecutando UPDATE para ID:", id);
    db.prepare("UPDATE productos SET nombre = ?, precio = ?, categoria_id = ? WHERE id = ?").run(
      nombre,
      precio,
      categoria_id,
      id
    );
    const actualizado = { id, nombre, precio, categoria_id };
    console.log("[PRODUCTO REPOSITORY] actualizar() - Producto actualizado:", actualizado.nombre);
    return actualizado;
  }

  eliminar(id: number): boolean {
    console.log("[PRODUCTO REPOSITORY] eliminar() - Eliminando producto ID:", id);
    const result = db.prepare("DELETE FROM productos WHERE id = ?").run(id);
    console.log("[PRODUCTO REPOSITORY] eliminar() - DELETE completado, filas afectadas:", result.changes);
    return result.changes > 0;
  }
}