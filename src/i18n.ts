import { createI18n } from 'vue-i18n';

function getBrowserLocale(fallback = 'en'): string {
  const locale = navigator.language || navigator.languages[0];
  return locale.split('-')[0] || fallback; // "de-DE" → "de"
}

function loadLocaleMessages() {
  const locales = import.meta.glob('./locales/*.json', { eager: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages: Record<string, any> = {};

  for (const path in locales) {
    const matched = path.match(/\/([a-z0-9-_]+)\.json$/i);
    if (matched && matched[1]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages[matched[1]] = (locales[path] as any).default;
    }
  }

  return messages;
}

export const i18n = createI18n({
  locale: getBrowserLocale(),
  fallbackLocale: 'de',
  messages: loadLocaleMessages(),
});
