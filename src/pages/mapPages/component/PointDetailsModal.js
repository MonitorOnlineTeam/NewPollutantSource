import React, { PureComponent } from 'react'
import { Modal, Tabs, Descriptions, Divider, Spin } from 'antd';
import { connect } from 'dva'
import DataQuery from '@/pages/monitoring/dataquery/components/DataQuery'
import YsyShowVideo from '@/components/ysyvideo/YsyShowVideo'
import OperDetails from '@/pages/monitoring/mapview/component/OperDetails'
import AlarmRecord from '@/pages/monitoring/alarmrecord/components/AlarmRecord'
import RecordEchartTableOver from '@/components/recordEchartTableOver'
import RecordEchartTable from '@/components/recordEchartTable'
import SdlMap from '@/pages/AutoFormManager/SdlMap'
import config from '@/config'
import styles from '../index.less'
import OriginaldataContent from '@/pages/monitoring/originaldata/OriginaldataContent'


const { TabPane } = Tabs;

@connect(({ loading, map, global, common }) => ({
  pointDetailsModalVisible: map.pointDetailsModalVisible,
  infoWindowData: map.infoWindowData,
  monitorTime: map.monitorTime,
  noticeList: global.notices,
  menuNameList: common.menuNameList,
  loading: loading.effects['common/getMenuNameList'],
}))
class PointDetailsModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentPointInfo: props.pointInfo
    };
  }

  componentDidMount() {
    const { pointInfo } = this.props;
    this.getMenuNameList();
    this.props.dispatch({
      type: "map/getInfoWindowData",
      payload: {
        DGIMNs: pointInfo.DGIMN,
        dataType: "HourData",
        isLastest: true,
        isAirOrSite: true,
        pollutantTypes: pointInfo.type
      }
    })
  }

  getMenuNameList = () => {
    this.props.dispatch({
      type: 'common/getMenuNameList',
    })
  }

  render() {
    const { menuNameList, infoWindowData, pointInfo, pointDetailsModalVisible, loading } = this.props;
    const { currentPointInfo } = this.state;
    let currentKey = pointInfo.DGIMN;
    let imgName = infoWindowData.pollutantTypeCode === 2 ? "/gasInfoWindow.png" : (infoWindowData.pollutantTypeCode === 1 ? "/water.jpg" : "/infoWindowImg.png")
    if (infoWindowData.photo && infoWindowData.photo.length === 1) {
      imgName = "/upload/" + infoWindowData.photo[0];
    }
    const modalHeight = 'calc(100vh - 24vh - 55px - 48px - 90px - 48px)';
    console.log('props=', this.props)
    return (
      <Modal
        title={`${pointInfo.title}详情`}
        width="80%"
        footer={null}
        style={{ maxHeight: '80vh' }}
        visible={pointDetailsModalVisible}
        onCancel={() => {
          this.props.dispatch({
            type: "map/updateState",
            payload: {
              pointDetailsModalVisible: false
            }
          })
        }}
      >
        {
          loading ?
            <div style={{height: '200px', textAlign: 'center'}}>
              <Spin />
            </div> : <Tabs>
              {
                menuNameList.includes('历史数据') && <TabPane tab="历史数据" key="1">
                  <DataQuery DGIMN={currentKey}
                    initLoadData
                    chartHeight="calc(100vh - 427px)"
                    style={{ height: modalHeight, overflow: 'auto', height: 'calc(100vh - 350px)' }}
                    tableHeight="calc(100vh - 34vh - 55px - 48px - 90px - 64px)"
                    pointName={pointInfo.title}
                    pollutantTypes={pointInfo.type}
                    entName={pointInfo.Abbreviation}
                  />
                </TabPane>
              }
              {
                <TabPane tab="运维记录" key="6">
                  <OperDetails DGIMN={currentKey} />
                </TabPane>
              }
              {
                menuNameList.includes('视频预览') &&
                <TabPane tab="视频预览" key="2">
                  <YsyShowVideo DGIMN={currentKey} initLoadData style={{ maxHeight: modalHeight }} />
                </TabPane>
              }
              {
                menuNameList.includes('超标处置') && this.state.currentPointInfo.type != '5' &&
                <TabPane tab="超标处置" key="3">
                  <AlarmRecord DGIMN={currentKey} EntCode={this.state.currentPointInfo.EntCode} initLoadData dataHeight="calc(100vh - 450px)" style={{ maxHeight: modalHeight + 52, height: 'calc(100vh - 366px)' }} />
                </TabPane>
              }
              {
                menuNameList.includes('异常数据') && <TabPane tab="异常数据" key="4">
                  <RecordEchartTable DGIMN={currentKey} initLoadData style={{ maxHeight: '70vh' }} maxHeight={150} />
                </TabPane>
              }
              {
                menuNameList.includes('超标数据') && this.state.currentPointInfo.type != '5' &&
                <TabPane tab="超标数据" key="5">
                  <RecordEchartTableOver DGIMN={currentKey} initLoadData style={{ maxHeight: '70vh' }} maxHeight={150} noticeState={1} />
                </TabPane>
              }
              {
                menuNameList.includes('原始数据包') && <TabPane tab="原始数据包" key="8">
                  <OriginaldataContent DGIMN={currentKey} initLoadData style={{ maxHeight: '70vh' }} maxHeight={150} />
                </TabPane>
              }
              <TabPane tab="基本信息" key="7">
                <div style={{ height: "60vh", overflow: 'auto' }}>
                  <div className={styles.basisInfo}>
                    <div>
                      <img src={imgName} alt="" width="100%" />
                    </div>
                    <div>
                      <Descriptions title={infoWindowData.pointName}>
                        <Descriptions.Item label="区域">{infoWindowData.Abbreviation}</Descriptions.Item>
                        <Descriptions.Item label="经度">{infoWindowData.longitude}</Descriptions.Item>
                        <Descriptions.Item label="纬度">{infoWindowData.latitude}</Descriptions.Item>
                        <Descriptions.Item label="运维负责人">{infoWindowData.operationPerson}</Descriptions.Item>
                        <Descriptions.Item label="污染物类型">{infoWindowData.pollutantType}</Descriptions.Item>
                      </Descriptions>
                    </div>
                  </div>
                  <Divider />
                  {
                    this.state.currentPointInfo.PollutantType !== "5" && <Descriptions title="企业信息">
                      <Descriptions.Item label="企业名称">{infoWindowData.entName}</Descriptions.Item>
                      <Descriptions.Item label="行业">{infoWindowData.industryName}</Descriptions.Item>
                      <Descriptions.Item label="控制级别名称">{infoWindowData.attentionName}</Descriptions.Item>
                      <Descriptions.Item label="环保负责人">{infoWindowData.EnvironmentPrincipal}</Descriptions.Item>
                      <Descriptions.Item label="移动电话">{infoWindowData.entphone}</Descriptions.Item>
                      <Descriptions.Item label="企业地址">{infoWindowData.entadress}</Descriptions.Item>
                    </Descriptions>
                  }
                  <SdlMap
                    mode="map"
                    longitude={infoWindowData.longitude}
                    latitude={infoWindowData.latitude}
                    path={infoWindowData.entCoordinateSet || []}
                    handlePolygon
                    style={{ height: this.state.currentPointInfo.type !== "5" ? 300 : 430 }}
                    zoom={12}
                  />
                </div>
              </TabPane>
            </Tabs>
        }

      </Modal>
    );
  }
}

export default PointDetailsModal;