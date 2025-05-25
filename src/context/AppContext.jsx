// src/context/AppContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Membuat Context
export const AppContext = createContext();

// Membuat Provider untuk konteks
export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState('');  // Contoh data yang akan disimpan

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook untuk mudah mengakses context
export const useAppContext = () => useContext(AppContext);
