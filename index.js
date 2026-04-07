const http = require("http");
const _ = require("lodash");

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`App running with lodash: ${_.capitalize("hello world CI Cd Working")}\n`);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});