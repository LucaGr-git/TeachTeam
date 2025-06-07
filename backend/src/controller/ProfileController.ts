import { Request, Response } from "express";
import { Profile } from "../entity/Profile";
import { Pet } from "../entity/Pet";
import { AppDataSource } from "../data-source";

/**
 * ProfileController handles all HTTP requests related to user profiles
 * Provides CRUD operations for profiles and their associated pets
 */
export class ProfileController {
  /** Repository instance for database operations on Profile entity */
  private profileRepo = AppDataSource.getRepository(Profile);
  /** Repository instance for database operations on Pet entity */
  private petRepo = AppDataSource.getRepository(Pet);

  /**
   * Retrieves all profiles from the database
   * @param req - Express request object
   * @param res - Express response object
   * @returns JSON array of all profiles
   */
  async getAll(req: Request, res: Response) {
    const profiles = await this.profileRepo.find();
    res.json(profiles);
  }

  /**
   * Retrieves a single profile by profile_id
   * @param req - Express request object containing profile_id in params
   * @param res - Express response object
   * @returns JSON object of the profile or 404 if not found
   */
  async getOne(req: Request, res: Response) {
    const profile = await this.profileRepo.findOneBy({
      profile_id: parseInt(req.params.id),
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  }

  /**
   * Creates a new profile record
   * @param req - Express request object containing profile data in body
   * @param res - Express response object
   * @returns JSON object of the created profile with 201 status
   */
  async create(req: Request, res: Response) {
    /** Create a new profile object from the request body */
    const profile = this.profileRepo.create(req.body);

    /** Save the new profile to the database */
    try {
      await this.profileRepo.save(profile);
    } catch (error) {
      return res.status(500).json({ message: "Error saving profile", error });
    }

    /** Return the created profile with a 201 status */
    res.status(201).json(profile);
  }

  /**
   * Updates an existing profile record
   * @param req - Express request object containing profile_id in params and update data in body
   * @param res - Express response object
   * @returns JSON object of the updated profile or 404 if not found
   */
  async update(req: Request, res: Response) {
    /** Retrieve the profile from the database */
    let profile = await this.profileRepo.findOneBy({
      profile_id: parseInt(req.params.id),
    });

    /** Check if the profile exists, if not, return a 404 error */
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    /** Merge the existing profile with the new data from the request body */
    this.profileRepo.merge(profile, req.body);

    /** Save the updated profile to the database */
    try {
      await this.profileRepo.save(profile);
    } catch (error) {
      return res.status(500).json({ message: "Error saving profile", error });
    }

    /** Return the updated profile */
    res.json(profile);
  }

  /**
   * Deletes a profile record
   * @param req - Express request object containing profile_id in params
   * @param res - Express response object
   * @returns 204 status on success or 404 if profile not found
   */
  async delete(req: Request, res: Response) {
    /** Delete the profile from the database */
    const result = await this.profileRepo.delete({
      profile_id: parseInt(req.params.id),
    });

    /** Check if the profile was deleted, if not, return a 404 error */
    if (!result.affected) {
      return res.status(404).json({ message: "Profile not found" });
    }

    /** Return a 204 status on success */
    res.status(204).send();
  }

  /**
   * Retrieves all pets associated with a specific profile
   * @param req - Express request object containing profile id in params
   * @param res - Express response object
   * @returns JSON array of pets or 404 if profile not found
   */
  async getAllPets(req: Request, res: Response) {
    /** Retrieve the profile from the database */
    const profile = await this.profileRepo.findOneBy({
      profile_id: parseInt(req.params.id),
    });

    /** Check if the profile exists, if not, return a 404 error */
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    /** Retrieve all pets associated with the profile from the database */
    const pets = await this.petRepo.find({
      where: { profiles: { profile_id: profile.profile_id } },
    });

    /** Return the pets */
    res.json(pets);
  }

  /**
   * Retrieves a specific pet associated with a profile
   * @param req - Express request object containing profile id and pet id in params
   * @param res - Express response object
   * @returns JSON object of the pet or 404 if profile or pet not found
   */
  async getOnePet(req: Request, res: Response) {
    const profile = await this.profileRepo.findOneBy({
      profile_id: parseInt(req.params.id),
    });

    /** Check if the profile exists, if not, return a 404 error */
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    /** Retrieve the pet from the database */
    const pet = await this.petRepo.findOne({
      where: {
        pet_id: parseInt(req.params.pet_id),
        profiles: { profile_id: profile.profile_id },
      },
    });

    /** Check if the pet exists, if not, return a 404 error */
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    /** Return the pet */
    res.json(pet);
  }

  /**
   * Creates a new pet and associates it with a profile
   * @param req - Express request object containing profile id in params and pet data in body
   * @param res - Express response object
   * @returns JSON object of the created pet with 201 status or 404 if profile not found
   */
  async createPet(req: Request, res: Response) {
    const profile = await this.profileRepo.findOneBy({
      profile_id: parseInt(req.params.id),
    });

    /** Check if the profile exists, if not, return a 404 error */
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const pet = this.petRepo.create({
      ...req.body,
      profiles: [profile],
    });

    /** Save the new pet to the database */
    try {
      await this.petRepo.save(pet);
    } catch (error) {
      return res.status(500).json({ message: "Error saving pet", error });
    }

    /** Return the created pet with a 201 status */
    res.status(201).json(pet);
  }

  /**
   * Deletes a pet associated with a profile
   * @param req - Express request object containing profile id and pet id in params
   * @param res - Express response object
   * @returns 204 status on success or 404 if profile or pet not found
   */
  async deletePet(req: Request, res: Response) {
    const profile = await this.profileRepo.findOneBy({
      profile_id: parseInt(req.params.id),
    });

    /** Check if the profile exists, if not, return a 404 error */
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const result = await this.petRepo.delete({
      pet_id: parseInt(req.params.pet_id),
      profiles: { profile_id: profile.profile_id },
    });

    /** Check if the pet was deleted, if not, return a 404 error */
    if (!result.affected) {
      return res.status(404).json({ message: "Pet not found" });
    }

    /** Return a 204 status on success */
    res.status(204).send();
  }
}
