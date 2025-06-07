import { useState, useEffect } from "react";
import { Geist } from "next/font/google";
import { useRouter } from "next/router";
import { Profile } from "../types/types";
import { profileService } from "../services/api";

const geist = Geist({
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [newProfile, setNewProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  // Fetch profiles on component mount
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const data = await profileService.getAllProfiles();
      setProfiles(data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await profileService.createProfile(newProfile);
      setNewProfile({ first_name: "", last_name: "", email: "" });
      fetchProfiles();
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  const handleProfileClick = (profileId: string) => {
    router.push(`/profile/${profileId}`);
  };

  return (
    <div
      className={`${geist.className} min-h-screen p-8 bg-gray-50 text-black`}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-black">
          Pet Management System
        </h1>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-black">Profiles</h2>

          <form onSubmit={handleCreateProfile} className="mb-6">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="First Name"
                value={newProfile.first_name}
                onChange={(e) =>
                  setNewProfile({ ...newProfile, first_name: e.target.value })
                }
                className="w-full p-2 border rounded text-black"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newProfile.last_name}
                onChange={(e) =>
                  setNewProfile({ ...newProfile, last_name: e.target.value })
                }
                className="w-full p-2 border rounded text-black"
              />
              <input
                type="email"
                placeholder="Email"
                value={newProfile.email}
                onChange={(e) =>
                  setNewProfile({ ...newProfile, email: e.target.value })
                }
                className="w-full p-2 border rounded text-black"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Create Profile
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {profiles.map((profile) => (
              <div
                key={profile.profile_id}
                className="p-3 border rounded hover:bg-gray-50 cursor-pointer text-black"
                onClick={() => handleProfileClick(profile.profile_id)}
              >
                <h3 className="font-medium text-black">
                  {profile.first_name} {profile.last_name}
                </h3>
                <p className="text-sm text-black">{profile.email}</p>
                <p className="text-xs text-gray-400">
                  ID: {profile.profile_id}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
