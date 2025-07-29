import express from 'express';
import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function configureServer(server) {
  // Use Vite's built-in middleware handling
  server.middlewares.use(express.json());

  server.middlewares.use('/api/save-equipment', async (req, res) => {
    if (req.method !== 'POST') {
      res.statusCode = 405;
      return res.end('Method not allowed');
    }

    try {
      const filePath = resolve(__dirname, 'public', 'equipment_data.json');
      await writeFile(filePath, JSON.stringify(req.body, null, 2));
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true }));
    } catch (error) {
      console.error('Error saving data:', error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Failed to save data' }));
    }
  });
}
