export interface Concept {
  id: string;
  title: string;
  chapterTitle: string;
  class: number;
  subject: string;
  overview: string;
  keyPoints: string[];
  definition: string;
  relatedConcepts: string[];
  icon: string; // Lucide icon name
  order: number;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  class: number;
  subject: string;
  concepts: Concept[];
}

const mockChapters: Record<string, Chapter> = {
  "10-Science-Heredity": {
    id: "10-Science-Heredity",
    title: "Heredity",
    description: "Learn about how traits are passed from parents to offspring.",
    class: 10,
    subject: "Science",
    concepts: [
      {
        id: "dna-genes-1",
        title: "DNA & Genes",
        chapterTitle: "Heredity",
        class: 10,
        subject: "Science",
        overview: "DNA is the blueprint of life, containing all the information needed for an organism to grow, survive, and reproduce.",
        keyPoints: [
          "DNA is a molecule that carries genetic information",
          "Genes are segments of DNA that code for proteins",
          "Chromosomes are structures that contain genes"
        ],
        definition: "DNA (deoxyribonucleic acid) is a polymer of nucleotides that forms the genetic material of most organisms. It consists of two long chains of nucleotides twisted into a double helix.",
        relatedConcepts: ["Chromosomes", "Proteins", "Mutations"],
        icon: "Dna",
        order: 1
      },
      {
        id: "mendel-laws-2",
        title: "Mendel's Laws",
        chapterTitle: "Heredity",
        class: 10,
        subject: "Science",
        overview: "Gregor Mendel, through his work on pea plants, discovered the fundamental laws of inheritance.",
        keyPoints: [
          "Law of Dominance: One trait can mask another",
          "Law of Segregation: Alleles separate during gamete formation",
          "Law of Independent Assortment: Genes for different traits sort independently"
        ],
        definition: "Mendel's laws of inheritance are rules of inheritance that explain how traits are transmitted from parents to offspring.",
        relatedConcepts: ["Genetics", "Alleles", "Phenotype"],
        icon: "Beaker",
        order: 2
      }
    ]
  }
};

export const getChapter = (classNum: number, subject: string, chapterTitle: string): Chapter | undefined => {
  const key = `${classNum}-${subject}-${chapterTitle}`;
  return mockChapters[key];
};

export const getConceptsByChapter = (classNum: number, subject: string, chapterTitle: string): Concept[] => {
  const chapter = getChapter(classNum, subject, chapterTitle);
  return chapter ? chapter.concepts : [];
};

export const getConcept = (classNum: number, subject: string, chapterTitle: string, conceptId: string): Concept | undefined => {
  const concepts = getConceptsByChapter(classNum, subject, chapterTitle);
  return concepts.find(c => c.id === conceptId);
};
