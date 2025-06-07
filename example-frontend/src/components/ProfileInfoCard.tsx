import { Profile } from "../types/types";

interface ProfileInfoCardProps {
  profile: Profile;
  onDelete: () => void;
}

export default function ProfileInfoCard({
  profile,
  onDelete,
}: ProfileInfoCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold mb-4 text-black">
        Profile Information
      </h2>
      <div className="space-y-2">
        <p className="text-black">
          <span className="font-medium">First Name:</span> {profile.first_name}
        </p>
        <p className="text-black">
          <span className="font-medium">Last Name:</span> {profile.last_name}
        </p>
        <p className="text-black">
          <span className="font-medium">Email:</span> {profile.email}
        </p>
        <p className="text-xs text-gray-400">ID: {profile.profile_id}</p>
        <button
          onClick={onDelete}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete Profile
        </button>
      </div>
    </div>
  );
}
