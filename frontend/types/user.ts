export type UserProfile = {
  id: number;
  email: string;
  name: string;
};

export type UpdateUserProfileDto = {
    name: string;
};
