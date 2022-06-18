import "dotenv/config";
import http from "http";

const server = http.createServer((req, res) => {
  const { method } = req;
  const baseURL = `http://${req.headers.host}/`;

  res.end(
    JSON.stringify({
      success: true,
      message: `The method is ${method}, base url is ${baseURL}`,
    })
  );
});

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
