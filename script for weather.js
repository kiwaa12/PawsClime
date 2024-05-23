const form = document.getElementById('weather-form');
const weatherInfo = document.getElementById('weather-info');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const city = document.getElementById('city').value;
    const apiKey = "4f3ff9746d10bde307a74e6131c88ebb";

    try {
        // Fetch current weather
        const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const currentWeatherData = await currentWeatherResponse.json();

        if (currentWeatherData.cod === 200) {
            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
            const forecastData = await forecastResponse.json();
            const threeDayForecast = forecastData.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3);
            document.querySelector(".temperature-pet").innerText = currentWeatherData.main.temp;

            updatePetWarning(currentWeatherData.main.temp);

            let weatherInfoHTML = `
                <div class="card border-0 bg-transparent">
                    <div class="card-body text-white border-0">
                        <div class="rounded-5">
                          <h1 class="card-title">Weather in <span class="pawsclime display-5 fw-bold">${city}</span></h1>
                        <div class="d-flex align-items-baseline justify-content-between">
                            <h4 class="card-text">Temperature<br><span class="display-5">${currentWeatherData.main.temp}</span>°C</h4>
                            <h4 class="card-text">Description<img src="http://openweathermap.org/img/w/${currentWeatherData.weather[0].icon}.png" alt="Weather Icon"><br><span class="display-8 fw-light">${currentWeatherData.weather[0].description}</span></h4>
                        </div>
                        </div>
                        <h2 class="mt-3">Next 3 Day Forecast</h2>
            `;

            threeDayForecast.forEach(forecast => {
                const forecastDate = new Date(forecast.dt_txt);
                const forecastDay = forecastDate.toLocaleDateString('en-US', { weekday: 'long' });
                weatherInfoHTML += `
                    <div class="d-flex justify-content-between align-items-center bg-light text-dark px-3 rounded my-2">
                        <p class="w-25 text-white text-center bg-warning rounded-3">${forecastDay}</p>
                        <p class="w-30"><img src="http://openweathermap.org/img/w/${forecast.weather[0].icon}.png" alt="Weather Icon"> ${forecast.weather[0].description}</p>
                        <p class="w-25">${forecast.main.temp} °C</p>
                    </div>
                `;
            });

            weatherInfoHTML += `
                    </div>
                </div>
            `;
            
            weatherInfo.innerHTML = weatherInfoHTML;
        } else {
            weatherInfo.innerHTML = '<p class="text-danger">City not found. Please try again.</p>';
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherInfo.innerHTML = '<p class="text-danger">An error occurred. Please try again later.</p>';
    }
});

function updatePetWarning(temperature) {
    const petWarning = document.querySelector('.pet-warning');
    let warningMessage = '';

    if (temperature > 30) {
        warningMessage = `
            <h4>When Temperatures are High</h4>
            <p>
                Tips:
                <ul>
                    <li>Always give cool water at all times. You can also give ice to keep it cold.</li>
                    <li>Regularly groom your pets to remove excess fur that can trap heat.</li>
                    <li>Give your pets a cool bath to help lower their body temperature.</li>
                    <li>Provide cooling mats or wet towels for your pets to lie on.</li>
                    <li>Set up a shallow wading pool or use a sprinkler for supervised playtime. This allows pets to cool down.</li>
                    <li>Avoid walks during the hottest part of the day. If you must go out, stick to shaded areas and keep walks short.</li>
                    <li>During extreme heat, create a cool haven for your pet indoors with air conditioning or fans.</li>
                </ul>
                Warnings:
                <ul>
                    <li>Heatstroke may encounter. Symptoms include excessive panting, vomiting, and diarrhea. Seek immediate veterinary care if suspected.</li>
                    <li>The higher the temperature, the higher the risk for very young or overweight pets.</li>
                </ul>
            </p>
        `;
    } else if (temperature < 10) {
        warningMessage = `
            <h4>When Temperatures are Low</h4>
            <p>
                Tips:
                <ul>
                    <li>Give them plenty of nutritious food to have extra energy to stay warm.</li>
                    <li>Give extra bedding to help your pet keep body heat.</li>
                    <li>Keep your pet active even during colder months. Daily walks or playtime indoors help maintain muscle mass and generate heat.</li>
                    <li>Cold weather can dry out and crack your pet's paw pads. Consider using a pet-safe paw balm to keep them moisturized and prevent discomfort.</li>
                    <li>Ensure your pet has access to fresh, unfrozen water at all times.</li>
                </ul>
                Warnings:
                <ul>
                    <li>Frostbite and hypothermia are dangers, especially for small, young, or elderly pets. Signs include shivering and being slow to get up.</li>
                    <li>Some pets may need to be kept indoors during extreme cold snaps.</li>
                </ul>
            </p>
        `;
    } else {
        warningMessage = `
            <h4>When the Temperature is Normal</h4>
            <p>
                Tips:
                <ul>
                    <li>Provide comfortable bedding. Make sure your pet has a clean and comfortable place to rest and relax, especially during normal temperature days.</li>
                    <li>Regular brushing helps remove loose fur and keeps your pet cooler by improving air circulation through their coat.</li>
                    <li>Maintain your pet's dental hygiene by brushing their teeth or providing dental chews. Good oral health can contribute to overall well-being.</li>
                    <li>Rotate your pet's toys seasonally to keep things interesting. For normal temperature days, consider introducing new chew toys or puzzle feeders that challenge them mentally.</li>
                    <li>Ensure your pet has access to fresh, clean water at all times. This is especially important as pets regulate their body temperature through panting and can become dehydrated easily.</li>
                </ul>
            </p>
        `;
    }

    petWarning.innerHTML = warningMessage;
};
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feeding-form');
    const feedingRecords = document.getElementById('feeding-records');
    const clearButton = document.getElementById('clear-records');
  
    // Load feeding records from local storage
    loadFeedingRecords();
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const petName = document.getElementById('petName').value;
      const foodType = document.getElementById('foodType').value;
      const foodAmount = document.getElementById('foodAmount').value;
      const feedingTime = document.getElementById('feedingTime').value;
  
      const newRecord = {
        petName,
        foodType,
        foodAmount,
        feedingTime
      };
  
      addFeedingRecord(newRecord);
      saveFeedingRecord(newRecord);
  
      form.reset();
    });
  
    clearButton.addEventListener('click', () => {
      // Clear the local storage
      localStorage.removeItem('feedingRecords');
  
      // Clear the table
      feedingRecords.innerHTML = '';
    });
  
    function addFeedingRecord(record) {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${record.petName}</td>
        <td>${record.foodType}</td>
        <td>${record.foodAmount}</td>
        <td>${record.feedingTime}</td>
      `;
  
      feedingRecords.appendChild(newRow);
    }
  
    function saveFeedingRecord(record) {
      let records = JSON.parse(localStorage.getItem('feedingRecords')) || [];
      records.push(record);
      localStorage.setItem('feedingRecords', JSON.stringify(records));
    }
  
    function loadFeedingRecords() {
      const records = JSON.parse(localStorage.getItem('feedingRecords')) || [];
      records.forEach(record => addFeedingRecord(record));
    }
  });
  