import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaLockOpen, FaQuestionCircle } from 'react-icons/fa';

const questions = [
  {
    id: 1,
    before: "Dashing through",
    blank: "THE SNOW",
    after: "in a one-horse open sleigh",
    hint: "What are you dashing through?"
  },
  {
    id: 2,
    before: "Walking in a",
    blank: "WINTER WONDERLAND",
    after: "",
    hint: "A magical winter place"
  },
  {
    id: 3,
    before: "All I want for Christmas is",
    blank: "YOU",
    after: "",
    hint: "Mariah Carey's famous wish"
  },
  {
    id: 4,
    before: "Rudolph the",
    blank: "RED NOSED",
    after: "reindeer",
    hint: "The color of his glowing nose"
  },
  {
    id: 5,
    before: "Silent night,",
    blank: "HOLY NIGHT",
    after: "all is calm, all is bright",
    hint: "A sacred evening"
  },
  {
    id: 6,
    before: "Deck the halls with",
    blank: "BOUGHS OF HOLLY",
    after: "fa la la la la, la la la la",
    hint: "Traditional Christmas decoration"
  },
  {
    id: 7,
    before: "Have yourself a merry",
    blank: "LITTLE CHRISTMAS",
    after: "let your heart be light",
    hint: "A modest festive celebration"
  },
  {
    id: 8,
    before: "Last Christmas I gave you my",
    blank: "HEART",
    after: "but the very next day you gave it away",
    hint: "A romantic organ"
  },
  {
    id: 9,
    before: "Chestnuts roasting on an",
    blank: "OPEN FIRE",
    after: "Jack Frost nipping at your nose",
    hint: "How the chestnuts are cooked"
  },
  {
    id: 10,
    before: "I'm dreaming of a",
    blank: "WHITE CHRISTMAS",
    after: "just like the ones I used to know",
    hint: "The color of a snowy December 25th"
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

function QuizRound4() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [lockedAnswers, setLockedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showHint, setShowHint] = useState({});
  const [hintsUsed, setHintsUsed] = useState(0);

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

  // Update calculateScore
  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (normalizeAnswer(answers[q.id]) === normalizeAnswer(q.blank)) {
        correct++;
      }
    });
    return {
      correct,
      incorrect: questions.length - correct
    };
  };

  const handleSubmit = () => {
    if (Object.keys(lockedAnswers).length === questions.length) {
      setShowResults(true);
      localStorage.setItem('round4Answers', JSON.stringify(answers));
      localStorage.setItem('round4Score', JSON.stringify({
        ...calculateScore(),
        hintsUsed
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    navigate('/round5');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-green-700 py-8 px-4 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">
            Round 4: Christmas Song Lyrics! 🎵
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            You have 3 hints available for this round - use them wisely! 🎯
          </p>

          <div className="space-y-6">
            {questions.map((question) => (
              <div 
                key={question.id}
                className="bg-gray-50 p-4 rounded-lg transform transition-all duration-500"
              >
                <div className="flex flex-col gap-4">
                  <div className="text-lg font-medium">
                    <span>{question.before} </span>
                    <span className="text-blue-600">_____</span>
                    <span> {question.after}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      disabled={lockedAnswers[question.id] || showResults}
                      placeholder="Fill in the blank..."
                      className="flex-1 p-2 border rounded-lg"
                    />
                    <button
                      onClick={() => toggleLock(question.id)}
                      className={`p-2 rounded-lg transition-colors duration-300 ${
                        lockedAnswers[question.id] 
                          ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {lockedAnswers[question.id] ? <FaLock /> : <FaLockOpen />}
                    </button>
                    {!showHint[question.id] && hintsUsed < 3 && !lockedAnswers[question.id] && (
                      <button
                        onClick={() => handleHint(question.id)}
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
                  {showHint[question.id] && (
                    <p className="text-blue-600 animate-fadeIn">
                      Hint: {question.hint}
                    </p>
                  )}
                  {showResults && (
                    <p className={`font-semibold ${
                      normalizeAnswer(answers[question.id]) === normalizeAnswer(question.blank)
                        ? 'text-green-600'
                        : 'text-red-600'
                      } animate-fadeIn`}
                    >
                      Correct Answer: {question.blank}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!showResults && (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(lockedAnswers).length !== questions.length}
              className={`w-full mt-8 py-3 rounded-lg font-semibold transform transition-all duration-300
                ${Object.keys(lockedAnswers).length === questions.length
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
                Continue to Round 5 🎄
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizRound4; 