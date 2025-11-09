// Simplified server that works with Node v24
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log('');
  console.log('========================================');
  console.log(`EdConnect is running!`);
  console.log(`Open your browser to: http://localhost:${port}`);
  console.log('========================================');
  console.log('');
  console.log('NOTE: This is a simplified version for demo purposes.');
  console.log('The AI tutor backend is not running in this mode.');
  console.log('');
});
