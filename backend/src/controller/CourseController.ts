import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Profile } from "../entity/Profile";
import { Course } from "../entity/Course";
import { CourseLecturer } from "../entity/CourseLecturer";
import { CourseTutor } from "../entity/CourseTutor";
import { TutorApplication } from "../entity/TutorApplication";
import { ShortlistedTutor } from "../entity/ShortlistedTutor";
import { ShortlistNote } from "../entity/ShortlistNote";
import { LecturerShortlist } from "../entity/LecturerShortlist";
import { PreferredSkill } from "../entity/PreferredSkill";

/**
 * CourseController handles all HTTP requests related to courses
 * Provides CRUD (Create, Read, Update, Delete) operations for course resources
 */
export class CourseController {
  /** Repository instance for database operations on Course entity */
  private courseRepo = AppDataSource.getRepository(Course);
  private courseLecturerRepo = AppDataSource.getRepository(CourseLecturer);
  private courseTutorRepo = AppDataSource.getRepository(CourseTutor);
  private tutorApplicationRepo = AppDataSource.getRepository(TutorApplication);
  private shortlistedTutorRepo = AppDataSource.getRepository(ShortlistedTutor);
  private shortlistNoteRepo = AppDataSource.getRepository(ShortlistNote);
  private lecturerShortlistRepo = AppDataSource.getRepository(LecturerShortlist);
  private preferredSkillRepo = AppDataSource.getRepository(PreferredSkill);

  /**
   * Retrieves all courses from the database
   * @param req - Express request object
   * @param res - Express response object
   * @returns JSON array of all courses
   */
  async getAllCourses(req: Request, res: Response) {
    /** Retrieve all courses from the database */
    const courses = await this.courseRepo.find();

    /** Return the courses */
    res.json(courses);
  }

  /**
   * Retrieves all course lecturers from the database
   * @param req - Express request object
   * @param res - Express response object
   * @returns JSON array of all courses
   */
  async getAllCourseLecturers(req: Request, res: Response) {
    /** Retrieve all courseLecturer from the database */
    const courseLecturers = await this.courseLecturerRepo.find();

    /** Return the course lecturers */
    res.json(courseLecturers);
  }

  /**
   * Retrieves all TutorApplications from the database
   * @param req - Express request object
   * @param res - Express response object
   * @returns JSON array of all TutorApplications
   */
  async getAllTutorApplications(req: Request, res: Response) {
    /** Retrieve all TutorApplications from the database */
    const tutorApplications = await this.tutorApplicationRepo.find();

    /** Return the TutorApplications */
    res.json(tutorApplications);
  }

  

  /**
   * Retrieves all CourseTutors from the database
   * @param req - Express request object
   * @param res - Express response object
   * @returns JSON array of all CourseTutors
   */
  async getAllCourseTutors(req: Request, res: Response) {
    /** Retrieve all CourseTutors from the database */
    const courseTutors = await this.courseTutorRepo.find();

    /** Return the CourseTutors */
    res.json(courseTutors);
  }

// Shortlisted Tutors
async getAllShortlistedTutors(req: Request, res: Response) {
  const shortlistedTutors = await this.shortlistedTutorRepo.find();
  res.json(shortlistedTutors);
}

// Shortlist Notes
async getAllShortlistNotes(req: Request, res: Response) {
  const shortlistNotes = await this.shortlistNoteRepo.find({
    relations: ['course', 'lecturer', 'tutor'],
  });
  // Map the shortlist notes to correct structure
  res.json(shortlistNotes.map(note => ({
  id: note.id,
  message: note.message,
  date: note.date,
  courseCode: note.course?.courseCode,
  lecturerEmail: note.lecturer?.email,
  tutorEmail: note.tutor?.email,
})));
}

// Lecturer Shortlist
async getAllLecturerShortlists(req: Request, res: Response) {
  const lecturerShortlists = await this.lecturerShortlistRepo.find();
  res.json(lecturerShortlists);
}

// Preferred Skills
async getAllPreferredSkills(req: Request, res: Response) {
  const preferredSkills = await this.preferredSkillRepo.find();
  res.json(preferredSkills);
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
  async createCourse(req: Request, res: Response) {
    /** Create a new course object from the request body */
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
  async updateCourse(req: Request, res: Response) {
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
  async deleteCourse(req: Request, res: Response) {
    const course = await this.courseRepo.findOneBy({
      courseCode: req.params.courseCode,
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await this.courseRepo.remove(course);

    res.json({ message: "Course deleted" });
  }

  /**
   * Gets a lecturer in CourseLecturer by course code
   * @param req - Express request object containing course code in params
   * @param res - Express response object
   * @return JSON object of the CourseLecturer or 404 if not found
   */
   async getLecturerByCourseCode(req: Request, res: Response) {
    /** Retrieve the CourseLecturer from the database */
    const courseLecturer = await this.courseLecturerRepo.findBy({
      courseCode: req.params.courseCode,
    });

    /** Check if the course Lecturer exists, if not, return a 404 error */
    if (!courseLecturer) {
      return res.status(404).json({ message: "Course Lecturer not found" });
    }

    /** Return the course lecturer */
    res.json(courseLecturer);
   }

   /**
    * Gets the course code by the Lecturer email in courseLecturer
    * @param req - Express request oject containing lecturer email in params
    * @param res - Express response object
    * @return JSON object of the CourseLecturer or 404 if not found
    */
   async getCourseCodeByLecturer(req: Request, res: Response){
    /** Retrieve the CourseLecturer from the database */
    const courseLecturer = await this.courseLecturerRepo.findOneBy({
        lecturerEmail: req.params.lecturerEmail,
    });

    /** Check if the course Lecturer exists, if not, return a 404 error */
    if (!courseLecturer) {
      return res.status(404).json({ message: "Course Lecturer not found" });
    }

    /** Return the course lecturer */
    res.json(courseLecturer);
   }

  /**
   * Creates a new CourseLecturer record
   * @param req - Express request object containing course data in body
   * @param res - Express response object
   * @returns JSON object of the created Course with 201 status
   */
  async createCourseLecturer(req: Request, res: Response) {
    /** Create a new course lecturer object from the request body */
    const courseLecturer = this.courseLecturerRepo.create(req.body);

    /** Save the new course to the database */
    try {
      await this.courseLecturerRepo.save(courseLecturer);
    } catch (error) {
      return res.status(500).json({ message: "Error saving course lecturer", error });
    }

    /** Return the created course with a 201 status */
    res.status(201).json(courseLecturer);
  }

  /**
   * Deletes a CourseLecturer record
   * @param req - Express request object containing course code in params
   * @param res - Express response object
   * @returns 204 status on success or 404 if CourseLecturer not found
   */
  async deleteCourseLecturer(req: Request, res: Response) {
    const courseLecturer = await this.courseLecturerRepo.findOneBy({
       lecturerEmail: req.params.lecturerEmail,
       courseCode: req.params.courseCode,
    });

    if (!courseLecturer) {
      return res.status(404).json({ message: "Course Lecturer not found" });
    }

    await this.courseLecturerRepo.remove(courseLecturer);

    res.json({ message: "Course Lecturer deleted" });
  }

  /**
   * Creates a new CourseTutor record
   * @param req - Express request object containing course data in body
   * @param res - Express response object
   * @returns JSON object of the created Course with 201 status
   */
  async createCourseTutor(req: Request, res: Response) {
    /** Create a new course tutor object from the request body */
    const { courseCode, tutorEmail } = req.body;

    const newCourseTutor = this.courseTutorRepo.create({
      courseCode,
      tutorEmail,
      course: { courseCode },     // <-- must match PK on Course entity
      tutor: { email: tutorEmail } // <-- must match PK on User entity
    });

    /** Save the new course to the database */
    try {
      await this.courseTutorRepo.save(newCourseTutor);
    } catch (error) {
      console.error("Error saving course Tutor ", error);
      return res.status(500).json({ message: "Error saving course tutor "});
    }

    /** Return the created course with a 201 status */
    res.status(201).json(newCourseTutor);
  }

  /**
    * Gets the course code by the Tutor email in courseTutor
    * @param req - Express request object containing lecturer email in params
    * @param res - Express response object
    * @return JSON object of the CourseTutor or 404 if not found
    */
  async getCourseCodeByTutor(req: Request, res: Response){
    /** Retrieve the CourseTutor from the database */
    const courseTutor = await this.courseTutorRepo.findOneBy({
        tutorEmail: req.params.lecturerEmail,
    });

    /** Check if the course Lecturer exists, if not, return a 404 error */
    if (!courseTutor) {
      return res.status(404).json({ message: "Course Lecturer not found" });
    }

    /** Return the course tutor */
    res.json(courseTutor);
  }


  /**
   * Gets a lecturer in CourseTutor by course code
   * @param req - Express request object containing course code in params
   * @param res - Express response object
   * @return JSON object of the CourseTutor or 404 if not found
   */
  async getTutorByCourseCode(req: Request, res: Response) {
    /** Retrieve the CourseTutor from the database */
    const courseTutor = await this.courseTutorRepo.findOneBy({
      courseCode: req.params.courseCode,
    });

    /** Check if the course Tutor exists, if not, return a 404 error */
    if (!courseTutor) {
      return res.status(404).json({ message: "Course Lecturer not found" });
    }

    /** Return the course lecturer */
    res.json(courseTutor);
   }


  // Tutor application entity functions
  /**
   * Gets a tutor Application in TutorApplication by course code
   * @param req - Express request object containing course code in params
   * @param res - Express response object
   * @return JSON object of the TutorApplication or 404 if not found
   */
   async getTutorApplicationByCourseCode(req: Request, res: Response) {
    /** Retrieve the TutorApplication from the database */
    const tutorApplication = await this.tutorApplicationRepo.findBy({
      courseCode: req.params.courseCode,
    });

    /** Check if the tutor application exists, if not, return a 404 error */
    if (!tutorApplication) {
      return res.status(404).json({ message: "Tutor application not found" });
    }

    /** Return the course lecturer */
    res.json(tutorApplication);
   }

  /**
   * Gets a tutor Application course code by tutor application email
   * @param req - Express request object containing course code in params
   * @param res - Express response object
   * @return JSON object of the TutorApplication or 404 if not found
   */
   async getCourseCodeByTutorApplication(req: Request, res: Response) {
    /** Retrieve the TutorApplication from the database */
    const tutorApplication = await this.tutorApplicationRepo.findOneBy({
      tutorEmail: req.params.tutorEmail,
    });

    /** Check if the tutor application exists, if not, return a 404 error */
    if (!tutorApplication) {
      return res.status(404).json({ message: "Tutor application not found" });
    }

    /** Return the tutor application */
    res.json(tutorApplication);
   }

  /**
   * Creates a new tutorApplication record
   * @param req - Express request object containing course data in body
   * @param res - Express response object
   * @returns JSON object of the created Course with 201 status
   */
  async createTutorApplication(req: Request, res: Response) {
    /** Create a new course lecturer object from the request body */
    const tutorApplication = this.tutorApplicationRepo.create(req.body);

    /** Save the new course to the database */
    try {
      await this.tutorApplicationRepo.save(tutorApplication);
    } catch (error) {
      return res.status(500).json({ message: "Error saving tutor application", error });
    }

    /** Return the created course with a 201 status */
    res.status(201).json(tutorApplication);
  }

  /**
   * Deletes a TutorApplication record
   * @param req - Express request object containing course code in params
   * @param res - Express response object
   * @returns 204 status on success or 404 if tutorApplication not found
   */
  async deleteTutorApplication(req: Request, res: Response) {
  const { tutorEmail, courseCode } = req.params;

  const tutorApplication = await this.tutorApplicationRepo.findOneBy({
    tutorEmail,
    courseCode,
  });

  if (!tutorApplication) {
    return res.status(404).json({ message: "Tutor application not found" });
  }

  // First, delete all related shortlist notes
  try {
    await this.shortlistNoteRepo
      .createQueryBuilder()
      .delete()
      .where("tutorEmail = :tutorEmail", { tutorEmail })
      .andWhere("courseCode = :courseCode", { courseCode })
      .execute();
  } catch (error) {
    return res.status(500).json({ message: "Error deleting related shortlist notes", error });
  }

  // Then delete the tutor application
  try {
    await this.tutorApplicationRepo.remove(tutorApplication);
  } catch (error) {
    return res.status(500).json({ message: "Error deleting tutor application", error });
  }

  res.json({ message: "Tutor application and related shortlist notes deleted" });
}


  // Shortlisted Tutor Entity functions
  /**
   * Gets a Shortlisted tutor in shortlist tutor by course code
   * @param req - Express request object containing course code in params
   * @param res - Express response object
   * @return JSON object or 404 if not found
   */
   async getShortlistedTutorByCourseCode(req: Request, res: Response) {
    /** Retrieve the TutorApplication from the database */
    const shortlistedTutor = await this.shortlistedTutorRepo.findOneBy({
      courseCode: req.params.courseCode,
    });

    /** Check if the tutor application exists, if not, return a 404 error */
    if (!shortlistedTutor) {
      return res.status(404).json({ message: "Shortlisted tutor not found" });
    }

    /** Return the course lecturer */
    res.json(shortlistedTutor);
   }

  /**
   * Gets a Shortlisted tutor in shortlist tutor by course code
   * @param req - Express request object containing course code in params
   * @param res - Express response object
   * @return JSON object or 404 if not found
   */
   async getCourseCodeByShortlistedTutorEmail(req: Request, res: Response) {
    /** Retrieve the TutorApplication from the database */
    const shortlistedTutor = await this.shortlistedTutorRepo.findOneBy({
      tutorEmail: req.params.tutorEmail,
    });

    /** Check if the tutor application exists, if not, return a 404 error */
    if (!shortlistedTutor) {
      return res.status(404).json({ message: "Shortlisted tutor not found" });
    }

    /** Return the course lecturer */
    res.json(shortlistedTutor);
   }

  /**
   * Creates a new shortlistedTutor record
   * @param req - Express request object containing course data in body
   * @param res - Express response object
   * @returns JSON object of the created Course with 201 status
   */
  async createShortlistedTutor(req: Request, res: Response) {
    /** Create a new course lecturer object from the request body */
    const shortlistedTutor = this.shortlistedTutorRepo.create(req.body);

    /** Save the new course to the database */
    try {
      await this.shortlistedTutorRepo.save(shortlistedTutor);
    } catch (error) {
      return res.status(500).json({ message: "Error saving shortlisted tutor", error });
    }

    /** Return the created course with a 201 status */
    res.status(201).json(shortlistedTutor);
  }

  /**
   * Deletes a shortListedTutor record
   * @param req - Express request object containing course code in params
   * @param res - Express response object
   * @returns 204 status on success or 404 if tutorApplication not found
   */
  async deleteShortlistedTutor(req: Request, res: Response) {
    const shortListedTutor = await this.shortlistedTutorRepo.findOneBy({
       tutorEmail: req.params.tutorEmail,
       courseCode: req.params.courseCode,
    });

    if (!shortListedTutor) {
      return res.status(404).json({ message: "Shortlisted tutor not found" });
    }

    await this.shortlistedTutorRepo.remove(shortListedTutor);

    res.json({ message: "Shortlisted tutor deleted" });
  }

  // Shortlist note entity functions
  /**
   * Gets a shortlist note by its ID
   * @param req - Express request object containing ID in params
   * @param res - Express response object
   * @return JSON object or 404 if not found
   */
   async getShortlistNoteByID(req: Request, res: Response) {
    /** Retrieve the shortlistNote from the database */
    const shortlistNote = await this.shortlistNoteRepo.findOneBy({
      id: parseInt(req.params.id),
    });

    /** Check if the tutor application exists, if not, return a 404 error */
    if (!shortlistNote) {
      return res.status(404).json({ message: "ShortlistNote not found" });
    }

    /** Return the tutor application */
    res.json(shortlistNote);
   }

  /**
   * Creates a new shortlistNote record
   * @param req - Express request object containing course data in body
   * @param res - Express response object
   * @returns JSON object of the created note with 201 status
   */
  async createShortlistNote(req: Request, res: Response) {
    /** Create a new course note object from the request body */
    const { courseCode, tutorEmail, lecturerEmail, message, date } = req.body;

    const shortlistNote = this.shortlistNoteRepo.create({
    course: { courseCode }, // must match the PK of Course entity
        tutor: { email: tutorEmail }, // must match the PK of User
        lecturer: { email: lecturerEmail }, // must match the PK of User
        message,
        date 
    });

    /** Save the new course to the database */
    try {
      await this.shortlistNoteRepo.save(shortlistNote);
    } catch (error) {
      return res.status(500).json({ message: "Error saving shortlist note", error });
    }

    /** Return the created course with a 201 status */
    res.status(201).json(shortlistNote);
  }

  /**
   * Updates an existing shortlistNote record
   * @param req - Express request object containing course code in params and update data in body
   * @param res - Express response object
   * @returns JSON object of the updated pet or 404 if not found
   */
  async updateShortlistNote(req: Request, res: Response) {
    let shortlistNote = await this.shortlistNoteRepo.findOneBy({
      id: parseInt(req.params.id),
    });

    /** Check if the shortlist note exists, if not, return a 404 error */
    if (!shortlistNote) {
      return res.status(404).json({ message: "Shortlist note not found" });
    }

    /** Merge the existing note with the new data from the request body */
    this.shortlistNoteRepo.merge(shortlistNote, req.body);

    /** Save the updated note to the database */
    try {
      await this.shortlistNoteRepo.save(shortlistNote);
    } catch (error) {
      return res.status(500).json({ message: "Error updating shortlist note", error });
    }

    /** Return the updated pet */
    res.json(shortlistNote);
  }

  /**
   * Deletes a shortlist note record
   * @param req - Express request object containing course code in params
   * @param res - Express response object
   * @returns 204 status on success or 404 if tutorApplication not found
   */
  async deleteShortlistNote(req: Request, res: Response) {
    const shortlistNote = await this.shortlistNoteRepo.findOneBy({
       id: parseInt(req.params.noteId),
    });

    if (!shortlistNote) {
      return res.status(404).json({ message: "Shortlist note not found" });
    }

    await this.shortlistNoteRepo.remove(shortlistNote);

    res.json({ message: "Shortlist note deleted" });
  }

// LecturerShortlist Entity functions

/**
 * Gets a LecturerShortlist by course code and lecturer email
 * @param req - Express request object containing courseCode and lecturerEmail in params
 * @param res - Express response object
 * @return JSON object or 404 if not found
 */
async getTutorEmailByCourseCodeAndLecEmail(req: Request, res: Response) {
  const lecturerShortlist = await this.lecturerShortlistRepo.findOneBy({
    courseCode: req.params.courseCode,
    lecturerEmail: req.params.lecturerEmail,
  });

  if (!lecturerShortlist) {
    return res.status(404).json({ message: "Lecturer shortlist not found" });
  }

  res.json(lecturerShortlist);
}

/**
 * Creates a new LecturerShortlist record
 * @param req - Express request object containing data in body
 * @param res - Express response object
 * @returns JSON object of the created record with 201 status
 */
async createLecturerShortlist(req: Request, res: Response) {
  const lecturerShortlist = this.lecturerShortlistRepo.create(req.body);

  try {
    await this.lecturerShortlistRepo.save(lecturerShortlist);
  } catch (error) {
    return res.status(500).json({ message: "Error saving lecturer shortlist", error });
  }

  res.status(201).json(lecturerShortlist);
}

/**
 * Updates an existing LecturerShortlist record
 * @param req - Express request object containing courseCode and lecturerEmail in params, and update data in body
 * @param res - Express response object
 * @returns JSON object of the updated record or 404 if not found
 */
async updateLecturerShortlist(req: Request, res: Response) {
  let lecturerShortlist = await this.lecturerShortlistRepo.findOneBy({
    courseCode: req.params.courseCode,
    lecturerEmail: req.params.lecturerEmail,
    tutorEmail: req.params.tutorEmail,
  });

  if (!lecturerShortlist) {
    return res.status(404).json({ message: "Lecturer shortlist not found" });
  }

  this.lecturerShortlistRepo.merge(lecturerShortlist, req.body);

  try {
    await this.lecturerShortlistRepo.save(lecturerShortlist);
  } catch (error) {
    return res.status(500).json({ message: "Error updating lecturer shortlist", error });
  }

  res.json(lecturerShortlist);
}

/**
 * Deletes a LecturerShortlist record
 * @param req - Express request object containing courseCode and lecturerEmail in params
 * @param res - Express response object
 * @returns 204 status on success or 404 if not found
 */
async deleteLecturerShortlist(req: Request, res: Response) {
  const lecturerShortlist = await this.lecturerShortlistRepo.findOneBy({
    courseCode: req.params.courseCode,
    lecturerEmail: req.params.lecturerEmail,
    tutorEmail: req.params.tutorEmail,
  });

  if (!lecturerShortlist) {
    return res.status(404).json({ message: "Lecturer shortlist not found" });
  }

  await this.lecturerShortlistRepo.remove(lecturerShortlist);

  res.json({ message: "Lecturer shortlist deleted" });
}

// Preferred skill functions

/**
 * Gets all PreferredSkills by course code
 * @param req - Express request object containing courseCode in params
 * @param res - Express response object
 * @return JSON array of preferred skills or 404 if none found
 */
async getSkillByCourseCode(req: Request, res: Response) {
  const preferredSkills = await this.preferredSkillRepo.findBy({
    courseCode: req.params.courseCode,
  });

  if (!preferredSkills || preferredSkills.length === 0) {
    return res.status(404).json({ message: "No preferred skills found for this course code" });
  }

  res.json(preferredSkills);
}

/**
 * Creates a new PreferredSkill record
 * @param req - Express request object containing preferred skill data in body
 * @param res - Express response object
 * @returns JSON object of the created preferred skill with 201 status
 */
async createPreferredSkill(req: Request, res: Response) {
  const preferredSkill = this.preferredSkillRepo.create(req.body);

  try {
    await this.preferredSkillRepo.save(preferredSkill);
  } catch (error) {
    return res.status(500).json({ message: "Error saving preferred skill", error });
  }

  res.status(201).json(preferredSkill);
}

/**
 * Deletes a PreferredSkill record
 * @param req - Express request object containing courseCode and skill in params
 * @param res - Express response object
 * @returns 204 status on success or 404 if not found
 */
async deletePreferredSkill(req: Request, res: Response) {
  const preferredSkill = await this.preferredSkillRepo.findOneBy({
    courseCode: req.params.courseCode,
    skill: req.params.skill,
  });

  if (!preferredSkill) {
    return res.status(404).json({ message: "Preferred skill not found" });
  }

  await this.preferredSkillRepo.remove(preferredSkill);

  res.json({ message: "Preferred skill deleted" });
}

}

