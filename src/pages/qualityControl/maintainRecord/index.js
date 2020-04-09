/*
 * @Author: Jiaqi 
 * @Date: 2019-11-15 11:37:27 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-18 15:20:28
 * @desc: 质控仪操作记录
 */
import React, { Component } from 'react';
import { Card, Modal, Tooltip, Icon } from 'antd';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import YsyShowVideo from '@/components/QCAVideo/QCAYsyShowVideo.js'
import moment from 'moment';

class MaintainRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      VideoNo: null,
      startTime: null
    };
    this._SELF_ = {
      configId: "QCAnalyzeOperRecord"
    }
  }
  render() {
    const { configId } = this._SELF_;
    const { VideoNo, startTime } = this.state;
    return (
      <BreadcrumbWrapper>
        <Card className="contentContainer">
          <SearchWrapper
            configId={configId}
          />
          <AutoFormTable
            getPageConfig
            configId={configId}
            appendHandleRows={(row, key) => {
              if (row["dbo.T_Bas_QCAnalyzerInfo.CameraNO"]) {
                return <Tooltip title="查看视频">
                  <a onClick={() => {
                    this.setState({
                      visible: true,
                      VideoNo: row["dbo.T_Bas_QCAnalyzerInfo.CameraNO"],
                      startTime: row["dbo.T_Bas_QCAnalyzeOperRecord.OpenDoorTime"]
                    })
                  }}><Icon type="video-camera" /></a>
                </Tooltip>
              } else {
                return '-'
              }
            }}
          />
        </Card>
        <Modal
          width={"70%"}
          title="查看视频"
          destroyOnClose
          visible={this.state.visible}
          footer={[]}
          onOk={this.handleOk}
          onCancel={() => {
            this.setState({ visible: false })
          }}
        >
          {
            VideoNo && <YsyShowVideo VideoNo={VideoNo} defaultActiveKey="2" showModal={true} startTime={startTime} endTime={moment().format("YYYY-MM-DD 23:59:59")}/>
          }
        </Modal>
      </BreadcrumbWrapper>
    );
  }
}

export default MaintainRecord; 