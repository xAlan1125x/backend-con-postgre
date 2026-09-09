export const openApiSpecification = {
    openapi: "3.0.3",
    info: { title: "Backend con PostgreSQL", version: "1.0.0", description: "API de productos, categorías y checkout de pedidos" },
    servers: [{ url: "http://localhost:3000" }],
    paths: {
        "/api/v1/productos": {
            get: { summary: "Obtener todos los productos", responses: { "200": { description: "Lista de productos" } } },
            post: {
                summary: "Crear un producto",
                requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CrearProductoDto" } } } },
                responses: { "201": { description: "Producto creado" }, "422": { description: "Datos inválidos" } }
            }
        },
        "/api/v1/productos/{id}": {
            parameters: [{ $ref: "#/components/parameters/Id" }],
            get: { summary: "Obtener un producto", responses: { "200": { description: "Producto encontrado" }, "404": { description: "Producto inexistente" } } },
            put: {
                summary: "Actualizar un producto",
                requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ActualizarProductoDto" } } } },
                responses: { "200": { description: "Producto actualizado" }, "404": { description: "Producto inexistente" } }
            },
            delete: { summary: "Eliminar un producto", responses: { "204": { description: "Producto eliminado" }, "404": { description: "Producto inexistente" } } }
        },
        "/api/v1/categorias": {
            get: { summary: "Obtener todas las categorías", responses: { "200": { description: "Lista de categorías" } } },
            post: {
                summary: "Crear una categoría",
                requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CrearCategoriaDto" } } } },
                responses: { "201": { description: "Categoría creada" }, "422": { description: "Datos inválidos" } }
            }
        },
        "/api/v1/categorias/{id}": {
            parameters: [{ $ref: "#/components/parameters/Id" }],
            get: { summary: "Obtener una categoría", responses: { "200": { description: "Categoría encontrada" }, "404": { description: "Categoría inexistente" } } },
            put: {
                summary: "Actualizar una categoría",
                requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ActualizarCategoriaDto" } } } },
                responses: { "200": { description: "Categoría actualizada" }, "404": { description: "Categoría inexistente" } }
            },
            delete: { summary: "Eliminar una categoría", responses: { "204": { description: "Categoría eliminada" }, "404": { description: "Categoría inexistente" } } }
        },
        "/api/pedidos": {
            post: {
                summary: "Procesar checkout de un pedido",
                requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CrearPedidoDto" } } } },
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
            Producto: { type: "object", properties: { id: { type: "integer" }, nombre: { type: "string" }, precio: { type: "number" }, stock: { type: "integer" }, categoria_id: { type: "integer", nullable: true } } },
            CrearProductoDto: { type: "object", required: ["nombre", "precio", "categoria_id"], properties: { nombre: { type: "string" }, precio: { type: "number", exclusiveMinimum: 0 }, stock: { type: "integer", minimum: 0 }, categoria_id: { type: "integer", minimum: 1 } } },
            ActualizarProductoDto: { type: "object", properties: { nombre: { type: "string" }, precio: { type: "number", exclusiveMinimum: 0 }, stock: { type: "integer", minimum: 0 }, categoria_id: { type: "integer", minimum: 1 } } },
            Categoria: { type: "object", properties: { id: { type: "integer" }, nombre: { type: "string" }, descripcion: { type: "string" } } },
            CrearCategoriaDto: { type: "object", required: ["nombre"], properties: { nombre: { type: "string", minLength: 3 }, descripcion: { type: "string" } } },
            ActualizarCategoriaDto: { type: "object", properties: { nombre: { type: "string", minLength: 3 }, descripcion: { type: "string" } } },
            CrearPedidoDto: {
                type: "object", required: ["usuarioId", "productosComprados"],
                properties: {
                    usuarioId: { type: "integer", minimum: 1 },
                    productosComprados: { type: "array", minItems: 1, items: { $ref: "#/components/schemas/ProductoCompradoDto" } }
                },
                parameters: { Id: { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } } }
            },
            ProductoCompradoDto: {
                type: "object", required: ["productoId", "cantidad"],
                properties: { productoId: { type: "integer", minimum: 1 }, cantidad: { type: "integer", minimum: 1 } }
            }
        }
    }
};
