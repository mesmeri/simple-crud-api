import { HTTPStatusCode, User } from "./../types/index";
import AppError from "../errors/app-error";
import UsersRepository from "../repositories/users-repository";
import * as uuid from "uuid";

class UsersService {
  repo: UsersRepository;

  constructor() {
    this.repo = new UsersRepository();
  }

  static validate(dataToSave: Partial<User>): Omit<User, "id"> {
    const { username, age, hobbies } = dataToSave;

    if (typeof username === "undefined") {
      throw new AppError(
        HTTPStatusCode.BAD_REQUEST,
        "Username is required parameter"
      );
    }

    if (typeof username !== "string") {
      throw new AppError(
        HTTPStatusCode.BAD_REQUEST,
        "Username must be a string"
      );
    }

    if (typeof age === "undefined") {
      throw new AppError(
        HTTPStatusCode.BAD_REQUEST,
        "Age is required parameter"
      );
    }

    if (Number.isNaN(Number(age))) {
      throw new AppError(HTTPStatusCode.BAD_REQUEST, "Age must be a number");
    }

    if (typeof hobbies === "undefined") {
      throw new AppError(
        HTTPStatusCode.BAD_REQUEST,
        "Hobbies is required parameter"
      );
    }

    if (!Array.isArray(hobbies)) {
      throw new AppError(
        HTTPStatusCode.BAD_REQUEST,
        "Hobbies must be an array of strings"
      );
    }

    if (hobbies.some((el) => typeof el !== "string")) {
      throw new AppError(
        HTTPStatusCode.BAD_REQUEST,
        "Hobbies must include strings only"
      );
    }

    return {
      username,
      age,
      hobbies,
    };
  }

  public getAllUsers(): Promise<User[]> {
    const users = this.repo.getAll();

    return users;
  }

  public async create(user: Omit<User, "id">): Promise<User> {
    try {
      const record = await this.repo.add(user);
      return record;
    } catch {
      throw new AppError(
        HTTPStatusCode.INTERNAL_SERVER,
        "Unable to save record"
      );
    }
  }

  public async getUserById(id: string): Promise<User> {
    const isIdValid = uuid.validate(id);

    if (!isIdValid) {
      throw new AppError(HTTPStatusCode.BAD_REQUEST, "UUID is not valid");
    }

    try {
      const user = await this.repo.getById(id);
      return user;
    } catch {
      throw new AppError(
        HTTPStatusCode.NOT_FOUND,
        `User with id ${id} not found`
      );
    }
  }

  public async update(id: string, user: Omit<User, "id">): Promise<User> {
    const isIdValid = uuid.validate(id);

    if (!isIdValid) {
      throw new AppError(HTTPStatusCode.BAD_REQUEST, "UUID is not valid");
    }

    try {
      await this.repo.getById(id);
    } catch (e) {
      throw new AppError(
        HTTPStatusCode.NOT_FOUND,
        `No user with id ${id} in the database`
      );
    }

    try {
      const record = this.repo.updateUser(id, user);
      return record;
    } catch {
      throw new AppError(HTTPStatusCode.INTERNAL_SERVER, `Unable to update`);
    }
  }

  public async remove(id: string): Promise<string> {
    const isIdValid = uuid.validate(id);

    if (!isIdValid) {
      throw new AppError(HTTPStatusCode.BAD_REQUEST, "UUID is not valid");
    }

    try {
      const deletedUserId = await this.repo.removeUser(id);
      return deletedUserId;
    } catch {
      throw new AppError(
        HTTPStatusCode.NOT_FOUND,
        `Unable to delete, no user with id ${id} in the database`
      );
    }
  }
}

export default UsersService;
