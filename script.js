const apiKey = '57ec6887251179517ee8ade7ccc02f1c';

async function fetchWeather() {
    const city = document.getElementById('cityInput').value;
    if (!city) return alert('Please enter a city name.');

    try {
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.length) throw new Error('City not found.');

        const { lat, lon, name, country } = geoData[0];

        // Get current weather
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const weatherRes = await fetch(weatherUrl);
        const weather = await weatherRes.json();

        // Show current weather
        document.getElementById('weatherInfo').style.display = 'block';
        document.getElementById('weatherInfo').innerHTML = `
            <p>📍 <strong>${name}, ${country}</strong></p>
            <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="${weather.weather[0].description}">
            <p>🌡️ Temperature: ${weather.main.temp} °C</p>
            <p>🌤️ Condition: ${weather.weather[0].description}</p>
            <p>💧 Humidity: ${weather.main.humidity}%</p>
            <p>💨 Wind: ${weather.wind.speed} m/s</p>
        `;

        // Get hourly forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const forecastRes = await fetch(forecastUrl);
        const forecastData = await forecastRes.json();

        const hourlyHTML = forecastData.list.slice(0, 8).map(hour => {
            const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `
                <div class="hour-card">
                    <p>${time}</p>
                    <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" alt="${hour.weather[0].description}">
                    <p>${hour.main.temp} °C</p>
                    <p>${hour.weather[0].description}</p>
                </div>
            `;
        }).join('');

        document.getElementById('hourlyForecast').innerHTML = hourlyHTML;

    } catch (error) {
        alert("❌ " + error.message);
    }
}
