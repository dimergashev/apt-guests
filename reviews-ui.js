/* Отзывы: 1) «Сортировка отзывов» раскрывается по клику — меню прода (MenuList/Option, снято 26 ноя с ostrovok.ru),
   пункты переставляют отзывы в списке; 2) мобилка: «Читать отзывы» открывает шторку прода (HotelReviews_background)
   с плавным появлением; закрывается крестиком, «Закрыть», тапом по затемнению и Escape. */
(function () {
  var MONTHS = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
  var OPTS = ['Сначала полезные', 'Сначала новые', 'Сначала высокая оценка', 'Сначала низкая оценка'];
  var CHECK = '<svg width="16" height="16" viewBox="0 0 20 20" class="Option_checkIcon__KlnqH"><path fill="currentColor" d="M17.13 5.38a1.3 1.3 0 00-1.83 0l-7.48 7.48-3.13-3.12a1.27 1.27 0 00-1.79 0l-.03.04a1.27 1.27 0 000 1.79l4.05 4.05a1.27 1.27 0 001.8 0l.01-.02.02-.02 8.38-8.38a1.3 1.3 0 000-1.82"></path></svg>';

  function dateKey(li) {
    var d = li.querySelector('.UserInfo_date__wr65u');
    var m = d && d.textContent.trim().toLowerCase().match(/^([а-я]+)\s+(\d{4})/);
    return m ? +m[2] * 12 + MONTHS.indexOf(m[1]) : 0;
  }
  function scoreKey(li) {
    var r = li.querySelector('.TotalRating_content__k5u6S');
    return r ? parseFloat(r.textContent.replace(',', '.')) || 0 : 0;
  }

  /* ---------- сортировка ---------- */
  document.querySelectorAll('.HotelReviews_select__F819D').forEach(function (box) {
    var wrap = box.querySelector('.css-dyr6gj-container');
    var field = box.querySelector('.InputBase_fieldContainer__cXJMl');
    var value = box.querySelector('[data-testid="selected-sorting-reviews"]');
    var ind = box.querySelector('.DropdownIndicatorCustom_container__4C7xv');
    var list = box.parentElement.querySelector('.Reviews_reviews__H2KTq');
    if (!wrap || !field || !value) return;
    if (list) [].forEach.call(list.children, function (li, i) { li.dataset.ord = i; });
    var cur = Math.max(0, OPTS.indexOf(value.textContent.trim()));
    var menu = null;

    function render() {
      menu = document.createElement('div');
      menu.className = 'ok-sort-menu';
      menu.innerHTML = '<div class="MenuList_menuList__K2lCr" role="listbox">' + OPTS.map(function (t, i) {
        var sel = i === cur;
        return '<div class="Option_option__TZR9o' + (sel ? ' Option_option_focused__TNuw8' : '') + '" role="option" aria-selected="' + sel + '" data-i="' + i + '">' +
          '<div class="Option_optionCol__GkTTP"><div><span class="Option_label__uqq71' + (sel ? ' Option_label_selected__KRPmM' : '') + '">' + t + '</span>' +
          '<div class="Option_selectIndicator__Lg2cR' + (sel ? ' Option_selectIndicator_selected__fREJO' : '') + '">' + CHECK + '</div></div></div></div>';
      }).join('') + '</div>';
      menu.addEventListener('mouseover', function (e) {
        var o = e.target.closest('.Option_option__TZR9o'); if (!o) return;
        menu.querySelectorAll('.Option_option_focused__TNuw8').forEach(function (x) { x.classList.remove('Option_option_focused__TNuw8'); });
        o.classList.add('Option_option_focused__TNuw8');
      });
      menu.addEventListener('click', function (e) {
        var o = e.target.closest('.Option_option__TZR9o'); if (!o) return;
        e.stopPropagation();
        pick(+o.dataset.i);
      });
      wrap.appendChild(menu);
    }
    function open() { if (menu) return; render(); field.classList.add('ok-sort-open'); if (ind) ind.classList.add('DropdownIndicatorCustom_container_open__lVysJ'); }
    function close() { if (!menu) return; menu.remove(); menu = null; field.classList.remove('ok-sort-open'); if (ind) ind.classList.remove('DropdownIndicatorCustom_container_open__lVysJ'); }
    function pick(i) {
      cur = i; value.textContent = OPTS[i]; close();
      if (!list) return;
      var items = [].slice.call(list.children);
      var by = [
        function (a, b) { return a.dataset.ord - b.dataset.ord; },
        function (a, b) { return dateKey(b) - dateKey(a) || a.dataset.ord - b.dataset.ord; },
        function (a, b) { return scoreKey(b) - scoreKey(a) || a.dataset.ord - b.dataset.ord; },
        function (a, b) { return scoreKey(a) - scoreKey(b) || a.dataset.ord - b.dataset.ord; }
      ][i];
      items.sort(by).forEach(function (li) { list.appendChild(li); });
    }
    field.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); menu ? close() : open(); });
    document.addEventListener('click', function (e) { if (menu && !wrap.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  });

  /* ---------- «Фото гостей»: мок количества (переключатель оболочки ставит html[data-ph]) ----------
     как на проде: в ряд — сколько миниатюр влезает по ширине, на последней — затемнение «+N» (UgcGallery__more) */
  var POOL = ['img/a16eec652f25cfbb.jpeg', 'img/490b063fc6816f49.jpeg', 'img/fb381ed9b33cdce6.jpeg', 'img/d67c877d08fd5fb9.jpeg',
    'img/d6c60e733bb64947.jpeg', 'img/e6fcf73a0aa5a89d.jpeg', 'img/5ba01c9e832a1a3d.jpeg', 'img/8658fcf07069c280.jpeg'];
  var galleries = [].slice.call(document.querySelectorAll('.UgcGallery_UgcGallery__WKIFZ'));
  galleries.forEach(function (g) { var ul = g.querySelector('.UgcGallery_UgcGallery__content__I7MdB'); g._orig = ul ? ul.innerHTML : ''; });
  function thumb(src) {
    return '<li role="menuitem" tabindex="0" class="UgcGallery_UgcGallery__item__yaOoV"><picture class="StorageImage_picture___wpnT StorageImage_picture_loaded__1N1FC">' +
      '<img alt="" loading="lazy" src="' + src + '"></picture></li>';
  }
  function renderPhotos() {
    var n = +document.documentElement.getAttribute('data-ph') || 1;
    galleries.forEach(function (g) {
      var ul = g.querySelector('.UgcGallery_UgcGallery__content__I7MdB'), cnt = g.querySelector('.UgcGallery_UgcGallery__imagesCount__RARQb');
      var wr = g.querySelector('.UgcGallery_UgcGallery__contentWrapper__uu7l5');
      if (!ul) return;
      if (cnt) cnt.textContent = n;
      if (n <= 1) { ul.innerHTML = g._orig; return; }
      var w = wr ? wr.clientWidth : 0;
      if (!w) return;  // шторка закрыта — посчитаем при открытии
      var size = parseFloat(getComputedStyle(ul).getPropertyValue('--thumb-size')) || 88, gap = 4;
      var fit = Math.max(1, Math.floor((w + gap) / (size + gap))), k = Math.min(n, fit);
      var html = '';
      for (var i = 0; i < k; i++) html += thumb(POOL[i % POOL.length]);
      ul.innerHTML = html;
      if (n > k) ul.lastElementChild.insertAdjacentHTML('beforeend', '<div class="UgcGallery_UgcGallery__more__BIHpB">+' + (n - k) + '</div>');
    });
  }
  new MutationObserver(renderPhotos).observe(document.documentElement, { attributes: true, attributeFilter: ['data-ph'] });
  window.addEventListener('resize', renderPhotos);
  window.addEventListener('load', renderPhotos);
  renderPhotos();

  /* ---------- мобилка: шторка отзывов ---------- */
  var mq = window.matchMedia('(max-width: 680px)');
  document.querySelectorAll('.HotelReviews_hotelReviews__i3ZP_').forEach(function (rv) {
    var btn = rv.querySelector('.HotelReviews_button__BkbYT');
    var bg = rv.querySelector('.HotelReviews_background__WRr58');
    if (!btn || !bg) return;
    var ct = bg.querySelector('.HotelReviews_content__ieyas');
    var HID = 'HotelReviews_background_hidden__2cjkO', timer = 0;
    function isOpen() { return !bg.classList.contains(HID) && !bg.classList.contains('ok-rv-off'); }
    function open() {
      if (!mq.matches) return;
      clearTimeout(timer);
      bg.classList.add('ok-rv-off');
      bg.classList.remove(HID);
      if (ct) ct.scrollTop = 0;
      void bg.offsetWidth;
      renderPhotos();
      bg.classList.remove('ok-rv-off');
      document.documentElement.style.overflow = 'hidden';
    }
    function close() {
      if (bg.classList.contains(HID)) return;
      bg.classList.add('ok-rv-off');
      document.documentElement.style.overflow = '';
      timer = setTimeout(function () { bg.classList.add(HID); }, 450);
    }
    btn.addEventListener('click', open);
    bg.addEventListener('click', function (e) {
      if (e.target === bg || e.target.closest('.HotelReviews_closeButton__AkhzH, .HotelReviews_header__JgLYO > button')) close();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen() && mq.matches) close(); });
  });
})();
