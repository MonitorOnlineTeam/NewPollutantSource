import { Chart, Geom, Tooltip } from 'bizcharts';
import React from 'react';
import autoHeight from '../autoHeight';
import styles from '../index.less';

const MiniBar = props => {
  const { height = 0, forceFit = true, color = '#1890FF', data = [] } = props;
  const scale = {
    x: {
      type: 'cat',
    },
    y: {
      min: 0,
    },
  };
  const padding = [0, 5, 0, 5];
  const tooltip = [
    'x*y',
    (x, y) => ({
      name: x,
      value: y,
    }),
  ]; // for tooltip not to be hide

  const chartHeight = height + 24;
  return (
    // <div
    //   className={styles.miniChart}
    //   style={{
    //     height: 54,
    //   }}
    // >
    //   <div className={styles.chartContent}>
    <Chart scale={scale} height={48} forceFit={forceFit} data={data} padding={padding}>
      <Tooltip showTitle={false} crosshairs={false} />
      <Geom type="interval" position="x*y" color={color} tooltip={tooltip} />
    </Chart>
    //   </div>
    // </div>
  );
};

export default MiniBar;
