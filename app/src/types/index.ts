export type User = {
  id: string;
  email: string;
  displayName?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
};

export type Snippet = {
  id: string;
  title: string;
  codeBody: string;
  language: string;
  description?: string;
  visibility: "public" | "private";
  ownerId: string;
  forkedFromId?: string | null;
  viewCount?: number;
  forkCount?: number;
  createdAt?: string;
  updatedAt?: string;
  snippetTags?: Array<{ id: string; tagId: string; tag: { id: string; name: string } }>;
  owner?: { id: string; email: string; displayName?: string };
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type CreateSnippetInput = {
  title?: string;
  codeBody?: string;
  language?: string;
  description?: string;
  visibility?: "public" | "private";
  ownerId?: string;
  forkedFromId?: string | null;
  tagIds?: string[];
};

export type UpdateSnippetInput = {
  title?: string;
  codeBody?: string;
  language?: string;
  description?: string;
  visibility?: "public" | "private";
  ownerId?: string;
  forkedFromId?: string | null;
  tagIds?: string[];
};

export type ExplainResponse = {
  explanation: string;
}
