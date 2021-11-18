import React, { PureComponent } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Modal, Form, Row, Col, InputNumber, Select, Button, Popover, message, Table } from 'antd'
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import { getRowCuid } from '@/utils/utils';
import _ from 'lodash';
import ReactEcharts from 'echarts-for-react';
import styles from '@/pages/home/index.less';

const { Option } = Select;
const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
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
        data: ['化石燃料燃烧排放量(tCO₂)', '脱硫过程排放量(tCO₂)', '购入使用的电力排放量(tCO₂)', '新增设施排放量(tCO₂)', '既有设施排放量(tCO₂)']
      },
      series: [
        {
          name: '排放量来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
           
            { value: CO2SumData[1].value, name: '化石燃料燃烧排放量(tCO₂)' },
            { value: CO2SumData[2].value, name: '脱硫过程排放量(tCO₂)' },
            { value: CO2SumData[3].value, name: '购入使用的电力排放量(tCO₂)' },
            { value: CO2SumData[4].value, name: '新增设施排放量(tCO₂)' },
            { value: CO2SumData[5].value, name: '既有设施排放量(tCO₂)' }
          ],
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



  render() {
    const { CO2SumData, co2Loading } = this.props;

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
          <Table columns={columns} dataSource={CO2SumData} loading={co2Loading} showHeader={false} />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;