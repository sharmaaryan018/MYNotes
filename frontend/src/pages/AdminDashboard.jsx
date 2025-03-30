import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStats, setLoading, setError } from "../utility/notesSlice";
import axios from "../services/axiosInstance";
import { Stats } from "../components/stats";

const Dashboard = () => {
  const dispatch = useDispatch();
  const stats = useSelector((state) => state.notes.stats);
  const loading = useSelector((state) => state.notes.loading);
  const error = useSelector((state) => state.notes.error);

  const fetchStats = async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get("/note/stats");
      dispatch(setStats(response.data));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []); // Remove stats from dependency array

  return (
    <div className="flex-1 p-6 mt-20 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">📊 Dashboard</h2>
        <button 
          onClick={fetchStats}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Refresh Stats
        </button>
      </div>

      {loading ? (
        <p>Loading stats...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <Stats stats={stats} />
      )}  
    </div> 
  );
};

export default Dashboard;
