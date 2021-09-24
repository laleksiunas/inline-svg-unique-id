import { useState } from 'react';
import { useUniqueIdGenerator } from './context';

const useUniqueInlineId = () => {
  const uniqueIdGenerator = useUniqueIdGenerator();
  const [id] = useState(uniqueIdGenerator);

  return id;
};

export default useUniqueInlineId;
