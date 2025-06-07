import { useState, useEffect } from "react";
import { Geist } from "next/font/google";
import { useRouter } from "next/router";
import { Profile, Pet } from "../../types/types";
import { profileService, petService } from "../../services/api";
import ProfileInfoCard from "../../components/ProfileInfoCard";
import AddPetForm from "../../components/AddPetForm";
import PetsList from "../../components/PetsList";

const geist = Geist({
  subsets: ["latin"],
});

export default function ProfileDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [newPet, setNewPet] = useState({ name: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState({
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    if (id) {
      fetchProfile();
      fetchPets();
    }
  }, [id]);

  useEffect(() => {
    if (profile) {
      setEditedName({
        first_name: profile.first_name,
        last_name: profile.last_name,
      });
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const data = await profileService.getProfile(id as string);
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;

    try {
      const updatedProfile = await profileService.updateProfile(id as string, {
        ...profile,
        first_name: editedName.first_name,
        last_name: editedName.last_name,
      });
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const fetchPets = async () => {
    try {
      const data = await petService.getPets(id as string);
      setPets(data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const handleCreatePet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdPet = await petService.createPet(newPet.name);
      await petService.associatePetWithProfile(createdPet.pet_id, id as string);
      setNewPet({ name: "" });
      fetchPets();
    } catch (error) {
      console.error("Error creating pet:", error);
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        await profileService.deleteProfile(id as string);
        router.push("/");
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`${geist.className} min-h-screen p-8 bg-gray-50 text-black`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.push("/")}
            className="mr-4 text-blue-500 hover:text-blue-600"
          >
            ← Back to Profiles
          </button>
          <h1 className="text-3xl font-bold text-black">Profile Details</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  value={editedName.first_name}
                  onChange={(e) =>
                    setEditedName({ ...editedName, first_name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  value={editedName.last_name}
                  onChange={(e) =>
                    setEditedName({ ...editedName, last_name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleUpdateProfile}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedName({
                      first_name: profile.first_name,
                      last_name: profile.last_name,
                    });
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-gray-600">{profile.email}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit Name
              </button>
            </div>
          )}
        </div>

        <ProfileInfoCard profile={profile} onDelete={handleDeleteProfile} />

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-black">Pets</h2>

          <AddPetForm
            onSubmit={handleCreatePet}
            petName={newPet.name}
            onPetNameChange={(name) => setNewPet({ ...newPet, name })}
          />

          <PetsList
            pets={pets}
            onPetClick={(petId) => router.push(`/pet/${petId}`)}
          />
        </div>
      </div>
    </div>
  );
}
