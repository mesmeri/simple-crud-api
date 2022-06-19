import { IncomingMessage, ServerResponse } from "http";
import UsersService from "./services/users-service";
import { HTTPMethod, HTTPStatusCode } from "./types";

const usersService = new UsersService();

const requestListener = async (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;
  const baseURL = `http://${req.headers.host}/`;
  const { pathname } = new URL(url || "", baseURL);
  const splittedPath = pathname.split("/");
  const [apiPath, model, modelId] = splittedPath.filter((el) => el);

  if (!method || apiPath !== "api" || model !== "users") {
    res.writeHead(HTTPStatusCode.NOT_FOUND);
    res.end(
      JSON.stringify({
        success: false,
        message: "This path or HTTP method is not supported",
      })
    );
    return;
  }

  res.setHeader("Content-Type", "application/json");

  if (typeof modelId === "undefined") {
    // path looks like '/users'
    switch (method) {
      case HTTPMethod.GET: {
        try {
          const users = await usersService.getAllUsers();

          res.writeHead(HTTPStatusCode.OK);
          res.end(JSON.stringify({ success: true, data: users }));
        } catch (e) {
          res.end(JSON.stringify({ success: false, error: e }));
        }
        break;
      }
      case HTTPMethod.POST: {
        let body = "";

        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", async () => {
          try {
            const user = UsersService.validate(JSON.parse(body));
            const record = await usersService.create(user);

            res.writeHead(HTTPStatusCode.CREATED);
            res.end(JSON.stringify({ success: true, data: record }));
          } catch (e) {
            res.end(JSON.stringify({ success: false, error: e }));
          }
        });
        break;
      }
      default: {
        res.writeHead(HTTPStatusCode.BAD_REQUEST);
        res.end(
          JSON.stringify({
            success: false,
            error: { message: "This method is not allowed" },
          })
        );
      }
    }
  } else {
    // path looks like '/users/12345
    switch (method) {
      case HTTPMethod.GET: {
        try {
          const user = await usersService.getUserById(modelId);

          res.writeHead(HTTPStatusCode.OK);
          res.end(JSON.stringify({ success: true, data: user }));
        } catch (e) {
          res.end(JSON.stringify({ success: false, error: e }));
        }
        break;
      }
      case HTTPMethod.PUT: {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", async () => {
          try {
            const user = UsersService.validate(JSON.parse(body));
            const record = await usersService.update(modelId, user);

            res.writeHead(200);
            res.end(JSON.stringify({ success: true, data: record }));
          } catch (e) {
            res.end(JSON.stringify({ success: false, error: e }));
          }
        });
        break;
      }
      case HTTPMethod.DELETE: {
        try {
          await usersService.remove(modelId);

          res.writeHead(HTTPStatusCode.NO_CONTENT);
          res.end(JSON.stringify({ success: true }));
        } catch (e) {
          res.end(JSON.stringify({ success: false, error: e }));
        }
        break;
      }
      default: {
        res.writeHead(HTTPStatusCode.BAD_REQUEST);
        res.end(
          JSON.stringify({
            success: false,
            error: { message: "This method is not allowed" },
          })
        );
      }
    }
  }
};

export default requestListener;
