/**
 * This file contains the API service layer for the frontend application.
 * It provides two main services:
 *
 * 1. profileService: Handles all profile-related API operations
 *    - getAllProfiles: Fetches all user profiles
 *    - createProfile: Creates a new user profile
 *    - getProfile: Retrieves a specific profile by ID
 *    - deleteProfile: Deletes a profile by ID
 *
 * 2. petService: Manages all pet-related API operations
 *    - getAllPets: Fetches all pets
 *    - getPets: Gets pets associated with a specific profile
 *    - getPet: Retrieves a specific pet by ID
 *    - createPet: Creates a new pet
 *    - associatePetWithProfile: Links a pet to a profile
 *    - getPetProfiles: Gets all profiles associated with a pet
 *    - deletePet: Deletes a pet by ID
 *
 * All API calls are made to the base URL: http://localhost:3001/api
 * The services use axios for making HTTP requests and return typed responses
 * based on the Profile and Pet interfaces defined in the types file.
 */

import axios from "axios";
import { Profile, Pet } from "../types/types";

const API_BASE_URL = "http://localhost:3001/api";

export const profileService = {
  getAllProfiles: async (): Promise<Profile[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/profile`);
    return data;
  },

  createProfile: async (profile: {
    first_name: string;
    last_name: string;
    email: string;
  }): Promise<void> => {
    await axios.post(`${API_BASE_URL}/profile`, profile);
  },

  getProfile: async (id: string): Promise<Profile> => {
    const { data } = await axios.get(`${API_BASE_URL}/profile/${id}`);
    return data;
  },

  deleteProfile: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/profile/${id}`);
  },

  updateProfile: async (
    id: string,
    profile: {
      first_name: string;
      last_name: string;
      email: string;
    }
  ): Promise<Profile> => {
    const { data } = await axios.put(`${API_BASE_URL}/profile/${id}`, profile);
    return data;
  },
};

export const petService = {
  getAllPets: async (): Promise<Pet[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/pet`);
    return data;
  },

  getPets: async (profileId: string): Promise<Pet[]> => {
    const { data } = await axios.get(
      `${API_BASE_URL}/profile/${profileId}/pets`
    );
    return data;
  },

  getPet: async (petId: string): Promise<Pet> => {
    const { data } = await axios.get(`${API_BASE_URL}/pet/${petId}`);
    return data;
  },

  createPet: async (name: string): Promise<Pet> => {
    const { data } = await axios.post(`${API_BASE_URL}/pet`, { name });
    return data;
  },

  associatePetWithProfile: async (
    petId: string,
    profileId: string
  ): Promise<void> => {
    await axios.post(`${API_BASE_URL}/pet/${petId}/profiles/${profileId}`);
  },

  getPetProfiles: async (petId: string): Promise<Profile[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/pet/${petId}/profiles`);
    return data;
  },

  deletePet: async (petId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/pet/${petId}`);
  },
};
