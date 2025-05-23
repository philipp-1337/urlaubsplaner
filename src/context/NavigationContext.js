import React, { createContext, useContext, useState, useCallback } from 'react';

const NavigationContext = createContext({
  isNavigating: false,
  startNavigation: () => {},
  stopNavigation: () => {},
});

export const NavigationProvider = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);

  const startNavigation = useCallback(() => setIsNavigating(true), []);
  const stopNavigation = useCallback(() => setIsNavigating(false), []);

  return (
    <NavigationContext.Provider value={{ isNavigating, startNavigation, stopNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
