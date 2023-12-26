import fs from "node:fs/promises";
import { sendData, sendError } from "./send.js";
import { CLIENTS } from "../index.js";

export const handleGetCommedians = async (req, res, comedians, segments) => {

  if (segments.length === 2) {
    const comedian = comedians.find(c => c.id === segments[1]);
    if (!comedian) {
      sendError(res, 404, 'Comedian not found');
      return;

    }
    sendData(res, comedian);
    return;
  }
  sendData(res, comedians);
}

export const handleAddClient = (req, res, ticket) => {
  let body = '';
  try {
    req.on('data', chunk => {
      body += chunk;
    });
  } catch(error) {
    console.log('Error while reading the query');
    sendError(res, 500, 'Error while reading the query');
  }
  req.on('end', async () => {
    try {
      const newClient = JSON.parse(body);
      if (   !newClient.fullName
          || !newClient.phone
          || !newClient.ticketNumber
          || !newClient.booking) {
        sendError(res, 400, 'Wrong data of the client');
        return;
      }

      if (!Array.isArray(newClient.booking) || !newClient.booking.length || !newClient.booking.every(item => item.comedian && item.time)) {
        sendError(res, 400, 'Wrong data of the booking');
        return;
      }

      const clientData = await fs.readFile(CLIENTS, 'utf-8');
      const clients = JSON.parse(clientData);

      clients.push(newClient);

      await fs.writeFile(CLIENTS, JSON.stringify(clients), 'utf-8');
      sendData(res, newClient);


      sendData(res, newClient);
    } catch (error) {

    }
  });
}


export const handleGetClients = async(req, res, ticket) => {
  try {
    const clientData = await fs.readFile(CLIENTS, 'utf-8');
    const clients = JSON.parse(clientData);

    const client = clients.find(c => c.ticketNumber === ticket);

    if (!client) {
      sendError(res, 404, 'There is no client with such a ticket');
      return;
    }

    sendData(res, client);


  } catch (error) {
    console.error(`handleGetClients server error: ${error}`);
    sendError(res, 500, 'handleGetClients server error');
  }
}

export const handleUpdateClient = (req, res, ticket) => {
  let body = '';
  try {
    req.on('data', chunk => {
      body += chunk;
    });
  } catch(error) {
    console.log('Error while reading the query');
    sendError(res, 500, 'Error while reading the query');
  }
  req.on('end', async () => {
    try {
      const updateData = JSON.parse(body);
      if (   !updateData.fullName
          || !updateData.phone
          || !updateData.ticketNumber
          || !updateData.booking) {
        sendError(res, 400, 'Wrong data of the client');
        return;
      }

      if (!Array.isArray(updateData.booking) || !updateData.booking.length || !updateData.booking.every(item => item.comedian && item.time)) {
        sendError(res, 400, 'Wrong data of the booking');
        return;
      }

      const clientData = await fs.readFile(CLIENTS, 'utf-8');
      const clients = JSON.parse(clientData);

      const clientIndex = clients.findIndex(c => c.ticketNumber === ticket);
      if (clientIndex === -1) {
        sendError(res, 404, 'There is no client with such a ticket');
        return;
      }

      clients[clientIndex] = {
        ...clients[clientIndex],
        ...updateData,
      }

      await fs.writeFile(CLIENTS, JSON.stringify(clients), 'utf-8');
      sendData(res, clients[clientIndex]);
    } catch (error) {
      console.error(`handleUpdateClient error: ${error}`);
      sendError(res, 404, 'handleUpdateClient error');
    }
  });
}

