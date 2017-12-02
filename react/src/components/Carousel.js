import React, { Component } from 'react';
import Slider from 'react-slick';
import { map as _map } from 'lodash';

function CarouselArrow(props) {
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
}

function getArrowProperties(size) {
  const arrowProps = {};

  switch (size) {
    case 'large': {
      arrowProps.width = 18;
      arrowProps.height = 34;
      arrowProps.viewBox = '0 0 18 34';
      arrowProps.strokeWidth = '1.4';
      arrowProps.leftArrowPoints = '17 1 1 17 17 33';
      arrowProps.rightArrowPoints = '1 1 17 17 1 33';
      break;
    }

    default: {
      arrowProps.width = 11;
      arrowProps.height = 20;
      arrowProps.viewBox = '0 0 11 20';
      arrowProps.strokeWidth = '1.2';
      arrowProps.leftArrowPoints = '10 1 1 10 10 19';
      arrowProps.rightArrowPoints = '1 1 10 10 1 19';
    }
  }

  return arrowProps;
}

export default (props) => {
  const {
    width, height, viewBox, strokeWidth, leftArrowPoints, rightArrowPoints,
  } = getArrowProperties(props.size);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 1,
    prevArrow: (
      <CarouselArrow>
        <svg
          xmlns="http://www.w3.org/2000/svg" width={width} height={height}
          viewBox={viewBox} icon="slidenav-previous" ratio="1"
          style={{
            filter: 'drop-shadow( 1px 0px 1px #ccc )',
            marginLeft: '10px',
          }}
        >
          <polyline
            fill="none" stroke="#000" strokeWidth={strokeWidth}
            points={leftArrowPoints}
          />
        </svg>
      </CarouselArrow>
    ),
    nextArrow: (
      <CarouselArrow>
        <svg
          xmlns="http://www.w3.org/2000/svg" width={width} height={height}
          viewBox={viewBox} icon="slidenav-next" ratio="1"
          style={{
            filter: 'drop-shadow( 1px 0px 1px #ccc )',
            marginRight: '10px',
          }}
        >
          <polyline
            fill="none" stroke="#000" strokeWidth={strokeWidth}
            points={rightArrowPoints}
          />
        </svg>
      </CarouselArrow>
    ),
  };

  return (
    <Slider {...settings}>
      {
        _map(props.photos, (photo, index) => (
          <div
            className="ratio16_9"
            key={index}
          >
            <img
              src={photo}
              alt=""
            />
          </div>
        ))
      }
    </Slider>
  );
};
