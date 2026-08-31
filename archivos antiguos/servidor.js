import { createServer } from "node:http";

export const requestListener = (solicitud, respuesta) => {
  respuesta.setHeader(
    "Content-Type",
    "application/json; charset=utf-8"
  );

  if (solicitud.method === "GET" && solicitud.url === "/salud") {
    respuesta.writeHead(200);
    respuesta.end(
      JSON.stringify({
        estado: "ok",
        fecha: new Date().toISOString()
      })
    );
    return;
  }

  if (solicitud.method === "GET" && solicitud.url === "/api/saludo") {
    respuesta.writeHead(200);
    respuesta.end(
      JSON.stringify({
        mensaje: "¡Hola desde el nuevo endpoint!"
      })
    );
    return;
  }

  // --- NUEVO ENDPOINT POST /api/mensaje ---
  if (solicitud.method === "POST" && solicitud.url === "/api/mensaje") {
    let cuerpo = "";

    // Escuchar la llegada de fragmentos de datos (chunks)
    solicitud.on("data", (chunk) => {
      cuerpo += chunk.toString();
    });

    // Una vez recibidos todos los datos
    solicitud.on("end", () => {
      const datosEntrada = JSON.parse(cuerpo || "{}");

      respuesta.writeHead(201);
      respuesta.end(
        JSON.stringify({
          recibido: datosEntrada.mensaje ?? ""
        })
      );
    });
    return;
  }

  // Ruta por defecto (404)
  respuesta.writeHead(404);
  respuesta.end(
    JSON.stringify({
      error: "Recurso no encontrado"
    })
  );
};

export const servidor = createServer(requestListener);

if (process.argv[1] && process.argv[1].endsWith("servidor.js")) {
  const puerto = Number(process.env.PORT ?? 3000);
  servidor.listen(puerto, () => {
    console.log(`Servidor disponible en http://localhost:${puerto}`);
  });
}