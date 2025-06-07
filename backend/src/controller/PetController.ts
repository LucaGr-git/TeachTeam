import { Request, Response } from "express";
import { Pet } from "../entity/Pet";
import { AppDataSource } from "../data-source";
import { Profile } from "../entity/Profile";

/**
 * PetController handles all HTTP requests related to pets
 * Provides CRUD (Create, Read, Update, Delete) operations for pet resources
 */
export class PetController {
  /** Repository instance for database operations on Pet entity */
  private petRepo = AppDataSource.getRepository(Pet);

  /** Repository instance for database operations on Profile entity */
  private profileRepo = AppDataSource.getRepository(Profile);

  /**
   * Retrieves all pets from the database
   * @param req - Express request object
   * @param res - Express response object
   * @returns JSON array of all pets
   */
  async getAll(req: Request, res: Response) {
    /** Retrieve all pets from the database */
    const pets = await this.petRepo.find();

    /** Return the pets */
    res.json(pets);
  }

  /**
   * Retrieves a single pet by its ID
   * @param req - Express request object containing pet_id in params
   * @param res - Express response object
   * @returns JSON object of the pet or 404 if not found
   */
  async getOne(req: Request, res: Response) {
    /** Retrieve the pet from the database */
    const pet = await this.petRepo.findOneBy({
      pet_id: parseInt(req.params.pet_id),
    });

    /** Check if the pet exists, if not, return a 404 error */
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    /** Return the pet */
    res.json(pet);
  }

  /**
   * Creates a new pet record
   * @param req - Express request object containing pet data in body
   * @param res - Express response object
   * @returns JSON object of the created pet with 201 status
   */
  async create(req: Request, res: Response) {
    /** Create a new pet object from the request body */
    const pet = this.petRepo.create(req.body);

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
   * Updates an existing pet record
   * @param req - Express request object containing pet_id in params and update data in body
   * @param res - Express response object
   * @returns JSON object of the updated pet or 404 if not found
   */
  async update(req: Request, res: Response) {
    let pet = await this.petRepo.findOneBy({
      pet_id: parseInt(req.params.pet_id),
    });

    /** Check if the pet exists, if not, return a 404 error */
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    /** Merge the existing pet with the new data from the request body */
    this.petRepo.merge(pet, req.body);

    /** Save the updated pet to the database */
    try {
      await this.petRepo.save(pet);
    } catch (error) {
      return res.status(500).json({ message: "Error saving pet", error });
    }

    /** Return the updated pet */
    res.json(pet);
  }

  /**
   * Deletes a pet record
   * @param req - Express request object containing pet_id in params
   * @param res - Express response object
   * @returns 204 status on success or 404 if pet not found
   */
  async delete(req: Request, res: Response) {
    const pet = await this.petRepo.findOneBy({
      pet_id: parseInt(req.params.pet_id),
    });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    await this.petRepo.remove(pet);

    res.json({ message: "Pet deleted" });
  }

  /**
   * Attaches a profile to a pet
   * @param req - Express request object containing pet_id and profile_id in params
   * @param res - Express response object
   * @returns JSON object of the updated pet or 404 if pet/profile not found
   */
  async attachProfile(req: Request, res: Response) {
    // Find the pet
    const pet = await this.petRepo.findOne({
      where: { pet_id: parseInt(req.params.pet_id) },
      relations: ["profiles"],
    });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Find the profile
    const profile = await this.profileRepo.findOneBy({
      profile_id: parseInt(req.params.profile_id),
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Add profile to pet's profiles array if not already present
    if (!pet.profiles) {
      pet.profiles = [];
    }

    pet.profiles.push(profile);

    // Save the updated pet
    try {
      await this.petRepo.save(pet);
      res.json(pet);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error attaching profile to pet", error });
    }
  }

  /**
   * Retrieves the profile associated with a specific pet
   * @param req - Express request object containing pet id in params
   * @param res - Express response object
   * @returns JSON object of the profile or 404 if pet not found
   */
  async getOneProfile(req: Request, res: Response) {
    const pet = await this.petRepo.findOneBy({
      pet_id: parseInt(req.params.pet_id),
    });

    /** Check if the pet exists, if not, return a 404 error */
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    /* Fetch all of the profiles associated with the pet */
    const profiles = await this.profileRepo.find({
      where: { pets: { pet_id: pet.pet_id } },
    });

    /** Return the profiles */
    res.json(profiles);
  }
}
