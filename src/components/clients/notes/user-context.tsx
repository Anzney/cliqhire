import React, { createContext, useContext } from "react";

// Dummy user, replace with actual user fetching logic
const dummyUser = {
  name: "Aapka Naam", // Yahan apne user ka naam set karo (ya login ke baad set ho)
  avatar: "AN",      // Yahan initials ya avatar set karo
};

const UserContext = createContext(dummyUser);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  // Yahan aap apna actual user fetching logic laga sakte ho
  return (
    <UserContext.Provider value={dummyUser}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);