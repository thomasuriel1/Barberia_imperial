// dev.js
// Esto es un ejemplo del API nativo de Bun para servir archivos

Bun.serve({
  fetch(req) {
    const url = new URL(req.url);

    // Si la URL es la raíz, servimos index.html
    if (url.pathname === "/") {
      const file = Bun.file("index.html");
      return new Response(file);
    } 
    
    // Servir otros archivos (CSS, JS)
    try {
      const file = Bun.file(url.pathname.substring(1));
      if (file) {
        return new Response(file);
      }
    } catch (e) {
      // Archivo no encontrado
    }

    // Respuesta 404
    return new Response("404!", { status: 404 });
  },
  port: 3000,
  hostname: "0.0.0.0",
});

console.log(`🚀 Servidor de Bun corriendo en http://localhost:3000`);