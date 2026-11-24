/* Тариф: общее состояние оплаты для всех копий компонента (сайдбар десктопа, тариф в странице, шторка),
   итог пересчитывается (+480 ₽ за отложенную оплату); на мобилке — нижняя плашка (видна всегда) и шторка «Условия бронирования». */
(function () {
  var NB = ' ', NN = ' ';
  var fmt = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NB) + NN + '₽'; };
  var PAY = {
    'now_card:true': { label: 'Оплата сейчас', total: 64350, striked: 71500 },
    'delayed_card:false': { label: 'Оплата позже', total: 64830, striked: 71980 }
  };
  var radios = function () { return document.querySelectorAll('.RateOptionsSelection_radioGroup__YlJ1W input[type=radio]'); };

  function set(v) {
    var p = PAY[v]; if (!p) return;
    radios().forEach(function (r) { r.checked = r.value === v; r.classList.toggle('InputRadio_input_checked__RPMA6', r.checked); });
    document.querySelectorAll('.Price_amount__3n9_A, [data-price=total]').forEach(function (e) { e.textContent = fmt(p.total); });
    document.querySelectorAll('.Price_strikedPrice__m6yf_, [data-price=striked]').forEach(function (e) { e.textContent = fmt(p.striked); });
    document.querySelectorAll('[data-pay-label]').forEach(function (e) { e.textContent = p.label; });
  }
  radios().forEach(function (r) { r.addEventListener('change', function () { if (r.checked) set(r.value); }); });

  /* шторка — SwipeablePopup прода, как «Все удобства»: transition 0.5s у фона (opacity → 0.7) и обёртки (translateY),
     закрытие — фон, крестик, Esc или смахивание вниз за ручку/содержимое */
  var sh = document.getElementById('ok-rsheet');
  if (!sh) return;
  var bg = sh.querySelector('.SwipeablePopup_background__LC28a'), wr = sh.querySelector('.SwipeablePopup_wrapper__3cvKt'),
      ct = sh.querySelector('.SwipeablePopup_content___Z3pl'), T = 'transform 0.5s', O = 'opacity 0.5s', timer;
  function open() {
    clearTimeout(timer);
    sh.hidden = false;
    bg.style.transition = O; wr.style.transition = T;
    bg.style.opacity = '0'; wr.style.transform = 'translateY(100%)';
    wr.getBoundingClientRect();  // старт анимации с исходного положения
    bg.style.opacity = '0.7'; wr.style.transform = 'translateY(0px)';
    document.documentElement.style.overflow = 'hidden';
  }
  function close() {
    bg.style.transition = O; wr.style.transition = T;
    bg.style.opacity = '0'; wr.style.transform = 'translateY(100%)';
    document.documentElement.style.overflow = '';
    timer = setTimeout(function () { sh.hidden = true; }, 500);
  }
  // смахивание вниз: тянется за пальцем, отпустили дальше 25% высоты (или быстро) — закрываем, иначе возвращаем
  var y0 = null, t0 = 0, dy = 0;
  wr.addEventListener('touchstart', function (e) {
    if (ct.scrollTop > 0 && !e.target.closest('.SwipeablePopup_bar__P0oP_')) return;
    y0 = e.touches[0].clientY; t0 = Date.now(); dy = 0; wr.style.transition = 'none';
  }, { passive: true });
  wr.addEventListener('touchmove', function (e) {
    if (y0 === null) return;
    dy = Math.max(0, e.touches[0].clientY - y0);
    wr.style.transform = 'translateY(' + dy + 'px)';
    bg.style.transition = 'none'; bg.style.opacity = String(0.7 * (1 - dy / wr.offsetHeight));
  }, { passive: true });
  wr.addEventListener('touchend', function () {
    if (y0 === null) return; y0 = null;
    if (dy > wr.offsetHeight * 0.25 || (dy > 40 && dy / (Date.now() - t0) > 0.5)) close();
    else { wr.style.transition = T; bg.style.transition = O; wr.style.transform = 'translateY(0px)'; bg.style.opacity = '0.7'; }
  });
  document.querySelectorAll('.ok-sb-cond, .ok-sb-price, .ok-price-details').forEach(function (b) { b.addEventListener('click', open); });
  sh.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', close); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sh.hidden) close(); });
})();
