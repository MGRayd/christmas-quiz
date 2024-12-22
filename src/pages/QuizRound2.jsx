import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQuestionCircle, FaLock, FaLockOpen } from 'react-icons/fa';

// Add hints array to match the movies
const movieHints = [
  "A modern musical adaptation of A Christmas Carol",
  "The Griswolds' chaotic holiday adventure",
  "A young boy defends his house from burglars",
  "Tim Allen becomes Father Christmas",
  "How the mean one stole Christmas",
  "Eddie Murphy's festive neighborhood competition",
  "Kurt Russell stars as Santa Claus",
  "A family celebrates with the Kranks",
  "A Christmas musical with Bing Crosby",
  "The story of Jesus' birth"
];

// Update correct answers array
const correctAnswers = [
  "Spirited",
  "National Lampoons Christmas Vacation",
  "Home Alone",
  "The Santa Clause",
  "How the Grinch Stole Christmas",
  "Candy Cane Lane",
  "The Christmas Chronicles",
  "Christmas with the Kranks",
  "Deck The Halls",
  "Nativity"
];

// Update the alternativeAnswers object
const alternativeAnswers = {
  3: ["Santa Clause"],
  4: ["The Grinch", "How the Grinch Stole Christmas"],
  6: ["Christmas Chronicles"]
};

function QuizRound2() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [revealedImages, setRevealedImages] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showHint, setShowHint] = useState({});
  const [hintsUsed, setHintsUsed] = useState(0);
  const [lockedAnswers, setLockedAnswers] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAnswer = (index, value) => {
    setAnswers(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleHint = (index) => {
    if (hintsUsed < 3 && !showHint[index]) {
      setShowHint(prev => ({ ...prev, [index]: true }));
      setHintsUsed(prev => prev + 1);
    }
  };

  const toggleLock = (index) => {
    if (!lockedAnswers[index] && answers[index]?.trim()) {
      setLockedAnswers(prev => ({
        ...prev,
        [index]: true
      }));
    }
  };

  const handleSubmit = () => {
    if (Object.keys(lockedAnswers).length === 10) {
      setShowResults(true);
      setRevealedImages(true);
      const score = calculateScore();
      console.log('Saving Round2 score:', score);
      localStorage.setItem('round2Answers', JSON.stringify(answers));
      localStorage.setItem('round2Score', JSON.stringify({
        ...score,
        hintsUsed
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    navigate('/round3');
  };

  // Update the answer checking in calculateScore
  const normalizeAnswer = (answer) => {
    return answer
      ?.toLowerCase()
      .replace(/['']/g, '')  // Remove apostrophes
      .replace(/[^a-z0-9\s]/g, '')  // Remove other special characters
      .replace(/\s+/g, ' ')  // Normalize spaces
      .trim();
  };

  const calculateScore = () => {
    let correct = 0;
    correctAnswers.forEach((answer, index) => {
      const normalizedInput = normalizeAnswer(answers[index]);
      
      // Check if this question has alternative answers
      if (alternativeAnswers[index]) {
        const isCorrect = alternativeAnswers[index].some(alt => 
          normalizeAnswer(alt) === normalizedInput
        );
        if (isCorrect) correct++;
      } else {
        // Regular single answer check
        if (normalizedInput === normalizeAnswer(answer)) {
          correct++;
        }
      }
    });
    return {
      correct,
      incorrect: correctAnswers.length - correct
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-green-700 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Round 2: Christmas Movies! 🎬
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            You have 3 hints available for this round - use them wisely! 🎯
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="relative">
                  <img
                    src={`${import.meta.env.BASE_URL}images/${index + 1}${revealedImages ? '' : '-Blanked'}.jpg`}
                    alt={`Christmas Movie ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                  {!showHint[index] && hintsUsed < 3 && !answers[index] && (
                    <button
                      onClick={() => handleHint(index)}
                      className="absolute top-2 right-2 p-2 rounded-lg bg-blue-100 text-blue-600 
                               hover:bg-blue-200 transition-colors duration-200 flex items-center gap-2"
                      title={`Use Hint (${3 - hintsUsed} remaining)`}
                      tabIndex="-1"
                    >
                      <FaQuestionCircle className="text-lg" />
                      <span className="hidden sm:inline">
                        ({3 - hintsUsed})
                      </span>
                    </button>
                  )}
                </div>

                {showHint[index] && (
                  <p className="text-blue-600 text-sm animate-fadeIn">
                    💡 {movieHints[index]}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={answers[index] || ''}
                    onChange={(e) => !lockedAnswers[index] && handleAnswer(index, e.target.value)}
                    placeholder="Enter movie title..."
                    className="flex-1 p-2 border rounded"
                    disabled={showResults || lockedAnswers[index]}
                    tabIndex={index * 2 + 1}
                  />
                  <button
                    onClick={() => toggleLock(index)}
                    disabled={!answers[index]?.trim() || showResults}
                    className={`p-2 rounded-lg transition-colors duration-300 ${
                      lockedAnswers[index] 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    tabIndex={index * 2 + 2}
                  >
                    {lockedAnswers[index] ? <FaLock /> : <FaLockOpen />}
                  </button>
                </div>

                {showResults && (
                  <p className={`font-semibold ${
                    alternativeAnswers[index] 
                      ? alternativeAnswers[index].some(alt => 
                          normalizeAnswer(alt) === normalizeAnswer(answers[index])
                        )
                        ? 'text-green-600'
                        : 'text-red-600'
                      : normalizeAnswer(answers[index]) === normalizeAnswer(correctAnswers[index])
                        ? 'text-green-600'
                        : 'text-red-600'
                  }`}>
                    {alternativeAnswers[index] 
                      ? alternativeAnswers[index].some(alt => 
                          normalizeAnswer(alt) === normalizeAnswer(answers[index])
                        )
                        ? '✓ Correct!'
                        : `✗ Incorrect. The correct answer was: ${correctAnswers[index]}${alternativeAnswers[index].length > 0 ? ` or ${alternativeAnswers[index].join(' or ')}` : ''}`
                      : normalizeAnswer(answers[index]) === normalizeAnswer(correctAnswers[index])
                        ? '✓ Correct!'
                        : `✗ Incorrect. The correct answer was: ${correctAnswers[index]}`}
                  </p>
                )}
              </div>
            ))}
          </div>

          {!showResults ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(lockedAnswers).length !== 10}
              className={`w-full mt-8 py-3 rounded-lg font-semibold transform transition-all duration-300
                ${Object.keys(lockedAnswers).length === 10
                  ? 'bg-green-600 hover:bg-green-700 text-white hover:scale-102'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
                animate-bounce`}
            >
              Submit Answers ({Object.keys(lockedAnswers).length}/10 Locked)
            </button>
          ) : (
            <div className="animate-fadeIn">
              <div className="grid grid-cols-2 gap-4 mt-8 mb-8">
                <div className="bg-green-100 p-4 sm:p-6 rounded-lg text-center transform transition hover:scale-105">
                  <p className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                    {calculateScore().correct}
                  </p>
                  <p className="text-green-800">Correct</p>
                </div>
                <div className="bg-red-100 p-4 sm:p-6 rounded-lg text-center transform transition hover:scale-105">
                  <p className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">
                    {calculateScore().incorrect}
                  </p>
                  <p className="text-red-800">Incorrect</p>
                </div>
              </div>
              <button
                onClick={handleNext}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold
                         hover:bg-green-700 transition-all duration-300 hover:scale-102
                         animate-bounce"
              >
                Continue to Round 3 🎄
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizRound2;