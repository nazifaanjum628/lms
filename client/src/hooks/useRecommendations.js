import { useState, useEffect } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';

const useRecommendations = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const [recommendations, setRecommendations] = useState([]);
  const [type, setType] = useState(''); // 'personalized' or 'popular'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(backendUrl + '/api/course/recommendations', {
          headers: {
            Authorization: `Bearer ${token}` // ← use token variable
          }
        });
        if (data.success) {
          setRecommendations(data.recommendations);
          setType(data.type);
        }
      } catch (error) {
        console.error('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
    
  }, [backendUrl]);

  return { recommendations, type, loading };
};

export default useRecommendations;