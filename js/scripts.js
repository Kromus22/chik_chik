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

//проверка загрузки страницы, чтобы отключать прелоадер. 
window.addEventListener('DOMContentLoaded', initSlider);



