export interface EventGoal {
  id: string
  title: string
  description: string
  targetValue: number
  currentValue: number
  unit: string
  category: "participation" | "environmental" | "educational" | "community"
}

export interface EventPost {
  id: string
  content: string
  author: {
    name: string
    avatar: string
    isVerified: boolean
  }
  timestamp: string
  likes: number
  comments: number
  shares: number
  image?: string
  isLiked: boolean
  isCommunityPost: boolean
  eventData?: {
    name: string
    date: string
    time: string
    location: string
    category: string
    goals: EventGoal[]
  }
}
