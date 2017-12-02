import React from 'react';
import Carousel from 'nuka-carousel';
import carouselArrows from './components/carouselArrows';

export default () => (
  <Carousel
    decorators={carouselArrows}
    wrapAround
  >
    <img src="https://getuikit.com/docs/images/photo.jpg" />
    <img src="https://getuikit.com/docs/images/dark.jpg" />
    <img src="https://getuikit.com/docs/images/light.jpg" />
  </Carousel>
);
