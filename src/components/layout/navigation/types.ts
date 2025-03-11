
import { ReactNode } from 'react';

export interface NavLink {
  title: string;
  href: string;
  icon: ReactNode;
  section?: string;
}
