export type UserRole = "contributor" | "maintainer";
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Issue {
  id: number;
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status: "open" | "closed";
  reporter_id: number;
  created_at: string;
  updated_at: string;
}
export type IssueCreateDTO = Omit<
  Issue,
  "id" | "status" | "created_at" | "reporter_id" | "updated_at"
>;
