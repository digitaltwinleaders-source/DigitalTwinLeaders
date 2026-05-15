export interface CouncilMember {
  id?: string;
  name: string;
  role: string;
  bio?: string;
  order: number;
  photoBase64?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
