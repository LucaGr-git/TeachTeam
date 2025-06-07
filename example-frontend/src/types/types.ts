export interface Profile {
  profile_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Pet {
  pet_id: string;
  name: string;
  profile_id?: string;
}
