import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {} from 'antd';
import styles from '../style.less';
import ReactEcharts from 'echarts-for-react';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  // todoList: wordSupervision.todoList,
  // messageList: wordSupervision.messageList,
  // todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
  // messageListLoading: loading.effects['wordSupervision/GetWorkBenchMsg'],
});

const PieChart = props => {
  const { color, title, rate, hideTitle, height, bottom } = props;
  const [currentTodoItem, setCurrentTodoItem] = useState({});

  useEffect(() => {}, []);

  const getOption = () => {
    let _rate = rate === '-' ? 0 : rate;
    let option = {
      color: [color, '#E8E8E8'],
      // animation: false,
      title: {
        show: title ? true : false,
        text: title,
        // textAlign: 'center',
        left: 'center',
        padding: 0,
        bottom: bottom || 6,
        textStyle: {
          fontSize: 14,
          // fontWeight: 'bolder',
          color: 'rgba(0, 0, 0, 0.7)',
        },
      },
      // tooltip: {
      //   show: true,
      //   trigger: 'item',
      //   formatter: '{b}:{d}%',
      //   position: [10, 20],
      // },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: [],
      },
      angleAxis: {
        max: 100,
        show: false,
      },
      series: [
        {
          name: '智能质控',
          type: 'pie',
          radius: ['44%', '56%'],
          top: -30,
          // silent: true,
          avoidLabelOverlap: false,
          hoverAnimation: false,
          silent: true,
          itemStyle: {
            borderRadius: 20,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: function() {
                const label = rate === '-' ? '-' : rate + '%';
                return label;
              },
              textStyle: {
                fontSize: 16,
                color: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
          data: [
            {
              value: _rate,
              name: '核实率',
            },
            {
              value: 100 - _rate,
              name: '未核实率',
            },
          ],
        },
      ],
    };
    return option;
  };

  return (
    <ReactEcharts
      option={getOption()}
      style={{ height: height || 'calc(100% - 40px)', width: '100%' }}
    />
  );
};

export default connect(dvaPropsData)(PieChart);
