/* Мобилка, нижняя плашка «Цены от … ₽ / за ночь для 2 гостей» (как на проде): нажатие — плавный скролл к «Доступным вариантам»;
   пока карточка тарифа на экране, плашка уезжает вниз (класс прода Price_price_visible снимается — transform .3s). */
(function () {
  var bar = document.getElementById('ok-pb');
  var target = document.querySelector('.ApartmentPage_availability__ezZS_');
  var card = document.querySelector('.ok-avail-rate');
  if (!bar || !target) return;
  bar.querySelector('.ok-pb-btn').addEventListener('click', function () {
    var head = document.querySelector('.MobileHeader_root__AOkf3, header');
    var off = head && getComputedStyle(head).position.match(/fixed|sticky/) ? head.getBoundingClientRect().height : 0;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - off - 8, behavior: 'smooth' });
  });
  function sync() {
    if (!card) return;
    var r = card.getBoundingClientRect();
    var onScreen = r.bottom > 0 && r.top < window.innerHeight - 40;
    bar.classList.toggle('Price_price_visible__6xvU9', !onScreen);
  }
  window.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  sync();
})();
