import http from "node:http";
import fs from "node:fs/promises";
import { sendData, sendError } from "./modules/send.js";
import { checkFile } from "./modules/checkFile.js";
import { handleGetCommedians, handleAddClient, handleGetClients, handleUpdateClient } from "./modules/handlers.js";

const PORT = 8080;
const COMEDIANS = './comedians.json';
export const CLIENTS = './clients.json';

const startServer = async () => {


  if (!await checkFile(COMEDIANS)) {
    return;
  }

  await checkFile(CLIENTS, true);
  const comediansData = await fs.readFile(COMEDIANS, 'utf-8');
  const comedians = JSON.parse(comediansData);

  http.createServer(async (req, res) => {
    const segments = req.url.split('/').filter(Boolean);

    try {
      if (req.method === 'GET' && segments[0] === 'comedians') {
        handleGetCommedians(req, res, comedians, segments);
        return;
      } // POST /clients
      else if (req.method === 'POST' && segments[0] === 'clients')  {
        const ticket = segments[1];
        handleAddClient(req, res, ticket);
        return;
      } // GET /clients/:ticket
      else if (req.method === 'GET' && segments[0] === 'clients' && segments.length === 2)  {
        const ticket = segments[1];
        handleGetClients(req, res, ticket);
      } // PATCH /clients/:ticket
      else if (req.method === 'PATCH' && segments[0] === 'clients' && segments.length === 2)  {
        const ticket = segments[1];
        handleUpdateClient(req, res, ticket);
      }
      else {
        sendError(res, 404, 'Not found');
      }
    } catch (err) {
      sendError(res, 500, `Server error: ${err}`);
    }
  }).listen(PORT);

  console.log(`The sever has been started on port ${PORT}`);
}

startServer();