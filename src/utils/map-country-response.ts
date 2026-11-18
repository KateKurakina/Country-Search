import type { Country } from '../types/country.js';

interface RawCountry {
  name: string;
  flags: {
    png: string;
  };
  capital: string;
  region: string;
  population: number;
  languages: {
    name: string;
  }[];
}

export const mapCountryResponse = (raw: unknown): Country => {
  const country = raw as RawCountry;
  return {
    name: country.name,
    flagUrl: country.flags.png,
    capital: country.capital,
    region: country.region,
    population: country.population,
    languages: country.languages.map((language) => language.name),
  };
};
