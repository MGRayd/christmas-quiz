import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitScore } from '../utils/googleSheets';

function Results() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scores, setScores] = useState({
    round1: { correct: 0, incorrect: 0 },
    round2: { correct: 0, incorrect: 0 },
    round3: { correct: 0, incorrect: 0 },
    round4: { correct: 0, incorrect: 0 },
    round5: { correct: 0, incorrect: 0 }
  });

  useEffect(() => {
    // Load scores from localStorage
    const round1Score = JSON.parse(localStorage.getItem('round1Score') || '{"correct":0,"incorrect":0}');
    const round2Score = JSON.parse(localStorage.getItem('round2Score') || '{"correct":0,"incorrect":0}');
    const round3Score = JSON.parse(localStorage.getItem('round3Score') || '{"correct":0,"incorrect":0}');
    const round4Score = JSON.parse(localStorage.getItem('round4Score') || '{"correct":0,"incorrect":0}');
    const round5Score = JSON.parse(localStorage.getItem('round5Score') || '{"correct":0,"incorrect":0}');

    setScores({
      round1: round1Score,
      round2: round2Score,
      round3: round3Score,
      round4: round4Score,
      round5: round5Score
    });
  }, []);

  const calculateTotalScore = () => {
    return Object.values(scores).reduce((total, round) => total + round.correct, 0);
  };

  const calculateMaxPossibleScore = () => {
    return Object.values(scores).reduce((total, round) => total + (round.correct + round.incorrect), 0);
  };

  const handleSubmitScore = async () => {
    if (!playerName.trim()) return;
    
    try {
      const scoreData = {
        name: playerName.trim(),
        score: calculateTotalScore(),
        maxScore: calculateMaxPossibleScore(),
        date: new Date().toISOString(),
        roundScores: scores
      };

      console.log('Submitting score data:', scoreData); // Debug log

      await submitScore(scoreData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('Error submitting score: ' + error.message + '\nPlease try again.');
    }
  };

  const handlePlayAgain = () => {
    // Clear all round scores
    localStorage.removeItem('round1Score');
    localStorage.removeItem('round2Score');
    localStorage.removeItem('round3Score');
    localStorage.removeItem('round4Score');
    localStorage.removeItem('round5Score');
    localStorage.removeItem('round1Answers');
    localStorage.removeItem('round2Answers');
    localStorage.removeItem('round3Answers');
    localStorage.removeItem('round4Answers');
    localStorage.removeItem('round5Answers');
    
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-green-700 py-8 px-4 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🎄 Quiz Complete! 🎄
          </h2>

          <div className="space-y-6">
            {/* Round Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(scores).map(([round, score]) => (
                <div key={round} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    Round {round.slice(-1)}
                  </h3>
                  <div className="flex justify-between">
                    <span className="text-green-600">Correct: {score.correct}</span>
                    <span className="text-red-600">Incorrect: {score.incorrect}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Score */}
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-blue-800 mb-2">
                Total Score: {calculateTotalScore()} / {calculateMaxPossibleScore()}
              </h3>
              <p className="text-blue-600">
                {Math.round((calculateTotalScore() / calculateMaxPossibleScore()) * 100)}% Correct
              </p>
            </div>

            {!isSubmitted ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    className="flex-1 p-3 border rounded-lg"
                    maxLength={20}
                  />
                  <button
                    onClick={handleSubmitScore}
                    disabled={!playerName.trim()}
                    className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold
                             hover:bg-green-700 transition-all duration-300 disabled:opacity-50"
                  >
                    Submit Score
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-green-600 font-semibold">
                  Score submitted successfully!
                </p>
                <button
                  onClick={handlePlayAgain}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold
                           hover:bg-blue-700 transition-all duration-300"
                >
                  Play Again 🎮
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results; 