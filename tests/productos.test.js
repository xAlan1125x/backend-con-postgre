import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ProductoService } from "../src/productos/producto.service.js";
import { ProductoRepository } from "../src/productos/producto.repository.js";
// Repositorio Mock para Pruebas
class ProductoRepositoryMock extends ProductoRepository {
    datos = [
        { id: 1, nombre: "Laptop", precio: 1000, categoria_id: 1 },
        { id: 2, nombre: "Mouse", precio: 25, categoria_id: 1 }
    ];
    obtenerTodos() {
        return this.datos;
    }
    buscarPorId(id) {
        return this.datos.find((p) => p.id === id);
    }
    guardar(dto) {
        const nuevo = {
            id: this.datos.length + 1,
            nombre: dto.nombre,
            precio: dto.precio,
            categoria_id: dto.categoria_id
        };
        this.datos.push(nuevo);
        return nuevo;
    }
    actualizar(id, dto) {
        const producto = this.buscarPorId(id);
        if (!producto)
            return undefined;
        if (dto.nombre !== undefined)
            producto.nombre = dto.nombre;
        if (dto.precio !== undefined)
            producto.precio = dto.precio;
        if (dto.categoria_id !== undefined)
            producto.categoria_id = dto.categoria_id;
        return producto;
    }
    eliminar(id) {
        const index = this.datos.findIndex((p) => p.id === id);
        if (index === -1)
            return false;
        this.datos.splice(index, 1);
        return true;
    }
}
const crearContexto = () => ({
    service: new ProductoService(new ProductoRepositoryMock())
});
const given = (description, fn) => {
    console.log(`  Given: ${description}`);
    fn();
};
const when = (description, fn, ctx) => {
    console.log(`  When: ${description}`);
    fn(ctx);
};
const then = (description, assertion) => {
    console.log(`  Then: ${description}`);
    assertion();
};
describe("Feature: Gestión de Productos", () => {
    describe("Scenario: Obtener lista de todos los productos", () => {
        test("should return all products from repository", () => {
            const ctx = crearContexto();
            given("que existen 2 productos en el repositorio", () => {
                assert.ok(ctx.service);
            });
            when("se solicita obtener todos los productos", (context) => {
                context.resultado = context.service.obtenerTodos();
            }, ctx);
            then("debe retornar una lista con 2 productos", () => {
                assert.equal(ctx.resultado.length, 2);
            });
            then("el primer producto debe ser 'Laptop'", () => {
                if (ctx.resultado[0])
                    assert.equal(ctx.resultado[0].nombre, "Laptop");
            });
        });
    });
    describe("Scenario: Buscar producto por ID existente", () => {
        test("should find product by valid ID", () => {
            const ctx = crearContexto();
            given("que existe un producto con ID 1", () => {
                assert.ok(ctx.service);
            });
            when("se busca un producto por ID 1", (context) => {
                context.resultado = context.service.obtenerPorId(1);
            }, ctx);
            then("debe retornar el producto encontrado", () => {
                assert.equal(ctx.resultado.id, 1);
            });
            then("el nombre debe ser 'Laptop'", () => {
                assert.equal(ctx.resultado.nombre, "Laptop");
            });
            then("el precio debe ser 1000", () => {
                assert.equal(ctx.resultado.precio, 1000);
            });
        });
    });
    describe("Scenario: Buscar producto por ID inexistente", () => {
        test("should throw 404 error for non-existent ID", () => {
            const ctx = crearContexto();
            given("que NO existe un producto con ID 99", () => {
                assert.ok(ctx.service);
            });
            when("se intenta buscar un producto por ID 99", (context) => {
                try {
                    context.service.obtenerPorId(99);
                }
                catch (err) {
                    context.error = err;
                }
            }, ctx);
            then("debe lanzar un error 404", () => {
                assert.ok(ctx.error);
                assert.match(ctx.error.code, /PRODUCT_NOT_FOUND/);
            });
        });
    });
    describe("Scenario: Crear producto válido", () => {
        test("should create new product with valid data", () => {
            const ctx = crearContexto();
            given("que tengo datos válidos para un nuevo producto", () => {
                assert.ok(ctx.service);
            });
            when("se crea un producto con nombre 'Teclado' y precio 75", (context) => {
                context.resultado = context.service.crear({
                    nombre: "Teclado",
                    precio: 75,
                    categoria_id: 1
                });
            }, ctx);
            then("debe retornar el producto creado", () => {
                assert.ok(ctx.resultado);
            });
            then("el nombre debe ser 'Teclado'", () => {
                assert.equal(ctx.resultado.nombre, "Teclado");
            });
            then("el precio debe ser 75", () => {
                assert.equal(ctx.resultado.precio, 75);
            });
        });
    });
    describe("Scenario: Crear producto con precio inválido", () => {
        test("should reject product with invalid price", () => {
            const ctx = crearContexto();
            given("que tengo datos inválidos (precio negativo)", () => {
                assert.ok(ctx.service);
            });
            when("se intenta crear un producto con precio -10", (context) => {
                try {
                    context.service.crear({
                        nombre: "Producto",
                        precio: -10,
                        categoria_id: 1
                    });
                }
                catch (err) {
                    context.error = err;
                }
            }, ctx);
            then("debe lanzar un error de validación", () => {
                assert.ok(ctx.error);
            });
            then("el error debe ser de tipo INVALID_DATA", () => {
                assert.match(ctx.error.code, /INVALID_DATA/);
            });
        });
    });
    describe("Scenario: Actualizar producto existente", () => {
        test("should update product with valid data", () => {
            const ctx = crearContexto();
            given("que existe un producto con ID 1", () => {
                assert.ok(ctx.service);
            });
            when("se actualiza el precio a 1200", (context) => {
                context.resultado = context.service.actualizar(1, {
                    precio: 1200
                });
            }, ctx);
            then("debe retornar el producto actualizado", () => {
                assert.ok(ctx.resultado);
            });
            then("el nuevo precio debe ser 1200", () => {
                assert.equal(ctx.resultado?.precio, 1200);
            });
            then("el nombre debe seguir siendo 'Laptop'", () => {
                assert.equal(ctx.resultado?.nombre, "Laptop");
            });
        });
    });
    describe("Scenario: Eliminar producto existente", () => {
        test("should delete product by ID", () => {
            const ctx = crearContexto();
            given("que existen 2 productos en el repositorio", () => {
                assert.equal(ctx.service.obtenerTodos().length, 2);
            });
            when("se elimina el producto con ID 2", (context) => {
                context.resultado = context.service.eliminar(2);
            }, ctx);
            then("la operación debe completarse exitosamente", () => {
                assert.equal(ctx.resultado, true);
            });
            then("debe quedar solo 1 producto en el repositorio", () => {
                const restantes = ctx.service.obtenerTodos();
                assert.equal(restantes.length, 1);
            });
            then("el producto restante debe ser 'Laptop'", () => {
                const restantes = ctx.service.obtenerTodos();
                if (restantes[0])
                    assert.equal(restantes[0].nombre, "Laptop");
            });
        });
    });
});
