import { User } from "./types";

export type Community = {
  id: number;
  name: string;
  slug: string;
  description: string;
  banner?: string; 
  icon?: string;   
  owner: User;         
  admins?: User[];      
  pending_requests?: User[]; 
  members?: User[];     
  members_count: number
  created_at: string;   
  is_private: boolean;
};
