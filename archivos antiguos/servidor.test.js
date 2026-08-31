import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { servidor } from "./src/servidor.js";

describe("Pruebas del Servidor HTTP", () => {
  let urlBase;

  before(() => {
    return new Promise((resolve) => {
      servidor.listen(0, () => {
        const puerto = servidor.address().port;
        urlBase = `http://localhost:${puerto}`;
        resolve();
      });
    });
  });

  after(() => {
    return new Promise((resolve, reject) => {
      servidor.close((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });

  test("GET /salud responde estado ok", async () => {
    const respuesta = await fetch(`${urlBase}/salud`);
    const datos = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.equal(datos.estado, "ok");
  });

  test("GET /api/saludo responde mensaje de bienvenida", async () => {
    const respuesta = await fetch(`${urlBase}/api/saludo`);
    const datos = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.equal(datos.mensaje, "¡Hola desde el nuevo endpoint!");
  });

  // ¡AQUÍ DENTRO DEBE IR EL NUEVO TEST!
  test("POST /api/mensaje responde con la confirmacion del mensaje", async () => {
    const respuesta = await fetch(`${urlBase}/api/mensaje`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje: "Hola XP" })
    });

    const datos = await respuesta.json();

    assert.equal(respuesta.status, 201);
    assert.equal(datos.recibido, "Hola XP");
  });
});