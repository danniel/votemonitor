import { authApi } from '@/common/auth-api';
import { DateTimeFormat } from '@/common/formats';
import {
  isDateAnswer,
  isMultiSelectAnswer,
  isMultiSelectQuestion,
  isNumberAnswer,
  isRatingAnswer,
  isRatingQuestion,
  isSingleSelectAnswer,
  isSingleSelectQuestion,
  isTextAnswer,
} from '@/common/guards';
import { FollowUpStatus, FunctionComponent } from '@/common/types';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Radio, RadioGroup } from '@/components/ui/radio-group';
import { RatingGroup } from '@/components/ui/ratings';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { cn, ratingScaleToNumber } from '@/lib/utils';
import { queryClient } from '@/main';
import { Route, formSubmissionDetailsQueryOptions } from '@/routes/responses/$submissionId';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { FlagIcon } from '@heroicons/react/24/solid';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { Link, useRouter } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Fragment } from 'react';
import { formSubmissionsByEntryKeys, formSubmissionsByObserverKeys } from '../../hooks/form-submissions-queries';
import { ResponseExtraDataSection } from '../ReponseExtraDataSection/ResponseExtraDataSection';

export default function FormSubmissionDetails(): FunctionComponent {
  const { submissionId } = Route.useParams();
  const submissionQuery = useSuspenseQuery(formSubmissionDetailsQueryOptions(submissionId));
  const formSubmission = submissionQuery.data;
  const router = useRouter();

  const updateSubmissionFollowUpStatusMutation = useMutation({
    mutationKey: formSubmissionsByEntryKeys.detail(submissionId),
    mutationFn: (followUpStatus: FollowUpStatus) => {
      const electionRoundId: string | null = localStorage.getItem('electionRoundId');

      return authApi.put<void>(
        `/election-rounds/${electionRoundId}/form-submissions/${submissionId}:status`,
        {
          followUpStatus
        }
      );
    },

    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Follow-up status updated',
      });

      router.invalidate();
      queryClient.invalidateQueries({ queryKey: formSubmissionsByEntryKeys.all });
      queryClient.invalidateQueries({ queryKey: formSubmissionsByObserverKeys.all });
    },

    onError: () => {
      toast({
        title: 'Error updating follow up status',
        description: 'Please contact tech support',
        variant: 'destructive'
      });
    }
  });

  function handleFolowUpStatusChange(followUpStatus: FollowUpStatus): void {
    updateSubmissionFollowUpStatusMutation.mutate(followUpStatus);
  }

  return (
    <Layout title={`#${formSubmission.submissionId}`}>
      <div className='flex flex-col gap-4'>
        <Card className='max-w-4xl'>
          <CardContent className='pt-6 flex flex-col gap-4'>
            <div className='flex gap-2'>
              <p>Observer:</p>
              <Link
                search
                className='text-purple-500 font-bold flex gap-1'
                to='/monitoring-observers/view/$monitoringObserverId/$tab'
                params={{ monitoringObserverId: formSubmission.monitoringObserverId, tab: 'details' }}
                target='_blank'
                preload={false}>
                {formSubmission.observerName}
                <ArrowTopRightOnSquareIcon className='w-4' />
              </Link>
            </div>

            <div className='flex gap-2'>
              <p>Phone number:</p>
              {formSubmission.phoneNumber}
            </div>

            <div className='flex gap-4'>
              <div className='flex gap-2'>
                <p>Location - L1:</p>
                {formSubmission.level1}
              </div>
              {formSubmission.level2 && <div className='flex gap-2'>
                <p>Location - L2:</p>
                {formSubmission.level2}
              </div>}
              {formSubmission.level3 && <div className='flex gap-2'>
                <p>Location - L3:</p>
                {formSubmission.level3}
              </div>}
              {formSubmission.level4 && <div className='flex gap-2'>
                <p>Location - L4:</p>
                {formSubmission.level4}
              </div>}
              {formSubmission.level5 && <div className='flex gap-2'>
                <p>Location - L5:</p>
                {formSubmission.level5}
              </div>}
              <p>Number:</p>
              #{formSubmission.number}
            </div>
          </CardContent>
        </Card>

        <Card className='max-w-4xl'>
          <CardHeader>
            <CardTitle className='mb-4 flex justify-between'>
              <div>
                {formSubmission.formCode}: {formSubmission.formType}
              </div>
              <Select onValueChange={handleFolowUpStatusChange} defaultValue={formSubmission.followUpStatus} value={formSubmission.followUpStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder='Follow-up status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={FollowUpStatus.NotApplicable}>Not Applicable</SelectItem>
                    <SelectItem value={FollowUpStatus.NeedsFollowUp}>Needs Follow-Up</SelectItem>
                    <SelectItem value={FollowUpStatus.Resolved}>Resolved</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </CardTitle>
            <Separator />
          </CardHeader>

          <CardContent className='flex flex-col gap-10'>
            {formSubmission.questions.map((question, index) => {
              const answer = formSubmission.answers.find(({ questionId }) => questionId === question.id);
              const notes = formSubmission.notes.filter(({ questionId }) => questionId === question.id);
              const attachments = formSubmission.attachments.filter(({ questionId }) => questionId === question.id);

              return (
                <div key={question.id} className='flex flex-col gap-4'>
                  <p className='text-gray-700 font-medium'>
                    {index + 1}: {question.text[formSubmission.defaultLanguage]}
                  </p>

                  {isSingleSelectQuestion(question) && (
                    <RadioGroup
                      defaultChecked
                      defaultValue={answer && isSingleSelectAnswer(answer) ? answer.selection?.optionId : ''}
                      className='flex gap-8 items-center'>
                      {question.options.map((option) => (
                        <Fragment key={option.id}>
                          <FormItem className='flex items-center gap-2 !mt-0'>
                            <Radio disabled value={option.id} />
                            <Label className='font-normal' key={option.id}>
                              {option.text[formSubmission.defaultLanguage]}
                              {option.isFlagged && <> (Flagged)</>}
                            </Label>
                            {option.isFlagged && <FlagIcon className={cn('text-destructive', 'w-4')} />}
                          </FormItem>
                          {option.isFreeText &&
                            answer &&
                            isSingleSelectAnswer(answer) &&
                            answer.selection?.optionId === option.id && <p>{answer.selection?.text ?? '-'}</p>}
                        </Fragment>
                      ))}
                    </RadioGroup>
                  )}

                  {isMultiSelectQuestion(question) &&
                    question.options.map((option) => {
                      const isOptionChecked =
                        answer &&
                        isMultiSelectAnswer(answer) &&
                        !!answer.selection?.find((selection) => selection.optionId === option.id);

                      return (
                        <FormItem key={option.id} className='flex flex-row items-start space-x-3 space-y-0'>
                          <Checkbox checked={isOptionChecked} disabled />
                          <Label>{option.text[formSubmission.defaultLanguage]}</Label>
                        </FormItem>
                      );
                    })}

                  {isRatingQuestion(question) && (
                    <RatingGroup
                      className='max-w-fit'
                      scale={ratingScaleToNumber(question.scale)}
                      defaultValue={answer && isRatingAnswer(answer) ? answer.value?.toString() : undefined}
                      disabled
                    />
                  )}

                  {answer ? (
                    <>
                      {isDateAnswer(answer) && <p>{answer.date ? format(answer.date, DateTimeFormat) : '-'}</p>}

                      {isNumberAnswer(answer) && <p>{answer.value ?? '-'}</p>}

                      {isTextAnswer(answer) && <p>{answer.text ?? '-'}</p>}
                    </>
                  ) : (
                    '-'
                  )}
                  {(attachments.length > 0 || notes.length > 0) && (
                    <ResponseExtraDataSection attachments={attachments} notes={notes} aggregateDisplay={false} />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
