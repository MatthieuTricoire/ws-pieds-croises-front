import { LucideIconData } from 'lucide-angular';

export interface ButtonNav {
  label: string;
  path?: string;
  icon: LucideIconData;
  menuList?: ButtonNav[];
  action?: () => void;
}
