import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaLockOpen } from 'react-icons/fa';

// Import all images
const blankedImages = [...Array(10)].map((_, i) => 
  `/xmas-quiz/images/${i + 1}-Blanked.jpg`
);

const originalImages = [...Array(10)].map((_, i) => 
  `/xmas-quiz/images/${i + 1}.jpg`
);

// Add a new CSS class for image transition
const imageTransitionClass = "transition-all duration-700 transform";

// Add normalizeAnswer helper function
const normalizeAnswer = (answer) => {
  return answer
    ?.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

function QuizRound2() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [lockedAnswers, setLockedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [revealedImages, setRevealedImages] = useState(false);

  // Encoded correct answers (base64-encoded for security)
  const encodedAnswers = [
    "U2Nyb29nZWQ=",
    "TmF0aW9uYWwgTGFtcG9vbnMgQ2hyaXN0bWFzIFZhY2F0aW9u",
    "SG9tZSBBbG9uZQ==",
    "VGhlIFNhbnRhIENsYXVzZQ==",
    "SmluZ2xlIEFsbCBUaGUgV2F5",
    "SmFjayBGcm9zdA==",
    "TG92ZSBBY3R1YWxseQ==",
    "Q2hyaXN0bWFzIHdpdGggdGhlIEtyYW5rcw==",
    "RGVjayB0aGUgSGFsbHM=",
    "TmF0aXZpdHk="
  ];

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAnswerChange = (index, value) => {
    if (!lockedAnswers[index]) {
      setAnswers(prev => ({
        ...prev,
        [index]: value
      }));
    }
  };

  const toggleLock = (id) => {
    if (!lockedAnswers[id] && answers[id]?.trim()) {
      setLockedAnswers(prev => ({
        ...prev,
        [id]: true
      }));
    }
  };

  // Update calculateScore
  const calculateScore = () => {
    let correct = 0;
    Object.entries(lockedAnswers).forEach(([index, isLocked]) => {
      if (isLocked) {
        const correctAnswer = atob(encodedAnswers[index]);
        if (normalizeAnswer(answers[index]) === normalizeAnswer(correctAnswer)) {
          correct++;
        }
      }
    });
    return {
      correct,
      incorrect: 10 - correct
    };
  };

  const handleSubmit = () => {
    if (Object.keys(lockedAnswers).length === 10) {
      setShowResults(true);
      setRevealedImages(true);
      localStorage.setItem('round2Answers', JSON.stringify(answers));
      localStorage.setItem('round2Score', JSON.stringify(calculateScore()));
      // Smooth scroll to top when showing results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    navigate('/round3');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-green-700 py-8 px-4 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
            Round 2: Name That Christmas Movie! 🎬
          </h2>

          {/* Change grid to single column on mobile, two columns on larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {[...Array(10)].map((_, index) => (
              <div 
                key={index} 
                className={`space-y-4 transform transition-all duration-500 
                  ${showResults ? 'scale-100 opacity-100' : 'scale-95 opacity-90'}`}
              >
                <div className="relative overflow-hidden rounded-lg shadow-md">
                  <img
                    src={revealedImages ? originalImages[index] : blankedImages[index]}
                    alt={`Christmas Movie ${index + 1}`}
                    className={`w-full h-48 sm:h-64 object-cover ${imageTransitionClass}
                      ${revealedImages ? 'scale-105' : 'scale-100'}`}
                  />
                  {/* Add movie number overlay */}
                  <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded-full">
                    Movie {index + 1}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={answers[index] || ''}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    disabled={lockedAnswers[index] || showResults}
                    placeholder="Enter movie name..."
                    className="flex-1 p-2 border rounded-lg text-sm sm:text-base"
                  />
                  <button
                    onClick={() => toggleLock(index)}
                    className={`p-2 rounded-lg transition-colors duration-300 ${
                      lockedAnswers[index] 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {lockedAnswers[index] ? <FaLock /> : <FaLockOpen />}
                  </button>
                </div>
                {showResults && (
                  <p className={`font-semibold text-sm sm:text-base ${
                    normalizeAnswer(answers[index]) === normalizeAnswer(atob(encodedAnswers[index]))
                      ? 'text-green-600'
                      : 'text-red-600'
                    } animate-fadeIn`}
                  >
                    Correct Answer: {atob(encodedAnswers[index])}
                  </p>
                )}
              </div>
            ))}
          </div>

          {!showResults && (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(lockedAnswers).length !== 10}
              className={`w-full mt-8 py-3 rounded-lg font-semibold transform transition-all duration-300
                ${Object.keys(lockedAnswers).length === 10
                  ? 'bg-green-600 hover:bg-green-700 text-white hover:scale-102'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                animate-bounce`}
            >
              Submit Answers ({Object.keys(lockedAnswers).length}/10 Locked)
            </button>
          )}

          {showResults && (
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