import http from "node:http";
import fs from "node:fs/promises";

const PORT = 8080;
const COMEDIANS = './comedians.json';

http.createServer(async (req, res) => {

  if (req.method === 'GET' && req.url === '/comedians') {

    try {

    } catch (error) {
      res.writeHead(500);
      res.end(`Server error ${error}`);
    }
    const data = await fs.readFile(COMEDIANS, 'utf-8');
    res.writeHead(200, {
      'Content-Type': 'text/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
  } else {
    console.log(2);
    res.writeHead(404);
    res.end("Not found");
  }
}).listen(PORT);