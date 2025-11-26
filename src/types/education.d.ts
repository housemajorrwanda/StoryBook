export interface EducationContent {
  id: number
  title: string
  description: string
  content: string
  type: string
  imageUrl: string
  videoUrl: string | null
  duration: number | null
  views: number
  category: string
  tags: string[]
  status: string
  isPublished: boolean
  isCompleted: boolean
  userId: number
  createdAt: string
  updatedAt: string
  user: {
    id: number
    fullName: string
    email: string
  }
  simulations: []
}

export interface EducationResponse {
  data: EducationContent[]
  meta: {
    skip: number
    limit: number
    total: number
  }
}

export interface UseEducationContentParams {
  skip?: number
  limit?: number
  search?: string
  type?: string
  category?: string
  status?: string
  isPublished?: boolean
}