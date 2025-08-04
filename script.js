document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.querySelector('.quiz-container');
    const submitButton = document.getElementById('submitQuiz');
    const scoreModal = document.getElementById('scoreModal');
    const scoreText = document.getElementById('scoreText');
    const scoreMessage = document.getElementById('scoreMessage');
    const closeButton = document.querySelector('.close-button');

    const questions = [
        {
            question: "Яка планета є найбільшою в Сонячній системі?",
            options: ["Марс", "Юпітер", "Сатурн"],
            correctAnswer: "Юпітер"
        },
        {
            question: "Скільки років Землі?",
            options: ["12,8 мільярди", "4,5 мільярди", "3,7 мільярди"],
            correctAnswer: "4,5 мільярди"
        },
        {
            question: "До якого типу зірок відноситься Сонце?",
            options: ["Жовті карлики", "Жовті гіганти", "Білі карлики"],
            correctAnswer: "Жовті карлики"
        },
        {
            question: "Яка найбільша чорна діра у Всесвіті?",
            options: ["NGC 4889", "Стрілець а*", "ТОН 618"],
            correctAnswer: "ТОН 618"
        },
        {
            question: "Як називається викид гарячої плазми із поверхні Сонця, що утримується його магнітним полем?",
            options: ["Петля", "Протуберанець", "Промінь"],
            correctAnswer: "Протуберанець"
        },
        {
            question: "Яка найбільша зірка у Всесвіті?",
            options: ["UY Щита", "Бетельгейзе", "Стівенсон 2-18"],
            correctAnswer: "Стівенсон 2-18"
        },
        {
            question: "Яка найяскравіша зірка на нічному небі?",
            options: ["Сіріус", "Полярна зірка", "Бетельгейзе"],
            correctAnswer: "Сіріус"
        },
        {
            question: "Яка найбільша галактика у Всесвіті?",
            options: ["Велика Магелланова Хмара", "Андромеда", "ІС1101"],
            correctAnswer: "ІС1101"
        },
        {
            question: "Яка найближча до Сонячної системи зірка?",
            options: ["Проксіма Центавра", "Сіріус", "Альфа Центавра"],
            correctAnswer: "Проксіма Центавра"
        }
    ];

    const TOTAL_QUESTIONS = questions.length; // Автоматично отримуємо загальну кількість запитань

    let userAnswers = {}; // Об'єкт для зберігання відповідей користувача: key - questionIndex, value - true/false (правильна/неправильна відповідь)

    function loadQuiz() {
        // Очищаємо контейнер, щоб уникнути дублювання при повторному завантаженні (якщо це станеться)
        quizContainer.innerHTML = '';
        questions.forEach((q, index) => {
            const questionCard = document.createElement('div');
            questionCard.classList.add('question-card');
            questionCard.setAttribute('data-question-index', index);

            questionCard.innerHTML = `
                <h3>${index + 1}. ${q.question}</h3>
                <hr>
                <div class="options-container">
                    ${q.options.map((option, optIndex) => `
                        <label class="option" data-option="${option}">
                            <input type="radio" name="question${index}" value="${option}">
                            <span class="custom-radio"></span>
                            ${option}
                        </label>
                    `).join('')}
                </div>
            `;
            quizContainer.appendChild(questionCard);
        });
        attachEventListeners();
    }

    function attachEventListeners() {
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.addEventListener('click', (event) => {
                const parentCard = option.closest('.question-card');
                const questionIndex = parseInt(parentCard.getAttribute('data-question-index'));
                const selectedOption = option.getAttribute('data-option');
                const questionData = questions[questionIndex];

                // Знімаємо вибір з інших опцій цього ж запитання
                const currentQuestionOptions = parentCard.querySelectorAll('.option');
                currentQuestionOptions.forEach(opt => {
                    opt.classList.remove('correct', 'wrong');
                    // Очищаємо галочки/хрестики, якщо вони були
                    const customRadio = opt.querySelector('.custom-radio');
                    if (customRadio) {
                        customRadio.innerHTML = '';
                    }
                });

                // Додаємо клас до обраної опції
                if (selectedOption === questionData.correctAnswer) {
                    option.classList.add('correct');
                    userAnswers[questionIndex] = true; // Правильна відповідь
                } else {
                    option.classList.add('wrong');
                    userAnswers[questionIndex] = false; // Неправильна відповідь
                }
            });
        });
    }

    submitButton.addEventListener('click', () => {
        const answeredQuestionsCount = Object.keys(userAnswers).length;
        if (answeredQuestionsCount < TOTAL_QUESTIONS) {
            alert('Всі завдання мають бути виконаними!');
            return;
        }

        let correctAnswersCount = 0;
        for (const index in userAnswers) {
            if (userAnswers[index] === true) {
                correctAnswersCount++;
            }
        }

        scoreText.textContent = `${correctAnswersCount}/${TOTAL_QUESTIONS}`;

        let message = "";
        if (correctAnswersCount >= 1 && correctAnswersCount <= 3) {
            message = "Ми віримо, що Ви зможете краще наступного разу!";
        } else if (correctAnswersCount >= 4 && correctAnswersCount <= 5) {
            message = "Це не поганий результат, але наступного разу Ви точно зможете краще!";
        } else if (correctAnswersCount === 6) {
            message = "Ваш результат вище середнього, але у Вас точно вийде краще";
        } else if (correctAnswersCount >= 7 && correctAnswersCount <= 8) { // Якщо 9 запитань, то 7/9, 8/9
            message = "Ваш результат чудовий! Це показує, що ви дуже добре розбираєтеся в астрономії";
        } else if (correctAnswersCount === TOTAL_QUESTIONS) { // Якщо 9/9
            message = "Ви чемпіон! Ви справилися із вікториною на всі 100%!";
        }
        scoreMessage.textContent = message;

        scoreModal.style.display = 'flex'; // Показуємо модальне вікно
    });

    closeButton.addEventListener('click', () => {
        scoreModal.style.display = 'none';
    });

    // Закриття модального вікна при кліку поза ним
    window.addEventListener('click', (event) => {
        if (event.target === scoreModal) {
            scoreModal.style.display = 'none';
        }
    });

    // Викликаємо функцію завантаження вікторини при завантаженні сторінки
    loadQuiz();
});