import { Router } from "express";
import { PetController } from "../controller/PetController";
import { validateDto } from "../middlewares/validate";
import { CreatePetDTO } from "../exampledtos/create-pet.dto";
import { UpdatePetDTO } from "../exampledtos/update-pet.dto";
import { CourseController } from "src/controller/CourseController";


import { UserController } from '../controller/UserController'

const router = Router();
const controller = new UserController();
  
router.post('/', controller.createUser.bind(controller));

router.get('/', controller.getAll.bind(controller));

router.get('/:email', controller.getUserByEmail.bind(controller));

router.put('/:email', controller.update.bind(controller));

router.delete('/:email', controller.delete.bind(controller));

router.get('/:email/profile', controller.getUserByEmail.bind(controller));

router.post('/:email/experience', controller.addExperienceToUser.bind(controller));

router.delete('/:email/experience/:experienceId', controller.deleteExperience.bind(controller));

router.get('/:email/experiences', controller.getUserExperiences.bind(controller));

router.post('/:email/skill', controller.addSkillToUser.bind(controller));

router.delete('/:email/skill/:skill', controller.deleteSkill.bind(controller));

router.get('/:email/skills', controller.getUserSkills.bind(controller));

router.post('/:email/qualification', controller.addQualificationToUser.bind(controller));

router.delete('/:email/qualification/:qualification', controller.deleteQualification.bind(controller));

router.get('/:email/qualifications', controller.getUserQualifications.bind(controller));

export default router;
