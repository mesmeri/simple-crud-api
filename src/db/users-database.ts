import { v4 as uuidv4 } from "uuid";
import { User } from "../types";

class UsersDatabase {
  storage: User[];

  constructor() {
    this.storage = [];
  }

  getAll(): Promise<User[]> {
    return new Promise((resolve) => {
      resolve([...this.storage]);
    });
  }

  getOne<T extends keyof User>(
    parameter: T,
    value: User[T]
  ): Promise<User | undefined> {
    return new Promise((resolve) => {
      resolve(this.storage.find((item) => item[parameter] === value));
    });
  }

  addOne(record: Omit<User, "id">): Promise<User> {
    return new Promise((resolve) => {
      const storageLength = this.storage.push({ id: uuidv4(), ...record });

      resolve(this.storage[storageLength - 1]);
    });
  }

  removeOne(id: string): Promise<string | undefined> {
    return new Promise((resolve) => {
      const ind = this.storage.findIndex((el) => el.id === id);

      if (ind !== -1) {
        const removedRecordId = this.storage.splice(ind, 1)[0].id;

        resolve(removedRecordId);
      }
    });
  }

  updateOne(id: string, record: Omit<User, "id">): Promise<User | undefined> {
    return new Promise((resolve) => {
      const ind = this.storage.findIndex((el) => el.id === id);

      if (ind !== -1) {
        const updatedRecord = { ...record, id };
        this.storage.splice(ind, 1, updatedRecord);

        resolve(this.storage.find((el) => el.id === id));
      }
    });
  }
}

export default UsersDatabase;
