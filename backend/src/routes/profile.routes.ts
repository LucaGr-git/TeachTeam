import { Router } from "express";
import { ProfileController } from "../controller/ProfileController";
import { validateDto } from "../middlewares/validate";
import { CreateProfileDTO } from "../dtos/create-profile.dto";
import { UpdateProfileDTO } from "../dtos/update-profile.dto";

const router = Router();

const profileController = new ProfileController();

router.get("/", (req, res) => profileController.getAll(req, res));
router.get("/:id", (req, res) => profileController.getOne(req, res));

router.post("/", validateDto(CreateProfileDTO), (req, res) =>
  profileController.create(req, res)
);

router.put("/:id", validateDto(UpdateProfileDTO), (req, res) =>
  profileController.update(req, res)
);

router.delete("/:id", (req, res) => profileController.delete(req, res));

router.get("/:id/pets", (req, res) => profileController.getAllPets(req, res));
router.get("/:id/pets/:pet_id", (req, res) =>
  profileController.getOnePet(req, res)
);
router.post("/:id/pets", (req, res) => profileController.createPet(req, res));
router.delete("/:id/pets/:pet_id", (req, res) =>
  profileController.deletePet(req, res)
);

export default router;
