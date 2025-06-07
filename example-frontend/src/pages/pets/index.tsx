import { useState, useEffect } from "react";
import { Geist } from "next/font/google";
import { useRouter } from "next/router";
import { Pet } from "../../types/types";
import { petService } from "../../services/api";
import CreatePetForm from "../../components/CreatePetForm";
import PetsList from "../../components/PetsList";

const geist = Geist({
  subsets: ["latin"],
});

export default function Pets() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [newPetName, setNewPetName] = useState("");

  // Fetch pets on component mount
  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const data = await petService.getAllPets();
      setPets(data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const handleCreatePet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await petService.createPet(newPetName);
      setNewPetName("");
      fetchPets();
    } catch (error) {
      console.error("Error creating pet:", error);
    }
  };

  const handlePetClick = (petId: string) => {
    router.push(`/pet/${petId}`);
  };

  return (
    <div
      className={`${geist.className} min-h-screen p-8 bg-gray-50 text-black`}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-black">Pets</h1>

        <div className="space-y-6">
          <CreatePetForm
            onSubmit={handleCreatePet}
            petName={newPetName}
            onPetNameChange={setNewPetName}
          />

          <PetsList pets={pets} onPetClick={handlePetClick} />
        </div>
      </div>
    </div>
  );
}
