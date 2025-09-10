const row = document.getElementById('rowForecastDays');
const currentData = document.getElementById('current');
const searchInput = document.getElementById('searchInput');
const numberDays = document.getElementById('numberDays');
const numberDaysInput = document.getElementById('numberDaysInput');
const btnSearch = document.querySelector('[title="Search"]');

async function checkQuery(name) {
  if (!name || name.trim() === '') return;

  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=cb6f88b79c4d44bbae4145903250709&q=${name}`
    );
    const data = await res.json();

    if (Array.isArray(data) && data.length > 0 && data[0].name) {
      if (numberDaysInput.value) {
        getWeather(data[0].name, numberDaysInput.value);
      } else {
        getWeather(data[0].name);
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Search error:', error);
  }
}

async function getWeather(cityOrCountry = 'Cairo', _days = 3) {
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=cb6f88b79c4d44bbae4145903250709&q=${cityOrCountry}&days=${_days}`
    );
    const data = await res.json();

    numberDays.innerHTML = `${_days}-Day Forecast`;

    const current = data.current;
    const { name: city, country } = data.location;
    const { forecastday } = data.forecast;

    const currentHeader = currentData.children[0];
    const currentDetails = currentData.children[1];

    currentHeader.children[0].children[0].innerHTML = `${city}, ${country}`;
    currentHeader.children[0].children[1].innerHTML = `${current.condition.text}`;
    currentHeader.children[1].children[0].innerHTML = `${current.temp_c}°C`;

    currentDetails.children[0].innerHTML = `
      <div class="col-md-3 col-6 mb-3">
        <div class="highlight">
          <i class="fas fa-wind"></i>
          <div>Wind</div>
          <div class="fw-bold">${current.wind_kph} km/h</div>
        </div>
      </div>
      <div class="col-md-3 col-6 mb-3">
        <div class="highlight">
          <i class="fas fa-tint"></i>
          <div>Humidity</div>
          <div class="fw-bold">${current.humidity}%</div>
        </div>
      </div>
      <div class="col-md-3 col-6 mb-3">
        <div class="highlight">
          <i class="fas fa-compress-alt"></i>
          <div>Pressure</div>
          <div class="fw-bold">${current.pressure_mb} hPa</div>
        </div>
      </div>
    `;

    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    row.innerHTML = '';

    forecastday.forEach((day) => {
      const date = new Date(day.date);
      const dayName = days[date.getDay()];

      const card = document.createElement('div');
      card.innerHTML = `
        <div class="weather-card card h-100">
          <div class="card-header text-center fw-bold">${dayName}</div>
          <div class="card-body text-center d-flex flex-column justify-content-between">
            <img 
              src="${day.day.condition.icon}" 
              alt="${day.day.condition.text}" 
              class="weather-icon mb-3 mx-auto" 
              style="max-width: 80px;"
            />
            <h5 class="city-name">${city}</h5>
            <p class="temperature fs-4 fw-semibold">${Math.round((day.day.maxtemp_c + day.day.mintemp_c) / 2)}°C</p>
            <p class="text-info small">${day.day.condition.text}</p>
          </div>
        </div>
      `;
      row.appendChild(card);
    });
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
  }
}

getWeather('Cairo', numberDaysInput.value);

btnSearch.addEventListener('click', () => {
  checkQuery(searchInput.value);
});
