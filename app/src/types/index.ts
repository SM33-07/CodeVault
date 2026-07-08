export type User = {
  id: string;
  email: string;
  displayName?: string;
  bio?: string;
};

export type Snippet = {
  id: string;
  title: string;
  code: string;
  language: string;
  description?: string;
  visibility: "public" | "private";
  ownerId: string;
};
