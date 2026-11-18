import { searchCountries } from './services/countries-api.js';
import { mapCountryResponse } from './utils/map-country-response.js';
import { SearchController } from './services/search-controller.js';
import type { Country } from './types/country.js';

const app = document.createElement('main');
app.className = 'app';

const title = document.createElement('h1');
title.className = 'app__title';
title.textContent = 'Country Search';

const description = document.createElement('p');
description.className = 'app__description';
description.textContent = 'Find information about countries around the world';

const searchForm = document.createElement('form');
searchForm.className = 'search';

const searchInput = document.createElement('input');
searchInput.className = 'search__input';
searchInput.type = 'search';
searchInput.placeholder = 'Enter a country name...';
searchInput.setAttribute('aria-label', 'Country name');

const searchButton = document.createElement('button');
searchButton.className = 'search__button';
searchButton.type = 'submit';
searchButton.textContent = 'Search';

const status = document.createElement('p');
status.className = 'status';
status.setAttribute('aria-live', 'polite');

const retryButton = document.createElement('button');
retryButton.className = 'retry-button';
retryButton.type = 'button';
retryButton.textContent = 'Try again';
retryButton.hidden = true;

const results = document.createElement('section');
results.className = 'results';
results.setAttribute('aria-label', 'Search results');

searchForm.append(searchInput, searchButton);
app.append(title, description, searchForm, status, retryButton, results);
document.body.append(app);

const createCountryCard = (country: Country): HTMLElement => {
  const card = document.createElement('article');
  card.className = 'country-card';

  const flag = document.createElement('img');
  flag.className = 'country-card__flag';
  flag.src = country.flagUrl;
  flag.alt = `Flag of ${country.name}`;

  const name = document.createElement('h2');
  name.className = 'country-card__name';
  name.textContent = country.name;

  const capital = document.createElement('p');
  capital.className = 'country-card__info';
  capital.textContent = `Capital: ${country.capital}`;

  const region = document.createElement('p');
  region.className = 'country-card__info';
  region.textContent = `Region: ${country.region}`;

  card.append(flag, name, capital, region);

  return card;
};

const searchController = new SearchController<Country>(async (query, signal) => {
  const data = await searchCountries(query, signal);

  return data.map(mapCountryResponse);
});

let lastQuery = '';

const performSearch = async (query: string): Promise<void> => {
  lastQuery = query;
  retryButton.hidden = true;

  status.className = 'status status--loading';
  status.textContent = 'Loading...';
  results.replaceChildren();

  try {
    const countries = await searchController.search(query);

    if (countries.length === 0) {
      status.className = 'status status--empty';
      status.textContent = 'No countries found.';
      return;
    }

    status.className = 'status';
    status.textContent = '';

    countries.forEach((country) => {
      results.append(createCountryCard(country));
    });
  } catch (error) {
    retryButton.hidden = false;
    status.className = 'status status--error';
    status.textContent = error instanceof Error ? error.message : 'Something went wrong.';
  }
};

retryButton.addEventListener('click', () => {
  if (lastQuery) {
    void performSearch(lastQuery);
  }
});

searchForm.addEventListener('submit', (event: SubmitEvent) => {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    retryButton.hidden = true;
    status.className = 'status status--error';
    status.textContent = 'Please enter a country name.';
    results.replaceChildren();
    return;
  }

  void performSearch(query);
});
