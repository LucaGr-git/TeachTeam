import { Router } from "express";
import { CourseController } from "../controller/CourseController";

const router = Router();
const controller = new CourseController();

router.get("/", (req, res) => controller.getAll(req, res));

router.get("/:courseCode", (req, res) => controller.getCourseByCode);

router.post("/", (req, res) => controller.createCourse);

router.put("/:courseCode", (req, res) => controller.updateCourse);

router.delete("/:courseCode", (req, res) => controller.deleteCourse);


router.get("/lecturer/:courseCode", (req, res) => controller.getLecturerByCourseCode);

router.get("/courseCode/:lecturerEmail", (req, res) => controller.getCourseCodeByLecturer); // ? conflict

router.post("/lecturer/", (req, res) => controller.createCourseLecturer);


router.get("/application/:courseCode", (req, res) => controller.getTutorApplicationByCourseCode);

router.get("/application/email/:tutorEmail", (req, res) => controller.getCourseCodeByTutorApplication); // todo ???

router.post("/application", (req, res) => controller.createTutorApplication);

router.delete("/application/:tutorEmail/:courseCode", (req, res) => controller.deleteTutorApplication);


router.get("/shortlistedTutor/:courseCode", (req, res) => controller.getShortlistedTutorByCourseCode);

router.get("/courseCode/:tutorEmail", (req, res) => controller.getCourseCodeByShortlistedTutorEmail); // ? confilct

router.post("/shortlist", (req, res) => controller.createShortlistedTutor);

router.delete("/shortlist/:tutorEmail/:courseCode", (req, res) => controller.deleteShortlistedTutor);

export default router;
