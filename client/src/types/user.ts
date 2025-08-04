export type User = {
  id: string
  dateOfBirth: string
  imageUrl?: string
  displayName: string
  created: string
  lastActivity: string
  gender: string
  description?: string
  city: string
  country: string
}

export type UserPhoto = {
  id: number
  url?: string
  publicId?: string
  memberId: string
}

export type EditableUSer = {
  displayName : string;
  description? : string;
  city : string;
  country : string;
}

export class UserParams {
  gender? : string;
  minAge = 18;
  maxAge = 100;
  pageNumber = 1;
  pageSize = 10;
  orderBy = 'lastActivity';
}