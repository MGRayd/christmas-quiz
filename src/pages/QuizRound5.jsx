import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaLockOpen } from 'react-icons/fa';

const questions = [
  {
    id: 1,
    emojis: "🏻😱🎄👦🏼👴🏼",
    answer: "HOME ALONE",
    hint: "Kid left behind during Christmas vacation"
  },
  {
    id: 2,
    emojis: "⚡️⚡️3️⃣4️⃣🎅",
    answer: "MIRACLE ON 34TH STREET",
    hint: "Santa proves he's real in court"
  },
  {
    id: 3,
    emojis: "🏠🎄😨✈️🗽",
    answer: "HOME ALONE 2: LOST IN NEW YORK",
    hint: "Kid gets on wrong plane at Christmas"
  },
  {
    id: 4,
    emojis: "🎄📖👓😊",
    answer: "A CHRISTMAS STORY",
    hint: "Boy wants a Red Ryder BB gun"
  },
  {
    id: 5,
    emojis: "✈️🚂🚗👴🏼👨🏻",
    answer: "PLANES, TRAINS AND AUTOMOBILES",
    hint: "Two men try to get home for the holidays"
  },
  {
    id: 6,
    emojis: "👔🎄🎉",
    answer: "OFFICE CHRISTMAS PARTY",
    hint: "Corporate holiday celebration gets wild"
  },
  {
    id: 7,
    emojis: "👨‍♂️🎅🍝",
    answer: "ELF",
    hint: "Will Ferrell as a human raised by Santa's helpers"
  },
  {
    id: 8,
    emojis: "😴💝",
    answer: "WHILE YOU WERE SLEEPING",
    hint: "Romance while someone's in a coma"
  },
  {
    id: 9,
    emojis: "🎄🎅🚂👮",
    answer: "THE POLAR EXPRESS",
    hint: "Magical train ride to North Pole"
  },
  {
    id: 10,
    emojis: "❄️⛄️😊❄️",
    answer: "FROSTY THE SNOWMAN",
    hint: "Magical hat brings snow creation to life"
  }
];

const normalizeAnswer = (answer) => {
  return answer
    ?.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ')        // Replace multiple spaces with single space
    .trim();
};

function QuizRound5() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [lockedAnswers, setLockedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showHint, setShowHint] = useState({});

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

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (normalizeAnswer(answers[q.id]) === normalizeAnswer(q.answer)) {
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
      localStorage.setItem('round5Answers', JSON.stringify(answers));
      localStorage.setItem('round5Score', JSON.stringify(calculateScore()));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    navigate('/results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-green-700 py-8 px-4 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
            Round 5: Christmas Emoji Pictionary! 🎯
          </h2>

          <div className="space-y-6">
            {questions.map((question) => (
              <div 
                key={question.id}
                className="bg-gray-50 p-4 rounded-lg transform transition-all duration-500"
              >
                <div className="flex flex-col gap-4">
                  <div className="text-4xl text-center mb-2">
                    {question.emojis}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      disabled={lockedAnswers[question.id] || showResults}
                      placeholder="What's the Christmas phrase?"
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
                    <button
                      onClick={() => toggleHint(question.id)}
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200
                               transition-colors duration-300"
                    >
                      💡
                    </button>
                  </div>
                  {showHint[question.id] && (
                    <p className="text-blue-600 animate-fadeIn">
                      Hint: {question.hint}
                    </p>
                  )}
                  {showResults && (
                    <p className={`font-semibold ${
                      normalizeAnswer(answers[question.id]) === normalizeAnswer(question.answer)
                        ? 'text-green-600'
                        : 'text-red-600'
                      } animate-fadeIn`}
                    >
                      Correct Answer: {question.answer}
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
                See Final Results 🎄
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizRound5; 