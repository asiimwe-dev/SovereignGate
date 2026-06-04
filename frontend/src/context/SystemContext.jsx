import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SystemContext = createContext();

export const SystemProvider = ({ children }) => {
  const [batch, setBatch] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [sharesSubmitted, setSharesSubmitted] = useState([]); 
  const [isCompromised, setIsCompromised] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:8000/api/v1';

  const fetchStatus = async () => {
    try {
      console.log("SovereignGate: Polling API...");
      const response = await axios.get(`${API_BASE}/gate/batch`);
      setBatch(response.data);
      
      // Update compromise state based on current batch status
      if (response.data.status === 'CRITICAL_COMPROMISE') {
        setIsCompromised(true);
      } else {
        setIsCompromised(false);
      }
    } catch (error) {
      console.warn("SovereignGate: API unreachable. Check if backend is running at :8000");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const value = { 
    batch,
    selectedBatch,
    setSelectedBatch,
    sharesSubmitted, 
    setSharesSubmitted, 
    isCompromised, 
    loading,
    fetchStatus,
    API_BASE
  };

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => useContext(SystemContext);
