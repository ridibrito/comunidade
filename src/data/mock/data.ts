export type Lesson = { id: string; title: string; videoUrl: string; description?: string; materialsUrl?: string };
export type Module = { id: string; title: string; lessons: Lesson[] };
export type Trail = { id: string; title: string; modules: Module[] };

export const mockUser = {
  name: "Usuário Singulari",
  email: "usuario@singulari.com",
  avatarInitials: "US",
};

export const mockTrails: Trail[] = [
  {
    id: "t1",
    title: "Trilha de Introdução",
    modules: [
      {
        id: "m1",
        title: "Módulo 1",
        lessons: [
          { id: "l1", title: "Bem-vindo", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { id: "l2", title: "Primeiros passos", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
        ],
      },
      {
        id: "m2",
        title: "Módulo 2",
        lessons: [
          { id: "l3", title: "Fundamentos", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
        ],
      },
    ],
  },
  {
    id: "t2",
    title: "Trilha Avançada",
    modules: [
      { id: "m3", title: "Módulo A", lessons: [{ id: "l4", title: "Aula A1", videoUrl: "https://youtu.be/dQw4w9WgXcQ" }] },
    ],
  },
];

export const mockMaterials = [
  { id: "mat1", title: "Livro: Educação e AHSD", url: "https://example.com/livro.pdf" },
  { id: "mat2", title: "Planilha de acompanhamento", url: "https://example.com/planilha.xlsx" },
];

export const mockRodas = [
  { id: "r1", title: "Roda 01 - Integração", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
  { id: "r2", title: "Roda 02 - Experiências", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
];

export const mockPlantoes = [
  { id: "p1", title: "Plantão 01 - Perguntas frequentes", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
  { id: "p2", title: "Plantão 02 - Estudos de caso", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
];

export const mockEvents = [
  { id: "e1", title: "Live de Boas-vindas", date: "2025-11-01 19:00" },
  { id: "e2", title: "Workshop AHSD", date: "2025-11-10 20:00" },
];

export const mockProgress = {
  totalLessons: 24,
  completed: 9,
};


