import { Router } from "express";
import { CourseController } from "../controller/CourseController";

const router = Router();
const controller = new CourseController();

router.get("/", controller.getAll.bind(controller));

router.get("/:courseCode", controller.getCourseByCode.bind(controller));

router.post("/", controller.createCourse.bind(controller));

router.put("/:courseCode", controller.updateCourse.bind(controller));

router.delete("/:courseCode", controller.deleteCourse.bind(controller));


router.get("/lecturer/:courseCode", controller.getLecturerByCourseCode.bind(controller));

router.get("/courseCode/:lecturerEmail", controller.getCourseCodeByLecturer.bind(controller));

router.post("/lecturer/", controller.createCourseLecturer.bind(controller));


router.get("/application/:courseCode", controller.getTutorApplicationByCourseCode.bind(controller));

router.get("/application/email/:tutorEmail", controller.getCourseCodeByTutorApplication.bind(controller)); // todo ??????

router.post("/application", controller.createTutorApplication.bind(controller));

router.delete("/application/:tutorEmail/:courseCode", controller.deleteTutorApplication.bind(controller));


router.get("/shortlistedTutor/:courseCode", controller.getShortlistedTutorByCourseCode.bind(controller));

router.get("/courseCode/:tutorEmail", controller.getCourseCodeByShortlistedTutorEmail.bind(controller));

router.post("/shortlist", controller.createShortlistedTutor.bind(controller));

router.delete("/shortlist/:tutorEmail/:courseCode", controller.deleteShortlistedTutor.bind(controller));

export default router;
