interface CreatePetFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  petName: string;
  onPetNameChange: (value: string) => void;
}

export default function CreatePetForm({
  onSubmit,
  petName,
  onPetNameChange,
}: CreatePetFormProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-black">Create New Pet</h2>

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
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Create Pet
          </button>
        </div>
      </form>
    </div>
  );
}
