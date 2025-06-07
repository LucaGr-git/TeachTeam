interface ProfileAssociationFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  profileId: string;
  onProfileIdChange: (value: string) => void;
  isSubmitting: boolean;
  error?: string;
}

export default function ProfileAssociationForm({
  onSubmit,
  profileId,
  onProfileIdChange,
  isSubmitting,
  error,
}: ProfileAssociationFormProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4 text-black">
        Associate New Profile
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="profileId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Profile ID
          </label>
          <input
            type="text"
            id="profileId"
            value={profileId}
            onChange={(e) => onProfileIdChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter profile ID"
            disabled={isSubmitting}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting || !profileId.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Associating..." : "Associate Profile"}
        </button>
      </form>
    </div>
  );
}
