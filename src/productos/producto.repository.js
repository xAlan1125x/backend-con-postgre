import prisma from "../database/prisma.js";

export class ProductoRepository {
    async obtenerTodos() {
        console.log("[PRODUCTO REPOSITORY] obtenerTodos() - Ejecutando consulta Prisma");
        const productos = await prisma.producto.findMany();
        const resultado = productos.map((producto) => ({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            categoria_id: producto.categoriaId
        }));
        console.log("[PRODUCTO REPOSITORY] obtenerTodos() - Query completada, registros obtenidos:", resultado.length);
        return resultado;
    }
    async buscarPorId(id) {
        console.log("[PRODUCTO REPOSITORY] buscarPorId() - Buscando producto con ID:", id);
        const producto = await prisma.producto.findUnique({ where: { id } });
        const resultado = producto
            ? {
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                categoria_id: producto.categoriaId
            }
            : undefined;
        if (!resultado) {
            console.log("[PRODUCTO REPOSITORY] buscarPorId() - No se encontró producto con ID:", id);
        }
        else {
            console.log("[PRODUCTO REPOSITORY] buscarPorId() - Encontrado producto:", resultado.nombre);
        }
        return resultado;
    }
    async guardar(dto) {
        console.log("[PRODUCTO REPOSITORY] guardar() - Insertando nuevo producto:", dto.nombre);
        const productoGuardado = await prisma.producto.create({
            data: {
                nombre: dto.nombre,
                precio: dto.precio,
                categoriaId: dto.categoria_id
            }
        });
        const producto = {
            id: productoGuardado.id,
            nombre: productoGuardado.nombre,
            precio: productoGuardado.precio,
            categoria_id: productoGuardado.categoriaId
        };
        console.log("[PRODUCTO REPOSITORY] guardar() - Producto insertado con ID:", producto.id);
        return producto;
    }
    async actualizar(id, dto) {
        console.log("[PRODUCTO REPOSITORY] actualizar() - Actualizando producto ID:", id);
        const actual = await this.buscarPorId(id);
        if (!actual)
            return undefined;
        const nombre = dto.nombre ?? actual.nombre;
        const precio = dto.precio ?? actual.precio;
        const categoria_id = dto.categoria_id ?? actual.categoria_id;
        const productoActualizado = await prisma.producto.update({
            where: { id },
            data: { nombre, precio, categoriaId: categoria_id }
        });
        const actualizado = {
            id: productoActualizado.id,
            nombre: productoActualizado.nombre,
            precio: productoActualizado.precio,
            categoria_id: productoActualizado.categoriaId
        };
        console.log("[PRODUCTO REPOSITORY] actualizar() - Producto actualizado:", actualizado.nombre);
        return actualizado;
    }
    async eliminar(id) {
        console.log("[PRODUCTO REPOSITORY] eliminar() - Eliminando producto ID:", id);
        const result = await prisma.producto.deleteMany({ where: { id } });
        console.log("[PRODUCTO REPOSITORY] eliminar() - DELETE completado, filas afectadas:", result.count);
        return result.count > 0;
    }
}
