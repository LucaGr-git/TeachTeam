import { Router } from "express";
import { CourseController } from "../controller/CourseController";

const router = Router();
const controller = new CourseController();

router.get('/courses', (req, res) => controller.getAll(req, res));

router.get("/courses/:courseCode", (req, res) => controller.getCourseByCode(req, res));

router.post("/courses", (req, res) => controller.createCourse(req, res));

router.put("/courses/:courseCode", (req, res) => controller.updateCourse(req, res));

router.delete("'/courses/:courseCode'", (req, res) => controller.deleteCourse(req, res));


router.get("/courses/:courseCode/lecturers", (req, res) => controller.getLecturerByCourseCode(req, res));

router.get("/lecturers/:lecturerEmail/courses", (req, res) => controller.getCourseCodeByLecturer(req, res)); 

router.post("/courses/:courseCode/lecturers", (req, res) => controller.createCourseLecturer(req, res));


router.get("/courses/:courseCode/applications", (req, res) => controller.getTutorApplicationByCourseCode(req, res));

router.get("/applications/:tutorEmail/courses", (req, res) => controller.getCourseCodeByTutorApplication(req, res)); 

router.post("/courses/:courseCode/applications", (req, res) => controller.createTutorApplication(req, res));

router.delete("/applications/:tutorEmail/:courseCode", (req, res) => controller.deleteTutorApplication(req, res));


router.get("/courses/:courseCode/shortlistedTutors", (req, res) => controller.getShortlistedTutorByCourseCode(req, res));

router.get("/shortlistedTutors/:tutorEmail/courses", (req, res) => controller.getCourseCodeByShortlistedTutorEmail(req, res));

router.post("/courses/:courseCode/shortlistedTutors", (req, res) => controller.createShortlistedTutor(req, res));

router.delete("/courses/:courseCode/shortlistedTutors/:tutorEmail", (req, res) => controller.deleteShortlistedTutor(req, res));

router.get(, (req, res) => controller.getShortlistNoteByID(req,res));

router.post(, (req, res) => controller.createShortlistNote(req, res));

router.put(, (req, res) => controller.updateShortlistNote(req, res));

router.delete(, (req, res) => controller.deleteShortlistNote(req, res));

router.get(, (req, res) => controller.getTutorEmailByCourseCodeAndLecEmail(req, res));

router.post(, (req, res) => controller.createLecturerShortlist(req, res));

router.put(, (req, res) => controller.updateLecturerShortlist(req, res));

router.delete(, (req, res) => controller.deleteLecturerShortlist(req, res));

router.get(, (req, res) => controller.getSkillByCourseCode(req, res));

router.get(, (req, res) => controller.createPreferredSkill(req, res));

router.delete(, (req, res) => controller.deletePreferredSkill(req, res));


// todo change course code functions to reference entity not jsut code where applicable
// todo also pluralize e.g.  getShortlistedTutorByCourseCode --> getShortlistedTutorsByCourseCode
// todo add all functions to routes
export default router;
