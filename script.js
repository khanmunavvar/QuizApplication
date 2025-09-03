// -----------------------------
// QUIZ QUESTIONS DATA
// -----------------------------
const quizData = [
  {
    question: "1. What does HTML stand for?",
    options: ["HyperText Markup Language", "HighText Machine Language", "Hyperlink Text Markup Language","Hyper Markup Language"],
    answer: "HyperText Markup Language"
  },
  {
    question: "2. Which language is used for styling web pages?",
    options: ["HTML", "CSS", "JavaScript","Bootstrap"],
    answer: "CSS"
  },
  {
    question: "3. Inside which HTML element do we put JavaScript?",
    options: ["script", "js", "javascript","java"],
    answer: "script"
  },

  {
    question: "4. Which of These is a Class in ES6",
    options: ["constant", "cons", "const","cnst"],
    answer: "const"
  },
  {
    question: "5. Which language is used for styling web pages?",
    options: ["Function", "Data Type", "Derived DataType","Variable"],
    answer: "Function"
  },
  {
    question: "6.  What is the Role of the JavaScript Engine??",
    options: ["Compilation", "Interpretation", "parsing","Compilation and parsing"],
    answer: "Interpretation"
  },

  
  {
    question: "7. What is the x = = = y Statement Interpreted as in JavaScript?",
    options: ["State that x and y have equal value", "State that x and y are not equal", "State that x and y are equal in type, value, and reference address","State that x and y are equal in value and reference address only"],
    answer: "State that x and y are equal in type, value, and reference address"
  },
  {
    question: "8.  Which Function Does Not Return a Value?",
    options: ["Dynamic function", "Method", "Static function","Processes"],
    answer: "Processes"
  }
];

// -----------------------------
// GLOBAL VARIABLES
// -----------------------------
let currentQuestion = 0;
let answers = [];
let timer;
let timeLeft = 30;

// -----------------------------
// DOM CONTENT LOADED
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const quizContainer = document.getElementById("questionContainer");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");
  const timerDisplay = document.getElementById("timer");
  const scoreDisplay = document.getElementById("score");

  /* ---------------------------
     REGISTRATION
  ---------------------------- */
  if (registerForm) {
    registerForm.addEventListener("submit", e => {
      e.preventDefault();
      const user = document.getElementById("regUser").value;
      const pass = document.getElementById("regPass").value;

      if (localStorage.getItem(user)) {
        document.getElementById("regMsg").innerText = "User already exists!";
      } else {
        localStorage.setItem(user, pass);
        sessionStorage.setItem("loggedInUser", user);
        window.location.href = "quiz.html";
      }
    });
  }

  /* ---------------------------
     LOGIN
  ---------------------------- */
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const user = document.getElementById("loginUser").value;
      const pass = document.getElementById("loginPass").value;

      if (localStorage.getItem(user) === pass) {
        sessionStorage.setItem("loggedInUser", user);
        window.location.href = "quiz.html";
      } else {
        document.getElementById("loginMsg").innerText = "Invalid username or password!";
      }
    });
  }

  /* ---------------------------
     QUIZ PAGE
  ---------------------------- */
  if (quizContainer) {
    if (!sessionStorage.getItem("loggedInUser")) {
      window.location.href = "index.html";
      return;
    }

    loadQuestion();

    nextBtn.addEventListener("click", () => {
      saveAnswer();
      if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        loadQuestion();
      }
    });

    prevBtn.addEventListener("click", () => {
      saveAnswer();
      if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
      }
    });

    submitBtn.addEventListener("click", () => {
      saveAnswer();
      calculateScore();
    });

    // Start timer
    function startTimer() {
      clearInterval(timer);
      timeLeft = 30;
      timerDisplay.textContent = `Time Left: ${timeLeft}s`;

      timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
          clearInterval(timer);
          if (currentQuestion < quizData.length - 1) {
            saveAnswer();
            currentQuestion++;
            loadQuestion();
          } else {
            calculateScore();
          }
        }
      }, 1000);
    }

    // Load question
    function loadQuestion() {
      const q = quizData[currentQuestion];
      let optionsHTML = "";
      q.options.forEach(opt => {
        const checked = answers[currentQuestion] === opt ? "checked" : "";
        optionsHTML += `<label><input type="radio" name="option" value="${opt}" ${checked}> ${opt}</label>`;
      });

      quizContainer.innerHTML = `<p>${q.question}</p>${optionsHTML}`;

      // Button visibility
      prevBtn.style.display = (currentQuestion === 0) ? "none" : "inline-block";
      nextBtn.style.display = (currentQuestion === quizData.length - 1) ? "none" : "inline-block";
      submitBtn.style.display = (currentQuestion === quizData.length - 1) ? "inline-block" : "none";

      startTimer();
    }

    // Save answer
    function saveAnswer() {
      const selected = document.querySelector('input[name="option"]:checked');
      if (selected) {
        answers[currentQuestion] = selected.value;
      }
    }

    // Calculate score
    function calculateScore() {
      let score = 0;
      quizData.forEach((q, i) => {
        if (answers[i] === q.answer) {
          score++;
        }
      });
      sessionStorage.setItem("score", score);
      window.location.href = "result.html";
    }
  }

  /* ---------------------------
     RESULT PAGE
  ---------------------------- */
  if (scoreDisplay) {
    if (!sessionStorage.getItem("loggedInUser")) {
      window.location.href = "index.html";
      return;
    }
    const score = sessionStorage.getItem("score");
    scoreDisplay.innerText = `You scored ${score} / ${quizData.length}`;
  }
});

// -----------------------------
// LOGOUT FUNCTION
// -----------------------------
function logout() {
  sessionStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
