import { Pet } from "../types/types";

interface PetsListProps {
  pets: Pet[];
  onPetClick: (petId: string) => void;
}

export default function PetsList({ pets, onPetClick }: PetsListProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-black">All Pets</h2>
      <div className="space-y-2">
        {pets.map((pet) => (
          <div
            key={pet.pet_id}
            className="p-3 border rounded hover:bg-gray-50 cursor-pointer text-black"
            onClick={() => onPetClick(pet.pet_id)}
          >
            <h3 className="font-medium text-black">{pet.name}</h3>
            <p className="text-xs text-gray-400">ID: {pet.pet_id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
