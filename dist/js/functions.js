function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

function autoSpollers() {
  const spollersArray = document.querySelectorAll("[data-spollers]");
  if (spollersArray.length > 0) {
    //отримання звичайних спойлерів(без медіа запитів)
    const spollersRegular = Array.from(spollersArray).filter((item, index, self) => {
      return !item.dataset.spollers.split(",")[0];
    });
    if (spollersRegular.length > 0) {
      initSpollers(spollersRegular);
    }

    //отримання спойлерів з медіа запитами
    const spollersMedia = Array.from(spollersArray).filter((item, index, self) => {
      return item.dataset.spollers.split(",")[0];
    });

    //ініціфлізація спойлерів з медіа запросами
    if (spollersMedia.length > 0) {
      const breakpointsArray = [];
      spollersMedia.forEach((item) => {
        const params = item.dataset.spollers;
        const breakpoint = {};
        const paramsArray = params.split(",");
        breakpoint.value = paramsArray[0];
        breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
        breakpoint.item = item;
        breakpointsArray.push(breakpoint);
      });

      //отримуєму унікальні брекпоінти(щоб врахувати повтори)
      let mediaQueries = breakpointsArray.map(function (item) {
        return `(${item.type}-width: ${item.value}px),${item.value},${item.type}`;
      });

      //повертаємо унікальне значення(будуть тільки унікальі значення без
      //повторів)
      mediaQueries = mediaQueries.filter(function (item, index, self) {
        return self.indexOf(item) === index;
      });
      //робота з кожним брейкпоінтом
      mediaQueries.forEach((breakpoint) => {
        const paramsArray = breakpoint.split(",");
        const mediaBreakpoint = paramsArray[1];
        const mediaType = paramsArray[2];
        const matchMedia = window.matchMedia(paramsArray[0]);

        //об'єкти з потрібними властивостями(перевірка)
        const spollersArray = breakpointsArray.filter(function (item) {
          if (item.value === mediaBreakpoint && item.type === mediaType) {
            return true;
          }
        });

        //івент
        matchMedia.addEventListener("change", () => {
          initSpollers(spollersArray, matchMedia);
        });
        initSpollers(spollersArray, matchMedia); //просто запускаємо функцію,
        //щоб вона запустилася після загрузки сторінки
      });
    }
    //ініціалізація функції

    function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach((spollersBlock) => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add("_init");
          initSpollerBody(spollersBlock);
          spollersBlock.addEventListener("click", setSpollerAction);
        } else {
          spollersBlock.classList.remove("_init");
          initSpollerBody(spollersBlock, false);
          spollersBlock.removeEventListener("click", setSpollerAction);
        }
      });
    }
    //-----------------------------------------------------------------
    //Робота з контентом

    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      const spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
      if (spollerTitles.length > 0) {
        spollerTitles.forEach((spollerTitle) => {
          if (hideSpollerBody) {
            spollerTitle.removeAttribute("tabindex");
          }
          if (!spollerTitle.classList.contains("_active")) {
            spollerTitle.nextElementSibling.hidden = true;
          } else {
            spollerTitle.setAttribute("tabindex", "-1");
            spollerTitle.nextElementSibling.hidden = false;
          }
        });
      }
    }
    function setSpollerAction(e) {
      const el = e.target;
      if (el.hasAttribute("data-spoller") || el.closest("[data-spoller]")) {
        const spollerTitle = el.hasAttribute("data-spoller") ? el : el.closest("[data-spoller]");
        const spollersBlock = spollerTitle.closest("[data-spollers]");
        const oneSpoller = spollersBlock.hasAttribute("data-one-spoller") ? true : false;
        if (!spollersBlock.querySelectorAll("._slide").length) {
          if (oneSpoller && !spollerTitle.classList.contains("_active")) {
            hideSpollersBody(spollersBlock);
          }
          spollerTitle.classList.toggle("_active");
          _slideToggle(spollerTitle.nextElementSibling, 300); //тут вказати швидкість відкривання/закривання
        }
        e.preventDefault();
      }
    }

    function hideSpollersBody(spollersBlock) {
      const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._active");
      if (spollerActiveTitle) {
        spollerActiveTitle.classList.remove("_active");
        _slideUp(spollerActiveTitle.nextElementSibling, 300); //тут вказати швидкість відкривання/закривання
      }
    }
  }

  //-----------------------------------------------------------------

  let _slideUp = (target, duration = 500) => {
    if (!target.classList.contains("_slide")) {
      target.classList.add("_slide");
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + "ms";
      target.style.height = target.offsetHeight + "px";
      target.offsetHeight;
      target.style.overflow = "hidden";
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => {
        target.hidden = true;
        target.style.removeProperty("height");
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        target.style.removeProperty("overflow");
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
        target.classList.remove("_slide");
      }, duration);
    }
  };

  let _slideDown = (target, duration = 500) => {
    if (!target.classList.contains("_slide")) {
      target.classList.add("_slide");
      if (target.hidden) {
        target.hidden = false;
      }
      let height = target.offsetHeight;
      target.style.overflow = "hidden";
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + "ms";
      target.style.height = height + "px";
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      window.setTimeout(() => {
        target.style.removeProperty("height");
        target.style.removeProperty("overflow");
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
        target.classList.remove("_slide");
      }, duration);
    }
  };

  let _slideToggle = (target, duration = 500) => {
    if (target.hidden) {
      return _slideDown(target, duration);
    } else {
      return _slideUp(target, duration);
    }
  };
}
autoSpollers();
//-----------------------------------------------------------------
function openCloseBurger() {
  const menuBtn = document.querySelector(".menu__icon");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      document.body.classList.toggle("_locked");
      menuBtn.classList.toggle("_active");
      document.querySelector(".menu__body").classList.toggle("_active");
    });
  }
}
openCloseBurger();
