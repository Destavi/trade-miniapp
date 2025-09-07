const API_BASE = ""; // "" = тот же домен

// Загружаем последний сигнал
async function loadLatestSignal() {
  const res = await fetch(`${API_BASE}/api/signals/latest`);
  const data = await res.json();
  document.getElementById("latest-signal").innerHTML = `
    <p>Пара: ${data.pair}</p>
    <p>Сделка: ${data.direction}</p>
    <p>Через: ${data.entryTime} мин</p>
    <p>Длительность: ${data.duration} мин</p>
    <p>Прогноз: ${data.percent}%</p>
  `;
}

// Загружаем историю
async function loadHistory() {
  const res = await fetch(`${API_BASE}/api/signals/history?limit=5`);
  const data = await res.json();
  const list = document.getElementById("history");
  list.innerHTML = "";
  let labels = [], values = [];
  data.forEach(sig => {
    const li = document.createElement("li");
    li.textContent = `${sig.pair} | ${sig.direction} | ${sig.percent}%`;
    list.appendChild(li);
    labels.push(sig.pair);
    values.push(sig.percent);
  });
  renderChart(labels, values);
}

// График
function renderChart(labels, values) {
  new Chart(document.getElementById("historyChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Проценты",
        data: values,
        borderColor: "#58a6ff",
        fill: false
      }]
    }
  });
}

// Статистика
async function loadStats() {
  const res = await fetch(`${API_BASE}/api/stats`);
  const data = await res.json();
  document.getElementById("stats").innerHTML =
    `👥 Всего: ${data.total_users} | 🔥 Активные: ${data.active_today} | 🔔 Подписаны: ${data.subscribed}`;
}

// Калькулятор
function calculate() {
  const amount = parseFloat(document.getElementById("amount").value);
  const res = [0.5, 1, 2].map(p => `${p}% → ${(amount * p / 100).toFixed(2)}$`);
  document.getElementById("calc-result").innerHTML = res.join("<br>");
}

// Подписка
async function subscribe() {
  const tg = window.Telegram?.WebApp;
  if (!tg) {
    alert("Откройте через Telegram Mini App");
    return;
  }
  const user = tg.initDataUnsafe.user;
  await fetch(`${API_BASE}/api/subscribe`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({id: user.id, subscribe: true})
  });
  alert("Подписка оформлена ✅");
}

// Сохраняем пользователя при входе
async function saveUser() {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;
  const user = tg.initDataUnsafe.user;
  await fetch(`${API_BASE}/api/saveUser`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(user)
  });
}

// Админка — создание сигнала
const form = document.getElementById("signal-form");
if (form) {
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await fetch(`${API_BASE}/api/admin/add_signal`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({...data, admin_token: "supersecret"})
    });
    const out = await res.json();
    document.getElementById("admin-result").textContent = JSON.stringify(out);
    loadStats();
  });
}

// Автозагрузка
window.addEventListener("load", () => {
  saveUser();
  loadLatestSignal();
  loadHistory();
  loadStats();
});
