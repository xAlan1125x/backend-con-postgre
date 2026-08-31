import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { CategoriaService } from "../src/categorias/categoria.service.js";
import { CategoriaRepository } from "../src/categorias/categoria.repository.js";
// Repositorio Mock para Pruebas
class CategoriaRepositoryMock extends CategoriaRepository {
    datos = [
        { id: 1, nombre: "Electrónica", descripcion: "Gadgets y dispositivos electrónicos" },
        { id: 2, nombre: "Ropa", descripcion: "Prendas de vestir" }
    ];
    obtenerTodas() {
        return this.datos;
    }
    buscarPorId(id) {
        return this.datos.find((c) => c.id === id);
    }
    guardar(dto) {
        const nueva = {
            id: this.datos.length + 1,
            nombre: dto.nombre,
            descripcion: dto.descripcion || ""
        };
        this.datos.push(nueva);
        return nueva;
    }
    actualizar(id, dto) {
        const categoria = this.buscarPorId(id);
        if (!categoria)
            return undefined;
        if (dto.nombre !== undefined)
            categoria.nombre = dto.nombre;
        if (dto.descripcion !== undefined)
            categoria.descripcion = dto.descripcion;
        return categoria;
    }
    eliminar(id) {
        const index = this.datos.findIndex((c) => c.id === id);
        if (index === -1)
            return false;
        this.datos.splice(index, 1);
        return true;
    }
}
const crearContexto = () => ({
    service: new CategoriaService(new CategoriaRepositoryMock())
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
describe("Feature: Gestión de Categorías", () => {
    describe("Scenario: Obtener lista de todas las categorías", () => {
        test("should return all categories from repository", () => {
            const ctx = crearContexto();
            given("que existen 2 categorías en el repositorio", () => {
                assert.ok(ctx.service);
            });
            when("se solicita obtener todas las categorías", (context) => {
                context.resultado = context.service.obtenerTodas();
            }, ctx);
            then("debe retornar una lista con 2 categorías", () => {
                assert.equal(ctx.resultado.length, 2);
            });
            then("la primera categoría debe ser 'Electrónica'", () => {
                if (ctx.resultado[0])
                    assert.equal(ctx.resultado[0].nombre, "Electrónica");
            });
        });
    });
    describe("Scenario: Buscar categoría por ID existente", () => {
        test("should find category by valid ID", () => {
            const ctx = crearContexto();
            given("que existe una categoría con ID 1", () => {
                assert.ok(ctx.service);
            });
            when("se busca una categoría por ID 1", (context) => {
                context.resultado = context.service.obtenerPorId(1);
            }, ctx);
            then("debe retornar la categoría encontrada", () => {
                assert.equal(ctx.resultado.id, 1);
            });
            then("el nombre debe ser 'Electrónica'", () => {
                assert.equal(ctx.resultado.nombre, "Electrónica");
            });
        });
    });
    describe("Scenario: Buscar categoría por ID inexistente", () => {
        test("should throw 404 error for non-existent ID", () => {
            const ctx = crearContexto();
            given("que NO existe una categoría con ID 99", () => {
                assert.ok(ctx.service);
            });
            when("se intenta buscar una categoría por ID 99", (context) => {
                try {
                    context.service.obtenerPorId(99);
                }
                catch (err) {
                    context.error = err;
                }
            }, ctx);
            then("debe lanzar un error 404", () => {
                assert.ok(ctx.error);
                assert.match(ctx.error.code, /CATEGORY_NOT_FOUND/);
            });
        });
    });
    describe("Scenario: Crear categoría válida", () => {
        test("should create new category with valid data", () => {
            const ctx = crearContexto();
            given("que tengo datos válidos para una nueva categoría", () => {
                assert.ok(ctx.service);
            });
            when("se crea una categoría con nombre 'Libros'", (context) => {
                context.resultado = context.service.crear({
                    nombre: "Libros",
                    descripcion: "Libros variados"
                });
            }, ctx);
            then("debe retornar la categoría creada", () => {
                assert.ok(ctx.resultado);
            });
            then("el nombre debe ser 'Libros'", () => {
                assert.equal(ctx.resultado.nombre, "Libros");
            });
            then("debe tener descripción 'Libros variados'", () => {
                assert.equal(ctx.resultado.descripcion, "Libros variados");
            });
        });
    });
    describe("Scenario: Crear categoría con nombre inválido", () => {
        test("should reject category with name too short", () => {
            const ctx = crearContexto();
            given("que tengo datos inválidos (nombre muy corto)", () => {
                assert.ok(ctx.service);
            });
            when("se intenta crear una categoría con nombre 'AB'", (context) => {
                try {
                    context.service.crear({
                        nombre: "AB",
                        descripcion: "Corto"
                    });
                }
                catch (err) {
                    context.error = err;
                }
            }, ctx);
            then("debe lanzar un error de validación", () => {
                assert.ok(ctx.error);
            });
            then("el error debe ser de tipo INVALID_NAME", () => {
                assert.match(ctx.error.code, /INVALID_NAME/);
            });
        });
    });
    describe("Scenario: Actualizar categoría existente", () => {
        test("should update category with valid data", () => {
            const ctx = crearContexto();
            given("que existe una categoría con ID 1", () => {
                assert.ok(ctx.service);
            });
            when("se actualiza el nombre a 'Electrónica Premium'", (context) => {
                context.resultado = context.service.actualizar(1, {
                    nombre: "Electrónica Premium"
                });
            }, ctx);
            then("debe retornar la categoría actualizada", () => {
                assert.ok(ctx.resultado);
            });
            then("el nuevo nombre debe ser 'Electrónica Premium'", () => {
                assert.equal(ctx.resultado?.nombre, "Electrónica Premium");
            });
        });
    });
    describe("Scenario: Eliminar categoría existente", () => {
        test("should delete category by ID", () => {
            const ctx = crearContexto();
            given("que existen 2 categorías en el repositorio", () => {
                assert.equal(ctx.service.obtenerTodas().length, 2);
            });
            when("se elimina la categoría con ID 2", (context) => {
                context.resultado = context.service.eliminar(2);
            }, ctx);
            then("la operación debe completarse exitosamente", () => {
                assert.equal(ctx.resultado, true);
            });
            then("debe quedar solo 1 categoría en el repositorio", () => {
                const restantes = ctx.service.obtenerTodas();
                assert.equal(restantes.length, 1);
            });
        });
    });
});
