import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';

import UnlimitedMarqueeItem from './UnlimitedMarqueeItem';


class UnlimitedMarquee extends Component {
  componentDidMount() {
    const { gap, speed } = this.props;
    const heightGap = gap ? gap : 0;
    const scrollSpeed = speed ? speed : 100;
    const scrollContent = document.getElementById('scrollContent');
    const scrollDiv1 = document.getElementById('scrollDiv1');
    const scrollDiv2 = document.getElementById('scrollDiv2');

    function Marquee() {
      // console.log('scrollDiv2.offsetTop=',scrollDiv2.offsetTop)
      // console.log('scrollContent.scrollTop=',scrollContent.scrollTop)
      // console.log('heightGap=',heightGap)
      if (scrollDiv2.offsetTop - scrollContent.scrollTop <= heightGap) {
        scrollContent.scrollTop -= scrollDiv1.offsetHeight;
      }
      scrollContent.scrollTop++;
    }

    let MyMar = setInterval(Marquee, scrollSpeed);
    scrollContent.onmouseover = function StartScroll() {
      clearInterval(MyMar);
    };

    scrollContent.onmouseout = function StopScroll() {
      MyMar = setInterval(Marquee, scrollSpeed);
    };
  }

  setStyle(h, w) {
    return {
      overflow: 'hidden',
      height: h,
      width: w,
    };
  }

  render() {
    const { data, width, height } = this.props;
    const h = height ? height : '100px';
    const w = width ? width : '200px';
    const tableData = data ? data.map((dataItem, index) =>
      <UnlimitedMarqueeItem
        key={index}
        dataItem={dataItem}
      />
    ) : null;

    return (
      <div>
        <div id='scrollContent' style={this.setStyle(h, w)}>
          <div id='scrollDiv1'>
            {tableData}
          </div>
          <div id='scrollDiv2'>
            {tableData}
          </div>
        </div>
      </div>
    );
  }
}

UnlimitedMarquee.propTypes = {
  data: PropTypes.array.isRequired,
  height: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  gap: PropTypes.number,
  speed: PropTypes.number,
}

export default UnlimitedMarquee;
