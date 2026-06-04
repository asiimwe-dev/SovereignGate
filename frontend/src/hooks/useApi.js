import axios from 'axios';
import { useSystem } from '../context/SystemContext';

export const useApi = () => {
  const { API_BASE, fetchStatus } = useSystem();

  const submitShare = async (batchId, adminId, shareValue, hardwareToken) => {
    try {
      const response = await axios.post(`${API_BASE}/mpc/submit-share`, {
        batch_id: batchId,
        admin_id: adminId,
        share_value: shareValue,
        hardware_token: hardwareToken
      });
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

  return { submitShare, triggerInject };
};
