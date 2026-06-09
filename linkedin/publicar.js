const https = require('https');
const fs = require('fs');
const path = require('path');

const tokenPath = path.join(__dirname, 'token.json');

if (!fs.existsSync(tokenPath)) {
  console.error('No hay token. Ejecuta primero: node linkedin/oauth.js');
  process.exit(1);
}

const { access_token } = JSON.parse(fs.readFileSync(tokenPath));

// Texto del post — edítalo antes de publicar
const TEXTO = process.argv[2] || `¿Qué dice la ciencia sobre la procrastinación?

No es falta de voluntad. Es regulación emocional.

Evitamos las tareas que nos generan ansiedad, aburrimiento o frustración — no las que son difíciles. La clave no es forzarte, sino reducir la carga emocional de empezar.

Lo explicamos en La Inferencia 👇
https://lainferencia.com`;

function getUserId(token, callback) {
  const options = {
    hostname: 'api.linkedin.com',
    path: '/v2/userinfo',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  https.get(options, (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      const user = JSON.parse(data);
      callback(user.sub);
    });
  });
}

function publicarPost(token, personId, texto) {
  const body = JSON.stringify({
    author: `urn:li:person:${personId}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: texto },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  });

  const options = {
    hostname: 'api.linkedin.com',
    path: '/v2/ugcPosts',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      'X-Restli-Protocol-Version': '2.0.0',
    },
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      if (res.statusCode === 201) {
        console.log('\nPost publicado con exito en LinkedIn.');
      } else {
        console.error('\nError al publicar:', res.statusCode, data);
      }
    });
  });

  req.on('error', (e) => console.error('Error:', e.message));
  req.write(body);
  req.end();
}

getUserId(access_token, (personId) => {
  console.log(`Publicando como: urn:li:person:${personId}`);
  publicarPost(access_token, personId, TEXTO);
});
