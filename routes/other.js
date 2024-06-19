import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const router =express.Router();

router.get('/download', (req, res) => {
    const filePath = path.join(__dirname,'..', 'log.txt');
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error sending file');
        }
    });
});

router.delete('/clearlog', async (req, res) => {
    const filePath = path.join(__dirname,'..', 'log.txt');
    try {
        await fs.unlink(filePath);
        res.send('Log file deleted successfully');
    } catch (err) {
        console.error('Error deleting file:', err);
        res.status(500).send('Error deleting file');
    }
});
  



export default router;