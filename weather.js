import fetch from 'node-fetch';
import readline from 'readline';

const apiKey = '57ec6887251179517ee8ade7ccc02f1c';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askForCity() {
    rl.question("📍 Enter a city to get the hourly forecast: ", (city) => {
        if (!city.trim()) {
            console.log("❌ Please enter a valid city name.");
            rl.close();
            return;
        }

        showHourlyWeather(city.trim());
    });
}

async function showHourlyWeather(city) {
    try {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
        const response = await fetch(forecastUrl);
        const data = await response.json();

        if (!data || !data.list || data.cod !== "200") {
            throw new Error(data.message || "❌ Hourly forecast not available.");
        }

        console.log(`\n🌤️ Hourly Forecast for ${data.city.name}, ${data.city.country}:\n`);

        data.list.slice(0, 8).forEach(item => {
            const time = new Date(item.dt * 1000).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });

            const temp = item.main.temp;
            const description = item.weather[0].description;

            console.log(`🕒 ${time} - 🌡️ ${temp}°C - ${description}`);
        });

        console.log(`\n✅ Forecast (3-hourly intervals) for next 24 hours shown.\n`);
    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        rl.close(); 
    }
}

askForCity();
