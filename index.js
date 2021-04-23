import express from 'express';
import accountsRouter from './routes/accounts.js';
import { promises as fs } from 'fs';
import logger from './logs.js';
import cors from 'cors';

const { writeFile, readFile } = fs;

global.logs = logger;
global.filename = 'accounts.json';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/account', accountsRouter);

app.listen(8080, async () => {
  try {
    await readFile(filename);
    console.log('File Accounts.json loaded');
    console.log('API Started');
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    writeFile(filename, JSON.stringify(initialJson))
      .then(() => {
        console.log('File Accounts.json created');
        console.log('API Started');
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
