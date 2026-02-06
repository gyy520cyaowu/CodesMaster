
import React, { useState, useCallback, useRef } from 'react';
import { Question, UserAnswer, AppStatus } from './types';
import { QUESTION_BANK } from './data/questions';
import QuestionCard from './components/QuestionCard';
import Button from './components/Button';

// --- 配置区 ---
const MIN_TIME_LIMIT = 2000; 
// 请在此处替换为您的实际 Webhook 接收地址
const WEBHOOK_URL = 'https://open.feishu.cn/open-apis/bot/v2/hook/395744e9-f1e4-44d4-98d9-74a2c98d22b4'; 

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.START);
  const [userName, setUserName] = useState('');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  
  const questionStartTimeRef = useRef<number>(0);

  // 点击“立即开始”后的行为：进入姓名输入
  const goToNameInput = () => {
    setStatus(AppStatus.NAME_INPUT);
  };

  // 确认姓名并正式开始随机抽题
  const startQuiz = useCallback(() => {
    if (!userName.trim()) {
      setWarning("请输入您的真实姓名以记录成绩");
      setTimeout(() => setWarning(null), 2000);
      return;
    }
    
    // 随机抽取10个
    const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    
    setCurrentQuestions(selected);
    setCurrentIndex(0);
    setAnswers([]);
    setWarning(null);
    setStatus(AppStatus.QUIZ);
    questionStartTimeRef.current = Date.now();
  }, [userName]);

  // 发送结果到 Webhook
  const sendToWebhook = async (finalAnswers: UserAnswer[]) => {
    if (!WEBHOOK_URL || WEBHOOK_URL.includes('your-webhook-link')) {
      console.warn("Webhook URL 未配置，跳过发送过程。");
      return;
    }

    setWebhookStatus('sending');
    const score = finalAnswers.filter(a => a.isCorrect).length * 10;
    const payload = {
      studentName: userName,
      score: score,
      timestamp: new Date().toISOString(),
      details: finalAnswers.map((a, i) => ({
        index: i + 1,
        question: a.questionText,
        userAnswer: a.selectedOption,
        correctAnswer: a.correctOption,
        isCorrect: a.isCorrect,
        timeSpent: a.timeSpent.toFixed(2) + 's'
      }))
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setWebhookStatus('success');
      } else {
        setWebhookStatus('error');
      }
    } catch (err) {
      console.error("Webhook 发送失败:", err);
      setWebhookStatus('error');
    }
  };

  const handleAnswer = (selectedIdx: number) => {
    const now = Date.now();
    const timeSpentMs = now - questionStartTimeRef.current;

    if (timeSpentMs < MIN_TIME_LIMIT) {
      setWarning("做题要认真哦，不要秒选！");
      questionStartTimeRef.current = now; 
      setTimeout(() => setWarning(null), 2000);
      return;
    }

    const currentQ = currentQuestions[currentIndex];
    const isCorrect = selectedIdx === currentQ.correctAnswer;
    
    const newAnswer: UserAnswer = {
      questionId: currentQ.id,
      questionText: currentQ.text,
      selectedOption: currentQ.options[selectedIdx],
      correctOption: currentQ.options[currentQ.correctAnswer],
      isCorrect,
      timeSpent: timeSpentMs / 1000
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      questionStartTimeRef.current = Date.now();
      setWarning(null);
    } else {
      setStatus(AppStatus.FINISHED);
      // 在结算瞬间自动发送结果
      sendToWebhook(updatedAnswers);
    }
  };

  const exportResults = () => {
    const headers = ["姓名", "序号", "题目", "你的选择", "标准答案", "判断", "用时(秒)"];
    const rows = answers.map((a, idx) => [
      userName,
      idx + 1,
      `"${a.questionText.replace(/"/g, '""')}"`,
      `"${a.selectedOption.replace(/"/g, '""')}"`,
      `"${a.correctOption.replace(/"/g, '""')}"`,
      a.isCorrect ? "正确" : "错误",
      a.timeSpent.toFixed(2)
    ]);
    const csvContent = "\ufeff" + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${userName}_成绩单.csv`;
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center min-h-screen">
      {warning && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
          <div className="bg-red-500 text-white px-8 py-3 rounded-full shadow-2xl font-black border-4 border-white">
            ⚠️ {warning}
          </div>
        </div>
      )}

      {status === AppStatus.START && (
        <div className="text-center max-w-xl bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 animate-fadeIn">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-4">极速刷题宝</h1>
          <p className="text-slate-500 mb-10 text-lg">智能随机抽题，随时随地开启高效练习。</p>
          <Button onClick={goToNameInput} className="w-full text-xl py-5">立即开始</Button>
        </div>
      )}

      {status === AppStatus.NAME_INPUT && (
        <div className="text-center max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-slideUp">
          <h2 className="text-2xl font-black text-slate-800 mb-6">请输入您的姓名</h2>
          <div className="mb-8">
            <input 
              type="text" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="例如：张三"
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all text-center text-lg font-bold"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && startQuiz()}
            />
          </div>
          <Button onClick={startQuiz} className="w-full text-lg py-4">进入题库</Button>
          <p className="mt-4 text-xs text-slate-400">成绩将自动关联至您的姓名并上报给老师</p>
        </div>
      )}

      {status === AppStatus.QUIZ && currentQuestions[currentIndex] && (
        <div className="w-full max-w-2xl">
          <div className="mb-4 px-4 flex justify-between items-center text-slate-400 text-sm">
            <span>当前考生：<span className="text-slate-800 font-bold">{userName}</span></span>
            <span>防秒选模式已启动</span>
          </div>
          <QuestionCard 
            question={currentQuestions[currentIndex]}
            currentIndex={currentIndex}
            total={currentQuestions.length}
            onAnswer={handleAnswer}
          />
        </div>
      )}

      {status === AppStatus.FINISHED && (
        <div className="w-full max-w-5xl animate-fadeIn space-y-8">
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
            <div className="bg-slate-900 p-12 text-white text-center">
              <div className="inline-block px-4 py-1 bg-white/10 rounded-full text-xs mb-4 uppercase tracking-widest font-bold">
                Student: {userName}
              </div>
              <h2 className="text-xl opacity-70 mb-4">测试得分</h2>
              <div className="text-8xl font-black">{answers.filter(a => a.isCorrect).length * 10}</div>
              
              <div className="mt-6 flex justify-center items-center gap-2">
                 {webhookStatus === 'sending' && <span className="text-xs text-blue-400 animate-pulse">正在上报成绩...</span>}
                 {webhookStatus === 'success' && <span className="text-xs text-emerald-400">✅ 成绩已成功同步至老师端</span>}
                 {webhookStatus === 'error' && <span className="text-xs text-red-400">❌ 成绩同步失败，请手动导出</span>}
              </div>

              <div className="flex justify-center gap-8 mt-10">
                <div className="text-center">
                  <p className="text-xs opacity-50 mb-1 uppercase tracking-tighter">正确率</p>
                  <p className="text-2xl font-bold">{answers.filter(a => a.isCorrect).length * 10}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs opacity-50 mb-1 uppercase tracking-tighter">总用时</p>
                  <p className="text-2xl font-bold">{answers.reduce((s, a) => s + a.timeSpent, 0).toFixed(0)}s</p>
                </div>
              </div>
            </div>

            <div className="p-8 border-b flex flex-wrap justify-between items-center gap-4">
              <h3 className="text-2xl font-black">答题回顾</h3>
              <div className="flex flex-wrap gap-2">
                <Button onClick={exportResults} variant="success">导出 CSV</Button>
                <Button onClick={() => setStatus(AppStatus.START)} variant="secondary">回到主页</Button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {answers.map((answer, i) => (
                <div key={i} className={`rounded-3xl border-2 p-6 transition-all ${answer.isCorrect ? 'border-emerald-50 bg-emerald-50/20' : 'border-red-50 bg-red-50/20'}`}>
                  <div className="flex gap-4 items-start">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${answer.isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                      {i + 1}
                    </div>
                    <div className="flex-grow">
                      <p className="text-lg font-bold mb-2">{answer.questionText}</p>
                      <p className="text-sm">
                        <span className="text-slate-400">你的回答：</span>
                        <span className={answer.isCorrect ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>{answer.selectedOption}</span>
                        {!answer.isCorrect && <span className="ml-4 text-slate-400">标准答案：<span className="text-emerald-600 font-bold">{answer.correctOption}</span></span>}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
