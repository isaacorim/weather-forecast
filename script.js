
function getForecast() {
  const forecastContainer = document.getElementById('forecast');
  const errorContainer = document.getElementById('error');
  forecastContainer.innerHTML = '';
  errorContainer.textContent = '';

  const cityValue = document.getElementById('city').value;
  const [lat, lon] = cityValue.split(',');

  const apiUrl = `http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      return response.json();
    })
    .then(data => {
      if (!data.dataseries || data.dataseries.length === 0) {
        throw new Error("No forecast data available.");
      }

      const days = data.dataseries.slice(0, 7);

      days.forEach(day => {
        const date = formatDate(day.date);
        const weather = day.weather;
        const tempMin = day.temp2m.min;
        const tempMax = day.temp2m.max;

        const iconUrl = getWeatherIcon(weather);

        const div = document.createElement('div');
        div.className = 'forecast-day col-md-2 text-center';
        div.innerHTML = `
          <strong>${date}</strong><br/>
          <img src="${iconUrl}" alt="${weather}" width="64" height="64"/><br/>
          ${weather}<br/>
          <small>Min: ${tempMin}°C</small><br/>
          <small>Max: ${tempMax}°C</small>
        `;
        forecastContainer.appendChild(div);
      });
    })
    .catch(error => {
      errorContainer.textContent = "Error retrieving forecast: " + error.message;
    });
}

function formatDate(yyyymmdd) {
  const str = yyyymmdd.toString();
  const year = str.slice(0, 4);
  const month = str.slice(4, 6);
  const day = str.slice(6, 8);
  return `${day}/${month}/${year}`;
}

function getWeatherIcon(weather) {
  const iconMap = {
    clear: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
    pcloudy: "https://cdn-icons-png.flaticon.com/512/1163/1163661.png",
    mcloudy: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png",
    cloudy: "https://cdn-icons-png.flaticon.com/512/1163/1163629.png",
    humid: "https://cdn-icons-png.flaticon.com/512/414/414974.png",
    lightrain: "https://cdn-icons-png.flaticon.com/512/1146/1146858.png",
    oshower: "https://cdn-icons-png.flaticon.com/512/1146/1146860.png",
    ishower: "https://cdn-icons-png.flaticon.com/512/1146/1146860.png",
    rain: "https://cdn-icons-png.flaticon.com/512/1146/1146859.png",
    snow: "https://cdn-icons-png.flaticon.com/512/642/642102.png",
    ts: "https://cdn-icons-png.flaticon.com/512/1146/1146864.png",
    tsrain: "https://cdn-icons-png.flaticon.com/512/1146/1146865.png"
  };
  return iconMap[weather] || "https://cdn-icons-png.flaticon.com/512/869/869869.png"; // default to clear
}
