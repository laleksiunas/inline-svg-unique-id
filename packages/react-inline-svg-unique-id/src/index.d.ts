declare module '@inline-svg-unique-id/react' {
  import type { FC, PropsWithChildren } from 'react';

  export interface ProviderProps {
    idPrefix?: string;
  }

  export function useUniqueInlineId(): string;

  export const Provider: FC<PropsWithChildren<ProviderProps>>;
}
