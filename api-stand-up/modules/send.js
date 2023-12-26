export const sendData = async (res, data) => {
  res.writeHead(200, {
    'Content-Type': 'text/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

export const sendError = async (res, statusCode, errMsg) => {
  res.writeHead(statusCode, {
    'Content-Type': 'text/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(errMsg);
}