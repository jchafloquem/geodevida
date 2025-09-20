import fs from "fs";
import path from "path";

// Carpeta base (ajústala si tus estilos están en otro lado)
const baseDir = path.join(process.cwd(), "src");

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  // Buscar bloques @keyframes
  const regexKeyframes = /@keyframes\s+[^{]+\{([\s\S]*?)\}/g;
  let match;
  while ((match = regexKeyframes.exec(content)) !== null) {
    const keyframeBody = match[1];
    const lines = keyframeBody.split("\n");
    lines.forEach((line, i) => {
      // Buscar líneas que tienen solo "%" como selector
      if (/^\s*%\s*\{/.test(line)) {
        console.log(`⚠️  Selector inválido en ${filePath}:${i + 1}:`);
        console.log("   " + line.trim());
      }
    });
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith(".scss") || fullPath.endsWith(".css")) {
      checkFile(fullPath);
    }
  });
}

// Ejecutar
console.log("🔎 Buscando errores en @keyframes...");
walkDir(baseDir);
console.log("✅ Revisión terminada");
