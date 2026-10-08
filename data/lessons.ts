
export type VocabularyItem = {
  korean: string;
  english: string;
  romanization?: string;
  audioUrl?: string;
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  vocabulary: VocabularyItem[];
};

export const lessons: Lesson[] = [];

