export const openApiSpecification = {
  openapi: "3.0.3",
  info: {
    title: "Backend con PostgreSQL",
    version: "1.0.0",
    description: "API de productos, categorías y checkout de pedidos"
  },
  servers: [{ url: "http://localhost:3000" }],
  paths: {
    "/api/pedidos": {
      post: {
        summary: "Procesar checkout de un pedido",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CrearPedidoDto" }
            }
          }
        },
        responses: {
          "201": { description: "Pedido creado y stock actualizado" },
          "400": { description: "Datos inválidos, usuario inexistente o stock insuficiente" },
          "500": { description: "Error interno" }
        }
      }
    }
  },
  components: {
    schemas: {
      CrearPedidoDto: {
        type: "object",
        required: ["usuarioId", "productosComprados"],
        properties: {
          usuarioId: { type: "integer", minimum: 1 },
          productosComprados: {
            type: "array",
            minItems: 1,
            items: { $ref: "#/components/schemas/ProductoCompradoDto" }
          }
        }
      },
      ProductoCompradoDto: {
        type: "object",
        required: ["productoId", "cantidad"],
        properties: {
          productoId: { type: "integer", minimum: 1 },
          cantidad: { type: "integer", minimum: 1 }
        }
      }
    }
  }
};
