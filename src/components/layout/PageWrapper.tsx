import { type ReactNode } from 'react';
import styles from './PageWrapper.module.css';

interface PageWrapperProps {
  children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
