import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'gold';
  to?: string;
  children: ReactNode;
}

export function Button({ variant = 'primary', to, children, className, ...props }: ButtonProps) {
  const cls = `${styles.button} ${styles[variant]} ${className || ''}`;

  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
