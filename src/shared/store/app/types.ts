export type Locale = 'en' | 'fr' | null;

export type AppState = Readonly<{
  locale: Locale;
}>;

export type Action = {
  type: string;
  payload: any;
};
