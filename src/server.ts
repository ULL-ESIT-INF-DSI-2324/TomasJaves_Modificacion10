import net from 'net';
import { spawn } from 'child_process';

// Creamos el servidor escuchando en el puerto 60300
const server = net.createServer(connection => {
  console.log('Cliente conectado.');

  // Manejamos datos recibidos del cliente
  connection.on('data', data => {
    const [filePath, option] = data.toString().trim().split(' ');

    // Validamos que se proporcionó la ruta del archivo y la opción
    if (!filePath || !option) {
      connection.write('Por favor, proporciona la ruta del archivo y la opción (words, lines, chars).\n');
      return;
    }

    // Función para obtener el parámetro de wc según la opción
    function getWcParameter(option: string) {
      switch (option) {
        case 'lines':
          return '-l';
        case 'words':
          return '-w';
        case 'chars':
          return '-c';
        default:
          connection.write('Opción no válida. Por favor, elige entre "words", "lines" o "chars".\n');
          return;
      }
    }

    // Obtenemos el parámetro de wc según la opción
    const wcParameter = getWcParameter(option);

    // Si no se proporcionó una opción válida, no ejecutar el comando 'wc'
    if (!wcParameter) {
      return;
    }

    // Ejecutamos el comando 'wc' en un proceso secundario
    const wcProcess = spawn('wc', [wcParameter, filePath]);

    // Capturamos la salida del proceso 'wc' y enviarla al cliente
    wcProcess.stdout.on('data', output => {
      connection.write(output.toString());
    });

    // Capturamos errores si el archivo no se encuentra o no se puede leer
    wcProcess.stderr.on('data', error => {
      connection.write(error.toString());
    });
  });

  // Manejamos la desconexión del cliente
  connection.on('end', () => {
    console.log('Cliente desconectado.');
  });
});

server.listen(3000, () => {
  console.log('Servidor esperando conexiones...');
});
