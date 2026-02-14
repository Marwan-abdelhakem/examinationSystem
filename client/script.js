function addQuestionUI() {
    const container = document.getElementById('questionsContainer');
    const qIndex = container.children.length;

    const qCard = document.createElement('div');
    qCard.className = 'question-card';
    qCard.innerHTML = `
        <h3>num of question${qIndex + 1}</h3>
        <input type="text" class="q-text" placeholder="questions">
        
        <div class="options-grid">
            <input type="text" class="opt" placeholder="first choice">
            <input type="text" class="opt" placeholder="second choice">
            <input type="text" class="opt" placeholder="third choice">
            <input type="text" class="opt" placeholder="four choice">
        </div>

        <div style="margin-top:15px;">
            <label>correct choice</label>
            <input type="number" class="correct-idx" min="0" max="3" value="0">
        </div>
    `;
    container.appendChild(qCard);
}

async function submitQuiz() {
    const quizName = document.getElementById('quizName').value;
    const cards = document.querySelectorAll('.question-card');

    if (!quizName || cards.length === 0) {
        return alert("must enter name of quiz and enter questions");
    }

    const questionsArray = [];
    cards.forEach(card => {
        const options = Array.from(card.querySelectorAll('.opt')).map(i => i.value);

        questionsArray.push({
            questionText: card.querySelector('.q-text').value,
            options: options,
            correctAnswerIndex: parseInt(card.querySelector('.correct-idx').value),
            timerPerQuestion: 60
        });
    });

    const finalPayload = {
        quizName: quizName,
        questionsArray: questionsArray
    };
    try {
        const response = await fetch('http://localhost:3000/api/quiz/createQuiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalPayload)
        });

        const data = await response.json();

        if (response.ok) {
            alert("Quiz create success ");
            location.reload();
        } else {
            alert("fail" + data.message);
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        alert("server not work!!!!!!!!!!!");
    }
}

window.onload = addQuestionUI;