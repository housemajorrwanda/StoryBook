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
  simulations: [],
  _count: {
    userProgress: number
  }
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


export interface EducationStatistics {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  totalViews: number;
  mostViewedContent: {
    id: number;
    title: string;
    views: number;
    author: string;
  } | null;
  contentByType: Record<string, number>;
  contentByCategory: Record<string, number>;
  totalUserProgress: number;
}

export interface UserProgressResponse {
  totalContent: number;
  completedContent: number;
  inProgressContent: number;
  progressPercentage: number;
}
