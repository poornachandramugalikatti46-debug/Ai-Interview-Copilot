const http = require('http');

const registerData = JSON.stringify({ fullname: 'Debug User', email: 'debuguser123@example.com', password: 'Password123!' });
const registerOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(registerData),
  },
};

const doRequest = (options, data) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

(async () => {
  try {
    const registerRes = await doRequest(registerOptions, registerData);
    console.log('REGISTER', registerRes.statusCode, registerRes.body);

    if (registerRes.statusCode === 201) {
      const loginData = JSON.stringify({ email: 'debuguser123@example.com', password: 'Password123!' });
      const loginOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(loginData),
        },
      };

      const loginRes = await doRequest(loginOptions, loginData);
      console.log('LOGIN', loginRes.statusCode, loginRes.body);
    }
  } catch (err) {
    console.error('ERROR', err);
  }
})();
