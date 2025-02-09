import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const SpaceContext = createContext();

export const SpaceProvider = ({ children }) => {
  const [SpCode, setSpCode] = useState(localStorage.getItem("SpCode") || "");
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const auth = getAuth();

  useEffect(() => {
    if (SpCode) localStorage.setItem("SpCode", SpCode);
  }, [SpCode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setUserName(currentUser.displayName || ""); // Set user name
      } else {
        setUserName("Anonymous");
      }
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <SpaceContext.Provider value={{ SpCode, setSpCode, user, userName, signOut }}>
      {children}
    </SpaceContext.Provider>
  );
};

export const useSpace = () => useContext(SpaceContext);
