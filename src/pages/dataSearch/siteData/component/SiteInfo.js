import React, { PureComponent } from 'react';
import { Card, Anchor, Row, Col, Descriptions, Divider, Empty, Tag, Upload } from 'antd'
import { connect } from 'dva'
import SdlMap from '@/pages/AutoFormManager/SdlMap'
import styles from './index.less'
import SdlTable from "@/components/SdlTable"
import PageLoading from '@/components/PageLoading'
import Lightbox from "react-image-lightbox-rotate";


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
                <Tag color="cyan"> 下限报警 </Tag>{' '}
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
        render: (text, record) => {
          return text !== undefined ? text : '-'
        }
      },
      {
        title: '检出下限',
        dataIndex: 'AbnormalLowerLimit',
        key: 'AbnormalLowerLimit',
        render: (text, record) => {
          return text !== undefined ? text : '-'
        }
      },
      {
        title: '报警上限',
        dataIndex: 'UpperLimit',
        key: 'UpperLimit',
        render: (text, record) => {
          return text !== undefined ? text : '-'
        }
      },
      {
        title: '报警下限',
        dataIndex: 'LowerLimit',
        key: 'LowerLimit',
        render: (text, record) => {
          return text !== undefined ? text : '-'
        }
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

  handlePreview = (file, fileList) => {
    let photoIndex = 0;
    fileList.map((item, index) => {
      if (item.uid === file.uid) {
        photoIndex = index;
      }
    });
    this.setState({
      previewVisible: true,
      // previewImage: file.url,
      photoIndex: photoIndex,
    });
  }

  render() {
    const { columns, pollutantColumns, photoIndex } = this.state;
    const { loading, siteData, pointInstrumentList, pollutantByDgimnList } = this.props;

    let fileList = siteData.Photo ? siteData.Photo.map((item, index) => {
      return {
        uid: index,
        name: 'image.png',
        status: 'done',
        url: `/upload/${item}`,
      }
    }) : []

    let ImageList = fileList.map(item => item.url)

    if (loading) {
      return <PageLoading />
    }
    return (

      <Card id="container" title="排口详情">
        <Row>
          <Col ref={(div) => { this.div = div }} flex="1" style={{ height: "calc(100vh - 220px)", overflowY: "auto", paddingRight: 10, marginRight: 6 }}>
            {/* <Row>
          <Col flex="1" id="container"> */}
            <div id="basic" >
              <Descriptions title="基本信息" column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                <Descriptions.Item label="所属企业">{siteData.ParentName}</Descriptions.Item>
                <Descriptions.Item label="所属行业">{siteData.AutoMonitorInstrument}</Descriptions.Item>
                <Descriptions.Item label="站点名称">{siteData.PointName}</Descriptions.Item>
                <Descriptions.Item label="编号">{siteData.DGIMN}</Descriptions.Item>
                <Descriptions.Item label="行政区划">{siteData.RegionName}</Descriptions.Item>
                <Descriptions.Item label="设备类型">{siteData.PollutantType}</Descriptions.Item>
                <Descriptions.Item label="排口类型">{siteData.OutputType}</Descriptions.Item>
                <Descriptions.Item label="设备验收日期">{siteData.Col10}</Descriptions.Item>
              </Descriptions>
            </div>
            <Divider />
            <div id="personnel">
              <Descriptions id="personnel" title="人员信息" column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                <Descriptions.Item label="负责人">{siteData.Linkman}</Descriptions.Item>
                <Descriptions.Item label="联系方式">{siteData.MobilePhone}</Descriptions.Item>
                <Descriptions.Item label="运维人">{siteData.Col2}</Descriptions.Item>
                <Descriptions.Item label="联系方式">{siteData.Col3}</Descriptions.Item>
              </Descriptions>
            </div>
            <Divider />
            <div id="position">
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
                // handleMarker
                handlePolygon
                style={{ height: 300 }}
                zoom={12}
              />
            </div>
            <Divider />
            <div id="image" className="ant-descriptions-title" style={{ marginBottom: 20 }}>
              图片信息
            </div>
            <div className={styles.imagesContainer}>
              {
                siteData.Photo ?
                  <Upload
                    showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
                    listType='picture-card'
                    fileList={fileList}
                    onPreview={file => {
                      this.handlePreview(file, fileList);
                    }}
                  />
                  : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              }
            </div>
            <Divider />
            <div id="instrument" className="ant-descriptions-title" style={{ marginBottom: 20 }}>
              仪器信息
            </div>
            <SdlTable scroll={{ y: 400 }} columns={columns} dataSource={pointInstrumentList} pagination={false} />
            <Divider />
            <div id="wrw" className="ant-descriptions-title" style={{ marginBottom: 20 }}>
              污染物信息
            </div>
            <SdlTable columns={pollutantColumns} dataSource={pollutantByDgimnList} pagination={false} />
            <Divider />
            {/* </Col> */}
            {/* <Col flex="100px">
            <Anchor>
              <Link href="#basic" title="基本信息" />
              <Link href="#personnel" title="人员信息" />
              <Link href="#position" title="位置信息" />
              <Link href="#image" title="图片信息" />
              <Link href="#instrument" title="仪器信息" />
              <Link href="#wrw" title="污染物信息" />
            </Anchor>
          </Col> */}
            {/* </Row> */}
            {this.state.previewVisible && (
              <Lightbox
                mainSrc={ImageList[photoIndex]}
                nextSrc={ImageList[(photoIndex + 1) % ImageList.length]}
                prevSrc={ImageList[(photoIndex + ImageList.length - 1) % ImageList.length]}
                onCloseRequest={() => this.setState({ previewVisible: false })}
                onPreMovePrevRequest={() =>
                  this.setState({
                    photoIndex: (photoIndex + ImageList.length - 1) % ImageList.length
                  })
                }
                onPreMoveNextRequest={() =>
                  this.setState({
                    photoIndex: (photoIndex + 1) % ImageList.length
                  })
                }
              />
            )}
          </Col>
          <Col flex="100px">
            <Anchor getContainer={() => this.div}>
              {/* <Anchor> */}
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
