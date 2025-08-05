export interface SideNavItem {
  id: string; 
  label: string;
  icon?: string; 
  link?: string | any[];
  children?: SideNavItem[];
  expanded?: boolean;
}
