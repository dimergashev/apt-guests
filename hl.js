/* «Что понравилось гостям»: блик + обводка + подъём (.a6 .a7 исходника) —
   один прогон, когда блок впервые целиком попал в экран; дальше и по клику не повторяется. */
(function () {
  var card = document.querySelector('#hl .a6');
  if (!card) return;
  function play() { card.classList.add('play'); }
  card.addEventListener('animationend', function (e) { if (e.target === card && e.animationName === 'a7-lift') card.classList.remove('play'); });
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var need = Math.min(e.boundingClientRect.height, window.innerHeight) * .98;
      if (e.isIntersecting && e.intersectionRect.height >= need) { io.disconnect(); play(); }
    });
  }, { threshold: [0, .25, .5, .75, .9, .99, 1] });
  io.observe(card);
})();
