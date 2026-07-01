const http = require('http');
const https = require('https');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const authUrl =
  `https://www.linkedin.com/oauth/v2/authorization` +
  `?response_type=code` +
  `&client_id=${config.clientId}` +
  `&redirect_uri=${encodeURIComponent(config.redirectUri)}` +
  `&scope=${config.scopes.join('%20')}`;

console.log('\nAbriendo LinkedIn en el navegador...');
console.log('Si no se abre, copia esta URL:\n' + authUrl + '\n');
exec(`start "" "${authUrl}"`);

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost:8000');
  const code = url.searchParams.get('code');

  if (!code) {
    res.end('Error: no se recibió el código.');
    return;
  }

  res.end('<h2>Autorizado. Puedes cerrar esta pestaña.</h2>');
  server.close();

  console.log('Código recibido. Obteniendo token...');
  getToken(code);
});

server.listen(8000, () => {
  console.log('Esperando autorización en http://localhost:8000/callback ...');
});

function getToken(code) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.redirectUri,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  }).toString();

  const options = {
    hostname: 'www.linkedin.com',
    path: '/oauth/v2/accessToken',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      const token = JSON.parse(data);
      if (!token.access_token) {
        console.error('Error obteniendo token:', data);
        return;
      }
      const tokenPath = path.join(__dirname, 'token.json');
      fs.writeFileSync(tokenPath, JSON.stringify(token, null, 2));
      console.log('\nToken guardado en linkedin/token.json');
      console.log('Expira en:', Math.round(token.expires_in / 3600), 'horas');
      console.log('\nYa puedes usar publicar.js');
    });
  });

  req.on('error', (e) => console.error('Error:', e.message));
  req.write(body);
  req.end();
}
