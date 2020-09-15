import React, { PureComponent } from 'react';
import { Card, Anchor, Row, Col, Descriptions, Divider, Empty, Tag } from 'antd'
import { connect } from 'dva'
import SdlMap from '@/pages/AutoFormManager/SdlMap'
import styles from './index.less'
import SdlTable from "@/components/SdlTable"
import PageLoading from '@/components/PageLoading'

const { Link } = Anchor;

@connect(({ components, loading }) => ({
  siteData: components.siteData,
  pointInstrumentList: components.pointInstrumentList,
  pollutantByDgimnList: components.pollutantByDgimnList,
  loading: loading.effects["components/getSiteInfo"]
}))
class index extends PureComponent {
  state = {
    columns: [
      {
        title: '仪器',
        dataIndex: 'Name',
        key: 'Name',
      },
      {
        title: '仪器厂家',
        dataIndex: 'Factory',
        key: 'Factory',
      },
      {
        title: '分析方法',
        dataIndex: 'Method',
        key: 'Method',
      },
      {
        title: '检测项目',
        dataIndex: 'MonitorItem',
        key: 'MonitorItem',
      }
    ],
    pollutantColumns: [
      {
        title: '污染物名称',
        dataIndex: 'PollutantName',
        key: 'PollutantName',
      },
      {
        title: '单位',
        dataIndex: 'Unit',
        key: 'Unit',
      },
      {
        title: '报警类型',
        dataIndex: 'AlarmType',
        key: 'AlarmType',
        render: (text, record) => {
          if (text === 0) {
            return (
              <span>
                {' '}
                <Tag> 无报警 </Tag>{' '}
              </span>
            );
          }
          if (text === 1) {
            return (
              <span>
                {' '}
                <Tag color="green"> 上限报警 </Tag>{' '}
              </span>
            );
          }
          if (text === 2) {
            return (
              <span>
                {' '}
                <Tag color="cyan"> 下线报警 </Tag>{' '}
              </span>
            );
          }
          if (text === 3) {
            return (
              <span>
                {' '}
                <Tag color="lime"> 区间报警 </Tag>{' '}
              </span>
            );
          }
        },
      },
      {
        title: '检出上限',
        dataIndex: 'AbnormalUpperLimit',
        key: 'AbnormalUpperLimit',
      },
      {
        title: '检出下限',
        dataIndex: 'AbnormalLowerLimit',
        key: 'AbnormalLowerLimit',
      },
      {
        title: '标准值',
        dataIndex: 'StandardValue',
        key: 'StandardValue',
      }
    ]
  }

  componentDidMount() {
    this.getSiteInfo();
    this.getPointInstrument();
    this.getPollutantByDgimn();
  }

  // 获取站点详情
  getSiteInfo = () => {
    this.props.dispatch({
      type: "components/getSiteInfo",
      payload: {
        DGIMN: this.props.DGIMN
      }
    })
  }

  // 获取仪器信息
  getPointInstrument = () => {
    this.props.dispatch({
      type: "components/getPointInstrument",
      payload: {
        DGIMN: this.props.DGIMN
      }
    })
  }

  // 获取污染物信息
  getPollutantByDgimn = () => {
    this.props.dispatch({
      type: "components/getPollutantByDgimn",
      payload: {
        DGIMN: this.props.DGIMN
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.DGIMN !== prevProps.DGIMN) {
      this.getSiteInfo();
      this.getPointInstrument();
      this.getPollutantByDgimn();
    }
  }

  render() {
    const { columns, pollutantColumns } = this.state;
    const { loading, siteData, pointInstrumentList, pollutantByDgimnList } = this.props;
    if (loading) {
      return <PageLoading />
    }
    return (
      <Card title="排口详情" ref={(div) => { this.div = div }}>
        <Row>
          <Col flex="1" id="container">
            <Descriptions id="basic" title="基本信息" column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
              <Descriptions.Item label="所属企业">{siteData.ParentName}</Descriptions.Item>
              <Descriptions.Item label="所属行业">{siteData.AutoMonitorInstrument}</Descriptions.Item>
              <Descriptions.Item label="站点名称">{siteData.PointName}</Descriptions.Item>
              <Descriptions.Item label="编号">{siteData.PointCode}</Descriptions.Item>
              <Descriptions.Item label="行政区划">{siteData.RegionName}</Descriptions.Item>
              <Descriptions.Item label="设备类型">{siteData.PollutantType}</Descriptions.Item>
              <Descriptions.Item label="排口类型">{siteData.OutputType}</Descriptions.Item>
              <Descriptions.Item label="设备验收日期">{siteData.Col10}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions id="personnel" title="人员信息" column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
              <Descriptions.Item label="负责人">{siteData.Linkman}</Descriptions.Item>
              <Descriptions.Item label="联系方式">{siteData.MobilePhone}</Descriptions.Item>
              <Descriptions.Item label="运维人">{siteData.Col2}</Descriptions.Item>
              <Descriptions.Item label="联系方式">{siteData.Col3}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions id="position" title="位置信息" column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
              <Descriptions.Item label="站点地址">{siteData.Address}</Descriptions.Item>
              <Descriptions.Item label="经度">{siteData.Longitude}</Descriptions.Item>
              <Descriptions.Item label="纬度">{siteData.Latitude}</Descriptions.Item>
            </Descriptions>
            <SdlMap
              mode="map"
              longitude={siteData.Longitude}
              latitude={siteData.Latitude}
              path={siteData.CoordinateSet}
              handleMarker
              handlePolygon
              style={{ height: 300 }}
              zoom={12}
            />
            <Divider />
            {/* <div className="ant-descriptions-title">
              图片信息
            </div>
            <div className={styles.imagesContainer}>
              {
                siteData.Photo ? siteData.Photo.map(item => {
                  return <img src={`/upload/${item}`} alt="" />
                }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              }
            </div> */}
            <div id="instrument" className="ant-descriptions-title" style={{ marginBottom: 10 }}>
              仪器信息
            </div>
            <SdlTable scroll={{ y: 400 }} columns={columns} dataSource={pointInstrumentList} pagination={false} />
            <Divider />
            <div id="wrw" className="ant-descriptions-title" style={{ marginBottom: 10 }}>
              污染物信息
            </div>
            <SdlTable columns={pollutantColumns} dataSource={pollutantByDgimnList} pagination={false} />
            <Divider />
          </Col>
          <Col flex="100px">
            {/* <Anchor getContainer={() => this.div}> */}
            <Anchor>
              <Link href="#basic" title="基本信息" />
              <Link href="#personnel" title="人员信息" />
              <Link href="#position" title="位置信息" />
              <Link href="#image" title="图片信息" />
              <Link href="#instrument" title="仪器信息" />
              <Link href="#wrw" title="污染物信息" />
            </Anchor>
          </Col>
        </Row>

      </Card>
    );
  }
}

export default index;