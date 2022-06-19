import { v4 as uuidv4 } from "uuid";

interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

class Database {
  storage: any[];

  constructor() {
    this.storage = [];
  }

  getAll() {
    return [...this.storage];
  }

  getOne<T extends keyof User>(parameter: T, value: User[T]) {
    return this.storage.find((item) => item[parameter] === value);
  }

  addOne(record: Omit<User, "id">) {
    const storageLength = this.storage.push({ id: uuidv4(), ...record });

    return this.storage[storageLength - 1];
  }

  removeOne(id: string) {
    const ind = this.storage.findIndex((el) => el.id === id);

    if (ind !== -1) {
      const removedRecord = this.storage.splice(ind, 1)[0];

      return removedRecord;
    }
  }

  updateOne(id: string, record: User) {
    const ind = this.storage.findIndex((el) => el.id === id);

    if (ind !== -1) {
      const updatedRecord = { ...record, id };
      this.storage.splice(ind, 1, updatedRecord);

      return this.storage.find((el) => el.id === id);
    }
  }
}
