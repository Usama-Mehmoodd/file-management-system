import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => { } });

function getInitialTheme() {
  
  // here i locally store the previous theme value stored by user last time,

  const saved = localStorage.getItem('fm-theme');

  //check store value last login 
  if (saved === 'light' || saved === 'dark') return saved;


}



export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {

    // set the root website theme attribute which located in index.html DOM elment 
    // then css will apply on theme value of attribute  
    document.documentElement.setAttribute('data-theme', theme);
    
    // store the theme value in local sstorage for next login by user
    localStorage.setItem('fm-theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
