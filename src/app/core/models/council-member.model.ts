export const COUNCIL_REGIONS = [
  'Europe',
  'Middle East',
  'Africa',
  'Asia-Pacific',
  'North America',
  'Latin America'
] as const;

export type CouncilRegion = typeof COUNCIL_REGIONS[number];

export interface CouncilMember {
  id?: string;
  name: string;
  role: string;
  region?: CouncilRegion;
  practitioner?: boolean;
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
