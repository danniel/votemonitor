import { BaseQuestion } from '@/common/types';
import FormQuestionsEditor from '@/components/questionsEditor/FormQuestionsEditor';
import FormTemplateActions from '@/features/formsTemplate/components/FormTemplateActions';
import FormTemplateHeader from '@/features/formsTemplate/components/FormTemplateHeader';
import { FormTemplateFull } from '@/features/formsTemplate/models/formTemplate';
import { formTemplateDetailsQueryOptions } from '@/features/formsTemplate/queries'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const Route = createFileRoute('/form-templates/$formTemplateId/edit')({
  component: EditFormTemplate,
  loader: ({ context: { queryClient }, params: { formTemplateId } }) => queryClient.ensureQueryData(formTemplateDetailsQueryOptions(formTemplateId))

})

function EditFormTemplate() {
  const formTemplate = Route.useLoaderData();
  const [localForm, setLocalForm] = useState<FormTemplateFull | null>();
  const [localQuestions, setLocalQuestions] = useState<BaseQuestion[]>([]);
  const [activeQuestionId, setActiveQuestionId] = useState<string | undefined>();
  const [invalidQuestions, setInvalidQuestions] = useState<string[] | null>(null);

  useEffect(() => {
    if (formTemplate) {
      if (localForm) return;
      setLocalForm(JSON.parse(JSON.stringify(formTemplate)) as FormTemplateFull);
      setLocalQuestions(JSON.parse(JSON.stringify(formTemplate.questions ?? [])) as BaseQuestion[]);

      if (formTemplate.questions.length > 0) {
        setActiveQuestionId(formTemplate.questions[0]!.id!);
      }
    }
  }, [formTemplate]);

  return (
    <>
      <FormTemplateActions formTemplate={formTemplate} />

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <FormTemplateHeader formTemplate={formTemplate} />
        </TabsContent>
        <TabsContent value="questions">
          <FormQuestionsEditor
            languageCode={formTemplate.defaultLanguage}
            localQuestions={localQuestions}
            setLocalQuestions={setLocalQuestions}
            activeQuestionId={activeQuestionId}
            setActiveQuestionId={setActiveQuestionId}
            invalidQuestions={invalidQuestions}
            setInvalidQuestions={setInvalidQuestions} />
        </TabsContent>
      </Tabs>
    </>
  )
}