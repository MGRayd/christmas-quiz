import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaLockOpen, FaQuestionCircle } from 'react-icons/fa';
import { round1Questions as originalQuestions } from '../data/questions';

function QuizRound1() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [lockedAnswers, setLockedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showHint, setShowHint] = useState({});
  const [hintsUsed, setHintsUsed] = useState(0);
  const [questions, setQuestions] = useState([]);

  // Initialize randomized questions on mount
  useEffect(() => {
    const shuffledQuestions = originalQuestions.map(q => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5)
    })).sort(() => Math.random() - 0.5);
    
    setQuestions(shuffledQuestions);
    window.scrollTo(0, 0);
  }, []);

  const handleAnswer = (questionId, selectedOption) => {
    if (!lockedAnswers[questionId]) {
      setAnswers(prev => ({
        ...prev,
        [questionId]: selectedOption
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

  const handleHint = (questionId) => {
    if (hintsUsed < 3 && !showHint[questionId]) {
      setShowHint(prev => ({ ...prev, [questionId]: true }));
      setHintsUsed(prev => prev + 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) {
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
      localStorage.setItem('round1Answers', JSON.stringify(answers));
      localStorage.setItem('round1Score', JSON.stringify({
        ...calculateScore(),
        hintsUsed
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    navigate('/round2');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-green-700 py-8 px-4 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">
            Round 1: Christmas Trivia! 🎄
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
                  <p className="text-lg font-medium">{question.question}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 space-y-2">
                      {question.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleAnswer(question.id, option)}
                          disabled={lockedAnswers[question.id] || showResults}
                          className={`w-full text-left p-4 rounded-lg transition-colors duration-200 
                            ${answers[question.id] === option 
                              ? 'bg-red-600 text-white' 
                              : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => toggleLock(question.id)}
                        disabled={!answers[question.id] || showResults}
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
                  </div>
                  {showHint[question.id] && (
                    <p className="text-blue-600 animate-fadeIn">
                      💡 {question.hint}
                    </p>
                  )}
                  {showResults && (
                    <p className={`font-semibold ${
                      answers[question.id] === question.correct
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {answers[question.id] === question.correct 
                        ? '✓ Correct!' 
                        : `✗ Incorrect. The correct answer was: ${question.correct}`}
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
                Continue to Round 2 🎄
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizRound1; 