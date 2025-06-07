
import { Request, Response } from 'express';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';

export class UserController {
  private userRepo = AppDataSource.getRepository(User);

    /**
   * Creates a new user record
   * @param req - Express request object containing user date in body
   * @param res - Express response object
   * @returns JSON object of the created user with 201 status
   */
  async createUser(req: Request, res: Response) {
    /** Create a new user object from the request body */
    const user = this.userRepo.create(req.body);

    /** Save the new user to the database */
    try {
      await this.userRepo.save(user);
    } catch (error) {
      return res.status(500).json({ message: "Error saving user", error });
    }

    /** Return the created user with a 201 status */
    res.status(201).json(user);
 }

  /**
   * Retrieves all users from the database
   * @param req - Express request object
   * @param res - Express response object
   * @returns JSON array of all users
   */
  async getAll(req: Request, res: Response) {
    const users = await this.userRepo.find();
    res.json(users);
  }

  /**
   * Retrieves a single user by email
   * @param req - Express request object containing email in params
   * @param res - Express response object
   * @returns JSON object of the user or 404 if not found
   */
  async getUserByEmail(req: Request, res: Response) {

    const user = await this.userRepo.findOneBy({
      email: req.params.email,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  }

  /**
   * Updates an existing user record
   * @param req - Express request object containing email in params and update data in body
   * @param res - Express response object
   * @returns JSON object of the updated user or 404 if not found
   */
  async update(req: Request, res: Response) {
    /** Retrieve the user from the database */
    let user = await this.userRepo.findOneBy({
      email: req.params.id,
    });

    /** Check if the user exists, if not, return a 404 error */
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /** Merge the existing user with the new data from the request body */
    this.userRepo.merge(user, req.body);

    /** Save the updated user to the database */
    try {
      await this.userRepo.save(user);
    } catch (error) {
      return res.status(500).json({ message: "Error saving user", error });
    }

    /** Return the updated user */
    res.json(user);
  }


  /**
   * Deletes a user record
   * @param req - Express request object containing user in params
   * @param res - Express response object
   * @returns 204 status on success or 404 if user not found
   */
  async delete(req: Request, res: Response) {
    /** Delete the user from the database */
    const result = await this.userRepo.delete({
      email: req.params.id,
    });

    /** Check if the user was deleted, if not, return a 404 error */
    if (!result.affected) {
      return res.status(404).json({ message: "User not found" });
    }

    /** Return a 204 status on success */
    res.status(204).send();
  }
}
