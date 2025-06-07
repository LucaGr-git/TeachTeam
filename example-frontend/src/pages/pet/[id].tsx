import { useState, useEffect } from "react";
import { Geist } from "next/font/google";
import { useRouter } from "next/router";
import { Pet, Profile } from "../../types/types";
import { petService } from "../../services/api";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import PetInfoCard from "../../components/PetInfoCard";
import ProfileAssociationForm from "../../components/ProfileAssociationForm";
import AssociatedProfilesList from "../../components/AssociatedProfilesList";

const geist = Geist({
  subsets: ["latin"],
});

export default function PetDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [pet, setPet] = useState<Pet | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [newProfileId, setNewProfileId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPet();
      fetchProfiles();
    }
  }, [id]);

  const fetchPet = async () => {
    try {
      const data = await petService.getPet(id as string);
      setPet(data);
    } catch (error) {
      console.error("Error fetching pet:", error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const data = await petService.getPetProfiles(id as string);
      setProfiles(data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  const handleAssociateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileId.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      await petService.associatePetWithProfile(id as string, newProfileId);
      setNewProfileId("");
      await fetchProfiles();
    } catch (error) {
      console.error("Error associating profile:", error);
      setError(
        "Failed to associate profile. Please check the profile ID and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      await petService.deletePet(id as string);
      router.push("/pets");
    } catch (error) {
      console.error("Error deleting pet:", error);
      setError("Failed to delete pet. Please try again.");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!pet) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`${geist.className} min-h-screen p-8 bg-gray-50 text-black`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 text-blue-500 hover:text-blue-600"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-black">Pet Details</h1>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete Pet
          </button>
        </div>

        <DeleteConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
          itemName={pet.name}
        />

        <PetInfoCard pet={pet} />

        <ProfileAssociationForm
          onSubmit={handleAssociateProfile}
          profileId={newProfileId}
          onProfileIdChange={setNewProfileId}
          isSubmitting={isSubmitting}
          error={error}
        />

        <AssociatedProfilesList profiles={profiles} />
      </div>
    </div>
  );
}
