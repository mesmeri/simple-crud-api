import { IncomingMessage, ServerResponse } from "http";
import { HTTPStatusCode } from "../types";
import AppError from "./app-error";

const processError = (e: unknown, res: ServerResponse) => {
  if (e instanceof AppError) {
    res.writeHead(e.code);
    res.end(JSON.stringify({ success: false, message: e.friendlyMessage }));
    return;
  }

  res.writeHead(HTTPStatusCode.INTERNAL_SERVER);
  res.end(
    JSON.stringify({ success: false, message: "Error processing request" })
  );
};

export default processError;
