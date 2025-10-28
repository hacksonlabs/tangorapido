export type Language = 'en' | 'es';

export const SUPPORTED_LANGUAGES: Language[] = ['en', 'es'];

export const translations: Record<
  Language,
  Record<
    | 'app.title'
    | 'app.tagline'
    | 'nav.roadmap'
    | 'nav.courses'
    | 'nav.profile'
    | 'nav.admin'
    | 'nav.logout'
    | 'nav.login'
    | 'nav.signup'
    | 'nav.language'
    | 'auth.email'
    | 'auth.password'
    | 'auth.confirmPassword'
    | 'auth.login'
    | 'auth.signup'
    | 'auth.logout'
    | 'auth.haveAccount'
    | 'auth.noAccount'
    | 'auth.success'
    | 'auth.error'
    | 'auth.remember'
    | 'auth.forgot'
    | 'roadmap.title'
    | 'roadmap.subtitle'
    | 'roadmap.empty'
    | 'roadmap.legend.course'
    | 'roadmap.legend.module'
    | 'roadmap.legend.lesson'
    | 'roadmap.legend.badge'
    | 'roadmap.timelineTitle'
    | 'roadmap.timelineDescription'
    | 'roadmap.viewCourse'
    | 'roadmap.startCourse'
    | 'roadmap.continueCourse'
    | 'roadmap.completedCourse'
    | 'course.overview'
    | 'course.modules'
    | 'course.progress'
    | 'course.totalXp'
    | 'course.badges'
    | 'course.exercises'
    | 'course.noExercises'
    | 'module.progress'
    | 'lesson.type.lesson'
    | 'lesson.type.exercise'
    | 'lesson.markComplete'
    | 'lesson.completed'
    | 'lesson.notStarted'
    | 'lesson.noVideo'
    | 'profile.title'
    | 'profile.totalXp'
    | 'profile.badges'
    | 'profile.completedLessons'
    | 'profile.keepGoing'
    | 'admin.title'
    | 'admin.courses'
    | 'admin.modules'
    | 'admin.lessons'
    | 'admin.createCourse'
    | 'admin.createModule'
    | 'admin.createLesson'
    | 'admin.edit'
    | 'admin.delete'
    | 'admin.save'
    | 'admin.cancel'
    | 'admin.videoUrl'
    | 'admin.storagePath'
    | 'generic.loading'
    | 'generic.error'
    | 'generic.empty'
    | 'generic.notFound'
    | 'generic.progress'
    | 'generic.xp'
    | 'generic.badges'
    | 'generic.language'
    | 'generic.close'
    | 'generic.continue'
    | 'generic.back'
    | 'a11y.skipNav'
    | 'badges.firstSteps'
    | 'badges.quarterCourse'
    | 'badges.moduleMaster'
    | 'badges.lessonStreak'
    | 'badges.firstStepsDesc'
    | 'badges.quarterCourseDesc'
    | 'badges.moduleMasterDesc'
    | 'badges.lessonStreakDesc'
    | 'badges.unlocked'
    | 'badges.locked'
  , string>
> = {
  en: {
    'app.title': 'Tango Rápido',
    'app.tagline': 'Learn tango faster with gentle guidance.',
    'nav.roadmap': 'Roadmap',
    'nav.courses': 'Courses',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin',
    'nav.logout': 'Log out',
    'nav.login': 'Log in',
    'nav.signup': 'Sign up',
    'nav.language': 'Language',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm password',
    'auth.login': 'Log in',
    'auth.signup': 'Create account',
    'auth.logout': 'Log out',
    'auth.haveAccount': 'Already have an account?',
    'auth.noAccount': "Don't have an account?",
    'auth.success': 'Success! Redirecting…',
    'auth.error': 'Something went wrong. Please try again.',
    'auth.remember': 'Remember me',
    'auth.forgot': 'Forgot password?',
    'roadmap.title': 'Your learning roadmap',
    'roadmap.subtitle': 'Follow the steps to glide onto the dance floor with confidence.',
    'roadmap.empty': 'Add courses from the admin studio to see them here. Learners will track their progress and unlock badges as they complete lessons.',
    'roadmap.legend.course': 'Course milestone',
    'roadmap.legend.module': 'Module checkpoint',
    'roadmap.legend.lesson': 'Lesson step',
    'roadmap.legend.badge': 'Badge moment',
    'roadmap.timelineTitle': 'Your tango journey',
    'roadmap.timelineDescription': 'Each circle marks a course milestone—follow the path, pick a course, and keep gliding forward.',
    'roadmap.viewCourse': 'View course details',
    'roadmap.startCourse': 'Start course',
    'roadmap.continueCourse': 'Continue course',
    'roadmap.completedCourse': 'Course completed 🎉',
    'course.overview': 'Course overview',
    'course.modules': 'Modules',
    'course.progress': 'Progress',
    'course.totalXp': 'Total XP',
    'course.badges': 'Badges',
    'course.exercises': 'Quick access exercises',
    'course.noExercises': 'No exercises yet—keep exploring the lessons.',
    'module.progress': 'Module progress',
    'lesson.type.lesson': 'Lesson',
    'lesson.type.exercise': 'Exercise',
    'lesson.markComplete': 'Mark complete',
    'lesson.completed': 'Completed',
    'lesson.notStarted': 'Not started',
    'lesson.noVideo': 'Video coming soon. Check back later!',
    'profile.title': 'Your dance journey',
    'profile.totalXp': 'Total XP earned',
    'profile.badges': 'Badges earned',
    'profile.completedLessons': 'Lessons completed',
    'profile.keepGoing': 'Keep going—your next badge is within reach!',
    'admin.title': 'Admin studio',
    'admin.courses': 'Courses',
    'admin.modules': 'Modules',
    'admin.lessons': 'Lessons',
    'admin.createCourse': 'Add course',
    'admin.createModule': 'Add module',
    'admin.createLesson': 'Add lesson',
    'admin.edit': 'Edit',
    'admin.delete': 'Delete',
    'admin.save': 'Save changes',
    'admin.cancel': 'Cancel',
    'admin.videoUrl': 'Video URL',
    'admin.storagePath': 'Storage path',
    'generic.loading': 'Loading',
    'generic.error': 'Something went wrong.',
    'generic.empty': 'Nothing to show yet.',
    'generic.notFound': "We couldn't find that page.",
    'generic.progress': 'Progress',
    'generic.xp': 'XP',
    'generic.badges': 'Badges',
    'generic.language': 'Language',
    'generic.close': 'Close',
    'generic.continue': 'Continue',
    'generic.back': 'Back',
    'a11y.skipNav': 'Skip to main content',
    'badges.firstSteps': 'First Steps',
    'badges.quarterCourse': 'Quarter Milestone',
    'badges.moduleMaster': 'Module Master',
    'badges.lessonStreak': 'Lesson Streak',
    'badges.firstStepsDesc': 'Complete your very first lesson.',
    'badges.quarterCourseDesc': 'Reach 25% progress in any course.',
    'badges.moduleMasterDesc': 'Finish every lesson in a module.',
    'badges.lessonStreakDesc': 'Complete three lessons in a row.',
    'badges.unlocked': 'Unlocked',
    'badges.locked': 'Locked'
  },
  es: {
    'app.title': 'Tango Rápido',
    'app.tagline': 'Aprende tango más rápido con guía amable.',
    'nav.roadmap': 'Ruta',
    'nav.courses': 'Cursos',
    'nav.profile': 'Perfil',
    'nav.admin': 'Administración',
    'nav.logout': 'Cerrar sesión',
    'nav.login': 'Iniciar sesión',
    'nav.signup': 'Crear cuenta',
    'nav.language': 'Idioma',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar contraseña',
    'auth.login': 'Iniciar sesión',
    'auth.signup': 'Crear cuenta',
    'auth.logout': 'Cerrar sesión',
    'auth.haveAccount': '¿Ya tienes cuenta?',
    'auth.noAccount': '¿No tienes cuenta?',
    'auth.success': '¡Listo! Redirigiendo…',
    'auth.error': 'Algo salió mal. Inténtalo de nuevo.',
    'auth.remember': 'Recuérdame',
    'auth.forgot': '¿Olvidaste tu contraseña?',
    'roadmap.title': 'Tu ruta de aprendizaje',
    'roadmap.subtitle': 'Sigue los pasos para llegar a la pista con confianza.',
    'roadmap.empty': 'Agrega cursos desde la administración para verlos aquí. Las personas alumnas seguirán su progreso y desbloquearán insignias al completar lecciones.',
    'roadmap.legend.course': 'Meta del curso',
    'roadmap.legend.module': 'Punto del módulo',
    'roadmap.legend.lesson': 'Paso de lección',
    'roadmap.legend.badge': 'Momento de insignia',
    'roadmap.timelineTitle': 'Tu camino tanguero',
    'roadmap.timelineDescription': 'Cada círculo marca un hito del curso. Sigue el camino, elige un curso y sigue avanzando.',
    'roadmap.viewCourse': 'Ver detalles del curso',
    'roadmap.startCourse': 'Comenzar curso',
    'roadmap.continueCourse': 'Continuar curso',
    'roadmap.completedCourse': 'Curso completado 🎉',
    'course.overview': 'Resumen del curso',
    'course.modules': 'Módulos',
    'course.progress': 'Progreso',
    'course.totalXp': 'XP total',
    'course.badges': 'Insignias',
    'course.exercises': 'Ejercicios de acceso rápido',
    'course.noExercises': 'Aún no hay ejercicios; sigue explorando las lecciones.',
    'module.progress': 'Progreso del módulo',
    'lesson.type.lesson': 'Lección',
    'lesson.type.exercise': 'Ejercicio',
    'lesson.markComplete': 'Marcar como completada',
    'lesson.completed': 'Completada',
    'lesson.notStarted': 'Sin empezar',
    'lesson.noVideo': 'El video estará disponible pronto. ¡Vuelve más tarde!',
    'profile.title': 'Tu camino de baile',
    'profile.totalXp': 'XP total ganado',
    'profile.badges': 'Insignias logradas',
    'profile.completedLessons': 'Lecciones completadas',
    'profile.keepGoing': '¡Sigue así! Tu próxima insignia está cerca.',
    'admin.title': 'Estudio de administración',
    'admin.courses': 'Cursos',
    'admin.modules': 'Módulos',
    'admin.lessons': 'Lecciones',
    'admin.createCourse': 'Agregar curso',
    'admin.createModule': 'Agregar módulo',
    'admin.createLesson': 'Agregar lección',
    'admin.edit': 'Editar',
    'admin.delete': 'Eliminar',
    'admin.save': 'Guardar cambios',
    'admin.cancel': 'Cancelar',
    'admin.videoUrl': 'URL del video',
    'admin.storagePath': 'Ruta en almacenamiento',
    'generic.loading': 'Cargando',
    'generic.error': 'Algo salió mal.',
    'generic.empty': 'Nada que mostrar todavía.',
    'generic.notFound': 'No pudimos encontrar esa página.',
    'generic.progress': 'Progreso',
    'generic.xp': 'XP',
    'generic.badges': 'Insignias',
    'generic.language': 'Idioma',
    'generic.close': 'Cerrar',
    'generic.continue': 'Continuar',
    'generic.back': 'Volver',
    'a11y.skipNav': 'Saltar al contenido principal',
    'badges.firstSteps': 'Primeros pasos',
    'badges.quarterCourse': 'Meta del 25 %',
    'badges.moduleMaster': 'Maestro del módulo',
    'badges.lessonStreak': 'Racha de lecciones',
    'badges.firstStepsDesc': 'Completa tu primera lección.',
    'badges.quarterCourseDesc': 'Alcanza 25 % de progreso en cualquier curso.',
    'badges.moduleMasterDesc': 'Termina todas las lecciones de un módulo.',
    'badges.lessonStreakDesc': 'Completa tres lecciones seguidas.',
    'badges.unlocked': 'Desbloqueada',
    'badges.locked': 'Bloqueada'
  }
};
