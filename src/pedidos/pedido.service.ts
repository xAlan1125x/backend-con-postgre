import prisma from "../database/prisma.js";
import { AppError } from "../errors/app-error.js";
import type { CrearPedidoDto } from "./pedido.dto.js";

export class PedidoService {
  async checkout(dto: CrearPedidoDto) {
    if (!Number.isInteger(dto.usuarioId) || dto.usuarioId <= 0) {
      throw new AppError(400, "INVALID_USER", "El usuarioId debe ser un entero positivo");
    }
    if (!Array.isArray(dto.productosComprados) || dto.productosComprados.length === 0) {
      throw new AppError(400, "INVALID_PRODUCTS", "Debe enviar al menos un producto");
    }

    for (const item of dto.productosComprados) {
      if (!Number.isInteger(item.productoId) || item.productoId <= 0 ||
          !Number.isInteger(item.cantidad) || item.cantidad <= 0) {
        throw new AppError(400, "INVALID_PRODUCT_ITEM", "Cada producto debe tener productoId y cantidad válidos");
      }
    }

    return prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.findUnique({ where: { id: dto.usuarioId } });
      if (!usuario) {
        throw new AppError(400, "USER_NOT_FOUND", "El usuario no existe");
      }

      const pedido = await tx.pedido.create({
        data: { usuarioId: dto.usuarioId, total: 0 }
      });

      let total = 0;
      for (const item of dto.productosComprados) {
        const producto = await tx.producto.findUnique({ where: { id: item.productoId } });
        if (!producto) {
          throw new AppError(400, "PRODUCT_NOT_FOUND", `El producto ${item.productoId} no existe`);
        }

        const actualizado = await tx.producto.updateMany({
          where: { id: item.productoId, stock: { gte: item.cantidad } },
          data: { stock: { decrement: item.cantidad } }
        });
        if (actualizado.count !== 1) {
          throw new AppError(400, "INSUFFICIENT_STOCK", `Stock insuficiente para ${producto.nombre}`);
        }

        total += producto.precio * item.cantidad;
        await tx.detallePedido.create({
          data: {
            pedidoId: pedido.id,
            productoId: producto.id,
            cantidad: item.cantidad,
            precio: producto.precio
          }
        });
      }

      return tx.pedido.update({
        where: { id: pedido.id },
        data: { total },
        include: { usuario: true, detalles: { include: { producto: true } } }
      });
    });
  }
}
