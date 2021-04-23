import express from 'express';
import { promises as fs } from 'fs';

const router = express.Router();
const { readFile, writeFile } = fs;

router.post('/', async (req, res, next) => {
  try {
    let account = req.body;

    if (!account.balance == null || account.name) {
      throw new Error('Name e balance são obrigatórios');
    }

    const data = JSON.parse(await readFile(global.filename));

    account = {
      id: data.nextId++,
      name: account.name,
      balance: account.balance,
    };
    data.accounts.push(account);

    await writeFile(global.filename, JSON.stringify(data, null, 2));
    res.send(account);
    logs.info(`POST /account`);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.filename));
    delete data.nextId;
    res.send(data);
    logs.info(`GET /account`);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.filename));
    let account = data.accounts.find(
      (account) => account.id === parseInt(req.params.id)
    );
    // console.log(account);
    // if (account === undefined) throw new Error('Não Encontrado');
    // else
    res.send(account);

    logs.info(`GET /account/:id`);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.filename));
    data.accounts = data.accounts.filter(
      (account) => account.id !== parseInt(req.params.id)
    );
    await writeFile(global.filename, JSON.stringify(data, null, 2));
    res.end();
    logs.info(`DELETE /account/:id - ${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const account = req.body;

    if (!account.id || !account.name || account.balance == null) {
      throw new Error('Id, name e balance são obrigatórios');
    }

    const data = JSON.parse(await readFile(global.filename));
    const index = data.accounts.findIndex((acc) => acc.id === account.id);

    if (index === -1) {
      throw new Error('Registro não encontrado');
    }

    data.accounts[index] = account;
    await writeFile(global.filename, JSON.stringify(data, null, 2));
    res.send(account);
    logs.info(`PUT /account`);
  } catch (err) {
    next(err);
  }
});

router.patch('/updateBalance', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.filename));
    const account = req.body;
    const index = data.accounts.findIndex((acc) => acc.id === account.id);

    if (!account.id || account.balance == null) {
      throw new Error('Id e balance são obrigatórios');
    }

    if (index === -1) {
      throw new Error('Registro não encontrado');
    }

    data.accounts[index].balance = account.balance;
    await writeFile(global.filename, JSON.stringify(data, null, 2));
    res.send(data.accounts[index]);
    logs.info(`PATCH /account/updateBalance`);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  logs.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default router;
