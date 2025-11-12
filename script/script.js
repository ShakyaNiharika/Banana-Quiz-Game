class BananaGame {
  constructor() {
    this.score = 0;
    this.attempts = 0;
    this.currentQuestion = null;
    this.initializeGame();
  }

  async initializeGame() {
    await this.loadQuestion();
    this.setupEventListeners();
  }

  async loadQuestion() {
    try {
      console.log("Fetching question from API...");

      // Add cache busting to avoid cached responses
      const timestamp = new Date().getTime();
      const response = await fetch(
        `https://marcconrad.com/uob/banana/api.php?t=${timestamp}`
      );

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      this.currentQuestion = data;
      document.getElementById("puzzle-image").src = data.question;
      this.showFeedback("Question loaded! Enter your answer.", null);
    } catch (error) {
      console.error(" Error loading question:", error);
      this.showFeedback(`Error: ${error.message}`, false);

      // Show fallback message
      document.getElementById("puzzle-image").src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIHF1ZXN0aW9uIGxvYWRlZDwvdGV4dD48L3N2Zz4=";
    }
  }

  checkAnswer(userAnswer) {
    if (!this.currentQuestion) {
      this.showFeedback("No question loaded yet!", false);
      return false;
    }

    this.attempts++;
    const isCorrect = userAnswer === this.currentQuestion.solution.toString();

    if (isCorrect) {
      this.score++;
      this.showFeedback("Correct! 🎉 Loading next question...", true);
      // Load next question after delay
      setTimeout(() => {
        this.loadQuestion();
        document.getElementById("answer-input").value = "";
      }, 1500);
    } else {
      this.showFeedback("Try again! ❌", false);
    }

    this.updateStats();
    return isCorrect;
  }

  showFeedback(message, isCorrect) {
    const feedback = document.getElementById("feedback");
    feedback.textContent = message;

    if (isCorrect === true) {
      feedback.className = "correct";
    } else if (isCorrect === false) {
      feedback.className = "incorrect";
    } else {
      feedback.className = "";
    }
  }

  updateStats() {
    document.getElementById(
      "stats"
    ).textContent = `Score: ${this.score} | Attempts: ${this.attempts}`;
  }

  setupEventListeners() {
    document.getElementById("submit-btn").addEventListener("click", () => {
      const answer = document.getElementById("answer-input").value;
      this.checkAnswer(answer);
    });

    document
      .getElementById("answer-input")
      .addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const answer = document.getElementById("answer-input").value;
          this.checkAnswer(answer);
        }
      });
  }
}

// Initialize game when page loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Initializing Banana Game...");
  window.game = new BananaGame();
});
