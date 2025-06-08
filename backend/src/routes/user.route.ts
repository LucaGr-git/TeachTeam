import { Router } from "express";
import { PetController } from "../controller/PetController";
import { validateDto } from "../middlewares/validate";
import { CreatePetDTO } from "../exampledtos/create-pet.dto";
import { UpdatePetDTO } from "../exampledtos/update-pet.dto";
import { CourseController } from "src/controller/CourseController";


import { UserController } from '../controller/UserController'

const router = Router();
const controller = new UserController();
  
router.post('/', (req, res) => controller.createUser(req, res));

router.get('/', (req, res) => controller.getAll(req, res));

router.get('/:email', (req, res) => controller.getUserByEmail(req, res));

router.put('/:email', (req, res) => controller.update(req, res));

router.delete('/:email', (req, res) => controller.delete(req, res));

router.get('/:email/user', (req, res) => controller.getUserByEmail(req, res));

router.post('/:email/experience', (req, res) => controller.addExperienceToUser(req, res));

router.delete('/:email/experience/:experienceId', (req, res) => controller.deleteExperience(req, res));

router.get('/:email/experiences', (req, res) => controller.getUserExperiences(req, res));

router.post('/:email/skill', (req, res) => controller.addSkillToUser(req, res));

router.delete('/:email/skill/:skill', (req, res) => controller.deleteSkill(req, res));

router.get('/:email/skills', (req, res) => controller.getUserSkills(req, res));

router.post('/:email/qualification', (req, res) => controller.addQualificationToUser(req, res));

router.delete('/:email/qualification/:qualification', (req, res) => controller.deleteQualification(req, res));

router.get('/:email/qualifications', (req, res) => controller.getUserQualifications(req, res));

export default router;
