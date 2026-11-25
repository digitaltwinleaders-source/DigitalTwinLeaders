export interface CouncilMember {
  id?: string;
  name: string;
  role: string;
  country?: string;
  countryName?: string;
  bio?: string;
  organization?: string;
  linkedInUrl?: string;
  order: number;
  featured?: boolean;
  photoBase64?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
