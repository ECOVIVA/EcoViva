"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Post } from "../../../types/typesCM"
import { mockPosts } from "../../../pages/data/mockData"

interface PostContextType {
  posts: Post[]
  addPost: (post: Post) => void
}

const PostContext = createContext<PostContextType | undefined>(undefined)

export function PostProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(mockPosts)

  const addPost = (post: Post) => {
    setPosts((currentPosts) => [post, ...currentPosts])
  }

  return <PostContext.Provider value={{ posts, addPost }}>{children}</PostContext.Provider>
}

export function usePosts() {
  const context = useContext(PostContext)
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostProvider")
  }
  return context
}
