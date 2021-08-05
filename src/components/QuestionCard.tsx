import React from "react";
//types
import { AnswerObject } from "../App";

type Props = {
    question: string;
    answers: string[];
    callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
    userAnswer: AnswerObject | null;
    questionNr: number;
    totalQuestions: number;
};

const QuestionCard: React.FC<Props> = ({
    question,
    answers,
    callback,
    userAnswer,
    questionNr,
    totalQuestions,
}) => {
    return (
        <div>
            <p className="question-number">
                Question: {questionNr} / {totalQuestions}
            </p>
            <p dangerouslySetInnerHTML={{ __html: question }} />
            <div>
                {answers.map(answer => (
                    <div key={answer}>
                        <button
                            value={answer}
                            disabled={!!userAnswer}
                            onClick={callback}
                        >
                            <span
                                dangerouslySetInnerHTML={{ __html: answer }}
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionCard;
