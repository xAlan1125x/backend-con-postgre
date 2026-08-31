import db from "../database/sqlite.js";
export class CategoriaRepository {
    obtenerTodas() {
        console.log("[CATEGORIA REPOSITORY] obtenerTodas() - Ejecutando query SELECT * FROM categorias");
        const resultado = db.prepare("SELECT * FROM categorias").all();
        console.log("[CATEGORIA REPOSITORY] obtenerTodas() - Query completada, registros obtenidos:", resultado.length);
        return resultado;
    }
    buscarPorId(id) {
        console.log("[CATEGORIA REPOSITORY] buscarPorId() - Buscando categoría con ID:", id);
        const resultado = db.prepare("SELECT * FROM categorias WHERE id = ?").get(id);
        if (!resultado) {
            console.log("[CATEGORIA REPOSITORY] buscarPorId() - No se encontró categoría con ID:", id);
        }
        else {
            console.log("[CATEGORIA REPOSITORY] buscarPorId() - Encontrada categoría:", resultado.nombre);
        }
        return resultado;
    }
    guardar(dto) {
        console.log("[CATEGORIA REPOSITORY] guardar() - Insertando nueva categoría:", dto.nombre);
        const stmt = db.prepare("INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)");
        const result = stmt.run(dto.nombre, dto.descripcion || "");
        const categoria = { id: Number(result.lastInsertRowid), nombre: dto.nombre, descripcion: dto.descripcion || "" };
        console.log("[CATEGORIA REPOSITORY] guardar() - Categoría insertada con ID:", categoria.id);
        return categoria;
    }
    actualizar(id, dto) {
        console.log("[CATEGORIA REPOSITORY] actualizar() - Actualizando categoría ID:", id);
        const actual = this.buscarPorId(id);
        if (!actual)
            return undefined;
        const nombre = dto.nombre ?? actual.nombre;
        const descripcion = dto.descripcion ?? actual.descripcion;
        console.log("[CATEGORIA REPOSITORY] actualizar() - Ejecutando UPDATE para ID:", id);
        db.prepare("UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?").run(nombre, descripcion, id);
        const actualizada = { id, nombre, descripcion };
        console.log("[CATEGORIA REPOSITORY] actualizar() - Categoría actualizada:", actualizada.nombre);
        return actualizada;
    }
    eliminar(id) {
        console.log("[CATEGORIA REPOSITORY] eliminar() - Eliminando categoría ID:", id);
        const result = db.prepare("DELETE FROM categorias WHERE id = ?").run(id);
        console.log("[CATEGORIA REPOSITORY] eliminar() - DELETE completado, filas afectadas:", result.changes);
        return result.changes > 0;
    }
}
