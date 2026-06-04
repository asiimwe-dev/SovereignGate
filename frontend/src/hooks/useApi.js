import axios from 'axios';
import { useSystem } from '../context/SystemContext';

export const useApi = () => {
  const { API_BASE, fetchStatus, setSharesSubmitted } = useSystem();

  const submitShare = async (batchId, adminId, shareValue, hardwareToken) => {
    try {
      const response = await axios.post(`${API_BASE}/mpc/submit-share`, {
        batch_id: batchId,
        admin_id: adminId,
        share_value: shareValue,
        hardware_token: hardwareToken
      });
      
      // Update the signed list
      setSharesSubmitted(prev => [...new Set([...prev, adminId])]);
      
      await fetchStatus();
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Share submission failed";
    }
  };

  const triggerInject = async () => {
    try {
      const response = await axios.post(`${API_BASE}/simulator/inject`);
      await fetchStatus();
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "Injection failed";
    }
  };

  const resetSystem = async () => {
    try {
      const response = await axios.post(`${API_BASE}/simulator/reset`);
      setSharesSubmitted([]); // Reset local UI state
      await fetchStatus();
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || "System reset failed";
    }
  };

  return { submitShare, triggerInject, resetSystem };
};
