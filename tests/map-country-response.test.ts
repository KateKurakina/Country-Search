import { describe, expect, it } from 'vitest';
import { mapCountryResponse } from '../src/utils/map-country-response';

describe('mapCountryResponse', () => {
  it('should map country data to the required format', () => {
    const rawCountry = {
      name: 'Germany',
      flag: '🇩🇪',
      capital: 'Berlin',
      region: 'Europe',
      population: 83240525,
      languages: [
        {
          iso639_1: 'de',
          name: 'German',
          nativeName: 'Deutsch',
        },
      ],
    };

    const result = mapCountryResponse(rawCountry);

    expect(result).toEqual({
      name: 'Germany',
      flag: '🇩🇪',
      capital: 'Berlin',
      region: 'Europe',
      population: 83240525,
      languages: ['German'],
    });
  });

  it('should map all language names when a country has multiple languages', () => {
    const rawCountry = {
      name: 'Switzerland',
      flag: '🇨🇭',
      capital: 'Bern',
      region: 'Europe',
      population: 8796669,
      languages: [{ name: 'German' }, { name: 'French' }, { name: 'Italian' }],
    };

    const result = mapCountryResponse(rawCountry);

    expect(result).toEqual({
      name: 'Switzerland',
      flag: '🇨🇭',
      capital: 'Bern',
      region: 'Europe',
      population: 8796669,
      languages: ['German', 'French', 'Italian'],
    });
  });
});
