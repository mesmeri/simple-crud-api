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

  getOne<T extends keyof User>(parameter: T, value: User[T]): Promise<User> {
    return new Promise((resolve, reject) => {
      const user = this.storage.find((item) => item[parameter] === value);

      if (user) {
        resolve(user);
      } else {
        reject();
      }
    });
  }

  addOne(record: Omit<User, "id">): Promise<User> {
    return new Promise((resolve, reject) => {
      const id = uuidv4();

      this.storage.push({ id, ...record });

      const user = this.storage.find((item) => item.id === id);

      if (user) {
        resolve(user);
      } else {
        reject();
      }
    });
  }

  removeOne(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const ind = this.storage.findIndex((el) => el.id === id);

      if (ind !== -1) {
        const removedRecordId = this.storage.splice(ind, 1)[0].id;

        resolve(removedRecordId);
      } else {
        reject();
      }
    });
  }

  updateOne(id: string, record: Omit<User, "id">): Promise<User> {
    return new Promise((resolve, reject) => {
      const ind = this.storage.findIndex((el) => el.id === id);

      if (ind !== -1) {
        const updatedRecord = { ...record, id };

        this.storage.splice(ind, 1, updatedRecord);

        const newRecord = this.storage.find((el) => el.id === id);

        if (newRecord) {
          resolve(newRecord);
        } else {
          reject();
        }
      }

      reject();
    });
  }
}

export default UsersDatabase;
