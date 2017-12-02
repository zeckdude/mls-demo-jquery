import LeftArrow from './LeftArrow';
import RightArrow from './RightArrow';

export default [
  {
    component: LeftArrow,
    position: 'CenterLeft',
    style: {
      padding: 20,
    },
  },
  {
    component: RightArrow,
    position: 'CenterRight',
    style: {
      padding: 20,
    },
  },
];


// import React from 'react';
// import LeftArrow from './LeftArrow';
// import RightArrow from './RightArrow';
//
// export default [
//   {
//     component: <LeftArrow />,
//   },
//   {
//     component: <RightArrow />,
//   },
// ];
//
//
//
// export default [{
//   component: class LeftArrow extends Component {
//     render() {
//       console.log('rendering arrow left');
//       return (
//         <div
//           style={this.styleArrow(this.props.currentSlide === 0)}
//           onClick={this.props.previousSlide}
//         >
//                     Previous Slide
//         </div>
//       );
//     }
//     shouldComponentUpdate() { return this.props.currentSlide === 0; }
//     styleArrow(disabled) { return { opacity: disabled ? 0 : 1 }; }
//   },
// }, {
//   component: class RightArrow extends Component {
//     render() {
//       console.log('rendering arrow right');
//       return (
//         <div
//           style={this.styleArrow(this.props.currentSlide === this.props.slideCount - 1)}
//           onClick={this.props.nextSlide}
//         >
//                     Next Slide
//         </div>
//       );
//     }
//     shouldComponentUpdate() { return this.props.currentSlide === this.props.slideCount - 1; }
//     styleArrow(disabled) { return { opacity: disabled ? 0 : 1 }; }
//   },
// }];
