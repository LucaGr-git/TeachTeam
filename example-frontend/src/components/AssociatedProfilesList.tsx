import Link from "next/link";
import { Profile } from "../types/types";

interface AssociatedProfilesListProps {
  profiles: Profile[];
}

export default function AssociatedProfilesList({
  profiles,
}: AssociatedProfilesListProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-black">
        Associated Profiles
      </h2>
      {profiles.length > 0 ? (
        <div className="space-y-4">
          {profiles.map((profile) => (
            <Link
              href={`/profile/${profile.profile_id}`}
              key={profile.profile_id}
              className="block"
            >
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <p className="font-medium">
                  {profile.first_name} {profile.last_name}
                </p>
                <p className="text-sm text-gray-600">{profile.email}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No profiles associated with this pet.</p>
      )}
    </div>
  );
}
