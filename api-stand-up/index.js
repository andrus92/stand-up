import http from "node:http";
import fs from "node:fs/promises";

const PORT = 8080;
const COMEDIANS = './comedians.json';
const CLIENTS = './clients.json';

const checkFiles = async () => {
  try {
    await fs.access(COMEDIANS);
  } catch (error) {
    console.log(`File ${COMEDIANS} is not found`);
    return false;
  }

  try {
    await fs.access(CLIENTS);
  } catch (error) {
    await fs.writeFile(CLIENTS, JSON.stringify([]));
  }

  return true;
}

const sendData = async (res, data) => {
  res.writeHead(200, {
    'Content-Type': 'text/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(data);
}

const sendError = async (res, statusCode, errMsg) => {
  res.writeHead(statusCode, {
    'Content-Type': 'text/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(errMsg);
}

const startServer = async () => {
  if (!(await checkFiles())) {
    return;
  }

  http.createServer(async (req, res) => {
    const segments = req.url.split('/').filter(Boolean);
    console.log(segments);

    try {
      if (req.method === 'GET' && segments[0] === 'comedians') {
        const data = await fs.readFile(COMEDIANS, 'utf-8');
  
        if (segments.length === 2) {
          const comedian = JSON.parse(data).find(c => c.id === segments[1]);
          if (!comedian) {
            sendError(res, 404, 'Comedian not found');
            return;
  
          }
          sendData(res, JSON.stringify(comedian));
          return;
        }
        sendData(res, data);
      } // POST /clients
      else if (req.method === 'POST' && segments[0] === 'clients')  {
  
      } // GET /clients/:ticket
      else if (req.method === 'GET' && segments[0] === 'clients' && segments.length === 2)  {
  
      } // PATCH /clients/:ticket
      else if (req.method === 'PATCH' && segments[0] === 'clients' && segments.length === 2)  {
  
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