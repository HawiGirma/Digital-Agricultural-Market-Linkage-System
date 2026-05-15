import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { TRANSLATIONS, LANGUAGE_OPTIONS } from "../i18n/translations";

const STORAGE_KEY = "agrilink_locale";

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v && TRANSLATIONS[v]) return v;
    } catch {
      /* ignore */
    }
    return "en";
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      /* ignore */
    }
  }, [language]);

  const t = useMemo(() => {
    const table = TRANSLATIONS[language] || TRANSLATIONS.en;
    const fallback = TRANSLATIONS.en;
    return (key) => table[key] ?? fallback[key] ?? key;
  }, [language]);

  return (
    <LocaleContext.Provider value={{ language, setLanguage, t, LANGUAGE_OPTIONS }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
