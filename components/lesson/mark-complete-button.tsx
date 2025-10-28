'use client';

import { useTransition } from 'react';

import { completeLesson } from '@/app/lesson/[lessonId]/actions';
import { useLanguage } from '@/components/language-provider';

type MarkCompleteButtonProps = {
  lessonId: string;
  completed: boolean;
};

export const MarkCompleteButton = ({ lessonId, completed }: MarkCompleteButtonProps) => {
  const { t } = useLanguage();
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        await completeLesson(lessonId);
      } catch (error) {
        console.error(error);
      }
    });
  };

  const disabled = completed || pending;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="btn-primary w-full md:w-auto"
      aria-live="polite"
    >
      {completed ? t('lesson.completed') : pending ? `${t('lesson.markComplete')}…` : t('lesson.markComplete')}
    </button>
  );
};
