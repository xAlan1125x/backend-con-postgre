import type { Categoria } from "./categoria.entity.js";
import type { CrearCategoriaDto, ActualizarCategoriaDto } from "./categoria.dto.js";
import prisma from "../database/prisma.js";

export class CategoriaRepository {
  async obtenerTodas(): Promise<Categoria[]> {
    console.log("[CATEGORIA REPOSITORY] obtenerTodas() - Ejecutando consulta Prisma");
    const categorias = await prisma.categoria.findMany();
    const resultado = categorias.map((categoria) => ({
      id: categoria.id,
      nombre: categoria.nombre,
      descripcion: categoria.descripcion ?? ""
    }));
    console.log("[CATEGORIA REPOSITORY] obtenerTodas() - Query completada, registros obtenidos:", resultado.length);
    return resultado;
  }

  async buscarPorId(id: number): Promise<Categoria | undefined> {
    console.log("[CATEGORIA REPOSITORY] buscarPorId() - Buscando categoría con ID:", id);
    const categoria = await prisma.categoria.findUnique({ where: { id } });
    const resultado = categoria
      ? {
          id: categoria.id,
          nombre: categoria.nombre,
          descripcion: categoria.descripcion ?? ""
        }
      : undefined;
    if (!resultado) {
      console.log("[CATEGORIA REPOSITORY] buscarPorId() - No se encontró categoría con ID:", id);
    } else {
      console.log("[CATEGORIA REPOSITORY] buscarPorId() - Encontrada categoría:", resultado.nombre);
    }
    return resultado;
  }

  async guardar(dto: CrearCategoriaDto): Promise<Categoria> {
    console.log("[CATEGORIA REPOSITORY] guardar() - Insertando nueva categoría:", dto.nombre);
    const categoriaGuardada = await prisma.categoria.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion ?? null
      }
    });
    const categoria = {
      id: categoriaGuardada.id,
      nombre: categoriaGuardada.nombre,
      descripcion: categoriaGuardada.descripcion ?? ""
    };
    console.log("[CATEGORIA REPOSITORY] guardar() - Categoría insertada con ID:", categoria.id);
    return categoria;
  }

  async actualizar(id: number, dto: ActualizarCategoriaDto): Promise<Categoria | undefined> {
    console.log("[CATEGORIA REPOSITORY] actualizar() - Actualizando categoría ID:", id);
    const actual = await this.buscarPorId(id);
    if (!actual) return undefined;

    const nombre = dto.nombre ?? actual.nombre;
    const descripcion = dto.descripcion ?? actual.descripcion;

    const categoriaActualizada = await prisma.categoria.update({
      where: { id },
      data: { nombre, descripcion }
    });
    const actualizada = {
      id: categoriaActualizada.id,
      nombre: categoriaActualizada.nombre,
      descripcion: categoriaActualizada.descripcion ?? ""
    };
    console.log("[CATEGORIA REPOSITORY] actualizar() - Categoría actualizada:", actualizada.nombre);
    return actualizada;
  }

  async eliminar(id: number): Promise<boolean> {
    console.log("[CATEGORIA REPOSITORY] eliminar() - Eliminando categoría ID:", id);
    const result = await prisma.categoria.deleteMany({ where: { id } });
    console.log("[CATEGORIA REPOSITORY] eliminar() - DELETE completado, filas afectadas:", result.count);
    return result.count > 0;
  }
}