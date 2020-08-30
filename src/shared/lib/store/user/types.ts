export type UserState = {
  didInvalidate: boolean;
  isLoading: boolean;
  items: any[];
  updatedAt: number | null;
};

export type Action = {
  type: string;
  payload?: { items?: any[]; updatedAt: number };
  meta?: any;
  error?: boolean;
};
