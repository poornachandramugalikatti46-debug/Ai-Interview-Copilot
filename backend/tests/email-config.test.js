const assert = require('assert');
const path = require('path');

const repoRoot = path.join(__dirname, '..', '..');
const backendDir = path.join(__dirname, '..');

process.chdir(repoRoot);
delete process.env.EMAIL_USER;
delete process.env.EMAIL_PASS;
delete process.env.RESEND_API_KEY;

const sendWelcomeEmail = require(path.join(backendDir, 'utils', 'sendEmail'));

assert.ok(
  process.env.EMAIL_USER || process.env.RESEND_API_KEY,
  'Email credentials should be loaded from the backend .env file when the app is started from the workspace root'
);

console.log('Email config test passed');

module.exports = sendWelcomeEmail;
