import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Profile } from "../entity/Profile";
import { Course } from "src/entity/Course";

/**
 * PetController handles all HTTP requests related to courses
 * Provides CRUD (Create, Read, Update, Delete) operations for course resources
 */
export class PetController {
  /** Repository instance for database operations on Course entity */
  private courseRepo = AppDataSource.getRepository(Course);

  /**
   * Retrieves all courses from the database
   * @param req - Express request object
   * @param res - Express response object
   * @returns JSON array of all courses
   */
  async getAll(req: Request, res: Response) {
    /** Retrieve all courses from the database */
    const courses = await this.courseRepo.find();

    /** Return the pets */
    res.json(courses);
  }

  /**
   * Retrieves a single course by its course code
   * @param req - Express request object containing course code in params
   * @param res - Express response object
   * @returns JSON object of the pet or 404 if not found
   */
  async getCourseByCode(req: Request, res: Response) {
    /** Retrieve the pet from the database */
    const course = await this.courseRepo.findOneBy({
      courseCode: req.params.courseCode,
    });

    /** Check if the pet exists, if not, return a 404 error */
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    /** Return the pet */
    res.json(course);
  }

  /**
   * Creates a new course record
   * @param req - Express request object containing course data in body
   * @param res - Express response object
   * @returns JSON object of the created Course with 201 status
   */
  async createCoure(req: Request, res: Response) {
    /** Create a new pet object from the request body */
    const course = this.courseRepo.create(req.body);

    /** Save the new course to the database */
    try {
      await this.courseRepo.save(course);
    } catch (error) {
      return res.status(500).json({ message: "Error saving course", error });
    }

    /** Return the created course with a 201 status */
    res.status(201).json(course);
  }

  /**
   * Updates an existing course record
   * @param req - Express request object containing course code in params and update data in body
   * @param res - Express response object
   * @returns JSON object of the updated pet or 404 if not found
   */
  async update(req: Request, res: Response) {
    let course = await this.courseRepo.findOneBy({
      courseCode: req.params.courseCode,
    });

    /** Check if the course exists, if not, return a 404 error */
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    /** Merge the existing course with the new data from the request body */
    this.courseRepo.merge(course, req.body);

    /** Save the updated pet to the database */
    try {
      await this.courseRepo.save(course);
    } catch (error) {
      return res.status(500).json({ message: "Error updating course", error });
    }

    /** Return the updated pet */
    res.json(course);
  }

  /**
   * Deletes a course record
   * @param req - Express request object containing course code in params
   * @param res - Express response object
   * @returns 204 status on success or 404 if pet not found
   */
  async delete(req: Request, res: Response) {
    const course = await this.courseRepo.findOneBy({
      courseCode: req.params.courseCode,
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await this.courseRepo.remove(course);

    res.json({ message: "Course deleted" });
  }
}
