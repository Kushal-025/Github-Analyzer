import { useState, useEffect } from "react";
import axios from "axios";
import { History, Star } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const RecentSearches = ({ onSelectProfile }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/history`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  // Poll for new history every 5 seconds or fetch on mount
  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && history.length === 0) return null;
  if (history.length === 0) return null;

  return (
    <div className="card mt-8">
      <div className="flex items-center gap-2 mb-4">
        <History size={16} className="text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Recent Searches</h3>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectProfile(item.username)}
            className="flex flex-col items-center gap-2 min-w-[100px] p-3 rounded-lg bg-[#1a1a25] border border-[rgba(255,255,255,0.07)] hover:border-purple-500/50 hover:bg-[#1f1f2e] transition-all group"
          >
            <img 
              src={item.avatar_url} 
              alt={item.username} 
              className="w-10 h-10 rounded-full border border-gray-700 group-hover:border-purple-500 transition-colors"
            />
            <span className="text-xs font-mono text-gray-300 w-full truncate text-center">
              {item.username}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold bg-black/30 px-2 py-0.5 rounded-full">
              <Star size={10} className={item.rating >= 7 ? "text-green-400" : item.rating >= 5 ? "text-yellow-400" : "text-red-400"} />
              <span className={item.rating >= 7 ? "text-green-400" : item.rating >= 5 ? "text-yellow-400" : "text-red-400"}>
                {item.rating}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
