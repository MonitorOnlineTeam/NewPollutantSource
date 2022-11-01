import React, { Component } from 'react';
import {
  Card,
  Divider,
  Badge,
  Radio,
  Tag,
} from 'antd';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import SdlTable from '@/components/SdlTable';
import styles from './index.less';

@connect(({ loading, overview, global }) => ({
  electricViewData: overview.electricViewData,
  dataLoading: loading.effects['overview/getElectricRealTimeDataView'],
}))

class ElectricDataView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 1,
      pageSize: 20,
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 50,
          align: 'center',
          render: (value, record, index) => index + 1,
        },
        {
          title: '企业',
          dataIndex: 'EntName',
          width: 210,
          key: 'EntName',
        },
        {
          title: '行政区域',
          dataIndex: 'RegionName',
          key: 'RegionName',
          width: 180,
          // width: 120,
          align: 'center',
        },
        {
          title: '行业',
          width: 200,
          dataIndex: 'IndustryTypeName',
          key: 'IndustryTypeName',
          align: 'center',
          render: (text, record, index) => {
            return text || '-'
          }
        },
        // {
        //   title: '停限产',
        //   width: 140,
        //   dataIndex: 'stopStatus',
        //   key: 'stopStatus',
        //   align: 'center',
        //   render: (value, record, index) => {
        //     return value === 1 ? <Badge status="success" text="无计划" /> : <Badge status="default" text="失联" />
        //   }
        // },
        // {
        //   title: '治污设施',
        //   width: 140,
        //   dataIndex: 'facilityStatus',
        //   key: 'facilityStatus',
        //   align: 'center',
        //   render: (value, record, index) => {
        //     return value === 1 ? <Badge status="success" text="正常" /> : <Badge status="default" text="失联" />
        //   }
        // },
        {
          title: '电能点位数量',
          dataIndex: 'PointCount',
          width: 210,
          key: 'PointCount',
        },
        // {
        //   title: '总表',
        //   dataIndex: 'SummaryNum',
        //   key: 'SummaryNum',
        //   width: 210,
        // },
        {
          title: '点位状态',
          children: [
            {
              title: '运行',
              dataIndex: 'RunningNum',
              key: 'RunningNum',
              align: 'center',
              width: 140,
              render: (value, record, index) => {
                return <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{value}</span>
                return <Badge status="success" text={value} />
              }
            },
            // {
            //   title: '停机',
            //   dataIndex: 'stopNum',
            //   key: 'stopNum',
            //   align: 'center',
            //   render: (value, record, index) => {
            //     return <span style={{ color: '#faad14', fontWeight: 'bold' }}>{value}</span>
            //     return <Badge status="success" text={value} />
            //   }
            // },
            {
              title: '离线',
              dataIndex: 'OffLineNum',
              key: 'OffLineNum',
              align: 'center',
              width: 140,
              render: (value, record, index) => {
                return <span style={{ color: '#999999', fontWeight: 'bold' }}>{value}</span>
                return <Badge status="success" text={value} />
              }
            }
          ]
        },
      ]
    };
  }

  componentDidMount() {
    this.getPageData();
  }

  getPageData = () => {
    const { pageIndex, pageSize } = this.state;
    this.props.dispatch({
      type: 'overview/getElectricRealTimeDataView',
      payload: {
        pageIndex: pageIndex,
        pageSize: pageSize
      }
    })
  }

  onTableChange = (pageIndex, pageSize) => {
    const { electricViewData } = this.props;
    this.setState({ pageSize, pageIndex }, () => {
      this.getPageData();
    })
  };

  render() {
    const { columns, pageSize, pageIndex } = this.state;
    const { dataLoading, electricViewData } = this.props;
    console.log('electricViewData=', electricViewData);
    return (
      <BreadcrumbWrapper title="实时监控">
        <Card
          title={
            <>
              <div style={{ fontWeight: 'normal', fontSize: '14px', lineHeight: '32px' }}>
                <Badge status="success" text="当前在线企业：" /> <Badge showZero overflowCount={999} count={electricViewData.OnLineCount + ''} style={{ backgroundColor: '#52c41a' }} />
                <Divider type="vertical" />
                {/* <Badge color='#999' text="当前失联企业：" /> <Badge showZero count={3} style={{ backgroundColor: '#999999' }} /> */}
                {/* <Divider type="vertical" /> */}
                {/* <Badge status="success" text="当前在线设备：" /> <Badge showZero count={31} style={{ backgroundColor: '#52c41a' }} /> */}
                {/* <Divider type="vertical" /> */}
                <Badge color='#999' text="当前离线设备：" /> <Badge showZero overflowCount={999} count={electricViewData.OffLineCount} style={{ backgroundColor: '#999999' }} />
                <Divider type="vertical" />
                {/* <Badge status='warning' text="当前停机设备：" /> <Badge showZero count={8} style={{ backgroundColor: '#faad14' }} /> */}
                {/* <Divider type="vertical" /> */}
                <Badge status="success" text="当前在线率：" /> <Badge showZero overflowCount={999} count={electricViewData.OneLineRate} style={{ backgroundColor: '#52c41a' }} />
              </div>
            </>
          }
        // extra={
        //   <Radio.Group defaultValue="data">
        //     <Radio.Button value="data">数据</Radio.Button>
        //     <Radio.Button value="map">地图</Radio.Button>
        //   </Radio.Group>
        // }
        >
          <SdlTable
            loading={dataLoading}
            pagination={{
              total: electricViewData.Total,
              pageSize: pageSize,
              current: pageIndex,
              onChange: this.onTableChange,
            }}
            dataSource={electricViewData.EntList}
            columns={columns}
          />
        </Card >
      </BreadcrumbWrapper >
    );
  }
}

export default ElectricDataView;
