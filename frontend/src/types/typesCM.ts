export interface Post {
  id: number
  author: string
  timestamp: string
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  isCommunityPost: boolean
  eventData?: {
    name: string
    date: string
    time: string
    location: string
    category: string
    goals?: Array<{
      id: string
      title: string
      targetValue: number
      unit: string
    }>
  }
}

export interface EventComment {
  id: number
  author: string
  content: string
  image?: string
  timestamp: string
  status: "pending" | "approved" | "rejected"
  isOwner: boolean
}

export interface EventParticipant {
  id: number
  name: string
  avatar?: string
  joinedAt: string
  contributionsCount: number
  status: "active" | "inactive"
}
