import React, { useState } from "react";
import { fetchQuizQuestions } from "./API";
//components
import QuestionCard from "./components/QuestionCard";
//types
import { QuestionState, Difficulty } from "./API";
//styles
import { GlobalStyle, Wrapper } from "./App.styles";

export type AnswerObject = {
    question: string;
    answer: string;
    correct: boolean;
    correctAnswer: string;
};

const TOTAL_QUESTIONS = 10;

const App = () => {
    const [ loading, setLoading ] = useState(false);
    const [ questions, setQuestions ] = useState<QuestionState[]>([]);
    const [ questionNumber, setQuestionNumber ] = useState(0);
    const [ userAnswers, setUserAnswers ] = useState<AnswerObject[]>([]);
    const [ score, setScore ] = useState(0);
    const [ gameOver, setGameOver ] = useState(true);

    const startTrivia = async () => {
        setLoading(true);
        setGameOver(false);

        try {
            const newQuestions = await fetchQuizQuestions(
                TOTAL_QUESTIONS,
                Difficulty.EASY
            );

            setQuestions(newQuestions);
            setScore(0);
            setUserAnswers([]);
            setQuestionNumber(0);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!gameOver) {
            //user answer
            const answer = e.currentTarget.value;

            //check answer
            const correct = questions[questionNumber].correct_answer === answer;

            //add score if answer is correct
            if (correct) setScore(prev => prev + 1);

            //save answer in the array userAnswers
            const answerObject = {
                question: questions[questionNumber].question,
                answer,
                correct,
                correctAnswer: questions[questionNumber].correct_answer,
            };
            setUserAnswers(prev => [ ...prev, answerObject ]);
        }
    };

    const nextQuestion = () => {
        //move on to the next question
        const nextQuestion = questionNumber + 1;

        if (nextQuestion === TOTAL_QUESTIONS) {
            setGameOver(true);
        } else {
            setQuestionNumber(nextQuestion);
        }
    };

    return (
        <React.Fragment>
            <GlobalStyle />
            <Wrapper>
                <h1>Quiz</h1>
                {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
                    <button className="start" onClick={startTrivia}>
                        Start
                    </button>
                ) : null}
                {!gameOver && <p className="score">Score: {score}</p>}
                {loading && <p className="loading">Loading Questions...</p>}
                {!loading &&
                !gameOver && (
                    <QuestionCard
                        questionNr={questionNumber + 1}
                        totalQuestions={TOTAL_QUESTIONS}
                        question={questions[questionNumber].question}
                        answers={questions[questionNumber].answers}
                        userAnswer={
                            userAnswers ? userAnswers[questionNumber] : null
                        }
                        callback={checkAnswer}
                    />
                )}
                {!gameOver &&
                !loading &&
                userAnswers.length === questionNumber + 1 &&
                questionNumber !== TOTAL_QUESTIONS - 1 && (
                    <button className="next" onClick={nextQuestion}>
                        Next Question
                    </button>
                )}
            </Wrapper>
        </React.Fragment>
    );
};

export default App;
