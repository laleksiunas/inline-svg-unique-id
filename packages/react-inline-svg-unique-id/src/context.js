import { useContext, createContext } from 'react';

const defaultUniqueIdGenerator = (() => {
  let nextValue = 0;

  return () => `i${nextValue++}`;
})();

const context = createContext(defaultUniqueIdGenerator);

export const useUniqueIdGenerator = () => useContext(context);

export const UniqueIdGeneratorContextProvider = context.Provider;
