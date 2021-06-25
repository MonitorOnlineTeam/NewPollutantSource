// import numeral from 'numeral';
import Bar from './Bar';
import ChartCard from './ChartCard';
import Field from './Field';
import Gauge from './Gauge';
import MiniArea from './MiniArea';
import MiniBar from './MiniBar';
import MiniProgress from './MiniProgress';
import Pie from './Pie';
import TagCloud from './TagCloud';
import WaterWave from './WaterWave';

// const yuan = val => `¥ ${numeral(val).format('0,0')}`;

const Charts = {
  Bar,
  Pie,
  Gauge,
  MiniBar,
  MiniArea,
  MiniProgress,
  ChartCard,
  Field,
  WaterWave,
  TagCloud,
};
export {
  Charts as default,
  Bar,
  Pie,
  Gauge,
  MiniBar,
  MiniArea,
  MiniProgress,
  ChartCard,
  Field,
  WaterWave,
  TagCloud,
};
