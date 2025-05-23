import { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext'; // Import useAuth

// Erstellen des Kontexts
const CalendarContext = createContext();

// Provider-Komponente für den Calendar-Kontext
export function CalendarProvider({ children }) {
  const { currentUser } = useAuth(); // Get currentUser to detect login/logout

  // Define initial states for clarity and reset
  const initialAnsichtModus = 'liste';
  const initialAusgewaehltePersonId = null; // This is a primitive, stable by nature

  // Memoize getInitialCurrentDate with useCallback
  const getInitialCurrentDate = useCallback(() => new Date(), []); // No dependencies, created once

  const initialCurrentMonth = getInitialCurrentDate().getMonth();
  const initialCurrentYear = getInitialCurrentDate().getFullYear();

  // Memoize object/array initial values with useMemo
  const initialTagDaten = useMemo(() => ({}), []);
  const initialGlobalTagDaten = useMemo(() => ({}), []);
  const initialEmploymentData = useMemo(() => ({}), []);
  const initialYearConfigurations = useMemo(() => [], []);

  const initialLoginError = '';

  // Ansicht und Navigation 
  const [ansichtModus, setAnsichtModus] = useState(initialAnsichtModus); // 'liste', 'kalender', 'jahresuebersicht' oder 'jahresdetail'
  const [ausgewaehltePersonId, setAusgewaehltePersonId] = useState(initialAusgewaehltePersonId);
  
  // Aktuelles Datum und Navigation
  const [currentMonth, setCurrentMonth] = useState(initialCurrentMonth);
  const [currentYear, setCurrentYear] = useState(initialCurrentYear);
  
  // Daten
  // const [isLoadingData, setIsLoadingData] = useState(false); // Wird von useFirestore gehandhabt
  const [loginError, setLoginError] = useState(''); // Error messages, potentially from Firestore
  const [personen, setPersonen] = useState([]); // Wird dynamisch aus Firestore geladen
  
  // Resturlaub vom Vorjahr
  const [resturlaub, setResturlaub] = useState({});

  // Urlaubs-, Durchführungsdaten etc. (personenspezifisch)
  const [tagDaten, setTagDaten] = useState(initialTagDaten);

  // Globale Tageseinstellungen (z.B. Feiertage, Teamtage für alle)
  const [globalTagDaten, setGlobalTagDaten] = useState(initialGlobalTagDaten);

  // Beschäftigungsdaten
  const [employmentData, setEmploymentData] = useState(initialEmploymentData);

  // Jahreskonfigurationen
  const [yearConfigurations, setYearConfigurations] = useState(initialYearConfigurations);

  // Effekt zum Zurücksetzen des Kontext-Status bei Logout
  useEffect(() => {
    if (!currentUser) {
      // Benutzer ist ausgeloggt oder die Sitzung ist abgelaufen
      setAnsichtModus(initialAnsichtModus);
      setAusgewaehltePersonId(initialAusgewaehltePersonId);
      const newCurrentDate = getInitialCurrentDate();
      setCurrentMonth(newCurrentDate.getMonth());
      setCurrentYear(newCurrentDate.getFullYear());
      setLoginError(initialLoginError); // Kalenderspezifische Fehler zurücksetzen

      // Explicitly reset all data collections to their initial states
      // to prevent data leakage between user sessions.
      setPersonen([]);
      setTagDaten(initialTagDaten);
      setGlobalTagDaten(initialGlobalTagDaten);
      setResturlaub({});
      setEmploymentData(initialEmploymentData);
      setYearConfigurations(initialYearConfigurations);
    }
  }, [
    currentUser,
    initialAnsichtModus,
    initialAusgewaehltePersonId,
    getInitialCurrentDate, // This is a function, ensure it's stable or memoized if complex
    initialLoginError,
    initialTagDaten,
    initialGlobalTagDaten,
    initialEmploymentData,
    initialYearConfigurations
  ]); // Dependencies updated to satisfy exhaustive-deps

  // Monat wechseln
  const handleMonatWechsel = (richtung) => {
    let neuerMonat = currentMonth;
    let neuesJahr = currentYear;
    const configuredYears = yearConfigurations.map(yc => yc.year).sort((a, b) => a - b);
    
    if (richtung === 'vor') {
      if (currentMonth === 11) {
        const naechstesJahr = currentYear + 1;
        if (configuredYears.length === 0 || configuredYears.includes(naechstesJahr)) {
          neuerMonat = 0;
          neuesJahr = naechstesJahr;
        } else {
          // Optional: Feedback to user or simply do nothing
          console.warn(`Year ${naechstesJahr} is not configured. Staying in ${currentYear}.`);
          return; // Prevent change
        }
      } else {
        neuerMonat = currentMonth + 1;
      }
    } else if (richtung === 'zurueck') {
      if (currentMonth === 0) {
        const vorherigesJahr = currentYear - 1;
        if (configuredYears.length === 0 || configuredYears.includes(vorherigesJahr)) {
          neuerMonat = 11;
          neuesJahr = vorherigesJahr;
        } else {
          // Optional: Feedback to user or simply do nothing
          console.warn(`Year ${vorherigesJahr} is not configured. Staying in ${currentYear}.`);
          return; // Prevent change
        }
      } else {
        neuerMonat = currentMonth - 1;
      }
    } else if (richtung === 'aktuell') {
      const aktuellesDatum = new Date();
      // Ensure the actual current year is configured, or default to a configured one if not.
      // For simplicity, 'aktuell' will just set month/year. If that year isn't configured, other views might show "no data".
      // A more robust approach might be to jump to the closest configured year to new Date().getFullYear().
      // For now, this is fine as SettingsPage allows adding the current year.
      neuerMonat = aktuellesDatum.getMonth();
      neuesJahr = aktuellesDatum.getFullYear(); // This might be an unconfigured year.
    }
    
    setCurrentMonth(neuerMonat);
    setCurrentYear(neuesJahr);
  };

  // Context value to be provided
  const value = {
    ansichtModus,
    setAnsichtModus,
    ausgewaehltePersonId,
    setAusgewaehltePersonId,
    // State setters for month/year are provided here
    currentMonth,
    currentYear,
    setCurrentMonth,
    setCurrentYear,
    handleMonatWechsel,
    personen,
    setPersonen, // Setter für Personen bereitstellen
    // isLoadingData, // Wird von useFirestore gehandhabt
    loginError,
    setLoginError,
    tagDaten,
    setTagDaten,
    globalTagDaten,
    setGlobalTagDaten,
    resturlaub,
    setResturlaub,
    employmentData, // Beschäftigungsdaten bereitstellen
    setEmploymentData, // Setter für Beschäftigungsdaten
    yearConfigurations,
    setYearConfigurations,
    // Helper functions that depend on state will be in the useCalendar hook
  };

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

// Custom Hook für den Zugriff auf den Calendar-Kontext
export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}

export default CalendarContext;