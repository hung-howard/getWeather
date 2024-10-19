const apiKey = "ab1eaffae2af94520d6b190c7da8665b";

const container = document.querySelector(".main__container");
const cityInput = document.querySelector(".search");
const searchBtn = document.querySelector(".btn__search");
const weatherInfomation = document.querySelector(".information__container");

// 獲取地理編碼
const getGeocode = async function (cityName) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    cityName
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0) {
      return {
        lat: data[0].lat,
        lon: data[0].lon,
      };
    } else {
      throw new Error("找不到該地點");
    }
  } catch (error) {
    console.error("Error fetching geocode:", error);
    throw error;
  }
};

// 獲取天氣資料並且呈現
const getWeatherData = async function () {
  reset(); // 每次搜索前先重置

  const city = cityInput.value.trim();

  try {
    // 先獲取地理編碼
    const geoData = await getGeocode(city);

    // 使用經緯度獲取天氣資料
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${geoData.lat}&lon=${geoData.lon}&appid=${apiKey}&units=metric&lang=zh_tw`;

    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    if (data.cod === "404") error("找不到該地點的天氣資訊");
    if (data.weather?.[0] && data.main && data.wind) displayWeather(data);
    else error("未知錯誤，請稍後再試");

    cityInput.value = "";
  } catch (err) {
    console.error("Error:", err);
    error(err.message || "獲取天氣資料時發生錯誤");
  }
};

// 顯示解構天氣資訊
function displayWeather(data) {
  const { name, weather, main, wind } = data;
  const html = `
        <div class="imgContainer">
          <img class="img" src="img/${weather[0].main}.png" alt="" />
          <div class="cityWeather">
              <span class="weather-condition">${weather[0].main}</span>
            <span class="city-name">${name}</span>
            </div>
        </div>
        <div class="detail__container">
          <div class="icon__text-content">
            <icon class="wind fa-solid fa-wind"></icon>
            <h3>${wind.speed} km/h</h3>
          </div>
          <div class="icon__text-content">
            <icon
              class="temperatur fa-solid fa-wind fa-solid fa-temperature-low"
            ></icon>
            <h3>${main.temp} °C</h3>
          </div>
          <div class="icon__text-content">
            <icon class="water fa-solid fa-water"></icon>
            <h3>${main.humidity} %</h3>
          </div>
            `;
  // 清空
  weatherInfomation.innerHTML = "";
  // 插入
  setTimeout(() => {
    container.style.height = "54rem";
    weatherInfomation.classList.add("fade-In");
    weatherInfomation.insertAdjacentHTML("beforeend", html);
  }, 1000);
}

// 重置
const reset = function () {
  weatherInfomation.innerHTML = "";
  container.style.height = "11rem";
  weatherInfomation.classList.remove("fade-In");
};

// error 資訊
const error = function (message = "輸入錯誤，請重新輸入") {
  const html = `
            <div class="erro__imgContainer">
            <img class="img__erro" src="img/橘子.JPG" alt="" />
            <p>${message}</p>
            </div>
  
  `;

  setTimeout(() => {
    container.style.height = "54rem";
    weatherInfomation.classList.add("fade-In");
    weatherInfomation.insertAdjacentHTML("beforeend", html);
  }, 1000);
};

searchBtn.addEventListener("click", getWeatherData);

cityInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") getWeatherData();
});
