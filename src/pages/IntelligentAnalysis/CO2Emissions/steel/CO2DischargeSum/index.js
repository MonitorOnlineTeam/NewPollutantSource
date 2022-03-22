import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Table, Row, Col } from 'antd'
import { connect } from 'dva';
import _ from 'lodash';
import ReactEcharts from 'echarts-for-react';
import styles from '@/pages/home/index.less';

const columns = [
  {
    title: '核算边界',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '排放量(tCO₂)',
    dataIndex: 'value',
    key: 'value',
  },
];

@connect(({ loading, CO2Emissions, global }) => ({
  co2Loading: loading.effects['dataquery/getSteelCO2Sum'],
  steelCO2Sum: CO2Emissions.steelCO2Sum
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
      type: 'CO2Emissions/getSteelCO2Sum',
      payload: {
      },
    });
  }

  getoption = () => {
    const { steelCO2Sum } = this.props;
    if (steelCO2Sum.length) {
      let _steelCO2Sum = steelCO2Sum.filter(item => item.name.indexOf('温室气体排放总量') === -1);
      let legendData = _steelCO2Sum.map(item => item.name);
      let option = {
        color: ['#fac858', '#ee6666', '#73c0de', '#5470c6', '#91cc75', '#3ba272', '#fc8452', '#9a60b4'],
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
            radius: '70%',
            center: ['50%', '50%'],
            data: _steelCO2Sum,
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

  getKindOption = (item) => {
    let option = {
      // color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
      color: ['#fac858', '#ee6666', '#73c0de', '#5470c6', '#91cc75', '#3ba272', '#fc8452', '#9a60b4'],

      title: {
        text: item.name,
        subtext: '',
        left: 'center',
        textStyle: {
          fontWeight: 'normal',
        }
      },
      tooltip: {
        trigger: 'item',
        // alwaysShowContent: true,
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        left: 'left',
        type: 'scroll',
        orient: 'vertical',
      },
      series: [
        {
          name: '排放量',
          type: 'pie',
          radius: ['40%', '55%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: item.data
        }
      ]
    };
    return option;
  }

  render() {
    const { steelCO2Sum, co2Loading } = this.props;
    let itemsData = steelCO2Sum.filter(item => item.name.indexOf('温室气体排放总量') === -1);
    return (
      <div id="autoHeight">
        <BreadcrumbWrapper>
          <Card title={<div style={{ textAlign: 'center', marginTop: '-8px' }}>排放量汇总</div>} bodyStyle={{ padding: '10px 20px' }}>
            <Row justify='center'>
              <Col span={12}>
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
              </Col>
              <Col span={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                <Table style={{ width: '100%' }} columns={columns} dataSource={steelCO2Sum} loading={co2Loading} pagination={false} />
              </Col>
            </Row>
          </Card>
          <Row style={{ marginTop: 8, }} gutter={[8, 8]}>
            {
              itemsData.map(item => {
                return <Col className="gutter-row" span={itemsData.length % 3 === 0 ? 8 : (itemsData.length % 4 === 0 ? 6 : 8)}>
                  <Card>
                    <ReactEcharts
                      option={this.getKindOption(item)}
                      className="echarts-for-echarts"
                      theme="my_theme"
                    />
                  </Card>
                </Col>
              })
            }
          </Row>
        </BreadcrumbWrapper>
      </div>
    );
  }
}

export default index;