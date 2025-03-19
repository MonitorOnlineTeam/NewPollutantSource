import React, { useRef, useState } from 'react';
import { Tooltip } from 'antd';

const FullscreenToggle = props => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { style } = props;

  const toggleFullscreen = () => {
    let container = document.documentElement;
    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.mozRequestFullScreen) {
        // Firefox
        container.mozRequestFullScreen();
      } else if (container.webkitRequestFullscreen) {
        // Chrome, Safari, Opera
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        // IE/Edge
        container.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari, Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div style={{ width: 24, height: 24, cursor: 'pointer', ...style }} onClick={toggleFullscreen}>
      {!isFullscreen ? (
        <Tooltip placement="bottom" title={'全屏展示'}>
          <img src="/SystemDashboard/FullScreen.png" />
        </Tooltip>
      ) : (
        <Tooltip placement="bottom" title={'退出全屏'}>
          <img src="/SystemDashboard/unFullScreen.png" />
        </Tooltip>
      )}
    </div>
  );
};

FullscreenToggle.defaultProps = {
  style: {},
};

export default FullscreenToggle;
