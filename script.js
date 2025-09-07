function generateSignal() {
  const pairs = [
    "BTC/USDT", "ETH/USDT", "SOL/USDT", "XRP/USDT",
    "EUR/USD", "GBP/USD", "AUD/CAD", "EUR/JPY", "USD/JPY"
  ];

  const directions = ["LONG 📈", "SHORT 📉"];
  const entryTimes = [1, 3, 5, 10, 15];
  const durations = [1, 3, 5, 10];
  const percents = [0.5, 1, 2, 3, 5];

  const pair = pairs[Math.floor(Math.random() * pairs.length)];
  const direction = directions[Math.floor(Math.random() * directions.length)];
  const entryTime = entryTimes[Math.floor(Math.random() * entryTimes.length)];
  const duration = durations[Math.floor(Math.random() * durations.length)];
  const percent = percents[Math.floor(Math.random() * percents.length)];

  document.getElementById("pair").textContent = pair;
  document.getElementById("direction").textContent = direction;
  document.getElementById("entryTime").textContent = entryTime;
  document.getElementById("duration").textContent = duration;
  document.getElementById("percent").textContent = percent;
}

// Генерация первого сигнала при загрузке
generateSignal();

// Автогенерация каждые 30 секунд
setInterval(generateSignal, 30000);
