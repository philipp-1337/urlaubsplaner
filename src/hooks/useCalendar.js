import { useContext, useMemo, useCallback } from 'react'; // Import useMemo and useCallback
import CalendarContext from '../context/CalendarContext';
import { useFirestore } from './useFirestore';
import { getMonatsName as getMonatsNameUtil, getWochentagName as getWochentagNameUtil, getTageImMonat as getDaysInMonthUtil } from '../services/dateUtils';

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  const {
    personen,
    currentMonth,
    currentYear,
    setCurrentMonth,
    setCurrentYear,
    ansichtModus,
    setAnsichtModus,
    handleMonatWechsel, // Destructure from context
    ausgewaehltePersonId,
    setAusgewaehltePersonId,
    tagDaten,
    globalTagDaten: contextGlobalTagDaten, // Get global tag data from context, alias to avoid conflict
    yearConfigurations, // Get from context
    employmentData, // Get employmentData from context
    resturlaub,
    loginError
  } = context; // Add tagDaten here
  
  const { isLoadingData, setTagStatus } = useFirestore();
  
  // Use utils for date names and days in month, but keep them as part of the hook's API
  const getMonatsName = (monat) => {
    return getMonatsNameUtil(monat);
  };
  
  const getWochentagName = useCallback((wochentag) => {
    return getWochentagNameUtil(wochentag);
  }, []); // Diese Funktion hat keine Abhängigkeiten zum Hook-Scope
  
  const getTageImMonat = useCallback((monat = currentMonth, jahr = currentYear) => {
    // Ensure default values are handled if the util doesn't assume them
    // The getDaysInMonthUtil from dateUtils.js takes (monat, jahr)
    return getDaysInMonthUtil(monat, jahr);
  }, [currentMonth, currentYear]);

  // Memoize globalTagDaten to ensure its reference is stable
  const globalTagDaten = useMemo(() => {
    return contextGlobalTagDaten || {};
  }, [contextGlobalTagDaten]);
  
  // Prüft den Status eines bestimmten Tages für eine Person
  const getTagStatus = useCallback((personId, tag, monat = currentMonth, jahr = currentYear) => {
    // 1. Prüfe personenspezifischen Eintrag
    const personSpecificKey = `${personId}-${jahr}-${monat}-${tag}`;
    if (tagDaten[personSpecificKey] !== undefined) { // Auch 'null' als expliziter Status ist gültig
      return tagDaten[personSpecificKey];
    }
    // 2. Wenn kein personenspezifischer Eintrag, prüfe globalen Eintrag für diesen Tag
    const globalKey = `${jahr}-${monat}-${tag}`;
    if (globalTagDaten[globalKey] !== undefined) {
      return globalTagDaten[globalKey];
    }
    return null; // Kein spezifischer oder globaler Status gefunden
  }, [tagDaten, globalTagDaten, currentMonth, currentYear]);
  
  // --- Memoized Calculations ---

  // Memoize monthly totals per person for the current month/year
  const monthlyPersonTotals = useMemo(() => {
    const totals = {};
    const tage = getTageImMonat(currentMonth, currentYear);
    personen.forEach(person => {
      let urlaubCount = 0;
      let durchfuehrungCount = 0;
      let fortbildungCount = 0;
      let interneTeamtageCount = 0;
      let feiertagCount = 0;

      tage.forEach(tag => {
        const status = getTagStatus(person.id, tag.tag, currentMonth, currentYear);
        if (status === 'urlaub') urlaubCount++;
        if (status === 'durchfuehrung') durchfuehrungCount++;
        if (status === 'fortbildung') fortbildungCount++;
        if (status === 'interne teamtage') interneTeamtageCount++;
        if (status === 'feiertag') feiertagCount++;
      });

      totals[person.id] = {
        urlaub: urlaubCount,
        durchfuehrung: durchfuehrungCount,
        fortbildung: fortbildungCount,
        interneTeamtage: interneTeamtageCount,
        feiertage: feiertagCount,
      };
    });
    return totals;
  }, [personen, currentMonth, currentYear, getTageImMonat, getTagStatus]); // Dependencies updated

  // Getter functions that use the memoized monthlyPersonTotals for the current month/year
  const getPersonGesamtUrlaub = useCallback((personIdInput, monat = currentMonth, jahr = currentYear) => {
     // If the request is for the current month/year, use the memoized value
     if (monat === currentMonth && jahr === currentYear && monthlyPersonTotals[personIdInput]) {
        return monthlyPersonTotals[personIdInput].urlaub;
     }
     // Otherwise, calculate it (e.g., for MonthlyDetail which iterates over months)
     let count = 0;
     const tage = getTageImMonat(monat, jahr);
     tage.forEach(tag => {
       if (getTagStatus(personIdInput, tag.tag, monat, jahr) === 'urlaub') {
         count++;
       }
     });
     return count;
  }, [currentMonth, currentYear, monthlyPersonTotals, getTageImMonat, getTagStatus]);

  const getPersonGesamtDurchfuehrung = useCallback((personIdInput, monat = currentMonth, jahr = currentYear) => {
    if (monat === currentMonth && jahr === currentYear && monthlyPersonTotals[personIdInput]) {
       return monthlyPersonTotals[personIdInput].durchfuehrung;
    }
    let count = 0;
    const tage = getTageImMonat(monat, jahr);
    tage.forEach(tag => {
      if (getTagStatus(personIdInput, tag.tag, monat, jahr) === 'durchfuehrung') {
        count++;
      }
    });
    return count;
  }, [currentMonth, currentYear, monthlyPersonTotals, getTageImMonat, getTagStatus]);

  const getPersonGesamtFortbildung = useCallback((personIdInput, monat = currentMonth, jahr = currentYear) => {
    if (monat === currentMonth && jahr === currentYear && monthlyPersonTotals[personIdInput]) {
       return monthlyPersonTotals[personIdInput].fortbildung;
    }
    let count = 0;
    const tage = getTageImMonat(monat, jahr);
    tage.forEach(tag => {
      if (getTagStatus(personIdInput, tag.tag, monat, jahr) === 'fortbildung') {
        count++;
      }
    });
    return count;
  }, [currentMonth, currentYear, monthlyPersonTotals, getTageImMonat, getTagStatus]);

  const getPersonGesamtInterneTeamtage = useCallback((personIdInput, monat = currentMonth, jahr = currentYear) => {
    if (monat === currentMonth && jahr === currentYear && monthlyPersonTotals[personIdInput]) {
       return monthlyPersonTotals[personIdInput].interneTeamtage;
    }
    let count = 0;
    const tage = getTageImMonat(monat, jahr);
    tage.forEach(tag => {
      if (getTagStatus(personIdInput, tag.tag, monat, jahr) === 'interne teamtage') {
        count++;
      }
    });
    return count;
  }, [currentMonth, currentYear, monthlyPersonTotals, getTageImMonat, getTagStatus]);

  const getPersonGesamtFeiertage = useCallback((personIdInput, monat = currentMonth, jahr = currentYear) => {
    if (monat === currentMonth && jahr === currentYear && monthlyPersonTotals[personIdInput]) {
       return monthlyPersonTotals[personIdInput].feiertage;
    }
    let count = 0;
    const tage = getTageImMonat(monat, jahr);
    tage.forEach(tag => {
      if (getTagStatus(personIdInput, tag.tag, monat, jahr) === 'feiertag') {
        count++;
      }
    });
    return count;
  }, [currentMonth, currentYear, monthlyPersonTotals, getTageImMonat, getTagStatus]);

  // Memoize overall monthly totals for the current month/year
  const overallMonthlyTotals = useMemo(() => {
    let totalUrlaub = 0;
    let totalDurchfuehrung = 0;
    let totalFortbildung = 0;
    let totalInterneTeamtage = 0;
    let totalFeiertage = 0;

    Object.values(monthlyPersonTotals).forEach(totals => {
      totalUrlaub += totals.urlaub;
      totalDurchfuehrung += totals.durchfuehrung;
      totalFortbildung += totals.fortbildung;
      totalInterneTeamtage += totals.interneTeamtage;
      totalFeiertage += totals.feiertage;
    });

    return {
      urlaub: totalUrlaub,
      durchfuehrung: totalDurchfuehrung,
      fortbildung: totalFortbildung,
      interneTeamtage: totalInterneTeamtage,
      feiertage: totalFeiertage,
    };
  }, [monthlyPersonTotals]); // Depends on the memoized person totals

  // Getter functions that use the memoized overallMonthlyTotals for the current month/year
  const getGesamtUrlaub = (monat = currentMonth, jahr = currentYear) => {
     // Only use memoized value for the current month/year
     if (monat === currentMonth && jahr === currentYear) {
        return overallMonthlyTotals.urlaub;
     }
     // Otherwise, calculate (less likely needed, but for completeness)
     let summe = 0;
     personen.forEach(person => {
       summe += getPersonGesamtUrlaub(person.id, monat, jahr); // This will use the potentially memoized monthly total if for current month/year
     });
     return summe;
  };

  const getGesamtDurchfuehrung = (monat = currentMonth, jahr = currentYear) => {
    if (monat === currentMonth && jahr === currentYear) {
      return overallMonthlyTotals.durchfuehrung;
    }
    let summe = 0;
    personen.forEach(person => {
      summe += getPersonGesamtDurchfuehrung(person.id, monat, jahr);
    });
    return summe;
  };

  const getGesamtFortbildung = (monat = currentMonth, jahr = currentYear) => {
    if (monat === currentMonth && jahr === currentYear) {
      return overallMonthlyTotals.fortbildung;
    }
    let summe = 0;
    personen.forEach(person => {
      summe += getPersonGesamtFortbildung(person.id, monat, jahr);
    });
    return summe;
  };

  const getGesamtInterneTeamtage = (monat = currentMonth, jahr = currentYear) => {
    if (monat === currentMonth && jahr === currentYear) {
      return overallMonthlyTotals.interneTeamtage;
    }
    let summe = 0;
    personen.forEach(person => {
      summe += getPersonGesamtInterneTeamtage(person.id, monat, jahr);
    });
    return summe;
  };

  const getGesamtFeiertage = (monat = currentMonth, jahr = currentYear) => {
    // Diese Funktion wird aktuell nicht direkt in der UI verwendet, aber für Vollständigkeit
    if (monat === currentMonth && jahr === currentYear) {
      return overallMonthlyTotals.feiertage;
    }
    let summe = 0;
    personen.forEach(person => {
      summe += getPersonGesamtFeiertage(person.id, monat, jahr);
    });
    return summe;
  };

  // Memoize daily totals for the current month/year
  const dailyTotals = useMemo(() => {
    const totals = {};
    const tage = getTageImMonat(currentMonth, currentYear);
    tage.forEach(tag => {
      let urlaubCount = 0;
      let durchfuehrungCount = 0;
      let fortbildungCount = 0;
      let interneTeamtageCount = 0;
      let feiertagCount = 0;
      personen.forEach(person => {
        const status = getTagStatus(person.id, tag.tag, currentMonth, currentYear);
        if (status === 'urlaub') urlaubCount++;
        if (status === 'durchfuehrung') durchfuehrungCount++;
        if (status === 'fortbildung') fortbildungCount++;
        if (status === 'interne teamtage') interneTeamtageCount++;
        if (status === 'feiertag') feiertagCount++;
      });
      totals[tag.tag] = { urlaubCount, durchfuehrungCount, fortbildungCount, interneTeamtageCount, feiertagCount };
    });
    return totals;
  }, [personen, currentMonth, currentYear, getTageImMonat, getTagStatus]); // Dependencies updated

  // Getter function that uses the memoized dailyTotals for the current month/year
  const getTagesGesamtStatus = (tagNumber, monat = currentMonth, jahr = currentYear) => {
     // Only use memoized value for the current month/year
     if (monat === currentMonth && jahr === currentYear && dailyTotals[tagNumber]) {
        return dailyTotals[tagNumber];
     }
     // Otherwise, calculate (less likely needed)
     let urlaubCount = 0;
     let durchfuehrungCount = 0;
     let fortbildungCount = 0;
     let interneTeamtageCount = 0;
     let feiertagCount = 0;
     personen.forEach(person => {
       const status = getTagStatus(person.id, tagNumber, monat, jahr);
       if (status === 'urlaub') urlaubCount++;
       if (status === 'durchfuehrung') durchfuehrungCount++;
       if (status === 'fortbildung') fortbildungCount++;
       if (status === 'interne teamtage') interneTeamtageCount++;
       if (status === 'feiertag') feiertagCount++;
     });
     return { urlaubCount, durchfuehrungCount, fortbildungCount, interneTeamtageCount, feiertagCount };
  };

  // Memoize yearly totals per person for the current global year
  const yearlyPersonTotals = useMemo(() => {
    const totals = {};
    // Guard clause: if currentYear is not set or no personen, return empty totals
    if (typeof currentYear === 'undefined' || !currentYear === null || personen.length === 0) return totals;

    personen.forEach(person => {
      let jahresUrlaub = 0;
      let jahresDurchfuehrung = 0;
      let jahresFortbildung = 0;
      let jahresInterneTeamtage = 0;
      let jahresFeiertage = 0;

      for (let monat = 0; monat < 12; monat++) {
        // getPersonGesamtUrlaub etc. will use their own monthly memoization if monat === currentMonth
        // but for yearly sum, we iterate through all months.
        jahresUrlaub += getPersonGesamtUrlaub(person.id, monat, currentYear);
        jahresDurchfuehrung += getPersonGesamtDurchfuehrung(person.id, monat, currentYear);
        jahresFortbildung += getPersonGesamtFortbildung(person.id, monat, currentYear);
        jahresInterneTeamtage += getPersonGesamtInterneTeamtage(person.id, monat, currentYear);
        jahresFeiertage += getPersonGesamtFeiertage(person.id, monat, currentYear);
      }
      totals[person.id] = {
        urlaub: jahresUrlaub,
        durchfuehrung: jahresDurchfuehrung,
        fortbildung: jahresFortbildung,
        interneTeamtage: jahresInterneTeamtage,
        feiertage: jahresFeiertage,
      };
    });
    return totals;
  }, [personen, currentYear, getPersonGesamtUrlaub, getPersonGesamtDurchfuehrung, getPersonGesamtFortbildung, getPersonGesamtInterneTeamtage, getPersonGesamtFeiertage]); // Dependencies updated

  const getPersonJahresUrlaub = (personIdInput, jahr = currentYear) => {
    if (jahr === currentYear && yearlyPersonTotals[personIdInput]) {
      return yearlyPersonTotals[personIdInput].urlaub;
    }
    let summe = 0;
    for (let monat = 0; monat < 12; monat++) {
      summe += getPersonGesamtUrlaub(personIdInput, monat, jahr);
    }
    return summe;
  };
  
  const getPersonJahresDurchfuehrung = (personIdInput, jahr = currentYear) => {
    if (jahr === currentYear && yearlyPersonTotals[personIdInput]) {
      return yearlyPersonTotals[personIdInput].durchfuehrung;
    }
    let summe = 0;
    for (let monat = 0; monat < 12; monat++) {
      summe += getPersonGesamtDurchfuehrung(personIdInput, monat, jahr);
    }
    return summe;
  };
  
  const getPersonJahresFortbildung = (personIdInput, jahr = currentYear) => {
    if (jahr === currentYear && yearlyPersonTotals[personIdInput]) {
      return yearlyPersonTotals[personIdInput].fortbildung;
    }
    let summe = 0;
    for (let monat = 0; monat < 12; monat++) {
      summe += getPersonGesamtFortbildung(personIdInput, monat, jahr);
    }
    return summe;
  };

  const getPersonJahresInterneTeamtage = (personIdInput, jahr = currentYear) => {
    if (jahr === currentYear && yearlyPersonTotals[personIdInput]) {
      return yearlyPersonTotals[personIdInput].interneTeamtage;
    }
    let summe = 0;
    for (let monat = 0; monat < 12; monat++) {
      summe += getPersonGesamtInterneTeamtage(personIdInput, monat, jahr);
    }
    return summe;
  };

  const getPersonJahresFeiertage = (personIdInput, jahr = currentYear) => {
    if (jahr === currentYear && yearlyPersonTotals[personIdInput]) {
      return yearlyPersonTotals[personIdInput].feiertage;
    }
    let summe = 0;
    for (let monat = 0; monat < 12; monat++) {
      summe += getPersonGesamtFeiertage(personIdInput, monat, jahr);
    }
    return summe;
  };

  // Memoize current year's Urlaubsanspruch per person
  // Get Urlaubsanspruch for the current (or specified) year from configurations, adjusted for part-time
  const getCurrentYearUrlaubsanspruch = (personId, jahr = currentYear) => {
    const config = yearConfigurations.find(yc => yc.year === jahr);
    // Define a default entitlement if no specific config is found for the year.
    const DEFAULT_URLAUBSANSPRUCH = 30; // Standard-Urlaubsanspruch

    const baseUrlaubsanspruch = config ? config.urlaubsanspruch : DEFAULT_URLAUBSANSPRUCH; // Verwende Default, wenn keine Konfig

    if (!personId) {
      return baseUrlaubsanspruch;
    }

    const personEmpRecord = employmentData[personId]; // employmentData from context is for the 'jahr'

    if (personEmpRecord &&
        personEmpRecord.type === 'part-time' &&
        typeof personEmpRecord.daysPerWeek === 'number' &&
        personEmpRecord.daysPerWeek >= 1 &&
        personEmpRecord.daysPerWeek <= 5) {
      
      const adjustedUrlaubsanspruch = (personEmpRecord.daysPerWeek / 5) * baseUrlaubsanspruch;
      return Math.round(adjustedUrlaubsanspruch); // Round to the nearest whole number
    } else {
      // Full-time, or part-time with missing/invalid daysPerWeek (should be caught by settings save)
      return baseUrlaubsanspruch;
    }
  };

  // Die Variable currentYearUrlaubsanspruch wurde entfernt, da sie nicht verwendet wurde.
  // Get a sorted list of configured year numbers
  const getConfiguredYears = () => {
    return yearConfigurations.map(yc => yc.year).sort((a, b) => a - b);
  };
  // TODO: Consider how to handle default Urlaubsanspruch if a year is not configured.
  // For now, getCurrentYearUrlaubsanspruch returns 0.

  // handleMonatWechsel is now taken from context

  // Logic to determine the next status when a day cell is clicked
  const getNextStatusLogic = (currentStatus, hasPersonSpecificEntry, personSpecificStatusValue) => {
    let neuerStatus = null;
    if (currentStatus === null) {
      neuerStatus = 'urlaub';
    } else if (currentStatus === 'urlaub') {
      neuerStatus = 'durchfuehrung';
    } else if (currentStatus === 'durchfuehrung') {
      neuerStatus = 'fortbildung';
    } else if (currentStatus === 'fortbildung') {
      neuerStatus = 'interne teamtage';
    } else if (currentStatus === 'interne teamtage') {
      if (hasPersonSpecificEntry && personSpecificStatusValue === 'interne teamtage') {
        neuerStatus = 'feiertag';
      } else {
        neuerStatus = 'urlaub';
      }
    } else if (currentStatus === 'feiertag') {
      if (hasPersonSpecificEntry && personSpecificStatusValue === 'feiertag') {
        neuerStatus = null; // Clear person-specific feiertag
      } else {
        neuerStatus = 'urlaub'; // Override global feiertag
      }
    }
    return neuerStatus;
  };

  // Centralized handler for day cell clicks
  const handleDayCellClick = (personId, tagObject, monat = currentMonth, jahr = currentYear) => {
    if (!tagObject.istWochenende) {
      const personIdStr = String(personId);
      const currentStatus = getTagStatus(personIdStr, tagObject.tag, monat, jahr);
      const personSpecificKey = `${personIdStr}-${jahr}-${monat}-${tagObject.tag}`;
      const hasPersonSpecificEntry = tagDaten.hasOwnProperty(personSpecificKey);
      const personSpecificStatusValue = tagDaten[personSpecificKey];
      const neuerStatus = getNextStatusLogic(currentStatus, hasPersonSpecificEntry, personSpecificStatusValue);
      setTagStatus(personIdStr, tagObject.tag, neuerStatus, monat, jahr);
    }
  };

  // getPersonResturlaub is a simple lookup, no complex calculation to memoize here.
  const getPersonResturlaub = (personIdInput) => {
    return resturlaub[String(personIdInput)] || 0;
  };

  return {
    personen,
    currentMonth,
    currentYear,
    setCurrentMonth,
    setCurrentYear,
    ansichtModus,
    setAnsichtModus,
    ausgewaehltePersonId,
    setAusgewaehltePersonId,
    isLoadingData,
    loginError,
    getMonatsName,
    getWochentagName,
    getTageImMonat,
    getTagStatus,
    setTagStatus,
    getPersonGesamtUrlaub,
    getPersonGesamtDurchfuehrung,
    getPersonGesamtFortbildung,
    getPersonGesamtInterneTeamtage,
    getPersonGesamtFeiertage,
    getGesamtUrlaub,
    getGesamtDurchfuehrung,
    getGesamtFortbildung,
    getGesamtInterneTeamtage,
    getGesamtFeiertage,
    getPersonJahresUrlaub,
    getPersonJahresDurchfuehrung,
    getPersonJahresFortbildung,
    getPersonJahresInterneTeamtage,
    getPersonJahresFeiertage,
    getPersonResturlaub,
    getTagesGesamtStatus,
    handleMonatWechsel,
    handleDayCellClick,
    // New functions based on yearConfigurations
    getCurrentYearUrlaubsanspruch,
    getConfiguredYears,
    employmentData, // Make sure to return employmentData
    tagDaten, 
  };
};