
import { Request, Response } from 'express';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import { Skill } from '../entity/Skill';
import { Qualification } from 'src/entity/Qualification';
import { Experience } from 'src/entity/Experience';

/**
 * UserController handles all HTTP requests related to courses
 * Provides CRUD (Create, Read, Update, Delete) operations for course resources
 */
export class UserController {
  private userRepo = AppDataSource.getRepository(User);
  private skillRepo = AppDataSource.getRepository(Skill);
  private qualificationRepo = AppDataSource.getRepository(Qualification);
  private experienceRepo = AppDataSource.getRepository(Experience);


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

  /**
   * Retrieves all skills from a user in the database
   * @param req - Express request object
   * @param res - Express response object
   * @returns array of skills 
   */
  async getUserSkills(req: Request, res: Response) {
    const { email } = req.params;
    const user = await this.userRepo.findOne({ where: { email }, relations: ['skills'] });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.skills);
}

  /**
   * Retrieves all qualifications from a user in the database
   * @param req - Express request object
   * @param res - Express response object
   * @returns array of qualifications
   */
  async getUserQualifications(req: Request, res: Response) {
    const { email } = req.params;
    const user = await this.userRepo.findOne({ where: { email }, relations: ['qualifications'] });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.qualifications);
  }


  /**
   * Retrieves all experiences from a user in the database
   * @param req - Express request object
   * @param res - Express response object
   * @returns array of experiences
   */
  async getUserExperiences(req: Request, res: Response) {
    const { email } = req.params;
    const user = await this.userRepo.findOne({ where: { email }, relations: ['experiences'] });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.experiences);
  }

  /**
   * adds a skill to a user in the database
   * @param req - Express request object
   * @param res - Express response object
   * @returns 204 status on success or 404 if user not found
   */

  async addSkillToUser(req: Request, res: Response) {
    const { email } = req.params;

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user){ 
      return res.status(404).json({ error: 'User not found' })
    };

    const skill = this.skillRepo.create({ ...req.body, user });
    const result = await this.skillRepo.save(skill);

    return res.status(201).json(result);
  }
 

  /**
   * adds a qualification to a user in the database
   * @param req - Express request object
   * @param res - Express response object
   * @returns 204 status on success or 404 if user not found
   */
  async addQualificationToUser(req: Request, res: Response) {
    const { email } = req.params;

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user){ 
      return res.status(404).json({ error: 'User not found' })
    };

    const qualification = this.qualificationRepo.create({ ...req.body, user });
    const result = await this.qualificationRepo.save(qualification);

    return res.status(201).json(result);
  }

    

  /**
   * adds an experience to a user in the database
   * @param req - Express request object
   * @param res - Express response object
   * @returns 204 status on success or 404 if user not found
   */
  async addExperienceToUser(req: Request, res: Response) {
    const { email } = req.params;

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    };

    const experience = this.experienceRepo.create({ ...req.body, user });
    const result = await this.experienceRepo.save(experience);

    return res.status(201).json(result);
  }

 // todo delete experience, qualification , skill from user
  /**
   * adds an experience based on experience ID
   * @param req - Express request object
   * @param res - Express response object
   * @returns 204 status on success or 404 if user not found
   */
  async deleteExperience(req: Request, res: Response) {
    const { id } = req.params; // experience ID
    const result = await this.experienceRepo.delete({ id: parseInt(id) });
    if (!result.affected) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    return res.status(204).send();
  }

  /**
   * adds an qualification based on qualification ID
   * @param req - Express request object
   * @param res - Express response object
   * @returns 204 status on success or 404 if user not found
   */
  async deleteQualification(req: Request, res: Response) {
    const { id } = req.params; // qualification ID
    const result = await this.qualificationRepo.delete({ id: parseInt(id) });
    if (!result.affected) {
      return res.status(404).json({ error: 'Qualification not found' });
    }
    return res.status(204).send();
  }

  /**
   * adds an skill based on skill ID
   * @param req - Express request object
   * @param res - Express response object
   * @returns 204 status on success or 404 if user not found
   */
  async deleteSkill(req: Request, res: Response) {
    const { id } = req.params; // skill ID
    const result = await this.skillRepo.delete({ id: parseInt(id) });
    if (!result.affected) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    return res.status(204).send();
  }




}
