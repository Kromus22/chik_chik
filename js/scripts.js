const API_URL = 'https://educated-kindly-paddleboat.glitch.me/';

/*
GET /api - получить список услуг
GET /api?service={n} - получить список барберов
GET /api?spec={n} - получить список месяца работы барбера
GET /api?spec={n}&month={n} - получить список дней работы барбера
GET /api?spec={n}&month={n}&day={n} - получить список свободных часов барбера
POST /api/order - оформить заказ
*/

const addPreloader = (elem) => {
  elem.classList.add('preload');
}

const removePreloader = (elem) => {
  elem.classList.remove('preload');
}

// все настройки слайдера
const startSlider = () => {
  const sliderItems = document.querySelectorAll('.slider__item');
  const sliderList = document.querySelector('.slider__list');
  const btnNextSlide = document.querySelector('.slider__arrow_right');
  const btnPrevSlide = document.querySelector('.slider__arrow_left');

  let activeSlide = 1;
  let position = 0;

  // проверка позиции сладера, чтобы скрывать кнопки переключения, если мы в начале или в конце
  const checkSlider = () => {
    if ((activeSlide + 2 === sliderItems.length &&
      document.documentElement.offsetWidth > 540) ||
      activeSlide === sliderItems.length) {
      btnNextSlide.style.display = 'none';
    } else {
      btnNextSlide.style.display = '';
    }

    if (activeSlide === 1) {
      btnPrevSlide.style.display = 'none';
    } else {
      btnPrevSlide.style.display = '';
    }
  }

  checkSlider();
  // логика переключения слайдов
  const nextSlide = () => {
    sliderItems[activeSlide]?.classList.remove('slider__item_active');
    position = -sliderItems[0].clientWidth * activeSlide;
    sliderList.style.transform = `translateX(${position}px)`;
    activeSlide += 1;
    sliderItems[activeSlide]?.classList.add('slider__item_active');
    checkSlider();
  }

  const prevSlide = () => {
    sliderItems[activeSlide]?.classList.remove('slider__item_active');
    position = -sliderItems[0].clientWidth * (activeSlide - 2);
    sliderList.style.transform = `translateX(${position}px)`;
    activeSlide -= 1;
    sliderItems[activeSlide]?.classList.add('slider__item_active');
    checkSlider();
  }

  btnPrevSlide.addEventListener('click', prevSlide);
  btnNextSlide.addEventListener('click', nextSlide);

  // проверка размеров экрана
  window.addEventListener('resize', () => {
    if (activeSlide + 2 > sliderItems.length && document.documentElement.offsetWidth > 540) {
      activeSlide = sliderItems.length - 2;
      sliderItems[activeSlide]?.classList.add('slider__item_active');
    }

    position = -sliderItems[0].clientWidth * (activeSlide - 1);
    sliderList.style.transform = `translateX(${position}px)`;
    checkSlider();
  });
}

// запуск слайдера и прелоадера
const initSlider = () => {
  const slider = document.querySelector('.slider');
  const sliderContainer = document.querySelector('.slider__container');

  sliderContainer.style.display = 'none';

  addPreloader(slider);
  window.addEventListener('load', () => {
    sliderContainer.style.display = '';
    removePreloader(slider);
    startSlider();
  });
}

//рендер полученных данных в вёрстку
const renderPrice = (wrapper, data) => {
  data.forEach((item) => {
    const priceItem = document.createElement('li');
    priceItem.classList.add('price__item');

    priceItem.innerHTML = `
      <span class="price__item-title">${item.name}</span>
      <span class="price__item-count">${item.price} руб</span>
    `;
    wrapper.append(priceItem);
  });
}

const renderService = (wrapper, data) => {
  const labels = data.map(item => {
    const label = document.createElement('label');
    label.classList.add('radio');
    label.innerHTML = `
      <input class="radio__input" type="radio" name="service" value="${item.id}">
      <span class="radio__label">${item.name}</span>
    `;
    return label
  });
  wrapper.append(...labels);
}

const initService = () => {
  const priceList = document.querySelector('.price__list');
  const reserveFieldsetService = document.querySelector('.reserve__fieldset_service');
  priceList.textContent = '';
  addPreloader(priceList);

  reserveFieldsetService.innerHTML = '<legend class="reserve__legend">Услуга</legend>';
  addPreloader(reserveFieldsetService);


  // запрос на сервер
  fetch(`${API_URL}api`)
    .then(response => response.json())
    .then(data => {
      renderPrice(priceList, data);
      removePreloader(priceList);
      return data;
    })
    .then(data => {
      renderService(reserveFieldsetService, data);
      removePreloader(reserveFieldsetService);
    })
}

const addDisabled = (arr) => {
  arr.forEach(elem => {
    elem.disabled = true;
  })
}

const removeDisabled = (arr) => {
  arr.forEach(elem => {
    elem.disabled = false;
  })
}

//рендер спецов
const renderSpec = (wrapper, data) => {
  const labels = data.map(item => {
    const label = document.createElement('label');
    label.classList.add('radio');
    label.innerHTML = `
      <input class="radio__input" type="radio" name="spec" value="${item.id}">
      <span class="radio__label radio__label-spec" style="--bg-image: url(${API_URL}${item.img})">${item.name}</span>
    `;
    return label;
  });
  wrapper.append(...labels);
}

//рендер месяцев
const renderMonth = (wrapper, data) => {
  const labels = data.map(month => {
    const label = document.createElement('label');
    label.classList.add('radio');
    label.innerHTML = `
      <input class="radio__input" type="radio" name="month" value="${month}">
      <span class="radio__label">${new Intl.DateTimeFormat('ru-RU', {
      month: 'long'
    }).format(new Date(month))}</span>
    `;
    return label;
  });
  wrapper.append(...labels);
}

//рендер дней
const renderDay = (wrapper, data, month) => {
  const labels = data.map(day => {
    const label = document.createElement('label');
    label.classList.add('radio');
    label.innerHTML = `
      <input class="radio__input" type="radio" name="day" value="${day}">
      <span class="radio__label">${new Intl.DateTimeFormat('ru-RU', {
      month: 'long',
      day: 'numeric'
    }).format(new Date(`${month}/${day}`))}</span>
    `;
    return label;
  });
  wrapper.append(...labels);
}

//рендер часов работы
const renderTime = (wrapper, data) => {
  const labels = data.map(time => {
    const label = document.createElement('label');
    label.classList.add('radio');
    label.innerHTML = `
      <input class="radio__input" type="radio" name="time" value="${time}">
      <span class="radio__label">${time}</span>
    `;
    return label;
  });
  wrapper.append(...labels);
}

//логика блока бронирования записи
const initReserve = () => {

  //блокируем все кнопки, кроме выбора услуги и далее поэтапно, 
  //после выбора последующих пунктов, разблокируем следующие
  const reserveForm = document.querySelector('.reserve__form');
  const { fieldservice, fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn } = reserveForm;

  addDisabled([fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn,]);

  // логика выбора услуг, мастера и даты
  reserveForm.addEventListener('change', async (evt) => {
    const target = evt.target;

    if (target.name === 'service') {
      fieldspec.innerHTML = '<legend class=" reserve__legend">Специалист</legend>';
      addPreloader(fieldspec);

      const response = await fetch(`${API_URL}api?service=${target.value}`);
      const data = await response.json();

      renderSpec(fieldspec, data);

      removePreloader(fieldspec);
      removeDisabled([fieldspec]);
    }

    if (target.name === 'spec') {
      addPreloader(fieldmonth);
      fieldmonth.innerHTML = '';

      const response = await fetch(`${API_URL}api?spec=${target.value}`);
      const data = await response.json();

      renderMonth(fieldmonth, data);

      removePreloader(fieldmonth);
      removeDisabled([fielddata, fieldmonth]);
    }

    if (target.name === 'month') {
      addPreloader(fieldday);
      fieldday.innerHTML = '';

      const response = await fetch(`${API_URL}api?spec=${reserveForm.spec.value}&month=${target.value}`);
      const data = await response.json();

      renderDay(fieldday, data, target.value);

      removePreloader(fieldday);
      removeDisabled([fieldday]);
    }

    if (target.name === 'day') {
      addPreloader(fieldtime);
      fieldtime.innerHTML = '';

      const response = await fetch(`${API_URL}api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}&day=${target.value}`);
      const data = await response.json();

      renderTime(fieldtime, data);

      removePreloader(fieldtime);
      removeDisabled([fieldtime]);
    }

    if (target.name === 'time') {
      removeDisabled([btn]);
    }
  });

  // отправка данных на сервер
  reserveForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const formData = new FormData(reserveForm);
    const json = JSON.stringify(Object.fromEntries(formData));

    const response = await fetch(`${API_URL}api/order`, {
      method: 'post',
      body: json,
    });

    const data = await response.json();

    addDisabled([fieldservice, fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn,]);

    const orderSucces = document.createElement('p');
    orderSucces.textContent = `
      Спасибо за бронирование услуги! Ваш заказ №${data.id}. 
      Мастер будет ждат Вас ${new Intl.DateTimeFormat('ru-RU', {
      month: 'long',
      day: 'numeric',
    }).format(new Date(`${data.month}/${data.day}`))} в ${data.time}.
    `;

    reserveForm.append(orderSucces);
  });
}

const init = () => {
  initSlider();
  initService();
  initReserve();
}

//проверка загрузки страницы, чтобы запускать скрипты. 
window.addEventListener('DOMContentLoaded', init);



