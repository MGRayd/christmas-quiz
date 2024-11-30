import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaLockOpen } from 'react-icons/fa';

const anagrams = [
  {
    id: 1,
    scrambled: "CAROL GININS",
    answer: "CAROL SINGING",
    hint: "Musical festive activity"
  },
  {
    id: 2,
    scrambled: "WINTER HAMS",
    answer: "WARM NIGHTS",
    hint: "Cozy evening description"
  },
  {
    id: 3,
    scrambled: "TINY VITAL",
    answer: "NATIVITY",
    hint: "The Christmas story"
  },
  {
    id: 4,
    scrambled: "PRESENT",
    answer: "SERPENT",
    hint: "Something wrapped under the tree"
  },
  {
    id: 5,
    scrambled: "FRUIT CAKES",
    answer: "FRUIT CAKES",
    hint: "Traditional Christmas dessert"
  },
  {
    id: 6,
    scrambled: "SLEIGH BELLS",
    answer: "SLEIGH BELLS",
    hint: "They ring on Santa's transport"
  },
  {
    id: 7,
    scrambled: "SMILE TOTE",
    answer: "MISTLETOE",
    hint: "Kiss beneath it"
  },
  {
    id: 8,
    scrambled: "MATHS RISC",
    answer: "CHRISTMAS",
    hint: "The holiday itself"
  },
  {
    id: 9,
    scrambled: "RIDE NEAR",
    answer: "REINDEER",
    hint: "Santa's helpers"
  },
  {
    id: 10,
    scrambled: "WRAP PAPER",
    answer: "WRAP PAPER",
    hint: "Decorative covering"
  }
];

// Add normalizeAnswer helper function
const normalizeAnswer = (answer) => {
  return answer
    ?.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

function QuizRound3() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [lockedAnswers, setLockedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showHint, setShowHint] = useState({});

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAnswerChange = (id, value) => {
    if (!lockedAnswers[id]) {
      setAnswers(prev => ({
        ...prev,
        [id]: value
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

  const toggleHint = (id) => {
    setShowHint(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Update calculateScore
  const calculateScore = () => {
    let correct = 0;
    anagrams.forEach(q => {
      if (normalizeAnswer(answers[q.id]) === normalizeAnswer(q.answer)) {
        correct++;
      }
    });
    return {
      correct,
      incorrect: anagrams.length - correct
    };
  };

  const handleSubmit = () => {
    if (Object.keys(lockedAnswers).length === anagrams.length) {
      setShowResults(true);
      localStorage.setItem('round3Answers', JSON.stringify(answers));
      localStorage.setItem('round3Score', JSON.stringify(calculateScore()));
      // Smooth scroll to top when showing results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    navigate('/round4');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-green-700 py-8 px-4 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
            Round 3: Christmas Anagrams! 🎄
          </h2>

          <div className="space-y-6">
            {anagrams.map((anagram) => (
              <div 
                key={anagram.id}
                className="bg-gray-50 p-4 rounded-lg transform transition-all duration-500"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <p className="text-lg sm:text-xl font-bold text-gray-700 mb-2">
                      {anagram.scrambled}
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={answers[anagram.id] || ''}
                        onChange={(e) => handleAnswerChange(anagram.id, e.target.value)}
                        disabled={lockedAnswers[anagram.id] || showResults}
                        placeholder="Unscramble the letters..."
                        className="flex-1 p-2 border rounded-lg text-sm sm:text-base"
                      />
                      <button
                        onClick={() => toggleLock(anagram.id)}
                        className={`p-2 rounded-lg transition-colors duration-300 ${
                          lockedAnswers[anagram.id] 
                            ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {lockedAnswers[anagram.id] ? <FaLock /> : <FaLockOpen />}
                      </button>
                      <button
                        onClick={() => toggleHint(anagram.id)}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200
                                 transition-colors duration-300"
                      >
                        💡
                      </button>
                    </div>
                  </div>
                </div>
                {showHint[anagram.id] && (
                  <p className="text-blue-600 mt-2 animate-fadeIn">
                    Hint: {anagram.hint}
                  </p>
                )}
                {showResults && (
                  <p className={`font-semibold ${
                    normalizeAnswer(answers[anagram.id]) === normalizeAnswer(anagram.answer)
                      ? 'text-green-600'
                      : 'text-red-600'
                    } animate-fadeIn`}
                  >
                    Correct Answer: {anagram.answer}
                  </p>
                )}
              </div>
            ))}
          </div>

          {!showResults && (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(lockedAnswers).length !== anagrams.length}
              className={`w-full mt-8 py-3 rounded-lg font-semibold transform transition-all duration-300
                ${Object.keys(lockedAnswers).length === anagrams.length
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
                Continue to Round 4 🎄
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizRound3; 