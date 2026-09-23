document.addEventListener('DOMContentLoaded', () => {

  // Ano no rodapé
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Menu mobile
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      nav.classList.toggle('active');
    });

    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        nav.classList.remove('active');
      });
    });
  }

  // Header: transparente sobre o hero, sólido ao rolar
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Scroll reveal
  const revealTargets = document.querySelectorAll(
    '.card, .tech-tile, .testimonial, .about__content, .about__media, .section__head, .info-item, .contact__map, .reel-card'
  );
  revealTargets.forEach(el => el.setAttribute('data-reveal', ''));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  // ---------------------------------------------------------------------
  // Reels: autoplay mudo ao entrar na tela, play/pause manual e áudio
  // ---------------------------------------------------------------------
  const reelCards = document.querySelectorAll('[data-reel]');

  reelCards.forEach(card => {
    const video = card.querySelector('.reel-card__video');
    const soundBtn = card.querySelector('[data-sound-toggle]');
    const playBtn = card.querySelector('[data-play-toggle]');
    const soundIcon = soundBtn.querySelector('i');
    const playIcon = playBtn.querySelector('i');
    let userPaused = false;

    const loadSrc = () => {
      if (!video.src && video.dataset.src) {
        video.src = video.dataset.src;
      }
    };

    const play = () => {
      loadSrc();
      video.play().then(() => {
        card.classList.add('is-playing');
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
      }).catch(() => {});
    };

    const pause = () => {
      video.pause();
      card.classList.remove('is-playing');
      playIcon.classList.remove('fa-pause');
      playIcon.classList.add('fa-play');
    };

    // Autoplay mudo quando o card entra na tela
    const playObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !userPaused) {
          play();
        } else if (!entry.isIntersecting) {
          pause();
        }
      });
    }, { threshold: 0.55 });
    playObserver.observe(card);

    // Toggle play/pause manual
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        userPaused = false;
        play();
      } else {
        userPaused = true;
        pause();
      }
    });

    card.addEventListener('click', () => {
      if (video.paused) {
        userPaused = false;
        play();
      } else {
        userPaused = true;
        pause();
      }
    });

    // Ativar/desativar áudio (silencia os demais reels)
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willUnmute = video.muted;

      reelCards.forEach(otherCard => {
        const otherVideo = otherCard.querySelector('.reel-card__video');
        const otherSoundBtn = otherCard.querySelector('[data-sound-toggle]');
        const otherSoundIcon = otherSoundBtn.querySelector('i');
        otherVideo.muted = true;
        otherSoundBtn.classList.remove('is-unmuted');
        otherSoundIcon.classList.remove('fa-volume-high');
        otherSoundIcon.classList.add('fa-volume-xmark');
      });

      if (willUnmute) {
        video.muted = false;
        soundBtn.classList.add('is-unmuted');
        soundIcon.classList.remove('fa-volume-xmark');
        soundIcon.classList.add('fa-volume-high');
        loadSrc();
        play();
      }
    });
  });

});
