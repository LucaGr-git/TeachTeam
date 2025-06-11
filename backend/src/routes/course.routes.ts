import { Router } from "express";
import { CourseController } from "../controller/CourseController";
import { validateDto } from "../middlewares/validate";
import { CreateCourseDTO } from "../dtos/create-course.dto";
import { CreateTutorApplicationDTO } from "../dtos/create-tutorApplication.dto";
import { CreateShortlistedTutorDTO } from "../dtos/create-shortlistedTutor.dto";
import { CreateShortlistNoteDTO } from "../dtos/create-shortlistNote.dto";
import { UpdateShortlistNoteDTO } from "../dtos/update-shortlistNote.dto";
import { CreateLecturerShortlistDTO } from "../dtos/create-LecturerShortlist.dto";
import { UpdateLecturerShortlistDTO } from "../dtos/update-LecturerShortlist.dto";
import { CreatePreferredSkillDTO } from "../dtos/create-preferredSkill.dto";
import { CreateCourseTutorDTO } from "../dtos/create-courseTutor.dto";
import { CreateCourseLecturerDTO } from "../dtos/create-courseLecturer.dto";

const router = Router();
const controller = new CourseController();

router.get('/courses', (req, res) => controller.getAllCourses(req, res));

router.get('/courseLecturers', (req, res) => controller.getAllCourseLecturers(req, res));

router.get('/tutorApplications', (req, res) => controller.getAllTutorApplications(req, res));

router.get('/courseTutors', (req, res) => controller.getAllCourseTutors(req, res));

router.get('/shortlistedTutors', (req, res) => controller.getAllShortlistedTutors(req, res));

router.get('/shortlistNotes', (req, res) => controller.getAllShortlistNotes(req, res));

router.get('/lecturerShortlists', (req, res) => controller.getAllLecturerShortlists(req, res));

router.get('/preferredSkills', (req, res) => controller.getAllPreferredSkills(req, res));

router.get("/courses/:courseCode", (req, res) => controller.getCourseByCode(req, res));

router.post("/courses", validateDto(CreateCourseDTO), (req, res) => controller.createCourse(req, res));

router.put("/courses/:courseCode", (req, res) => controller.updateCourse(req, res));

router.delete("'/courses/:courseCode'", (req, res) => controller.deleteCourse(req, res));


router.get("/courses/:courseCode/lecturers", (req, res) => controller.getLecturerByCourseCode(req, res));

router.get("/lecturers/:lecturerEmail/courses", (req, res) => controller.getCourseCodeByLecturer(req, res)); 

router.post("/courses/:courseCode/lecturers", validateDto(CreateCourseLecturerDTO), (req, res) => controller.createCourseLecturer(req, res));

router.delete("/courses/:courseCode/lecturers/:lecturerEmail", (req, res) => controller.deleteCourseLecturer(req, res));


router.get("/courses/:courseCode/tutors", (req, res) => controller.getLecturerByCourseCode(req, res));

router.get("/tutors/:tutorEmail/courses", (req, res) => controller.getCourseCodeByLecturer(req, res)); 

router.post("/courses/:courseCode/tutors", validateDto(CreateCourseTutorDTO), (req, res) => controller.createCourseLecturer(req, res));

router.get("/courses/:courseCode/applications", (req, res) => controller.getTutorApplicationByCourseCode(req, res));

router.get("/applications/:tutorEmail/courses", (req, res) => controller.getCourseCodeByTutorApplication(req, res)); 

router.post("/courses/:courseCode/applications", validateDto(CreateTutorApplicationDTO),(req, res) => controller.createTutorApplication(req, res));

router.delete("/applications/:tutorEmail/:courseCode", (req, res) => controller.deleteTutorApplication(req, res));


router.get("/courses/:courseCode/shortlistedTutors", (req, res) => controller.getShortlistedTutorByCourseCode(req, res));

router.get("/shortlistedTutors/:tutorEmail/courses", (req, res) => controller.getCourseCodeByShortlistedTutorEmail(req, res));

router.post("/courses/:courseCode/shortlistedTutors", validateDto(CreateShortlistedTutorDTO),(req, res) => controller.createShortlistedTutor(req, res));

router.delete("/courses/:courseCode/shortlistedTutors/:tutorEmail", (req, res) => controller.deleteShortlistedTutor(req, res));

router.get("/shortlistNotes/:noteId", (req, res) => controller.getShortlistNoteByID(req,res));

router.post("/courses/:courseCode/shortlisted-tutors/:tutorEmail/notes", validateDto(CreateShortlistNoteDTO),(req, res) => controller.createShortlistNote(req, res));

router.put("/shortlistNotes/:noteId", validateDto(UpdateShortlistNoteDTO),(req, res) => controller.updateShortlistNote(req, res));

router.delete("/shortlistNotes/:noteId", (req, res) => controller.deleteShortlistNote(req, res));

router.get("/courses/:courseCode/lecturers/:lecturerEmail/shortlist", (req, res) => controller.getTutorEmailByCourseCodeAndLecEmail(req, res));

router.post("/courses/:courseCode/lecturers/:lecturerEmail/shortlist", validateDto(CreateLecturerShortlistDTO),(req, res) => controller.createLecturerShortlist(req, res));

router.put("/courses/:courseCode/lecturers/:lecturerEmail/shortlist", validateDto(UpdateLecturerShortlistDTO),(req, res) => controller.updateLecturerShortlist(req, res));

router.delete("/courses/:courseCode/lecturers/:lecturerEmail/shortlist", (req, res) => controller.deleteLecturerShortlist(req, res));

router.get("/courses/:courseCode/preferredSkills", (req, res) => controller.getSkillByCourseCode(req, res));

router.post("/courses/:courseCode/preferredSkills", validateDto(CreatePreferredSkillDTO), (req, res) => controller.createPreferredSkill(req, res));

router.delete("/courses/:courseCode/preferredSkills/:skillId", (req, res) => controller.deletePreferredSkill(req, res));


// todo change course code functions to reference entity not jsut code where applicable
// todo also pluralize e.g.  getShortlistedTutorByCourseCode --> getShortlistedTutorsByCourseCode
// todo add dto validation where necessary
export default router;
