import { BaseQuestion } from '@/common/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefObject } from 'react'

interface QuestionHeaderProps {
    languageCode: string;
    question: BaseQuestion;
    questionIdx: number;
    isInValid: boolean;
    ref?: RefObject<HTMLInputElement>;
    updateQuestion: (questionIdx: number, updatedAttributes: any) => void;
}

function QuestionHeader({
    languageCode,
    question,
    questionIdx,
    isInValid,
    ref,
    updateQuestion
}: QuestionHeaderProps) {
    function updateText(text: string) {
        const updatedText = {
            ...question.text,
            [languageCode]: text
        }

        updateQuestion(questionIdx, { ...question, text: updatedText });
    }

    function updateHelptext(helptext: string) {
        const updatedHelptext = question.helptext ? {
            ...question.helptext,
            [languageCode]: helptext
        } : {
            [languageCode]: helptext
        };

        updateQuestion(questionIdx, { ...question, helptext: updatedHelptext });
    }

    return (
        <>
            <div className="mt-3">
                <Label htmlFor="code">Code</Label>
                <div className="mt-2 flex flex-col gap-6">
                    <div className="flex items-center space-x-2">
                        <Input
                            autoFocus
                            ref={ref}
                            id="code"
                            name="code"
                            value={question.code}
                            onChange={(e) => updateQuestion(questionIdx, { ...question, code: e.target.value })}
                            className={isInValid && question.code.trim() === "" ? "border-red-300 focus:border-red-300" : ""}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-3">
                <Label htmlFor="text">Question</Label>
                <div className="mt-2 flex flex-col gap-6">
                    <div className="flex items-center space-x-2">
                        <Input
                            id="text"
                            name="text"
                            value={question.text[languageCode]}
                            onChange={(e) => updateText(e.target.value)}
                            className={isInValid && question.text[languageCode]!.trim() === "" ? "border-red-300 focus:border-red-300" : ""}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-3">
                <Label htmlFor="helptext">Helptext</Label>
                <div className="mt-2 flex flex-col gap-6">
                    <div className="flex items-center space-x-2">
                        <Input
                            id="helptext"
                            name="helptext"
                            value={question.helptext ? question.helptext[languageCode] : ""}
                            onChange={(e) => updateHelptext(e.target.value)}
                            className={isInValid && !!question.helptext && question.helptext[languageCode]!.trim() === "" ? "border-red-300 focus:border-red-300" : ""}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default QuestionHeader