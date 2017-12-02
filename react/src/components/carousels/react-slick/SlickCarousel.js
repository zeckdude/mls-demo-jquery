import React from 'react';
import Slider from 'react-slick';

const CarouselArrow = (props) => {
  const { style, onClick } = props;
  const positionClassName = props.className.includes('next') ? 'uk-position-center-right' : 'uk-position-center-left';
  return (
    <div
      className={`uk-slidenav uk-icon ${positionClassName}`}
      style={{ display: 'block' }}
      onClick={onClick}
    >
      {props.children}
    </div>
  );
};

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  prevArrow: (
    <CarouselArrow>
      <svg
        xmlns="http://www.w3.org/2000/svg" width="11" height="20"
        viewBox="0 0 11 20" icon="slidenav-previous" ratio="1"
      >
        <polyline
          fill="none" stroke="#000" strokeWidth="1.2"
          points="10 1 1 10 10 19"
        />
      </svg>
    </CarouselArrow>
  ),
  nextArrow: (
    <CarouselArrow>
      <svg
        xmlns="http://www.w3.org/2000/svg" width="11" height="20"
        viewBox="0 0 11 20" icon="slidenav-next" ratio="1"
      >
        <polyline
          fill="none" stroke="#000" strokeWidth="1.2"
          points="1 1 10 10 1 19"
        />
      </svg>
    </CarouselArrow>
  ),
};

export default () => (
  <Slider {...settings}>
    <img src="https://getuikit.com/docs/images/photo.jpg" alt="" />
    <img src="https://getuikit.com/docs/images/dark.jpg" alt="" />
    <img src="https://getuikit.com/docs/images/light.jpg" alt="" />
  </Slider>
);
