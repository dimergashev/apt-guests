/* «Вооооот это вас удивит» (вариант F): блик + обводка + подъём (.a6 .a7 исходника),
   один прогон по клику и при появлении блока целиком. */
(function () {
  var card = document.querySelector('#hl .a6');
  if (!card) return;
  function play() { card.classList.remove('play'); void card.offsetWidth; card.classList.add('play'); }
  card.addEventListener('click', play);
  card.addEventListener('animationend', function (e) { if (e.target === card && e.animationName === 'a7-lift') card.classList.remove('play'); });
  if ('IntersectionObserver' in window) {
    var armed = true;
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var need = Math.min(e.boundingClientRect.height, window.innerHeight) * .98;
        if (e.isIntersecting && e.intersectionRect.height >= need) { if (armed) { armed = false; play(); } }
        else if (!e.isIntersecting) armed = true;
      });
    }, { threshold: [0, .25, .5, .75, .9, .99, 1] }).observe(card);
  }
})();
