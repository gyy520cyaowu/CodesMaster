
import { Question } from '../types';

/**
 * 题库管理
 * 方便后期维护：直接在此数组中添加对象即可
 */
export const QUESTION_BANK: Question[] = [
  {
    id: 1,
    text: "React 中，用来处理副作用的 Hook 是哪一个？",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correctAnswer: 1
  },
  {
    id: 2,
    text: "下列哪个不是 CSS 的布局模型？",
    options: ["Flexbox", "Grid", "Float", "Hyperlink"],
    correctAnswer: 3
  },
  {
    id: 3,
    text: "JavaScript 中，'5' + 3 的结果是多少？",
    options: ["8", "'53'", "NaN", "Error"],
    correctAnswer: 1
  },
  {
    id: 4,
    text: "在 TypeScript 中，如何定义一个只读属性？",
    options: ["const", "final", "readonly", "static"],
    correctAnswer: 2
  },
  {
    id: 5,
    text: "HTML5 中哪个元素用于播放视频？",
    options: ["<media>", "<movie>", "<video>", "<play>"],
    correctAnswer: 2
  },
  {
    id: 6,
    text: "Git 命令中，用于将本地修改推送到远程仓库的是？",
    options: ["git pull", "git push", "git commit", "git add"],
    correctAnswer: 1
  },
  {
    id: 7,
    text: "哪个 HTTP 状态码表示'未找到页面'？",
    options: ["200", "403", "404", "500"],
    correctAnswer: 2
  },
  {
    id: 8,
    text: "Tailwind CSS 是一个什么类型的框架？",
    options: ["JavaScript 框架", "Utility-first CSS 框架", "数据库框架", "测试框架"],
    correctAnswer: 1
  },
  {
    id: 9,
    text: "下列哪个方法可以将字符串转换为整数？",
    options: ["parseInt()", "toString()", "toFixed()", "join()"],
    correctAnswer: 0
  },
  {
    id: 10,
    text: "在浏览器中，哪个对象代表整个窗口？",
    options: ["document", "window", "navigator", "screen"],
    correctAnswer: 1
  },
  {
    id: 11,
    text: "CSS 中 z-index 属性的作用是？",
    options: ["控制字体大小", "设置背景颜色", "控制元素的堆叠顺序", "设置外边距"],
    correctAnswer: 2
  },
  {
    id: 12,
    text: "JSON 的全称是什么？",
    options: ["JavaScript Object Notation", "Java Standard Object Network", "JavaScript Online Node", "Joint System Object Navigation"],
    correctAnswer: 0
  }
];
