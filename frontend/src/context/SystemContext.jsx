import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SystemContext = createContext();

export const SystemProvider = ({ children }) => {
  const [batch, setBatch] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batches, setBatches] = useState([]);
  const [sharesSubmitted, setSharesSubmitted] = useState([]); 
  const [isCompromised, setIsCompromised] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:8000/api/v1';

  const fetchStatus = async () => {
    try {
      console.log("SovereignGate: Polling API Status...");
      const response = await axios.get(`${API_BASE}/gate/batch`);
      setBatch(response.data);
      
      // Update compromise state based on current batch status
      if (response.data.status === 'CRITICAL_COMPROMISE') {
        setIsCompromised(true);
      } else {
        setIsCompromised(false);
      }
    } catch (error) {
      console.warn("SovereignGate: API status unreachable. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      console.log("SovereignGate: Fetching all batches...");
      const response = await axios.get(`${API_BASE}/gate/batches`);
      const list = response.data.batches || [];
      setBatches(list);
    } catch (error) {
      console.warn("SovereignGate: API batches unreachable.");
    }
  };

  // Poll status and batches list on interval
  useEffect(() => {
    fetchStatus();
    fetchBatches();
    const interval = setInterval(() => {
      fetchStatus();
      fetchBatches();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Automatically sync selectedBatch details when database state updates
  useEffect(() => {
    if (selectedBatch && batches.length > 0) {
      const updated = batches.find(b => b.batch_id === selectedBatch.batch_id);
      if (updated) {
        // Only update state if fields have actually changed
        if (updated.status !== selectedBatch.status || 
            JSON.stringify(updated.payload) !== JSON.stringify(selectedBatch.payload)) {
          setSelectedBatch(updated);
        }
      } else {
        // If selected batch was wiped from DB during system restore, reset selector
        setSelectedBatch(null);
      }
    }
  }, [batches, selectedBatch]);

  const value = { 
    batch,
    selectedBatch,
    setSelectedBatch,
    batches,
    setBatches,
    fetchBatches,
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
