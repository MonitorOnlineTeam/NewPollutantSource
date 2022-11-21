/*
 * @Author: JiaQi 
 * @Date: 2022-11-21 10:39:57 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2022-11-21 11:24:13
 * @Description: 排放源关联摄像头页面
 */
import React, { PureComponent } from 'react'
import { Modal, Transfer, Radio } from 'antd'
import { connect } from 'dva';
import VideoManager from '@/pages/Video/videomanager/PageContent';

@connect(({ standingBook, loading }) => ({
  videoModalVisible: standingBook.videoModalVisible,
  // loading: loading.effects['standingBook/getDayReportTableData'],
}))
class VideoModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      entCode: props.entCode,
      dataSource: [],
      targetKeys: [],
    };

    this._CONST = {
    }
  }

  componentDidMount() {
    // this.getPageData();
  }

  // 关闭弹窗
  onCancel = () => {
    this.props.dispatch({
      type: 'standingBook/updateState',
      payload: {
        videoModalVisible: false
      }
    })
  }

  render() {
    const { videoModalVisible, targetRowData } = this.props;
    console.log("videoModalVisible=", videoModalVisible)
    const { dataSource, targetKeys } = this.state;
    const emissionID = targetRowData['dbo.T_Cod_UnEmissionAndEnt.EmissionID'];

    return <Modal
      title="摄像头关联关系配置"
      visible={videoModalVisible}
      width={'80vw'}
      footer={false}
      onCancel={this.onCancel}
      bodyStyle={{ padding: 0 }}
    >
      <VideoManager DGIMN={emissionID} />
    </Modal>
  }
}

export default VideoModal;