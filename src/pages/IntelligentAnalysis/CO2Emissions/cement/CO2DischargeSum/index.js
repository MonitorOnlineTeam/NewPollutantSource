import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Table } from 'antd'
import { connect } from 'dva';
import _ from 'lodash';
import ReactEcharts from 'echarts-for-react';
import styles from '@/pages/home/index.less';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
  },
];

@connect(({ loading, CO2Emissions, global }) => ({
  co2Loading: loading.effects['dataquery/getCementCO2Sum'],
  cementCO2Sum: CO2Emissions.cementCO2Sum
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'CO2Emissions/getCementCO2Sum',
      payload: {
      },
    });
  }

  getoption = () => {
    const { cementCO2Sum } = this.props;
    if (cementCO2Sum.length) {
      let _cementCO2Sum = cementCO2Sum.filter(item => item.name.indexOf('温室气体排放总量') === -1);
      let legendData = _cementCO2Sum.map(item => item.name);
      let option = {
        title: {
          text: '排放量汇总',
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: legendData
        },
        series: [
          {
            name: '排放量来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: _cementCO2Sum,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      return option;
    }
    return {}
  }

  render() {
    const { cementCO2Sum, co2Loading } = this.props;

    return (
      <BreadcrumbWrapper>
        <Card>
          <div className={styles.echartBox}>
            <ReactEcharts
              option={this.getoption()}
              className="echarts-for-echarts"
              theme="my_theme"
              style={{
                width: '100%',
                height: 'calc(100vh - 460px)',
                maxHeight: 330,
                // height:130
              }}
            />
          </div>
          <Table columns={columns} dataSource={cementCO2Sum} loading={co2Loading} showHeader={false} />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;