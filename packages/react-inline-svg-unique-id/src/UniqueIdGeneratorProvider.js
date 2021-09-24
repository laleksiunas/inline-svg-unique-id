import { useCallback, useRef } from 'react';
import { UniqueIdGeneratorContextProvider } from './context';

const parseProps = (props) => {
  if (!['undefined', 'string'].includes(typeof props.idPrefix)) {
    throw new Error(
      `Invalid value passed for prop "idPrefix", expected undefined or string, got ${typeof props.idPrefix}`,
    );
  }

  return props;
};

const UniqueIdGeneratorProvider = (props) => {
  const { children, idPrefix = 'i' } = parseProps(props);

  const nextIdRef = useRef(0);

  const uniqueIdGenerator = useCallback(() => `${idPrefix}${nextIdRef.current++}`, []);

  return <UniqueIdGeneratorContextProvider value={uniqueIdGenerator}>{children}</UniqueIdGeneratorContextProvider>;
};

export default UniqueIdGeneratorProvider;
