import net from 'net';
import fs from 'fs';

// Obtenemos la ruta del archivo y la opción desde la línea de comandos
const [filePath, option] = process.argv.slice(2);

// Validamos que se proporcionaron la ruta del archivo y la opción
if (!filePath || !option) {
  console.error('Por favor, proporciona la ruta del archivo y la opción (words, lines, chars).');
  process.exit(1);
}

// Validamos la existencia del fichero
if (!fs.existsSync(filePath)) {
  console.error(`El archivo ${filePath} no se encontró.`);
  process.exit(1);
}

// Creamos una conexión TCP al servidor en el puerto 3000
const client = net.createConnection({ port: 3000 }, () => {
  console.log('Conectado al servidor.');

  // Enviamos la ruta del archivo y la opción al servidor
  client.write(`${filePath} ${option}`);
});

// Manejamos datos recibidos del servidor
client.on('data', data => {
  const response = data.toString().trim();
  console.log(response);

  // Terminamos la conexión y la ejecución después de recibir la respuesta
  client.end();
});

// Manejamos errores de conexión
client.on('error', error => {
  console.error('Error de conexión:', error);
  process.exit(1);
});
