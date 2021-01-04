import React, { PureComponent } from 'react'
import { Modal, Tabs, Descriptions, Divider } from 'antd';
import { connect } from 'dva'
import DataQuery from '@/pages/monitoring/dataquery/components/DataQuery'
import AlarmRecord from '@/pages/monitoring/alarmrecord/components/AlarmRecord'
import YsyShowVideo from '@/components/ysyvideo/YsyShowVideo'
import RecordEchartTableOver from '@/components/recordEchartTableOver'
import RecordEchartTable from '@/components/recordEchartTable'
import OperDetails from "./OperDetails"
import styles from '../index.less'
import SdlMap from '@/pages/AutoFormManager/SdlMap'
import config from "@/config"


const { TabPane } = Tabs;
let tabList = ["历史数据", "运维记录", "视频预览", "超标处置", "异常数据", "超标数据", "基本信息"];
const modalHeight = "calc(100vh - 24vh - 55px - 48px - 90px - 48px)";

@connect(({ loading, newHome }) => ({
  siteDetailsVisible: newHome.siteDetailsVisible,
  infoWindowData: newHome.infoWindowData,
}))
class SiteDetailsModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentKey: 1,
      itemTitle: "历史数据",
    };
  }

  componentDidMount() {
    // 获取infoWindow数据
    const { data } = this.props;
    this.props.dispatch({
      type: "newHome/getInfoWindowData",
      payload: {
        DGIMNs: data.key,
        dataType: "HourData",
        isLastest: true,
        // type: PollutantType,
        isAirOrSite: true,
        pollutantTypes: data.PollutantType
      }
    })
    if (data.PollutantType === "5") {
      tabList = ["历史数据", "运维记录", "视频预览", "", "异常数据", "", "基本信息"];
    }
  }


  footerItemClick = (key) => {
    this.setState({ currentKey: key + 1, itemTitle: tabList[key] })
  }

  renderModalFooter = () => {
    return <div className={styles.modalFooter}>
      <ul>
        {
          tabList.map((item, index) => {
            return item ? <li onClick={() => { this.footerItemClick(index) }}>
              <img src={`/xj/0${index + 1}.png`} alt="" />
              <p>{item}</p>
            </li> : ""
          })
        }
        {/* <li onClick={() => { this.footerItemClick(1) }}>
          <img src="/xj/01.png" alt="" />
          <p>历史数据</p>
        </li>
        <li onClick={() => { this.footerItemClick(2) }}>
          <img src="/xj/02.png" alt="" />
          <p>运维记录</p>
        </li>
        <li onClick={() => { this.footerItemClick(3) }}>
          <img src="/xj/03.png" alt="" />
          <p>视频预览</p>
        </li>
        <li onClick={() => { this.footerItemClick(4) }}>
          <img src="/xj/04.png" alt="" />
          <p>超标处置</p>
        </li>
        <li onClick={() => { this.footerItemClick(5) }}>
          <img src="/xj/05.png" alt="" />
          <p>异常数据</p>
        </li>
        <li onClick={() => { this.footerItemClick(6) }}>
          <img src="/xj/06.png" alt="" />
          <p>超标数据</p>
        </li>
        <li onClick={() => { this.footerItemClick(7) }}>
          <img src="/xj/07.png" alt="" />
          <p>基本信息</p>
        </li> */}
      </ul>
    </div>
  }

  render() {
    const { data, infoWindowData } = this.props;
    const { currentKey, itemTitle } = this.state;

    if (data.PollutantType === "5") {
      tabList = ["历史数据", "运维记录", "视频预览", "", "异常数据", "", "基本信息"];
    }else{
      tabList = ["历史数据", "运维记录", "视频预览", "超标处置", "异常数据", "超标数据", "基本信息"];
    }
    let imgName = infoWindowData.pollutantTypeCode === 2 ? "/gasInfoWindow.png" : (infoWindowData.pollutantTypeCode === 1 ? "/water.jpg" : "/infoWindowImg.png")
    if (infoWindowData.photo) {
      imgName = config.uploadHost + "upload" + imgName;
    }
    return (
      <Modal
        title={`${data.title} - ${itemTitle}`}
        className={styles.detailsModal}
        destroyOnClose
        width="80%"
        bodyStyle={{ paddingBottom: 0 }}
        footer={this.renderModalFooter()}
        visible={this.props.siteDetailsVisible}
        onCancel={() => {
          this.props.dispatch({
            type: "newHome/updateState",
            payload: { siteDetailsVisible: false }
          })
        }}
      >
        {
          currentKey === 1 && <div style={{ height: "60vh", overflow: "hidden" }}>
            <DataQuery
              DGIMN={data.key}
              initLoadData
              chartHeight='calc(100vh - 590px)'
              // style={{ height: modalHeight, overflow: 'auto', height: 'calc(100vh - 350px)' }}
              tableHeight={"calc(60vh - 238px)"}
              pointName={data.title}
              pollutantTypes={data.PollutantType}
              entName={data.EntName}
            />
          </div>
        }
        {
          currentKey === 2 && <div style={{ height: "60vh", overflow: "hidden" }}>
            <OperDetails DGIMN={data.key} />
          </div>
        }
        {
          currentKey === 3 && <div style={{ height: "60vh", overflow: 'auto' }}>
            <YsyShowVideo DGIMN={data.key} initLoadData />
          </div>
        }
        {
          currentKey === 4 && data.PollutantType != "5" &&
          <div style={{ height: "60vh", overflow: 'auto' }}>
            <AlarmRecord DGIMN={data.key} initLoadData />
          </div>
        }
        {
          currentKey === 5 &&
          <div style={{ height: "60vh", overflow: 'auto' }}>
            <RecordEchartTable DGIMN={data.key} initLoadData />
          </div>
        }
        {
          currentKey === 6 && data.PollutantType != "5" &&
          <div style={{ height: "60vh", overflow: 'auto' }}>
            <RecordEchartTableOver DGIMN={data.key} initLoadData noticeState={1} />
          </div>
        }
        {
          currentKey === 7 &&
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
              data.PollutantType !== "5" && <Descriptions title="企业信息">
                <Descriptions.Item label="企业名称">{infoWindowData.entName}</Descriptions.Item>
                <Descriptions.Item label="行业">{infoWindowData.industryName}</Descriptions.Item>
                <Descriptions.Item label="控制级别名称">{infoWindowData.attentionName}</Descriptions.Item>
                <Descriptions.Item label="环保负责人">{infoWindowData.entlinkman}</Descriptions.Item>
                <Descriptions.Item label="移动电话">{infoWindowData.entphone}</Descriptions.Item>
                <Descriptions.Item label="企业地址">{infoWindowData.entadress}</Descriptions.Item>
              </Descriptions>
            }
            <SdlMap
              mode="map"
              longitude={infoWindowData.longitude}
              latitude={infoWindowData.latitude}
              path={infoWindowData.entCoordinateSet || []}
              handleMarker={true}
              handlePolygon={true}
              style={{ height: data.PollutantType !== "5" ? 300 : 430 }}
              zoom={12}
            />
          </div>
        }
      </Modal >
    );
  }
}

export default SiteDetailsModal;
