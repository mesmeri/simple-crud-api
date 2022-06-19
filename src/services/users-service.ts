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

  public create(user: Omit<User, "id">): Promise<User> {
    const record = this.repo.add(user);

    return record;
  }

  public getUserById(id: string): Promise<User | undefined> {
    const isIdValid = uuid.validate(id);

    if (!isIdValid) {
      throw new AppError(HTTPStatusCode.BAD_REQUEST, "UUID is not valid");
    }

    const user = this.repo.getById(id);

    if (!user) {
      throw new AppError(
        HTTPStatusCode.NOT_FOUND,
        `User with id ${id} not found`
      );
    }

    return user;
  }

  public update(id: string, user: Omit<User, "id">): Promise<User | undefined> {
    const isIdValid = uuid.validate(id);

    if (!isIdValid) {
      throw new AppError(HTTPStatusCode.BAD_REQUEST, "UUID is not valid");
    }

    const record = this.repo.updateUser(id, user);

    if (!record) {
      throw new AppError(
        HTTPStatusCode.NOT_FOUND,
        "Unable to update, no such person in the database"
      );
    }

    return record;
  }

  public remove(id: string) {
    const isIdValid = uuid.validate(id);

    if (!isIdValid) {
      throw new AppError(HTTPStatusCode.BAD_REQUEST, "UUID is not valid");
    }

    return this.repo.removeUser(id);
  }
}

export default UsersService;
