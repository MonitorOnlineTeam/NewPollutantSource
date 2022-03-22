import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Row, Col, InputNumber, Select, Button, Popover, message, Table } from 'antd'
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';
import styles from '@/pages/home/index.less';

const { Option } = Select;
const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
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

@connect(({ loading, dataquery, global }) => ({
  co2Loading: loading.effects['dataquery/getCO2SumData'],
  CO2SumData: dataquery.CO2SumData
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
      type: 'dataquery/getCO2SumData',
      payload: {
      },
    });
  }

  getoption = () => {
    const { CO2SumData } = this.props;
    if (CO2SumData.length) {
      console.log('CO2SumData=', CO2SumData)
      let _CO2SumData = CO2SumData.filter(item => item.name.indexOf('企业二氧化碳排放总量(tCO₂)') === -1);
      let legendData = _CO2SumData.map(item => item.name);
      let option = {
        color: ['#fac858', '#ee6666', '#73c0de', '#5470c6', '#91cc75', '#3ba272', '#fc8452', '#9a60b4'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          // data: ['化石燃料燃烧排放量(tCO₂)', '脱硫过程排放量(tCO₂)', '购入使用的电力排放量(tCO₂)', '新增设施排放量(tCO₂)', '既有设施排放量(tCO₂)']
          data: legendData,
        },
        series: [
          {
            name: '排放量来源',
            type: 'pie',
            radius: '70%',
            center: ['50%', '50%'],
            // data: [

            //   { value: CO2SumData[1].value, name: '化石燃料燃烧排放量(tCO₂)' },
            //   { value: CO2SumData[2].value, name: '脱硫过程排放量(tCO₂)' },
            //   { value: CO2SumData[3].value, name: '购入使用的电力排放量(tCO₂)' },
            //   { value: CO2SumData[4].value, name: '新增设施排放量(tCO₂)' },
            //   { value: CO2SumData[5].value, name: '既有设施排放量(tCO₂)' }
            // ],
            data: _CO2SumData,
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
    // if (data.length) {
    if (true) {
      let option = {
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
    return {}
  }


  render() {
    const { CO2SumData, co2Loading } = this.props;
    let itemsData = CO2SumData.filter(item => item.name.indexOf('企业二氧化碳排放总量(tCO₂)') === -1);
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
                <Table style={{ width: '100%' }} columns={columns} dataSource={CO2SumData} loading={co2Loading} pagination={false} />
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