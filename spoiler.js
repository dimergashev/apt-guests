/* «Развернуть отзыв» (отзывы) и «Развернуть описание» (Об апартаментах): текст обрезан на 3 строках с многоточием,
   по клику раскрывается целиком, кнопка становится «Свернуть …», стрелка переворачивается (класс прода Spoiler_arrowIcon_open).
   У отзыва на проде полный текст подгружается — здесь хвост оборванной фразы дописан моком (data-more). */
(function () {
  document.querySelectorAll('.Review_spoiler__yTHKo').forEach(function (sp) {
    var box = sp.parentElement.querySelector('.Review_description__EIH6j'), btn = sp.querySelector('button');
    if (!box || !btn) return;
    var last = box.querySelector('p:last-child'), tail = document.createElement('span');
    tail.className = 'ok-rv-more'; tail.textContent = ' чем договаривались, всё показали и рассказали. С удовольствием остановимся здесь снова.';
    if (last && /,\s*$/.test(last.textContent)) { last.textContent = last.textContent.replace(/\s+$/, ''); last.appendChild(tail); }
    box.classList.add('ok-clamp');
    var label = btn.lastChild, icon = btn.querySelector('svg');
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      var open = box.classList.toggle('ok-open');
      label.textContent = open ? 'Свернуть отзыв' : 'Развернуть отзыв';
      icon.classList.toggle('Spoiler_arrowIcon_open__KfGsh', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.querySelectorAll('.About_spoiler___Pkl4').forEach(function (btn) {
    var box = btn.parentElement.querySelector('.About_descriptionWrapper__1kb5E');
    if (!box) return;
    var t0 = btn.textContent.trim();
    btn.addEventListener('click', function () {
      var open = box.classList.toggle('About_descriptionWrapper_isExpanded___Ssbt');
      btn.textContent = open ? 'Свернуть описание' : t0;
    });
  });
})();

/* «Что вокруг» и др. на мобилке: раскрытие списка по тапу на строку (высота — grid-rows 0fr → 1fr в guests.css),
   стрелка — класс прода Pois_titleArrow_opened */
(function () {
  document.querySelectorAll('.Pois_pois__1PO_m').forEach(function (box) {
    var btn = box.querySelector('.Pois_title__dGnze'), body = box.querySelector('.ok-poi-body');
    if (!btn || !body) return;
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      var open = box.classList.toggle('ok-open');
      btn.setAttribute('aria-expanded', String(open));
      var ar = btn.querySelector('.Pois_titleArrow__q_NZ1');
      if (ar) ar.classList.toggle('Pois_titleArrow_opened__OtNE7', open);
    });
  });
})();
