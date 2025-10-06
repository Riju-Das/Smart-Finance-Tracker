import type { MiddlewareFunction } from "react-router-dom";
import { create } from "zustand";

interface User{
  id: String;
  username: string;
  fullname:string;
  email:string;
}

interface AuthStore{
  accessToken: string | null;
  user: User | null;
  setAccessToken: (token: string | null )=>void;
  setUser: (user: User | null )=>void;
  logout: ()=>void
}

export const useAuthStore = create<AuthStore>((set)=>({
  accessToken: null,
  user:null,
  setAccessToken: (token)=> set({accessToken:token}),
  setUser:(user)=>set({user}),
  logout: ()=>set({accessToken:null , user:null})
}))
