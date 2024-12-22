import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaLockOpen, FaQuestionCircle } from 'react-icons/fa';

const anagrams = [
  { 
    id: 1,
    text: "VANDAL DECANTER", 
    hint: "A festive countdown to December 25th (6, 8)"
  },
  { 
    id: 2,
    text: "MERRIEST CHATS", 
    hint: "Decorated with baubles and tinsel (9, 4)"
  },
  { 
    id: 3,
    text: "SLIME TOTE", 
    hint: "Hang it up for a Christmas kiss (9)"
  },
  { 
    id: 4,
    text: "DANCEY CANS", 
    hint: "Sweet striped festive treats (5, 5)"
  },
  { 
    id: 5,
    text: "SNOG STICK", 
    hint: "Hang them by the fireplace for presents (10)"
  },
  { 
    id: 6,
    text: "ENCASES TART", 
    hint: "Anonymous gift-giving tradition (6, 5)"
  },
  { 
    id: 7,
    text: "DISARMS SCRATCH", 
    hint: "Festive greetings in the mail (9, 5)"
  },
  { 
    id: 8,
    text: "YETI DUEL", 
    hint: "Traditional name for the Christmas season (8)"
  },
  { 
    id: 9,
    text: "SCRATCH ORALISMS", 
    hint: "Songs of the season (9, 6)"
  },
  { 
    id: 10,
    text: "STARFISH REMATCH", 
    hint: "The man in red himself (6, 9)"
  }
];

const encodedAnswers = [
  "QWR2ZW50IENhbGVuZGFy",      // Advent Calendar
  "Q2hyaXN0bWFzIFRyZWU=",      // Christmas Tree
  "TWlzdGxldG9l",              // Mistletoe
  "Q2FuZHkgQ2FuZXM=",          // Candy Canes
  "U3RvY2tpbmdz",              // Stockings
  "U2VjcmV0IFNhbnRh",          // Secret Santa
  "Q2hyaXN0bWFzIENhcmRz",      // Christmas Cards
  "WXVsZXRpZGU=",              // Yuletide
  "Q2hyaXN0bWFzIENhcm9scw==",  // Christmas Carols
  "RmF0aGVyIENocmlzdG1hcw=="   // Father Christmas
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
  const [hintsUsed, setHintsUsed] = useState(0);

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

  const handleHint = (questionId) => {
    if (hintsUsed < 3 && !showHint[questionId]) {
      setShowHint(prev => ({ ...prev, [questionId]: true }));
      setHintsUsed(prev => prev + 1);
    }
  };

  // Update calculateScore function
  const calculateScore = () => {
    let correct = 0;
    anagrams.forEach((q, index) => {
      // Compare the normalized answer with the decoded correct answer
      if (normalizeAnswer(answers[q.id]) === normalizeAnswer(atob(encodedAnswers[index]))) {
        correct++;
      }
    });
    return {
      correct,
      incorrect: anagrams.length - correct
    };
  };

  // Update handleSubmit to ensure we're saving the correct scores
  const handleSubmit = () => {
    if (Object.keys(lockedAnswers).length === anagrams.length) {
      const score = calculateScore();
      setShowResults(true);
      localStorage.setItem('round3Answers', JSON.stringify(answers));
      localStorage.setItem('round3Score', JSON.stringify({
        ...score,
        hintsUsed
      }));
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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">
            Round 3: Christmas Anagrams! 🎄
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            You have 3 hints available for this round - use them wisely! 🎯
          </p>

          <div className="space-y-6">
            {anagrams.map((anagram) => (
              <div key={anagram.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <p className="text-lg sm:text-xl font-bold text-gray-700 mb-2">
                      {anagram.text}
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={answers[anagram.id] || ''}
                        onChange={(e) => handleAnswerChange(anagram.id, e.target.value)}
                        disabled={lockedAnswers[anagram.id] || showResults}
                        placeholder="Unscramble the letters..."
                        className="flex-1 p-2 border rounded-lg"
                      />
                      <button
                        onClick={() => toggleLock(anagram.id)}
                        className={`p-2 rounded-lg ${
                          lockedAnswers[anagram.id] 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {lockedAnswers[anagram.id] ? <FaLock /> : <FaLockOpen />}
                      </button>
                      {!showHint[anagram.id] && hintsUsed < 3 && !lockedAnswers[anagram.id] && (
                        <button
                          onClick={() => handleHint(anagram.id)}
                          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 
                                     transition-colors duration-200 flex items-center gap-2"
                          title={`Use Hint (${3 - hintsUsed} remaining)`}
                        >
                          <FaQuestionCircle className="text-lg" />
                          <span className="hidden sm:inline">
                            ({3 - hintsUsed})
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {showHint[anagram.id] && (
                  <p className="text-blue-600 mt-2">
                    Hint: {anagram.hint}
                  </p>
                )}
                {showResults && (
                  <p className={`font-semibold ${
                    normalizeAnswer(answers[anagram.id]) === normalizeAnswer(atob(encodedAnswers[anagram.id - 1]))
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    Correct Answer: {atob(encodedAnswers[anagram.id - 1])}
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