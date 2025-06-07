interface AddPetFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  petName: string;
  onPetNameChange: (value: string) => void;
}

export default function AddPetForm({
  onSubmit,
  petName,
  onPetNameChange,
}: AddPetFormProps) {
  return (
    <form onSubmit={onSubmit} className="mb-6">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Pet Name"
          value={petName}
          onChange={(e) => onPetNameChange(e.target.value)}
          className="w-full p-2 border rounded text-black"
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Add Pet
        </button>
      </div>
    </form>
  );
}
