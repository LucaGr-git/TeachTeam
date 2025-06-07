import { Router } from "express";
import { PetController } from "../controller/PetController";
import { validateDto } from "../middlewares/validate";
import { CreatePetDTO } from "../dtos/create-pet.dto";
import { UpdatePetDTO } from "../dtos/update-pet.dto";
const router = Router();

const petController = new PetController();

router.get("/", (req, res) => petController.getAll(req, res));
router.get("/:pet_id", (req, res) => petController.getOne(req, res));
router.post("/", validateDto(CreatePetDTO), (req, res) =>
  petController.create(req, res)
);
router.put("/:pet_id", validateDto(UpdatePetDTO), (req, res) =>
  petController.update(req, res)
);
router.delete("/:pet_id", (req, res) => petController.delete(req, res));
router.get("/:pet_id/profiles", (req, res) =>
  petController.getOneProfile(req, res)
);

router.post("/:pet_id/profiles/:profile_id", (req, res) =>
  petController.attachProfile(req, res)
);

export default router;
