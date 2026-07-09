"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function UserButton() {
  const { data: session } = useSession();
  
  if (session) return (
    <button 
      onClick={() => {
        if(navigator.vibrate) navigator.vibrate(50);
        signOut();
      }} 
      className="active:scale-95 transition-transform duration-100"
    >
      Logout
    </button>
  );

  return (
    <button 
      onClick={() => {
        if(navigator.vibrate) navigator.vibrate(50);
        signIn();
      }} 
      className="active:scale-95 transition-transform duration-100"
    >
      Login
    </button>
  );
}