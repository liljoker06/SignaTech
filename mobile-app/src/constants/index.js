export * from './theme';

export const API_CONFIG = {
  GRAPHQL_PORT: 4000,
  TIMEOUT: 10000,
};

export const COURSE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

export const COURSE_LEVEL_LABELS = {
  [COURSE_LEVELS.BEGINNER]: 'Débutant',
  [COURSE_LEVELS.INTERMEDIATE]: 'Intermédiaire',
  [COURSE_LEVELS.ADVANCED]: 'Avancé',
};

export const COURSE_LEVEL_COLORS = {
  [COURSE_LEVELS.BEGINNER]: '#4CAF50',
  [COURSE_LEVELS.INTERMEDIATE]: '#FF9800',
  [COURSE_LEVELS.ADVANCED]: '#F44336',
};
