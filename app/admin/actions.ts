'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import {
  getServerActionClient,
  getServiceRoleClient
} from '@/lib/supabase/server';

type AdminActionState = {
  success: boolean;
  message?: string;
};

const courseSchema = z.object({
  id: z.string().uuid().optional(),
  title_en: z.string().min(1),
  title_es: z.string().min(1),
  description_en: z.string().min(1),
  description_es: z.string().min(1),
  order_index: z.coerce.number().optional(),
  cover_image_url: z
    .string()
    .url()
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? value : null)),
  total_xp: z.coerce.number().optional()
});

const moduleSchema = z.object({
  id: z.string().uuid().optional(),
  course_id: z.string().uuid(),
  title_en: z.string().min(1),
  title_es: z.string().min(1),
  description_en: z.string().min(1),
  description_es: z.string().min(1),
  xp_value: z.coerce.number().default(100),
  order_index: z.coerce.number().optional()
});

const lessonSchema = z.object({
  id: z.string().uuid().optional(),
  module_id: z.string().uuid(),
  title_en: z.string().min(1),
  title_es: z.string().min(1),
  description_en: z.string().min(1),
  description_es: z.string().min(1),
  lesson_type: z.enum(['lesson', 'exercise']).default('lesson'),
  video_url: z
    .string()
    .url()
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? value : null)),
  storage_path: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? value : null)),
  order_index: z.coerce.number().optional()
});

const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const ensureAdmin = async () => {
  const supabase = getServerActionClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    throw new Error('Not authorized');
  }

  return { user };
};

const revalidateAll = (courseId?: string, lessonId?: string) => {
  revalidatePath('/admin');
  revalidatePath('/roadmap');
  revalidatePath('/course');
  if (courseId) {
    revalidatePath(`/course/${courseId}`);
  }
  if (lessonId) {
    revalidatePath(`/lesson/${lessonId}`);
  }
};

export const createCourse = async (_: AdminActionState | undefined, formData: FormData) => {
  try {
    await ensureAdmin();
    const serviceClient = getServiceRoleClient();
    const parsed = courseSchema.parse({
      title_en: formData.get('title_en'),
      title_es: formData.get('title_es'),
      description_en: formData.get('description_en'),
      description_es: formData.get('description_es'),
      order_index: formData.get('order_index'),
      cover_image_url: formData.get('cover_image_url'),
      total_xp: formData.get('total_xp')
    });

    await serviceClient.from('courses').insert({
      ...parsed,
      slug: slugify(parsed.title_en),
      total_xp: parsed.total_xp ?? 0
    });

    revalidateAll();
    return { success: true, message: 'Course created.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to create course.' };
  }
};

export const updateCourse = async (_: AdminActionState | undefined, formData: FormData) => {
  try {
    await ensureAdmin();
    const serviceClient = getServiceRoleClient();
    const parsed = courseSchema.parse({
      id: formData.get('id'),
      title_en: formData.get('title_en'),
      title_es: formData.get('title_es'),
      description_en: formData.get('description_en'),
      description_es: formData.get('description_es'),
      order_index: formData.get('order_index'),
      cover_image_url: formData.get('cover_image_url'),
      total_xp: formData.get('total_xp')
    });

    await serviceClient
      .from('courses')
      .update({
        title_en: parsed.title_en,
        title_es: parsed.title_es,
        description_en: parsed.description_en,
        description_es: parsed.description_es,
        order_index: parsed.order_index,
        cover_image_url: parsed.cover_image_url,
        total_xp: parsed.total_xp ?? 0,
        slug: slugify(parsed.title_en)
      })
      .eq('id', parsed.id!);

    revalidateAll(parsed.id);
    return { success: true, message: 'Course updated.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to update course.' };
  }
};

export const deleteCourse = async (_: AdminActionState | undefined, formData: FormData) => {
  try {
    await ensureAdmin();
    const serviceClient = getServiceRoleClient();
    const id = z.string().uuid().parse(formData.get('id'));

    await serviceClient.from('courses').delete().eq('id', id);

    revalidateAll();
    return { success: true, message: 'Course deleted.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to delete course.' };
  }
};

export const createModule = async (_: AdminActionState | undefined, formData: FormData) => {
  try {
    await ensureAdmin();
    const serviceClient = getServiceRoleClient();
    const parsed = moduleSchema.parse({
      course_id: formData.get('course_id'),
      title_en: formData.get('title_en'),
      title_es: formData.get('title_es'),
      description_en: formData.get('description_en'),
      description_es: formData.get('description_es'),
      xp_value: formData.get('xp_value'),
      order_index: formData.get('order_index')
    });

    await serviceClient.from('modules').insert(parsed);
    revalidateAll(parsed.course_id);
    return { success: true, message: 'Module created.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to create module.' };
  }
};

export const updateModule = async (_: AdminActionState | undefined, formData: FormData) => {
  try {
    await ensureAdmin();
    const serviceClient = getServiceRoleClient();
    const parsed = moduleSchema.parse({
      id: formData.get('id'),
      course_id: formData.get('course_id'),
      title_en: formData.get('title_en'),
      title_es: formData.get('title_es'),
      description_en: formData.get('description_en'),
      description_es: formData.get('description_es'),
      xp_value: formData.get('xp_value'),
      order_index: formData.get('order_index')
    });

    await serviceClient
      .from('modules')
      .update({
        title_en: parsed.title_en,
        title_es: parsed.title_es,
        description_en: parsed.description_en,
        description_es: parsed.description_es,
        xp_value: parsed.xp_value,
        order_index: parsed.order_index
      })
      .eq('id', parsed.id!);

    revalidateAll(parsed.course_id);
    return { success: true, message: 'Module updated.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to update module.' };
  }
};

export const deleteModule = async (_: AdminActionState | undefined, formData: FormData) => {
  try {
    await ensureAdmin();
    const serviceClient = getServiceRoleClient();
    const parsed = moduleSchema.pick({ id: true, course_id: true }).parse({
      id: formData.get('id'),
      course_id: formData.get('course_id')
    });

    await serviceClient.from('modules').delete().eq('id', parsed.id!);

    revalidateAll(parsed.course_id);
    return { success: true, message: 'Module deleted.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to delete module.' };
  }
};

export const createLesson = async (_: AdminActionState | undefined, formData: FormData) => {
  try {
    await ensureAdmin();
    const serviceClient = getServiceRoleClient();
    const courseId = z.string().uuid().parse(formData.get('course_id'));
    const parsed = lessonSchema.parse({
      module_id: formData.get('module_id'),
      title_en: formData.get('title_en'),
      title_es: formData.get('title_es'),
      description_en: formData.get('description_en'),
      description_es: formData.get('description_es'),
      lesson_type: formData.get('lesson_type') ?? 'lesson',
      video_url: formData.get('video_url'),
      storage_path: formData.get('storage_path'),
      order_index: formData.get('order_index')
    });

    await serviceClient.from('lessons').insert(parsed);

    revalidateAll(courseId);
    return { success: true, message: 'Lesson created.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to create lesson.' };
  }
};

export const updateLesson = async (_: AdminActionState | undefined, formData: FormData) => {
  try {
    await ensureAdmin();
    const serviceClient = getServiceRoleClient();
    const courseId = z.string().uuid().parse(formData.get('course_id'));
    const parsed = lessonSchema.parse({
      id: formData.get('id'),
      module_id: formData.get('module_id'),
      title_en: formData.get('title_en'),
      title_es: formData.get('title_es'),
      description_en: formData.get('description_en'),
      description_es: formData.get('description_es'),
      lesson_type: formData.get('lesson_type'),
      video_url: formData.get('video_url'),
      storage_path: formData.get('storage_path'),
      order_index: formData.get('order_index')
    });

    await serviceClient
      .from('lessons')
      .update({
        title_en: parsed.title_en,
        title_es: parsed.title_es,
        description_en: parsed.description_en,
        description_es: parsed.description_es,
        lesson_type: parsed.lesson_type,
        video_url: parsed.video_url,
        storage_path: parsed.storage_path,
        order_index: parsed.order_index
      })
      .eq('id', parsed.id!);

    revalidateAll(courseId, parsed.id);
    return { success: true, message: 'Lesson updated.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to update lesson.' };
  }
};

export const deleteLesson = async (_: AdminActionState | undefined, formData: FormData) => {
  try {
    await ensureAdmin();
    const serviceClient = getServiceRoleClient();
    const id = z.string().uuid().parse(formData.get('id'));
    const courseId = z.string().uuid().parse(formData.get('course_id'));

    await serviceClient.from('lessons').delete().eq('id', id);

    revalidateAll(courseId);
    return { success: true, message: 'Lesson deleted.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to delete lesson.' };
  }
};
