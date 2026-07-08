export type Snippet = {
  id?: string;
  title: string;
  codeBody: string;
  language: string;
  description?: string | null;
  visibility: string;
  ownerId?: string | null;
  forkedFromId?: string | null;
  viewCount?: number;
  forkCount?: number;
  createdAt?: string;
  updatedAt?: string;
};
