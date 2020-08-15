export type Locale = 'en_US' | 'fr_FR';

export type AppState = Readonly<{
  locale: Locale;
}>;

export type Action = {
  type: string;
  payload: any;
};
