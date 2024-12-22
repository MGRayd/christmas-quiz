import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLeaderboard } from '../utils/googleSheets';

// At the top of the file, import medal emojis or use Unicode
const MEDALS = {
  1: '🥇',
  2: '🥈',
  3: '🥉'
};

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

  const formatLeaderboardData = (data) => {
    return data.map(entry => ({
      name: entry[0],
      score: entry[1],
      maxScore: entry[2],
      hintsUsed: entry[3],
      maxHints: entry[4],
      date: entry[5]
    }));
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

        {/* Rules Section */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">
            📜 How to Play
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">🎯</span>
              <p className="text-gray-700">
                Each round has 10 questions and 3 hints available - use your hints wisely!
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🔒</span>
              <p className="text-gray-700">
                Lock in your answers before submitting - you can't change them once locked!
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">✨</span>
              <p className="text-gray-700">
                5 exciting rounds: Trivia, Picture Round, Anagrams, Song Lyrics, and Emoji Pictionary
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🏆</span>
              <p className="text-gray-700">
                Your final score considers both correct answers and hint usage - can you top the leaderboard?
              </p>
            </div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="bg-white rounded-lg shadow-xl p-8 mt-8">
          <h2 className="text-3xl font-bold mb-6 text-center">
            🏆 Christmas Quiz Champions 🏆
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 text-left">Rank</th>
                    <th className="py-3 text-left">Name</th>
                    <th className="py-3 text-right">Score</th>
                    <th className="py-3 text-right">Hints</th>
                    <th className="py-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr 
                      key={index}
                      className={`border-b hover:bg-gray-50 transition-colors duration-200
                        ${index < 3 ? 'font-semibold' : ''}`}
                    >
                      <td className="py-3">
                        <span className="flex items-center gap-2">
                          {MEDALS[index + 1] || (index + 1)}
                          {index < 3 && (
                            <div className={`h-2 w-2 rounded-full ${
                              index === 0 ? 'bg-yellow-400' :
                              index === 1 ? 'bg-gray-400' :
                              'bg-amber-600'
                            }`} />
                          )}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={
                          index === 0 ? 'text-yellow-600' :
                          index === 1 ? 'text-gray-600' :
                          index === 2 ? 'text-amber-700' :
                          'text-gray-700'
                        }>
                          {entry.name}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono">
                        {entry.score}/{entry.maxScore}
                      </td>
                      <td className="py-3 text-right font-mono">
                        {entry.hintsUsed}/{entry.maxHints}
                      </td>
                      <td className="py-3 text-right text-gray-600">
                        {formatDate(entry.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {leaderboard.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No scores yet! Be the first to play! 🎮
                </div>
              )}
            </div>
          )}
        </div>

        {/* Developer Info Footer */}
        <div className="bg-white/90 rounded-lg shadow-xl p-6 text-center">
          <p className="text-gray-600">
            Created by{' '}
            <span className="font-semibold text-gray-800">Mark G</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Built with{' '}
            <span className="text-purple-600">Vite</span> +{' '}
            <span className="text-blue-500">React</span> +{' '}
            <span className="text-cyan-500">Tailwind CSS</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            2024 Christmas Quiz
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home; 