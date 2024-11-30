import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const questions = [
  {
    id: 1,
    question: "Which Christmas beverage is also known as 'Milk Punch'?",
    options: ["Mulled Wine", "Eggnog", "Hot Chocolate", "Apple Cider"],
    correct: "Eggnog"
  },
  {
    id: 2,
    question: "In Home Alone, where are the McCallisters flying to when they leave Kevin?",
    options: ["London", "Paris", "New York", "Miami"],
    correct: "Paris"
  },
  {
    id: 3,
    question: "What decoration is traditionally placed on top of a Christmas tree?",
    options: ["Star", "Angel", "Santa", "Bell"],
    correct: "Star"
  },
  {
    id: 4,
    question: "Which of Santa's reindeer shares its name with a famous symbol of Valentine's Day?",
    options: ["Dasher", "Cupid", "Comet", "Blitzen"],
    correct: "Cupid"
  },
  {
    id: 5,
    question: "In the song 'The Twelve Days of Christmas,' how many lords are leaping?",
    options: ["Eight", "Nine", "Ten", "Eleven"],
    correct: "Ten"
  },
  {
    id: 6,
    question: "What color are mistletoe berries?",
    options: ["Red", "Green", "White", "Purple"],
    correct: "White"
  },
  {
    id: 7,
    question: "Which country started the tradition of putting up Christmas trees?",
    options: ["USA", "England", "Germany", "Norway"],
    correct: "Germany"
  },
  {
    id: 8,
    question: "What was the first company that used Santa Claus in advertising?",
    options: ["Pepsi", "Coca-Cola", "McDonald's", "Ford"],
    correct: "Coca-Cola"
  },
  {
    id: 9,
    question: "In which modern-day country was Saint Nicholas born?",
    options: ["Greece", "Turkey", "Italy", "Spain"],
    correct: "Turkey"
  },
  {
    id: 10,
    question: "What Christmas-themed ballet premiered in St. Petersburg, Russia in 1892?",
    options: ["The Nutcracker", "Swan Lake", "Sleeping Beauty", "The Snow Maiden"],
    correct: "The Nutcracker"
  }
];

function QuizRound1() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: selectedOption
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
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

  const handleNext = () => {
    localStorage.setItem('round1Answers', JSON.stringify(answers));
    localStorage.setItem('round1Score', JSON.stringify(calculateScore()));
    navigate('/round2');
  };

  const currentQ = questions[currentQuestion];

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-700 to-green-700 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Round 1 Complete! 🎄</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-green-100 p-6 rounded-lg text-center">
                <p className="text-4xl font-bold text-green-600 mb-2">{score.correct}</p>
                <p className="text-green-800">Correct</p>
              </div>
              <div className="bg-red-100 p-6 rounded-lg text-center">
                <p className="text-4xl font-bold text-red-600 mb-2">{score.incorrect}</p>
                <p className="text-red-800">Incorrect</p>
              </div>
            </div>

            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="border-b pb-4">
                  <p className="font-semibold mb-2">{q.question}</p>
                  <p className={`${answers[q.id] === q.correct ? 'text-green-600' : 'text-red-600'}`}>
                    Your answer: {answers[q.id]}
                    {answers[q.id] !== q.correct && (
                      <span className="text-green-600 ml-2">
                        (Correct: {q.correct})
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-full mt-8 bg-green-600 text-white py-3 rounded-lg font-semibold
                       hover:bg-green-700 transition-colors duration-200"
            >
              Continue to Round 2 🎄
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-green-700 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Round 1</h2>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-red-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{currentQ.question}</h3>
            <div className="space-y-3">
              {currentQ.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`w-full text-left p-4 rounded-lg transition-colors duration-200 
                    ${answers[currentQ.id] === option 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {currentQuestion === questions.length - 1 && Object.keys(answers).length === questions.length && (
            <button
              onClick={handleNext}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold
                       hover:bg-green-700 transition-colors duration-200"
            >
              Continue to Round 2 🎄
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizRound1; 