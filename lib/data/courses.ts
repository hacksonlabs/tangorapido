import { cache } from 'react';

import { getServerComponentClient } from '@/lib/supabase/server';
import type { Tables } from '@/types/database';

type LessonRow = Tables<'lessons'>;
type ModuleRow = Tables<'modules'>;
type CourseRow = Tables<'courses'>;
type ProgressRow = Tables<'progresses'>;
type LessonStateRow = Tables<'lesson_states'>;

export type LessonWithProgress = LessonRow & {
  completed: boolean;
};

export type ModuleWithProgress = ModuleRow & {
  lessons: LessonWithProgress[];
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  xpEarned: number;
};

export type CourseWithProgress = CourseRow & {
  modules: ModuleWithProgress[];
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  xpEarned: number;
  nextLessonId?: string;
};

type RawCourse = CourseRow & {
  modules: (ModuleRow & { lessons: LessonRow[] })[];
};

const DUMMY_TIMESTAMP = '2024-01-01T00:00:00.000Z';

const DUMMY_RAW_COURSES: RawCourse[] = [
  {
    id: 'demo-course-fundamentals',
    slug: 'course-1-fundamentals',
    title_en: 'Tango Fundamentals',
    title_es: 'Fundamentos de Tango',
    description_en: '19 lessons covering the pillars, steps, figures, and etiquette of tango.',
    description_es: '19 lecciones que cubren los pilares, pasos, figuras y etiqueta del tango.',
    cover_image_url: null,
    total_xp: 600,
    order_index: 0,
    created_at: DUMMY_TIMESTAMP,
    updated_at: DUMMY_TIMESTAMP,
    modules: [
      {
        id: 'demo-module-course-intro',
        course_id: 'demo-course-fundamentals',
        title_en: 'Course Introduction',
        title_es: 'Introducción al curso',
        description_en: 'Welcome to Tango Rápido fundamentals—meet your guides and outline the journey.',
        description_es: 'Bienvenida a los fundamentos de Tango Rápido: conoce a tus guías y el recorrido.',
        order_index: 0,
        xp_value: 40,
        created_at: DUMMY_TIMESTAMP,
        updated_at: DUMMY_TIMESTAMP,
        lessons: [
          {
            id: 'demo-lesson-course-intro',
            module_id: 'demo-module-course-intro',
            title_en: 'Tango Rápido Fundamentals Overview',
            title_es: 'Visión general de Fundamentos Tango Rápido',
            description_en: 'A warm introduction to the fundamentals course and how to pace yourself.',
            description_es: 'Una cálida introducción al curso de fundamentos y cómo dosificarte.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/course-intro.mp4',
            storage_path: 'fundamentals/course-intro.mp4',
            order_index: 0,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          }
        ]
      },
      {
        id: 'demo-module-three-pillars',
        course_id: 'demo-course-fundamentals',
        title_en: 'Three Pillars of Tango',
        title_es: 'Tres pilares del tango',
        description_en: 'Understand the triple connection—self, partner, and music.',
        description_es: 'Comprende la triple conexión: contigo, tu pareja y la música.',
        order_index: 1,
        xp_value: 120,
        created_at: DUMMY_TIMESTAMP,
        updated_at: DUMMY_TIMESTAMP,
        lessons: [
          {
            id: 'demo-lesson-three-pillars-overview',
            module_id: 'demo-module-three-pillars',
            title_en: 'Three Pillars of Tango',
            title_es: 'Tres pilares del tango',
            description_en: 'Overview of the foundational connections that support confident dancing.',
            description_es: 'Resumen de las conexiones fundamentales que sostienen un baile seguro.',
            lesson_type: 'lesson',
            video_url: 'https://www.youtube.com/watch?v=stmmlwCFE-M',
            storage_path: 'fundamentals/pillars/overview.mp4',
            order_index: 0,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-lesson-connection-self',
            module_id: 'demo-module-three-pillars',
            title_en: 'Connection to Yourself',
            title_es: 'Conexión contigo mismo',
            description_en: 'Breathing, posture, and balance drills to ground your movement.',
            description_es: 'Ejercicios de respiración, postura y equilibrio para anclar tu movimiento.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/pillars-self.mp4',
            storage_path: 'fundamentals/pillars/self.mp4',
            order_index: 1,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-exercise-axis',
            module_id: 'demo-module-three-pillars',
            title_en: 'Axis Drill',
            title_es: 'Práctica de eje',
            description_en: 'Strengthen your personal axis with gentle balance holds at the wall.',
            description_es: 'Fortalece tu eje personal con suaves ejercicios de equilibrio en la pared.',
            lesson_type: 'exercise',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/exercise-axis.mp4',
            storage_path: 'fundamentals/pillars/axis.mp4',
            order_index: 2,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-lesson-connection-partner',
            module_id: 'demo-module-three-pillars',
            title_en: 'Connection to Partner',
            title_es: 'Conexión con la pareja',
            description_en: 'Practice gentle frame exchanges and listening within the embrace.',
            description_es: 'Practica intercambios suaves de marco y escucha dentro del abrazo.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/pillars-partner.mp4',
            storage_path: 'fundamentals/pillars/partner.mp4',
            order_index: 3,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-exercise-partner-embrace',
            module_id: 'demo-module-three-pillars',
            title_en: 'Partner Embrace Drill',
            title_es: 'Práctica de abrazo con pareja',
            description_en: 'Explore offering the embrace with open palms and relaxed shoulders.',
            description_es: 'Explora ofrecer el abrazo con palmas abiertas y hombros relajados.',
            lesson_type: 'exercise',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/exercise-partner-embrace.mp4',
            storage_path: 'fundamentals/pillars/partner-embrace.mp4',
            order_index: 4,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-exercise-partner-communication',
            module_id: 'demo-module-three-pillars',
            title_en: 'Partner Communication Drill',
            title_es: 'Práctica de comunicación con pareja',
            description_en: 'Listen and respond through the embrace without verbal cues.',
            description_es: 'Escucha y responde a través del abrazo sin señales verbales.',
            lesson_type: 'exercise',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/exercise-partner-communication.mp4',
            storage_path: 'fundamentals/pillars/partner-communication.mp4',
            order_index: 5,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-lesson-connection-music',
            module_id: 'demo-module-three-pillars',
            title_en: 'Connection to Music',
            title_es: 'Conexión con la música',
            description_en: 'Feel phrasing and melody with easy tapping and swaying exercises.',
            description_es: 'Siente la frase y la melodía con sencillos ejercicios de palmas y balanceo.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/pillars-music.mp4',
            storage_path: 'fundamentals/pillars/music.mp4',
            order_index: 6,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-exercise-music-articulation',
            module_id: 'demo-module-three-pillars',
            title_en: 'Hearing Articulation (Staccato / Legato)',
            title_es: 'Escuchar articulación (Staccato / Legato)',
            description_en: 'Alternate staccato and legato walks to hear musical articulation.',
            description_es: 'Alterna caminatas staccato y legato para escuchar la articulación musical.',
            lesson_type: 'exercise',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/exercise-music-articulation.mp4',
            storage_path: 'fundamentals/pillars/music-articulation.mp4',
            order_index: 7,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-exercise-music-rhythm',
            module_id: 'demo-module-three-pillars',
            title_en: 'Hearing Rhythm Drill',
            title_es: 'Práctica de ritmo',
            description_en: 'March and clap to recognize the underlying rhythm in tango tracks.',
            description_es: 'Marcha y aplaude para reconocer el ritmo subyacente en pistas de tango.',
            lesson_type: 'exercise',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/exercise-music-rhythm.mp4',
            storage_path: 'fundamentals/pillars/music-rhythm.mp4',
            order_index: 8,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-exercise-music-syncopation',
            module_id: 'demo-module-three-pillars',
            title_en: 'Hearing Syncopation Drill',
            title_es: 'Práctica de síncopa',
            description_en: 'Shift weight to playful syncopations, accenting quick beats.',
            description_es: 'Traslada el peso en síncopas juguetonas, acentuando los tiempos rápidos.',
            lesson_type: 'exercise',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/exercise-music-syncopation.mp4',
            storage_path: 'fundamentals/pillars/music-syncopation.mp4',
            order_index: 9,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-exercise-music-pauses',
            module_id: 'demo-module-three-pillars',
            title_en: 'Hearing Pauses Drill',
            title_es: 'Práctica de pausas',
            description_en: 'Hold poised pauses between phrases to appreciate musical breathing.',
            description_es: 'Mantén pausas elegantes entre frases para apreciar la respiración musical.',
            lesson_type: 'exercise',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/exercise-music-pauses.mp4',
            storage_path: 'fundamentals/pillars/music-pauses.mp4',
            order_index: 10,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          }
        ]
      },
      {
        id: 'demo-module-eight-fundamental-steps',
        course_id: 'demo-course-fundamentals',
        title_en: 'Eight Fundamental Steps',
        title_es: 'Ocho pasos fundamentales',
        description_en: 'Master the essential steps that unlock every tango figure.',
        description_es: 'Domina los pasos esenciales que abren cada figura de tango.',
        order_index: 2,
        xp_value: 200,
        created_at: DUMMY_TIMESTAMP,
        updated_at: DUMMY_TIMESTAMP,
        lessons: [
          {
            id: 'demo-lesson-eight-steps-intro',
            module_id: 'demo-module-eight-fundamental-steps',
            title_en: 'Module Introduction',
            title_es: 'Introducción al módulo',
            description_en: 'Overview of the eight steps and how to structure practice sessions.',
            description_es: 'Resumen de los ocho pasos y cómo estructurar las prácticas.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/eight-steps-intro.mp4',
            storage_path: 'fundamentals/steps/intro.mp4',
            order_index: 0,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-lesson-front-step',
            module_id: 'demo-module-eight-fundamental-steps',
            title_en: 'Front Step',
            title_es: 'Paso adelante',
            description_en: 'Lead and follow front steps with mindful weight transfers.',
            description_es: 'Guía y sigue pasos adelante con transferencias de peso conscientes.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/step-front.mp4',
            storage_path: 'fundamentals/steps/front.mp4',
            order_index: 1,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-lesson-back-step',
            module_id: 'demo-module-eight-fundamental-steps',
            title_en: 'Back Step',
            title_es: 'Paso atrás',
            description_en: 'Travel backward smoothly while maintaining posture and embrace.',
            description_es: 'Desplázate hacia atrás con suavidad conservando postura y abrazo.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/step-back.mp4',
            storage_path: 'fundamentals/steps/back.mp4',
            order_index: 2,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-lesson-side-step',
            module_id: 'demo-module-eight-fundamental-steps',
            title_en: 'Side Step',
            title_es: 'Paso lateral',
            description_en: 'Shift laterally with relaxed hips and steady cadence.',
            description_es: 'Desplázate lateralmente con caderas relajadas y cadencia estable.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/step-side.mp4',
            storage_path: 'fundamentals/steps/side.mp4',
            order_index: 3,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-lesson-front-ocho',
            module_id: 'demo-module-eight-fundamental-steps',
            title_en: 'Front Ocho',
            title_es: 'Ocho adelante',
            description_en: 'Explore forward ochos with hips and torso guiding the spiral.',
            description_es: 'Explora ochos adelante usando caderas y torso para guiar la espiral.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/ocho-front.mp4',
            storage_path: 'fundamentals/steps/front-ocho.mp4',
            order_index: 4,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-lesson-back-ocho',
            module_id: 'demo-module-eight-fundamental-steps',
            title_en: 'Back Ocho',
            title_es: 'Ocho atrás',
            description_en: 'Learn back ochos with grounded pivots and patient leading.',
            description_es: 'Aprende ochos atrás con pivotes firmes y conducción paciente.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/ocho-back.mp4',
            storage_path: 'fundamentals/steps/back-ocho.mp4',
            order_index: 5,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-lesson-change-weight',
            module_id: 'demo-module-eight-fundamental-steps',
            title_en: 'Change Weight',
            title_es: 'Cambio de peso',
            description_en: 'Practice subtle weight shifts as preparation for adornos and pivots.',
            description_es: 'Practica cambios de peso sutiles como preparación para adornos y pivotes.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/change-weight.mp4',
            storage_path: 'fundamentals/steps/change-weight.mp4',
            order_index: 6,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-lesson-pause',
            module_id: 'demo-module-eight-fundamental-steps',
            title_en: 'Pause',
            title_es: 'Pausa',
            description_en: 'Savor stillness—use pauses to reconnect and breathe with the music.',
            description_es: 'Saborea la quietud: usa las pausas para reconectar y respirar con la música.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/pause.mp4',
            storage_path: 'fundamentals/steps/pause.mp4',
            order_index: 7,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-lesson-cross',
            module_id: 'demo-module-eight-fundamental-steps',
            title_en: 'Cross',
            title_es: 'Cruzada',
            description_en: 'Finish the foundational series with a clean cross and shared balance.',
            description_es: 'Cierra la serie fundamental con una cruzada limpia y equilibrio compartido.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/cross.mp4',
            storage_path: 'fundamentals/steps/cross.mp4',
            order_index: 8,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          }
        ]
      },
      {
        id: 'demo-module-fundamental-figures',
        course_id: 'demo-course-fundamentals',
        title_en: 'Fundamental Figures',
        title_es: 'Figuras fundamentales',
        description_en: 'Combine the core steps into classic figures for social dance.',
        description_es: 'Combina los pasos básicos en figuras clásicas para la pista social.',
        order_index: 3,
        xp_value: 160,
        created_at: DUMMY_TIMESTAMP,
        updated_at: DUMMY_TIMESTAMP,
        lessons: [
          {
            id: 'demo-lesson-figure-walking',
            module_id: 'demo-module-fundamental-figures',
            title_en: 'Walking',
            title_es: 'Caminar',
            description_en: 'Use musical walking patterns to build confidence on the ronda.',
            description_es: 'Usa patrones de caminata musical para ganar confianza en la ronda.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/figure-walking.mp4',
            storage_path: 'fundamentals/figures/walking.mp4',
            order_index: 0,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-lesson-walking-to-cross',
            module_id: 'demo-module-fundamental-figures',
            title_en: 'Walking to Cross',
            title_es: 'Caminar a la cruzada',
            description_en: 'Link walks to a comfortable cross, tailoring options for each role.',
            description_es: 'Une caminatas con una cruzada cómoda, adaptando opciones para cada rol.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/figure-walking-cross.mp4',
            storage_path: 'fundamentals/figures/walking-to-cross.mp4',
            order_index: 1,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-lesson-basic-eight',
            module_id: 'demo-module-fundamental-figures',
            title_en: 'Basic 8',
            title_es: 'Básico 8',
            description_en: 'Assemble the eight-count basic with rhythm and intention.',
            description_es: 'Arma el básico de ocho tiempos con ritmo e intención.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/figure-basic-eight.mp4',
            storage_path: 'fundamentals/figures/basic-eight.mp4',
            order_index: 2,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-lesson-ocho-cortado',
            module_id: 'demo-module-fundamental-figures',
            title_en: 'Ocho Cortado',
            title_es: 'Ocho cortado',
            description_en: 'Introduce rebounds and playful rhythm through the ocho cortado.',
            description_es: 'Introduce rebotes y ritmo juguetón con el ocho cortado.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/figure-ocho-cortado.mp4',
            storage_path: 'fundamentals/figures/ocho-cortado.mp4',
            order_index: 3,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-lesson-molinete',
            module_id: 'demo-module-fundamental-figures',
            title_en: 'Molinete',
            title_es: 'Molinete',
            description_en: 'Circle gracefully around your partner using molinete dynamics.',
            description_es: 'Gira con gracia alrededor de tu pareja usando dinámicas de molinete.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/figure-molinete.mp4',
            storage_path: 'fundamentals/figures/molinete.mp4',
            order_index: 4,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          }
        ]
      },
      {
        id: 'demo-module-fundamental-etiquette',
        course_id: 'demo-course-fundamentals',
        title_en: 'Fundamental Etiquette',
        title_es: 'Etiqueta fundamental',
        description_en: 'Navigate tango culture with confidence from cabeceo to the ronda.',
        description_es: 'Navega la cultura tanguera con confianza, del cabeceo a la ronda.',
        order_index: 4,
        xp_value: 80,
        created_at: DUMMY_TIMESTAMP,
        updated_at: DUMMY_TIMESTAMP,
        lessons: [
          {
            id: 'demo-lesson-cabeceo',
            module_id: 'demo-module-fundamental-etiquette',
            title_en: 'Cabeceo',
            title_es: 'Cabeceo',
            description_en: 'Learn the inviting eye contact that begins each tanda respectfully.',
            description_es: 'Aprende el contacto visual de invitación que inicia cada tanda con respeto.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/etiquette-cabeceo.mp4',
            storage_path: 'fundamentals/etiquette/cabeceo.mp4',
            order_index: 0,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-lesson-embrace-etiquette',
            module_id: 'demo-module-fundamental-etiquette',
            title_en: 'Embracing Etiquette',
            title_es: 'Etiqueta del abrazo',
            description_en: 'Offer and accept the embrace gracefully—no talking, just connection.',
            description_es: 'Ofrece y acepta el abrazo con gracia: sin hablar, solo conexión.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/etiquette-embrace.mp4',
            storage_path: 'fundamentals/etiquette/embrace.mp4',
            order_index: 1,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-lesson-line-of-dance',
            module_id: 'demo-module-fundamental-etiquette',
            title_en: 'Line of Dance',
            title_es: 'Línea de baile',
            description_en: 'Understand progression vs. in-place steps to flow with the ronda.',
            description_es: 'Comprende pasos de progresión frente a pasos en el lugar para fluir en la ronda.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/etiquette-line-of-dance.mp4',
            storage_path: 'fundamentals/etiquette/line-of-dance.mp4',
            order_index: 2,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-lesson-practicas-milongas',
            module_id: 'demo-module-fundamental-etiquette',
            title_en: 'Prácticas y Milongas',
            title_es: 'Prácticas y milongas',
            description_en: 'Tips for attending prácticas and milongas, from entry to farewell.',
            description_es: 'Consejos para asistir a prácticas y milongas, desde el ingreso hasta la despedida.',
            lesson_type: 'lesson',
            video_url: 'https://storage.googleapis.com/tango-rapido/demo/etiquette-practicas-milongas.mp4',
            storage_path: 'fundamentals/etiquette/practicas-milongas.mp4',
            order_index: 3,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          }
        ]
      }
    ]
  },
  {
    id: 'demo-course-musicality',
    slug: 'tango-musicality',
    title_en: 'Tango Musicality',
    title_es: 'Musicalidad en el Tango',
    description_en: 'Learn to feel the orchestra, phrase your steps, and play with dynamics.',
    description_es: 'Aprende a sentir la orquesta, frasear tus pasos y jugar con las dinámicas.',
    cover_image_url: null,
    total_xp: 360,
    order_index: 2,
    created_at: DUMMY_TIMESTAMP,
    updated_at: DUMMY_TIMESTAMP,
    modules: [
      {
        id: 'demo-module-rythm',
        course_id: 'demo-course-musicality',
        title_en: 'Rhythm & Timing',
        title_es: 'Ritmo y tiempo',
        description_en: 'Clap, step, and pause with classic tango, vals, and milonga tracks.',
        description_es: 'Aplaude, camina y pausa con pistas clásicas de tango, vals y milonga.',
        order_index: 1,
        xp_value: 180,
        created_at: DUMMY_TIMESTAMP,
        updated_at: DUMMY_TIMESTAMP,
        lessons: [
          {
            id: 'demo-lesson-beat',
            module_id: 'demo-module-rythm',
            title_en: 'Finding the Beat',
            title_es: 'Encontrar el pulso',
            description_en: 'Use soft movements to recognize downbeats and phrasing.',
            description_es: 'Usa movimientos suaves para reconocer tiempos y frases musicales.',
            lesson_type: 'lesson',
            video_url: null,
            storage_path: null,
            order_index: 1,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-lesson-syncopation',
            module_id: 'demo-module-rythm',
            title_en: 'Playing with Syncopation',
            title_es: 'Jugando con síncopas',
            description_en: 'Practice weight changes to accent the music playfully.',
            description_es: 'Practica cambios de peso para acentuar la música con diversión.',
            lesson_type: 'lesson',
            video_url: null,
            storage_path: null,
            order_index: 2,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          }
        ]
      },
      {
        id: 'demo-module-expression',
        course_id: 'demo-course-musicality',
        title_en: 'Expression & Dynamics',
        title_es: 'Expresión y dinámicas',
        description_en: 'Shape your dance with crescendos, pauses, and gentle adornos.',
        description_es: 'Dale forma a tu baile con crescendos, pausas y adornos suaves.',
        order_index: 2,
        xp_value: 180,
        created_at: DUMMY_TIMESTAMP,
        updated_at: DUMMY_TIMESTAMP,
        lessons: [
          {
            id: 'demo-lesson-pauses',
            module_id: 'demo-module-expression',
            title_en: 'Elegant Pauses',
            title_es: 'Pausas elegantes',
            description_en: 'Discover how pausing can add drama and comfort to the embrace.',
            description_es: 'Descubre cómo una pausa agrega dramatismo y confort al abrazo.',
            lesson_type: 'lesson',
            video_url: null,
            storage_path: null,
            order_index: 1,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          },
          {
            id: 'demo-lesson-adornos',
            module_id: 'demo-module-expression',
            title_en: 'Simple Adornos',
            title_es: 'Adornos sencillos',
            description_en: 'Add gentle embellishments without losing balance or connection.',
            description_es: 'Agrega adornos suaves sin perder equilibrio ni conexión.',
            lesson_type: 'lesson',
            video_url: null,
            storage_path: null,
            order_index: 2,
            created_at: DUMMY_TIMESTAMP,
            updated_at: DUMMY_TIMESTAMP
          }
        ]
      }
    ]
  }
];
const getLessonStates = async (userId: string | null) => {
  if (!userId) {
    return [];
  }

  const supabase = getServerComponentClient();
  const { data } = await supabase
    .from('lesson_states')
    .select('lesson_id, completed')
    .eq('user_id', userId);

  return (data ?? []) as Pick<LessonStateRow, 'lesson_id' | 'completed'>[];
};

const getProgressRows = async (userId: string | null) => {
  if (!userId) {
    return [];
  }

  const supabase = getServerComponentClient();
  const { data } = await supabase
    .from('progresses')
    .select('*')
    .eq('user_id', userId);

  return (data ?? []) as ProgressRow[];
};

const computeCourse = (
  course: RawCourse,
  lessonStates: Record<string, boolean>,
  progressRows: ProgressRow[]
): CourseWithProgress => {
  let totalLessons = 0;
  let completedLessons = 0;
  let nextLessonId: string | undefined;
  let xpEarned = 0;

  const modules: ModuleWithProgress[] = course.modules
    ?.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
    .map((module) => {
      const lessons = (module.lessons ?? []).sort(
        (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
      );

      const lessonViews: LessonWithProgress[] = lessons.map((lesson) => {
        const completed = Boolean(lessonStates[lesson.id]);
        return {
          ...lesson,
          completed
        };
      });

      const moduleCompletedLessons = lessonViews.filter((lesson) => lesson.completed).length;
      const moduleTotalLessons = lessonViews.length;
      totalLessons += moduleTotalLessons;
      completedLessons += moduleCompletedLessons;

      if (!nextLessonId) {
        const nextLesson = lessonViews.find((lesson) => !lesson.completed);
        nextLessonId = nextLesson?.id ?? nextLessonId;
      }

      const moduleProgress =
        moduleTotalLessons === 0 ? 0 : (moduleCompletedLessons / moduleTotalLessons) * 100;

      const moduleProgressRow = progressRows.find((row) => row.module_id === module.id);
      const moduleXpEarned =
        moduleProgressRow?.xp_earned ??
        (moduleProgress >= 100 ? module.xp_value ?? 0 : Math.round((module.xp_value ?? 0) * (moduleProgress / 100)));

      xpEarned += moduleXpEarned;

      return {
        ...module,
        lessons: lessonViews,
        totalLessons: moduleTotalLessons,
        completedLessons: moduleCompletedLessons,
        progressPercent: Math.round(moduleProgress),
        xpEarned: moduleXpEarned
      };
    }) ?? [];

  const courseProgress =
    totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

  const courseProgressRow = progressRows.find(
    (row) => row.course_id === course.id && row.module_id === null
  );

  if (courseProgressRow) {
    xpEarned = Math.max(xpEarned, courseProgressRow.xp_earned);
  }

  return {
    ...course,
    modules,
    totalLessons,
    completedLessons,
    progressPercent: courseProgress,
    xpEarned,
    nextLessonId
  };
};

export const getCoursesWithProgress = cache(async (userId: string | null) => {
  const supabase = getServerComponentClient();
  const { data } = await supabase
    .from('courses')
    .select(
      `
      *,
      modules (
        *,
        lessons (*)
      )
    `
    )
    .order('order_index', { ascending: true })
    .order('order_index', { foreignTable: 'modules', ascending: true })
    .order('order_index', { foreignTable: 'modules.lessons', ascending: true });

  const rawCourses = ((data ?? []).length > 0 ? (data ?? []) : DUMMY_RAW_COURSES) as RawCourse[];

  const lessonStatesRows = await getLessonStates(userId);
  const progressRows = await getProgressRows(userId);

  const lessonStates = Object.fromEntries(
    lessonStatesRows.map((state) => [state.lesson_id, state.completed])
  );

  return rawCourses.map((course) => computeCourse(course, lessonStates, progressRows));
});

export const getCourseWithProgress = cache(
  async (courseId: string, userId: string | null): Promise<CourseWithProgress | null> => {
    const supabase = getServerComponentClient();
    const { data } = await supabase
      .from('courses')
      .select(
        `
        *,
        modules (
          *,
          lessons (*)
        )
      `
      )
      .eq('id', courseId)
      .single();

    const targetCourse = data
      ? (data as RawCourse)
      : DUMMY_RAW_COURSES.find((course) => course.id === courseId);

    if (!targetCourse) {
      return null;
    }

    const lessonStatesRows = await getLessonStates(userId);
    const progressRows = await getProgressRows(userId);
    const lessonStates = Object.fromEntries(
      lessonStatesRows.map((state) => [state.lesson_id, state.completed])
    );

    return computeCourse(targetCourse, lessonStates, progressRows);
  }
);

export const getModuleWithProgress = cache(
  async (
    moduleId: string,
    userId: string | null
  ): Promise<ModuleWithProgress & { course: CourseRow } | null> => {
    const supabase = getServerComponentClient();

    const { data } = await supabase
      .from('modules')
      .select(
        `
        *,
        course:courses (*),
        lessons (*)
      `
      )
      .eq('id', moduleId)
      .single();

    let moduleData = data as
      | (ModuleRow & {
          course: CourseRow;
          lessons: LessonRow[];
        })
      | null;

    if (!moduleData) {
      const fallbackCourse = DUMMY_RAW_COURSES.find((course) =>
        course.modules.some((module) => module.id === moduleId)
      );
      const fallbackModule = fallbackCourse?.modules.find((module) => module.id === moduleId);

      if (fallbackCourse && fallbackModule) {
        moduleData = {
          ...fallbackModule,
          course: fallbackCourse,
          lessons: fallbackModule.lessons
        };
      }
    }

    if (!moduleData) {
      return null;
    }

    const { course, lessons, ...module } = moduleData as ModuleRow & {
      course: CourseRow;
      lessons: LessonRow[];
    };

    const lessonStatesRows = await getLessonStates(userId);
    const lessonStates = Object.fromEntries(
      lessonStatesRows.map((state) => [state.lesson_id, state.completed])
    );
    const progressRows = await getProgressRows(userId);

    const computedCourse = computeCourse(
      {
        ...course,
        modules: [{ ...(module as ModuleRow), lessons }]
      },
      lessonStates,
      progressRows
    );

    const computedModule = computedCourse.modules[0];

    return {
      ...computedModule,
      course
    };
  }
);

export const getLessonWithContext = cache(
  async (
    lessonId: string,
    userId: string | null
  ): Promise<
    (LessonWithProgress & {
      module: ModuleWithProgress;
      course: CourseRow;
    }) | null
  > => {
    const supabase = getServerComponentClient();
    const { data } = await supabase
      .from('lessons')
      .select(
        `
        *,
        module:modules (
          *,
          course:courses (*),
          lessons (*)
        )
      `
      )
      .eq('id', lessonId)
      .single();

    let lessonData = data as
      | (LessonRow & {
          module: ModuleRow & {
            course: CourseRow;
            lessons: LessonRow[];
          };
        })
      | null;

    if (!lessonData) {
      const fallbackCourse = DUMMY_RAW_COURSES.find((course) =>
        course.modules.some((module) => module.lessons.some((lesson) => lesson.id === lessonId))
      );
      const fallbackModule = fallbackCourse?.modules.find((module) =>
        module.lessons.some((lesson) => lesson.id === lessonId)
      );
      const fallbackLesson = fallbackModule?.lessons.find((lesson) => lesson.id === lessonId);

      if (fallbackCourse && fallbackModule && fallbackLesson) {
        lessonData = {
          ...fallbackLesson,
          module: {
            ...fallbackModule,
            course: fallbackCourse,
            lessons: fallbackModule.lessons
          }
        };
      }
    }

    if (!lessonData) {
      return null;
    }

    const { module, ...lesson } = lessonData as LessonRow & {
      module: ModuleRow & {
        course: CourseRow;
        lessons: LessonRow[];
      };
    };

    const lessonStatesRows = await getLessonStates(userId);
    const lessonStates = Object.fromEntries(
      lessonStatesRows.map((state) => [state.lesson_id, state.completed])
    );
    const progressRows = await getProgressRows(userId);

    const computedCourse = computeCourse(
      {
        ...module.course,
        modules: [
          {
            ...module,
            lessons: module.lessons
          }
        ]
      },
      lessonStates,
      progressRows
    );

    const computedModule = computedCourse.modules.find((mod) => mod.id === module.id);
    const computedLesson = computedModule?.lessons.find((item) => item.id === lesson.id);

    if (!computedModule || !computedLesson) {
      return null;
    }

    return {
      ...computedLesson,
      module: computedModule,
      course: computedCourse
    };
  }
);
