import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLeaderboard } from '../utils/googleSheets';

function Home() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setIsLoading(true);
        const data = await fetchLeaderboard();
        console.log('Leaderboard data:', data); // Debug log
        setLeaderboard(data);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLeaderboard();
  }, []);

  const startQuiz = () => {
    navigate('/round1');
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-green-700 py-8 px-4 sm:py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <h1 className="text-4xl font-bold mb-6 text-red-700">
            Welcome to Christmas Quiz! 🎄
          </h1>
          <p className="text-lg mb-8 text-gray-700">
            Test your Christmas knowledge with our festive quiz! Are you ready to get into the holiday spirit?
          </p>
          <button
            onClick={startQuiz}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full 
                     transform transition-transform hover:scale-105 shadow-lg"
          >
            Start Quiz 🎅
          </button>
        </div>

        {/* Leaderboard Section */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🏆 Leaderboard 🏆
          </h2>
          {isLoading ? (
            <div className="text-center py-4">Loading leaderboard...</div>
          ) : leaderboard.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Rank</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-right">Score</th>
                    <th className="px-4 py-2 text-right">Percentage</th>
                    <th className="px-4 py-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr 
                      key={index}
                      className={`border-t ${index < 3 ? 'bg-yellow-50' : ''}`}
                    >
                      <td className="px-4 py-2">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </td>
                      <td className="px-4 py-2 font-medium">{entry.name}</td>
                      <td className="px-4 py-2 text-right">
                        {entry.score}/{entry.maxScore}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {Math.round((entry.score / entry.maxScore) * 100)}%
                      </td>
                      <td className="px-4 py-2 text-right text-gray-600">
                        {formatDate(entry.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No scores yet. Be the first to play!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home; 