import UsersDatabase from "../db/users-database";
import { User } from "../types";

class UsersRepository {
  db: UsersDatabase;

  constructor() {
    this.db = new UsersDatabase();
  }

  async getAll() {
    return await this.db.getAll();
  }

  async add(user: Omit<User, "id">): Promise<User> {
    const record = await this.db.addOne(user);
    return record;
  }

  async getById(id: string): Promise<User | undefined> {
    const user = await this.db.getOne("id", id);
    return user;
  }

  async updateUser(
    id: string,
    user: Omit<User, "id">
  ): Promise<User | undefined> {
    const updatedRecord = await this.db.updateOne(id, user);
    return updatedRecord;
  }

  async removeUser(id: string): Promise<string | undefined> {
    const deletedUserId = await this.db.removeOne(id);
    return deletedUserId;
  }
}

export default UsersRepository;
