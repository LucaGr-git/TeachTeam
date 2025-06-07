import { Pet } from "../types/types";

interface PetInfoCardProps {
  pet: Pet;
}

export default function PetInfoCard({ pet }: PetInfoCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4 text-black">Pet Information</h2>
      <div className="space-y-2">
        <p className="text-black">
          <span className="font-medium">Name:</span> {pet.name}
        </p>
        <p className="text-xs text-gray-400">ID: {pet.pet_id}</p>
      </div>
    </div>
  );
}
