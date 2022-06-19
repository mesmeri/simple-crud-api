import { IncomingMessage, ServerResponse } from "http";
import AppError from "./errors/app-error";
import processError from "./errors/process-error";
import UsersService from "./services/users-service";
import { HTTPMethod, HTTPStatusCode } from "./types";

const usersService = new UsersService();

const requestListener = async (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;
  const baseURL = `http://${req.headers.host}/`;
  const { pathname } = new URL(url || "", baseURL);
  const splittedPath = pathname.split("/");
  const [apiPath, model, modelId] = splittedPath.filter((el) => el);

  res.setHeader("Content-Type", "application/json");

  if (!method || apiPath !== "api" || model !== "users") {
    res.writeHead(HTTPStatusCode.NOT_FOUND);
    res.end(
      JSON.stringify({
        success: false,
        message: "This route or HTTP method is not supported",
      })
    );
    return;
  }

  try {
    if (typeof modelId === "undefined") {
      // path looks like '/users'
      switch (method) {
        case HTTPMethod.GET: {
          const users = await usersService.getAllUsers();

          res.writeHead(HTTPStatusCode.OK);
          res.end(JSON.stringify({ success: true, data: users }));
          break;
        }

        case HTTPMethod.POST: {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const payload = JSON.parse(body);
              const user = UsersService.validate(payload);
              const record = await usersService.create(user);

              res.writeHead(HTTPStatusCode.CREATED);
              res.end(JSON.stringify({ success: true, data: record }));
            } catch (e) {
              processError(e, res);
            }
          });
          break;
        }

        default: {
          throw new AppError(
            HTTPStatusCode.BAD_REQUEST,
            "This method is not allowed"
          );
        }
      }
    } else {
      // path looks like '/users/12345
      switch (method) {
        case HTTPMethod.GET: {
          const user = await usersService.getUserById(modelId);

          res.writeHead(HTTPStatusCode.OK);
          res.end(JSON.stringify({ success: true, data: user }));
          break;
        }

        case HTTPMethod.PUT: {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const payload = JSON.parse(body);
              const user = UsersService.validate(payload);
              const record = await usersService.update(modelId, user);

              res.writeHead(HTTPStatusCode.OK);
              res.end(JSON.stringify({ success: true, data: record }));
            } catch (e) {
              processError(e, res);
            }
          });
          break;
        }

        case HTTPMethod.DELETE: {
          await usersService.remove(modelId);

          res.writeHead(HTTPStatusCode.NO_CONTENT);
          res.end(JSON.stringify({ success: true }));
          break;
        }

        default: {
          throw new AppError(
            HTTPStatusCode.BAD_REQUEST,
            "This method is not allowed"
          );
        }
      }
    }
  } catch (e) {
    processError(e, res);
  }
};

export default requestListener;
