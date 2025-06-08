import { Router } from "express";
import { PetController } from "../controller/PetController";
import { validateDto } from "../middlewares/validate";
import { CreatePetDTO } from "../exampledtos/create-pet.dto";
import { UpdatePetDTO } from "../exampledtos/update-pet.dto";
import { CourseController } from "src/controller/CourseController";


import { UserController } from '../controller/UserController'

const router = Router();
const controller = new UserController();
  
router.post('/users', (req, res) => controller.createUser(req, res));

router.get('/users', (req, res) => controller.getAll(req, res));

router.get('/users/:email', (req, res) => controller.getUserByEmail(req, res));

router.put('/users/:email', (req, res) => controller.update(req, res));

router.delete('/users/:email', (req, res) => controller.delete(req, res));

router.post('/users/:email/experiences', (req, res) => controller.addExperienceToUser(req, res));

router.delete('/users/:email/experiences/:experienceId', (req, res) => controller.deleteExperience(req, res));

router.get('/users/:email/experiences', (req, res) => controller.getUserExperiences(req, res));

router.post('/users/:email/skills', (req, res) => controller.addSkillToUser(req, res));

router.delete('/users/:email/skills/:skillId', (req, res) => controller.deleteSkill(req, res));

router.get('/users/:email/skills', (req, res) => controller.getUserSkills(req, res));

router.post('/users/:email/qualifications', (req, res) => controller.addQualificationToUser(req, res));

router.delete('/users/:email/qualifications/:qualificationId', (req, res) => controller.deleteQualification(req, res));

router.get('/users/:email/qualifications', (req, res) => controller.getUserQualifications(req, res));

// todo ada dto validation where necessary

export default router;
