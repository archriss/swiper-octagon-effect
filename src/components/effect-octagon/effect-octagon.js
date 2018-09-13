import Utils from '../../utils/utils';

const Octagon = {
  setTranslate() {
    const swiper = this;
    const {
      $wrapperEl, slides, rtlTranslate: rtl, size: swiperSize,
    } = swiper;
    // Swiper orientation
    const isHorizontal = swiper.isHorizontal();
    // Virtual slides
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    // Wrapper rotation
    let wrapperRotate = 0;

    // Apothem = (sideLength / 2) * (1 / tan(PI / numberOfFaces))
    const apothem = (swiperSize / 2) * (1 / Math.tan(Math.PI / 8));
    const diagonalApothem = apothem / Math.sqrt(2);

    // For each slide
    for (let i = 0; i < slides.length; i += 1) {
      // Slide element
      const $slideEl = slides.eq(i);
      // Slide index
      let slideIndex = i;
      // Check for virtual slide
      if (isVirtual) {
        slideIndex = parseInt($slideEl.attr('data-swiper-slide-index'), 10);
      }
      // Slide angle
      let slideAngle = slideIndex * 360 / 8;
      // Current round of slides
      let round = Math.floor(slideAngle / 360);
      // If right to left
      if (rtl) {
        slideAngle = -slideAngle;
        round = Math.floor(-slideAngle / 360);
      }
      // Slider progress (between 1 and 0)
      const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
      // Translation factors
      let tx = 0;
      let ty = 0;
      let tz = 0;

      // Same default position for every slide
      const originX = -((slideIndex % 8) * swiperSize + (swiperSize * 8 * round));

      if (slideIndex % 8 === 0) {
        // Front slide(s)
        tx = originX;
        tz = apothem;
      } else if (slideIndex % 8 === 1) {
        // Front right slide(s)
        tx = originX + diagonalApothem;
        tz = diagonalApothem;
      } else if (slideIndex % 8 === 2) {
        // Right slide(s)
        tx = originX + apothem;
        tz = 0;
      } else if (slideIndex % 8 === 3) {
        // Back right slide(s)
        tx = originX + diagonalApothem;
        tz = -diagonalApothem;
      } else if (slideIndex % 8 === 4) {
        // Back slide(s)
        tx = originX;
        tz = -apothem;
      } else if (slideIndex % 8 === 5) {
        // Back left slide(s)
        tx = originX - diagonalApothem;
        tz = -diagonalApothem;
      } else if (slideIndex % 8 === 6) {
        // Left slide(s)
        tx = originX - apothem;
        tz = 0;
      } else if (slideIndex % 8 === 7) {
        // Front left slide(s)
        tx = originX - diagonalApothem;
        tz = diagonalApothem;
      }

      if (rtl) {
        // Inverse X translation
        tx = -tx;
      }

      // Vertical translation
      if (!isHorizontal) {
        ty = tx;
        tx = 0;
      }

      // Apply slide transforms
      const transform = `translate3d(${tx}px, ${ty}px, ${tz}px) rotateX(${isHorizontal ? 0 : -slideAngle}deg) rotateY(${isHorizontal ? slideAngle : 0}deg)`;
      // If progress is between -1 and 1
      if (progress <= 1 && progress > -1) {
        // Wrapper rotation in degres
        wrapperRotate = (slideIndex * (360 / 8)) + (progress * (360 / 8));
        if (rtl) wrapperRotate = (-slideIndex * (360 / 8)) - (progress * (360 / 8));
      }
      // Slide transform origin
      $slideEl.css({
        '-webkit-transform-origin': '50% 50% 0px',
        '-moz-transform-origin': '50% 50% 0px',
        '-ms-transform-origin': '50% 50% 0px',
        'transform-origin': '50% 50% 0px',
      });
      // Apply slide transform
      $slideEl.transform(transform);
    }
    // Wrapper transform origin
    $wrapperEl.css({
      '-webkit-transform-origin': '50% 50% 0px',
      '-moz-transform-origin': '50% 50% 0px',
      '-ms-transform-origin': '50% 50% 0px',
      'transform-origin': '50% 50% 0px',
    });

    // Apply wrapper transforms
    $wrapperEl
      .transform(`translate3d(0px,0px,${-apothem}px) rotateX(${swiper.isHorizontal() ? 0 : wrapperRotate}deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`);
  },
  // Slider transition
  setTransition(duration) {
    const swiper = this;
    const { slides } = swiper;
    slides
      .transition(duration);
  },
};

export default {
  name: 'effect-octagon',
  params: {},
  create() {
    const swiper = this;
    Utils.extend(swiper, {
      octagonEffect: {
        setTranslate: Octagon.setTranslate.bind(swiper),
        setTransition: Octagon.setTransition.bind(swiper),
      },
    });
  },
  on: {
    beforeInit() {
      const swiper = this;
      if (swiper.params.effect !== 'octagon') return;
      swiper.classNames.push(`${swiper.params.containerModifierClass}octagon`);
      swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
      const overwriteParams = {
        slidesPerView: 1,
        slidesPerColumn: 1,
        slidesPerGroup: 1,
        watchSlidesProgress: true,
        resistanceRatio: 0,
        spaceBetween: 0,
        centeredSlides: false,
        virtualTranslate: true,
      };
      Utils.extend(swiper.params, overwriteParams);
      Utils.extend(swiper.originalParams, overwriteParams);
    },
    setTranslate() {
      const swiper = this;
      if (swiper.params.effect !== 'octagon') return;
      swiper.octagonEffect.setTranslate();
    },
    setTransition(duration) {
      const swiper = this;
      if (swiper.params.effect !== 'octagon') return;
      swiper.octagonEffect.setTransition(duration);
    },
  },
};
