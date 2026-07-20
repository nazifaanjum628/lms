import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import GamificationDashboard from "../../components/student/GamificationDashboard";
import { AppContext } from "../../context/AppContext";

const DashboardPage = () => {
  const { backendUrl, getToken, userData, setUserData} = useContext(AppContext);

  

  const [leaderboard, setLeaderboard] = useState([]);

  // FETCH USER
  const fetchUserData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/user/data",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (data.success) {
        setUserData(data.user);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // FETCH LEADERBOARD
  const fetchLeaderboard = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/user/leaderboard"
      );
      if (data.success){
        console.log("Leaderboard Data Received:", data.leaderboard);
        setLeaderboard(data.leaderboard);
      }

    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchLeaderboard();
  }, []);

  return (
    <div>
      <GamificationDashboard user={userData} leaderboard={leaderboard} />
    </div>
  );
};

export default DashboardPage;