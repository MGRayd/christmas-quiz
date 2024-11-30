import React from 'react';

function QuestionCard({ question, selectedAnswer, onAnswerSelect, isLocked }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-christmas-green mb-4">
        {question.question}
      </h3>
      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => !isLocked && onAnswerSelect(option)}
            className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
              selectedAnswer === option
                ? 'bg-christmas-red text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            } ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={isLocked}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuestionCard; 