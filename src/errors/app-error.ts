import { HTTPStatusCode } from "../types";

class AppError extends Error {
  code: HTTPStatusCode;
  friendlyMessage: string;

  constructor(code: HTTPStatusCode, message: string) {
    super();
    this.code = code;
    this.friendlyMessage = message;
  }
}

export default AppError;
