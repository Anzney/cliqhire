declare module 'react-select-country-list' {
  export interface Country {
    label: string;
    value: string;
  }
  export default function countryList(): { getData: () => Country[] };
}