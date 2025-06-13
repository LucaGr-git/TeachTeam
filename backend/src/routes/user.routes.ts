import { Router } from "express";
import { validateDto } from "../middlewares/validate";


import { UserController } from '../controller/UserController'
import { CreateUserDTO } from "../dtos/create-user.dto";
import { UpdateUserDTO } from "../dtos/update-user.dto";
import { CreateExperienceDTO } from "../dtos/create-experience.dto";
import { CreateSkillDTO } from "../dtos/create-skill.dto";
import { CreateQualificationDTO } from "../dtos/create-qualification.dto";

const router = Router();
const controller = new UserController();
  
router.post('/users', validateDto(CreateUserDTO), (req, res) => controller.createUser(req, res));

router.get('/users', (req, res) => controller.getAll(req, res));

router.get('/users/:email', (req, res) => controller.getUserByEmail(req, res));

router.put('/users/:email', validateDto(UpdateUserDTO), (req, res) => controller.update(req, res));

router.delete('/users/:email', (req, res) => controller.delete(req, res));

router.post('/users/:email/experiences', validateDto(CreateExperienceDTO), (req, res) => controller.addExperienceToUser(req, res));

router.delete('/users/:email/experiences/:experienceId', (req, res) => controller.deleteExperience(req, res));

router.get('/users/:email/experiences', (req, res) => controller.getUserExperiences(req, res));

router.post('/users/:email/skills', validateDto(CreateSkillDTO), (req, res) => controller.addSkillToUser(req, res));

router.delete('/users/:email/skills/:skillId', (req, res) => controller.deleteSkill(req, res));

router.get('/users/:email/skills', (req, res) => controller.getUserSkills(req, res));

router.post('/users/:email/qualifications', validateDto(CreateQualificationDTO), (req, res) => controller.addQualificationToUser(req, res));

router.delete('/users/:email/qualifications/:qualificationId', (req, res) => controller.deleteQualification(req, res));

router.get('/users/:email/qualifications', (req, res) => controller.getUserQualifications(req, res));


export default router;
