import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SystemContext = createContext();

export const SystemProvider = ({ children }) => {
  const [batch, setBatch] = useState(null);
  const [sharesSubmitted, setSharesSubmitted] = useState([]); // Array of admin IDs who have signed
  const [isCompromised, setIsCompromised] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:8000/api/v1';

  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE}/gate/batch`);
      setBatch(response.data);
      
      // If the batch was settled, we might want to clear local sign state 
      // but for the demo, we keep it or rely on the backend.
      // Since backend doesn't return WHO signed yet, we manage it locally 
      // via the submitShare hook in useApi.
      
      if (response.data.status === 'CRITICAL_COMPROMISE') {
        setIsCompromised(true);
      }
    } catch (error) {
      console.error("Failed to fetch system status", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <SystemContext.Provider value={{ 
      batch, 
      sharesSubmitted, 
      setSharesSubmitted, 
      isCompromised, 
      loading,
      fetchStatus,
      API_BASE
    }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => useContext(SystemContext);
