// Service pour récupérer des vidéos YouTube de cours LSF

const LSF_COURSES_VIDEOS = {
  alphabet: [
    { id: 'dQw4w9WgXcQ', title: 'Salutations de base', duration: '3:45' },
    // Ajoutez vos IDs de vidéos YouTube ici
  ],
  salutations: [
    { id: 'example123', title: 'vie-quotidienne', duration: '2:30' },
  ],
  quotidien: [
    { id: 'example456', title: 'Expressions courantes', duration: '5:00' },
  ],
  expressions: [
    { id: 'example789', title: 'La famille en LSF', duration: '4:20' },
  ],
  famille: [
    { id: 'example101', title: 'une journée', duration: '8:00' },
  ],
};

// Extraire l'ID de vidéo depuis une URL YouTube
export const extractYouTubeId = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

// Récupérer les vidéos par catégorie
export const getVideosByCategory = (category) => {
  return LSF_COURSES_VIDEOS[category] || [];
};

// Récupérer toutes les vidéos
export const getAllVideos = () => {
  return Object.values(LSF_COURSES_VIDEOS).flat();
};

// Données structurées des cours avec vidéos YouTube
export const coursesData = {
  1: {
    title: 'Salutations de base',
    description: 'Bonjour, merci, au revoir et plus encore',
    level: 'beginner',
    category: 'salutations',
    lessons: [
      {
        id: 1,
        title: 'Salutations essentielles',
        youtubeId: 'pQO0oCFLeiA',
        duration: '0:27',
        description: 'Bonjour, au revoir, merci',
      },
    ],
  },
  2: {
    title: 'Vie quotidienne',
    description: 'Vocabulaire pour les situations quotidiennes',
    level: 'beginner',
    category: 'quotidien',
    lessons: [
      {
        id: 1,
        title: 'Vocabulaire quotidien',
        youtubeId: '34LwgOJVaHE',
        duration: '0:40',
        description: 'Mots et expressions du quotidien',
      },
    ],
  },
  3: {
    title: 'Expressions émotionnelles',
    description: 'Vocabulaire pour exprimer des émotions et des besoins',
    level: 'intermediate',
    category: 'emotions',
    lessons: [
      {
        id: 1,
        title: 'Expressions courantes',
        youtubeId: 'vbooQ7EcKko',
        duration: '0:40',
        description: 'Je t\'aime, je suis fatigué, j\'ai faim',
      },
    ],
  },
  4: {
    title: 'La famille en LSF',
    description: 'Comment on appelle les membres de la famille en LSF',
    level: 'intermediate',
    category: 'famille',
    lessons: [
      {
        id: 1,
        title: 'Vocabulaire famille',
        youtubeId: 'SRjPJHD7ANA',
        duration: '0:58',
        description: 'Parents, frères, sœurs, enfants',
      },
    ],
  },
  5: {
    title: 'Une journée type',
    description: 'Dialogues pour décrire une journée',
    level: 'advanced',
    category: 'journée',
    lessons: [
      {
        id: 1,
        title: 'Décrire une journée',
        youtubeId: 'j6G_aayRCzo',
        duration: '0:31',
        description: 'Matin, midi, soir, activités',
      },
    ],
  },
};

export default { coursesData, getVideosByCategory, getAllVideos, extractYouTubeId };
