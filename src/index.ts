import "dotenv/config";
import http from "http";
import requestListener from "./request-listener";

const server = http.createServer(requestListener);

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
