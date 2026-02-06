
import React from 'react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  total: number;
  onAnswer: (optionIndex: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  currentIndex, 
  total, 
  onAnswer 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-auto animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          题目 {currentIndex + 1} / {total}
        </span>
        <div className="w-1/2 bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-500" 
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
        {question.text}
      </h2>

      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group flex items-start gap-4"
          >
            <span className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-slate-200 group-hover:border-blue-500 group-hover:bg-blue-500 group-hover:text-white flex items-center justify-center font-bold text-slate-500 transition-colors">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="text-slate-700 font-medium pt-0.5">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
