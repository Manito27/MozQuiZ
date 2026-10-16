const questions = [
  { question: "Qual é a capital de Moçambique?", answers: ["Beira", "Maputo", "Nampula"], correct: "Maputo" },
  { question: "Em que ano Moçambique conquistou a independência?", answers: ["1964", "1975", "1980"], correct: "1975" },
  { question: "Quem foi o primeiro Presidente de Moçambique independente?", answers: ["Joaquim Chissano", "Samora Machel", "Eduardo Mondlane"], correct: "Samora Machel" },
  { question: "Como se chama o lago que Moçambique partilha com o Malawi e a Tanzânia?", answers: ["Lago Niassa", "Lago Cahora Bassa", "Lago Chilwa"], correct: "Lago Niassa" },
  { question: "Qual é a moeda oficial de Moçambique?", answers: ["Rand", "Metical", "Kwacha"], correct: "Metical" }
];

const prizePerAnswer = 50;
const secondsPerQuestion = 30;
let currentIndex = 0;
let earned = 0;
let timerInterval = null;
let secondsLeft = secondsPerQuestion;
let transitioning = false;

const questionText = document.querySelector("#question-text");
const answersContainer = document.querySelector("#answers");
const questionCount = document.querySelector("#question-count");
const progressLabel = document.querySelector("#progress-label");
const progressBar = document.querySelector("#progress-bar");
const progressTrack = document.querySelector(".progress-track");
const timer = document.querySelector("#timer");
const earnings = document.querySelector("#earnings");
const questionArea = document.querySelector("#question-area");
const resultPanel = document.querySelector("#result-panel");
const resultAmount = document.querySelector("#result-amount");
const modal = document.querySelector("#withdraw-modal");

function renderQuestion() {
  const item = questions[currentIndex];
  transitioning = false;
  questionText.textContent = item.question;
  questionCount.textContent = `PERGUNTA ${currentIndex + 1} DE ${questions.length}`;
  const completed = Math.round((currentIndex / questions.length) * 100);
  progressLabel.textContent = `${completed}% concluído`;
  progressBar.style.width = `${completed}%`;
  progressTrack.setAttribute("aria-valuenow", String(currentIndex));
  answersContainer.replaceChildren();

  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    button.innerHTML = `<span class="answer-key">${String.fromCharCode(65 + index)}</span><span></span>`;
    button.querySelector("span:last-child").textContent = answer;
    button.addEventListener("click", () => chooseAnswer(answer, button));
    answersContainer.append(button);
  });
  startTimer();
}

function startTimer() {
  window.clearInterval(timerInterval);
  secondsLeft = secondsPerQuestion;
  updateTimerDisplay();
  timerInterval = window.setInterval(() => {
    secondsLeft -= 1;
    updateTimerDisplay();
    if (secondsLeft <= 0) {
      window.clearInterval(timerInterval);
      revealAnswer(null);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const seconds = Math.max(0, secondsLeft);
  timer.textContent = `00:${String(seconds).padStart(2, "0")}`;
  timer.setAttribute("aria-label", `${seconds} segundos`);
  timer.classList.toggle("is-low", seconds <= 10);
}

function chooseAnswer(answer, button) {
  if (transitioning) return;
  const isCorrect = answer === questions[currentIndex].correct;
  if (isCorrect) earned += prizePerAnswer;
  earnings.innerHTML = `${earned.toLocaleString("pt-MZ")} <small>MT</small>`;
  revealAnswer(answer, button);
}

function revealAnswer(selected, selectedButton) {
  if (transitioning) return;
  transitioning = true;
  window.clearInterval(timerInterval);
  const correct = questions[currentIndex].correct;
  [...answersContainer.children].forEach((button) => {
    const value = button.querySelector("span:last-child").textContent;
    button.disabled = true;
    if (value === correct) button.classList.add("correct");
    else if (button === selectedButton && selected !== correct) button.classList.add("incorrect");
  });
  window.setTimeout(() => {
    currentIndex += 1;
    if (currentIndex === questions.length) showResults();
    else renderQuestion();
  }, 850);
}

function showResults() {
  questionArea.hidden = true;
  resultPanel.hidden = false;
  const completed = questions.length;
  progressLabel.textContent = "100% concluído";
  progressBar.style.width = "100%";
  progressTrack.setAttribute("aria-valuenow", String(completed));
  resultAmount.innerHTML = `${earned.toLocaleString("pt-MZ")} <small>MT</small>`;
  document.querySelector("#modal-amount").textContent = `${earned.toLocaleString("pt-MZ")} MT`;
  document.querySelector("#withdraw-button").hidden = true;
  modal.hidden = false;
  document.querySelector("#notice-continue").focus();
}

document.querySelector("#withdraw-button").addEventListener("click", () => {
  window.location.href = "https://go.aff.nicebetpartners.com/ikwascov";
});
function closeRegistrationNotice() {
  modal.hidden = true;
  const withdrawButton = document.querySelector("#withdraw-button");
  withdrawButton.hidden = false;
  withdrawButton.focus();
}

document.querySelector("#notice-continue").addEventListener("click", closeRegistrationNotice);
document.querySelector("#close-modal").addEventListener("click", closeRegistrationNotice);
modal.addEventListener("click", (event) => { if (event.target === modal) closeRegistrationNotice(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.hidden) closeRegistrationNotice(); });
document.querySelector("#restart-button").addEventListener("click", () => {
  currentIndex = 0;
  earned = 0;
  earnings.innerHTML = `0 <small>MT</small>`;
  modal.hidden = true;
  document.querySelector("#withdraw-button").hidden = true;
  resultPanel.hidden = true;
  questionArea.hidden = false;
  renderQuestion();
  document.querySelector("#inicio").scrollIntoView({ behavior: "smooth", block: "start" });
});

renderQuestion();
