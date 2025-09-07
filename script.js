const API_BASE = "http://localhost:5000"; // сюда ставь URL backend, например http://localhost:5000

async function loadLatestSignal() {
  const res = await fetch(`${API_BASE}/api/signals/latest`);
  const data = await res.json();
  if(data.error){
    document.getElementById("latest-signal").innerHTML = "Сигналов пока нет";
    return;
  }
  document.getElementById("latest-signal").innerHTML = `
    <p>Пара: ${data.pair}</p>
    <p>Сделка: ${data.direction}</p>
    <p>Через: ${data.entryTime} мин</p>
    <p>Длительность: ${data.duration} мин</p>
    <p>Прогноз: ${data.percent}%</p>
  `;
}

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

function renderChart(labels, values){
  new Chart(document.getElementById("historyChart"), {
    type: "line",
    data: {labels, datasets:[{label:"Проценты", data:values, borderColor:"#58a6ff", fill:false}]}
  });
}

async function generateSignal(pair="BTC_USDT"){
  const res = await fetch(`${API_BASE}/api/signals/generate`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({pair})
  });
  const data = await res.json();
  loadLatestSignal();
  loadHistory();
  return data;
}

function calculate(){
  const amount = parseFloat(document.getElementById("amount").value);
  const res = [0.5,1,2].map(p => `${p}% → ${(amount*p/100).toFixed(2)}$`);
  document.getElementById("calc-result").innerHTML = res.join("<br>");
}

window.addEventListener("load",()=>{
  loadLatestSignal();
  loadHistory();
});
