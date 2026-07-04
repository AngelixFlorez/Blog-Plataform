import { useEffect } from 'react';
import { apiService } from '../services/apiService';

const INTERVAL = 10 * 60 * 1000;

const KeepAlive = () => {
  useEffect(() => {
    const ping = async () => {
      try {
        await apiService.getPosts({});
      } catch {
        // Ignorar errores, el backend puede estar despierto o dormido
      }
    };

    ping();
    const id = setInterval(ping, INTERVAL);
    return () => clearInterval(id);
  }, []);

  return null;
};

export default KeepAlive;
