import { Router } from "express";
import { CourseController } from "../controller/CourseController";

const router = Router();
const controller = new CourseController();

router.get("/", (req, res) => controller.getAll(req, res));

router.get("/:courseCode", (req, res) => controller.getCourseByCode(req, res));

router.post("/", (req, res) => controller.createCourse(req, res));

router.put("/:courseCode", (req, res) => controller.updateCourse(req, res));

router.delete("/:courseCode", (req, res) => controller.deleteCourse(req, res));


router.get("/lecturer/:courseCode", (req, res) => controller.getLecturerByCourseCode(req, res));

router.get("/courseCode/:lecturerEmail", (req, res) => controller.getCourseCodeByLecturer(req, res)); // ? conflict

router.post("/lecturer/", (req, res) => controller.createCourseLecturer(req, res));


router.get("/application/:courseCode", (req, res) => controller.getTutorApplicationByCourseCode(req, res));

router.get("/application/email/:tutorEmail", (req, res) => controller.getCourseCodeByTutorApplication(req, res)); // todo ???

router.post("/application", (req, res) => controller.createTutorApplication(req, res));

router.delete("/application/:tutorEmail/:courseCode", (req, res) => controller.deleteTutorApplication(req, res));


router.get("/shortlistedTutor/:courseCode", (req, res) => controller.getShortlistedTutorByCourseCode(req, res));

router.get("/courseCode/:tutorEmail", (req, res) => controller.getCourseCodeByShortlistedTutorEmail(req, res)); // ? confilct

router.post("/shortlist", (req, res) => controller.createShortlistedTutor(req, res));

router.delete("/shortlist/:tutorEmail/:courseCode", (req, res) => controller.deleteShortlistedTutor(req, res));

export default router;
