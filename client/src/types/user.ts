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
