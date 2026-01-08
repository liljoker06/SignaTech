import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

const GET_VIDEOS = gql`
  query GetVideos {
    videos {
      id
      titre
      url
    }
  }
`;

const extractYouTubeId = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

export const useCoursesData = () => {
  const { loading, error, data } = useQuery(GET_VIDEOS);

  const courses = useMemo(() => {
    if (data?.videos && data.videos.length > 0) {
      return data.videos
        .map((video, index) => {
          const youtubeId = extractYouTubeId(video.url);
          
          if (!youtubeId) {
            console.warn(`⚠️ ID YouTube invalide pour: ${video.titre}`);
            return null;
          }

          return {
            id: video.id,
            title: video.titre,
            description: 'Cours de langue des signes française',
            duration: '5:00',
            level: index % 3 === 0 ? 'beginner' : index % 3 === 1 ? 'intermediate' : 'advanced',
            youtubeVideoId: youtubeId,
            category: 'lsf',
          };
        })
        .filter(course => course !== null);
    }

    return [];
  }, [data, error]);

  return { courses, loading, error };
};
