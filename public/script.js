// Текущий язык
let currentLang = localStorage.getItem('lang') || 'lv';  // По умолчанию LV
let currentSection = 'cars';  // Текущая секция

// Функция сокращения описания (~10 слов для каталога)
function shortenDescription(desc, maxWords = 10) {
  const words = desc.split(' ');
  if (words.length <= maxWords) return desc;
  return words.slice(0, maxWords).join(' ') + '...';
}

// Показ/скрытие секций
function showSection(section) {
  currentSection = section;
  document.getElementById('cars-section').classList.toggle('hidden', section !== 'cars');
  document.getElementById('parts-section').classList.toggle('hidden', section !== 'parts');
  document.getElementById('cars-nav').classList.toggle('active', section === 'cars');
  document.getElementById('parts-nav').classList.toggle('active', section === 'parts');
  if (section === 'cars') loadCars();
  else loadParts();
}

// Загрузка машин (~10 слов в каталоге)
async function loadCars() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);  // 10s timeout
    const response = await fetch(`/api/cars?lang=${currentLang}`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('API ошибка');
    const cars = await response.json();
    console.log(`Загружено машин: ${cars.length}/10`);  // Лог количества
    const list = document.getElementById('cars');
    list.innerHTML = cars.map(car => `
      <li onclick="showDetails('${car._id}')">
        <img src="${car.image}" alt="${car.model}" onerror="this.src='https://via.placeholder.com/300x200?text=Bmw'">
        <h3>${car.model} (${car.year})</h3>
        <p class="short-desc">${shortenDescription(car.description, 10)}</p>
      </li>
    `).join('');
    document.getElementById('error-msg-cars').style.display = 'none';
  } catch (err) {
    console.error('Ошибка загрузки машин:', err);
    document.getElementById('cars').innerHTML = '<p>Машины не загружаются. Проверьте сервер.</p>';
    document.getElementById('error-msg-cars').style.display = 'block';
  }
}

// Загрузка запчастей (~10 слов в каталоге)
async function loadParts() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);  // 10s timeout
    const response = await fetch(`/api/parts?lang=${currentLang}`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('API ошибка');
    const parts = await response.json();
    console.log(`Загружено запчастей: ${parts.length}/10`);  // Лог количества
    const list = document.getElementById('parts');
    list.innerHTML = parts.map(part => `
      <li onclick="showPartDetails('${part._id}')">
        <img src="${part.image}" alt="${part.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Part'">
        <h3>${part.name}</h3> 
        <p class="short-desc">${shortenDescription(part.description, 10)}</p>
      </li>
    `).join('');
    document.getElementById('error-msg-parts').style.display = 'none';
  } catch (err) {
    console.error('Ошибка загрузки запчастей:', err);
    document.getElementById('parts').innerHTML = '<p>Запчасти не загружаются. Проверьте сервер.</p>';
    document.getElementById('error-msg-parts').style.display = 'block';
  }
}

function showPartDetails(id) {
  fetch(`/api/part/${id}?lang=${currentLang}`)
    .then(res => {
      if (!res.ok) throw new Error('Ошибка деталей');
      return res.json();
    })
    .then(part => {
      document.getElementById('part-detail-title').textContent = part.name;  // Билингвальное
      document.getElementById('part-detail-image').src = part.image;
      document.getElementById('part-detail-desc').textContent = part.description;  // Полное
      document.getElementById('part-details').classList.remove('hidden');
      document.getElementById('part-details').classList.add('slide-in');
      document.getElementById('part-detail-image').classList.add('fade-in-detail');
    })
    .catch(err => console.error('Ошибка в деталях запчасти:', err));
}

// Показ деталей машины (полное описание)
function showDetails(id) {
  fetch(`/api/car/${id}?lang=${currentLang}`)
    .then(res => {
      if (!res.ok) throw new Error('Ошибка деталей');
      return res.json();
    })
    .then(car => {
      document.getElementById('detail-title').textContent = car.model;
      document.getElementById('detail-image').src = car.image;
      document.getElementById('detail-desc').textContent = car.description;  // Полное
      document.getElementById('car-details').classList.remove('hidden');
      document.getElementById('car-details').classList.add('slide-in');
      document.getElementById('detail-image').classList.add('fade-in-detail');
    })
    .catch(err => console.error('Ошибка в деталях:', err));
}

// Показ деталей запчасти (полное описание)
function showPartDetails(id) {
  fetch(`/api/part/${id}?lang=${currentLang}`)
    .then(res => {
      if (!res.ok) throw new Error('Ошибка деталей');
      return res.json();
    })
    .then(part => {
      document.getElementById('part-detail-title').textContent = part.name;
      document.getElementById('part-detail-image').src = part.image;
      document.getElementById('part-detail-desc').textContent = part.description;  // Полное
      document.getElementById('part-details').classList.remove('hidden');
      document.getElementById('part-details').classList.add('slide-in');
      document.getElementById('part-detail-image').classList.add('fade-in-detail');
    })
    .catch(err => console.error('Ошибка в деталях запчасти:', err));
}

// Скрыть детали машины
function hideDetails() {
  document.getElementById('car-details').classList.add('hidden');
  document.getElementById('detail-image').classList.remove('fade-in-detail');
}

// Скрыть детали запчасти
function hidePartDetails() {
  document.getElementById('part-details').classList.add('hidden');
  document.getElementById('part-detail-image').classList.remove('fade-in-detail');
}

// Переключение языка
function toggleLang() {
  currentLang = currentLang === 'lv' ? 'ru' : 'lv';
  localStorage.setItem('lang', currentLang);
  document.getElementById('lang-toggle').textContent = currentLang === 'lv' ? 'LAT' : 'RU';
  // Обновить переводы
  document.querySelectorAll('[data-lang-lv]').forEach(el => {
    const key = `data-lang-${currentLang}`;
    if (el.hasAttribute(key)) {
      el.textContent = el.getAttribute(key);
    }
  });
  // Перезагрузить текущую секцию
  if (currentSection === 'cars') loadCars();
  else loadParts();
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('lang-toggle').textContent = currentLang === 'lv' ? 'LAT' : 'RU';
  showSection('cars');  // Начать с машин
});