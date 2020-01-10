import { Popover, Badge } from 'antd';

export const airLevel = [
  {
    color: '#00e400',
    text: '优',
    value: 1,
    standardValue: 0,
    status: 4,
    levelText: '一级',
  },
  {
    // color: "#ffff00",
    color: '#f3dd22',
    text: '良',
    value: 2,
    standardValue: 50,
    status: 5,
    levelText: '二级',
  },
  {
    color: '#ff7e00',
    text: '轻度污染',
    value: 3,
    standardValue: 100,
    status: 6,
    levelText: '三级',
  },
  {
    color: '#ff0000',
    text: '中度污染',
    value: 4,
    standardValue: 150,
    status: 7,
    levelText: '四级',
  },
  {
    color: '#99004c',
    text: '重度污染',
    value: 5,
    standardValue: 200,
    status: 8,
    levelText: '五级',
  },
  {
    color: '#7e0023',
    text: '严重污染',
    value: 6,
    standardValue: 300,
    status: 9,
    levelText: '六级',
  },
  {
    color: '#3c0011',
    text: '爆表',
    value: 7,
    standardValue: '≥500',
    status: 10,
    levelText: '七级',
  },
];

export const AQIPopover = (text, record) => {
  const color = record['AQI_Color'];
  return (
    <Popover
      content={
        <div>
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontWeight: 'Bold', fontSize: 16 }}>
              空气质量：<span style={{ color: color }}>{record.AirQuality}</span>
            </span>
          </div>
          {record.PrimaryPollutant !== undefined && (
            <li style={{ listStyle: 'none', marginBottom: 10 }}>
              <Badge color={color} text={`首要污染物：${record.PrimaryPollutant || '-'}`} />
            </li>
          )}
          <li style={{ listStyle: 'none', marginBottom: 10 }}>
            <Badge color={color} text={`污染级别：${record.AirLevel}`} />
          </li>
        </div>
      }
      trigger="hover"
    >
      <span style={{ color: color }}>{text !== undefined ? text : '-'}</span>
    </Popover>
  );
};

export const IAQIPopover = (text, record, field) => {
  const level = record[field + '_Level'] + '级';
  const airLevelObj = airLevel.find(itm => itm.levelText == level) || {};
  const airQuality = airLevelObj.text;
  const color = record[field + '_LevelColor'];
  return (
    <Popover
      content={
        <div>
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontWeight: 'Bold', fontSize: 16 }}>
              空气质量：<span style={{ color: color }}>{airQuality}</span>
            </span>
          </div>
          <li style={{ listStyle: 'none', marginBottom: 10 }}>
            <Badge color={color} text={`污染级别：${record[field + '_Level']}级`} />
          </li>
          <li style={{ listStyle: 'none', marginBottom: 10 }}>
            <Badge color={color} text={`IAQI：${record[field + '_Value']}`} />
          </li>
        </div>
      }
      trigger="hover"
    >
      <span style={{ color: color }}>{text}</span>
    </Popover>
  );
};

// 1. #00e400
// 2. #ffff00
// 3. #ff7e00
// 4. #ff0000
// 5. #99004c
// 6. #7e0023
// 7. #3c0011
