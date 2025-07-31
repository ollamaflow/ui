export enum ThemeEnum {
  LIGHT = "light",
  DARK = "dark",
}

export interface Configuration {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  config: any; // The actual configuration data
}
