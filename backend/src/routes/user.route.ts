import { Router } from "express";
import { PetController } from "../controller/PetController";
import { validateDto } from "../middlewares/validate";
import { CreatePetDTO } from "../exampledtos/create-pet.dto";
import { UpdatePetDTO } from "../exampledtos/update-pet.dto";
import { CourseController } from "src/controller/CourseController";


import { UserController } from '../controller/UserController'

const router = Router();
const controller = new UserController();
  
router.post('/', (req, res) => controller.createUser);

router.get('/', (req, res) => controller.getAll);

router.get('/:email', (req, res) => controller.getUserByEmail);

router.put('/:email', (req, res) => controller.update);

router.delete('/:email', (req, res) => controller.delete);

router.get('/:email/profile', (req, res) => controller.getUserByEmail);

router.post('/:email/experience', (req, res) => controller.addExperienceToUser);

router.delete('/:email/experience/:experienceId', (req, res) => controller.deleteExperience);

router.get('/:email/experiences', (req, res) => controller.getUserExperiences);

router.post('/:email/skill', (req, res) => controller.addSkillToUser);

router.delete('/:email/skill/:skill', (req, res) => controller.deleteSkill);

router.get('/:email/skills', (req, res) => controller.getUserSkills);

router.post('/:email/qualification', (req, res) => controller.addQualificationToUser);

router.delete('/:email/qualification/:qualification', (req, res) => controller.deleteQualification);

router.get('/:email/qualifications', (req, res) => controller.getUserQualifications);

export default router;
