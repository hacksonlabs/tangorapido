import { clientEnv } from '@/lib/env';
import { getServerComponentClient, getServiceRoleClient } from '@/lib/supabase/server';

const LESSON_MEDIA_BUCKET = clientEnv.NEXT_PUBLIC_SUPABASE_LESSON_BUCKET;

export const getSignedLessonUrl = async (path: string | null, expiresIn = 60 * 15) => {
  if (!path) {
    return null;
  }

  const supabase = getServerComponentClient();
  const { data, error } = await supabase.storage
    .from(LESSON_MEDIA_BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error('Failed to create signed URL', error);
    return null;
  }

  return data?.signedUrl ?? null;
};

export const getServiceSignedUrl = async (path: string, expiresIn = 60 * 60) => {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase.storage
    .from(LESSON_MEDIA_BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error('Failed to create service signed URL', error);
    return null;
  }

  return data?.signedUrl ?? null;
};
