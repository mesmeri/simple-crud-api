import "dotenv/config";
import http from "http";
import cluster from "cluster";
import { cpus } from "os";
import requestListener from "./request-listener";

const mode = process.env.MODE;
const port = process.env.PORT || 4000;

if (mode === "multi") {
  const numCPUs = cpus().length;

  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    const server = http.createServer(requestListener);

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    console.log(`Worker ${process.pid} started`);
  }
} else {
  const server = http.createServer(requestListener);

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
