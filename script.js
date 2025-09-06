const usdToUah = 41; // Курс USD → UAH (можно обновлять через API)

function calculate() {
  const amountInput = parseFloat(document.getElementById("amount").value);
  const leverage = parseInt(document.getElementById("leverage").value);
  const direction = document.getElementById("direction").textContent.includes("LONG") ? "long" : "short";
  const percent = parseFloat(document.getElementById("percent").textContent);
  const currency = document.getElementById("currency").value;

  if (!amountInput || amountInput <= 0) {
    document.getElementById("result").innerHTML = "Введите корректную сумму!";
    return;
  }

  // Конвертация в USD для расчета
  let amount = amountInput;
  if (currency === "uah") amount = amountInput / usdToUah;

  let profit = amount * percent / 100 * leverage;
  if (direction === "short") profit = profit; // прибыль считается на падении для шорта

  let displayProfit = currency === "usd" ? profit.toFixed(2) + " $" : (profit * usdToUah).toFixed(2) + " ₴";

  document.getElementById("result").innerHTML =
    `<p>💰 Прибыль при выбранном сигнале: ${displayProfit}</p>
     <p>Пример при 0.5%: ${(amount*0.005*leverage).toFixed(2)} $</p>
     <p>Пример при 1%: ${(amount*0.01*leverage).toFixed(2)} $</p>
     <p>Пример при 2%: ${(amount*0.02*leverage).toFixed(2)} $</p>`;
}

// Функция для обновления сигнала (в будущем можно вызывать с сервера)
function updateSignal(pair, direction, entryTime, duration, percent) {
  document.getElementById("pair").textContent = pair;
  document.getElementById("direction").textContent = direction === "long" ? "LONG 📈" : "SHORT 📉";
  document.getElementById("entryTime").textContent = entryTime;
  document.getElementById("duration").textContent = duration;
  document.getElementById("percent").textContent = percent;
}

// Пример автозаполнения сигнала
updateSignal("BTC/USDT", "long", 10, 3, 5);
