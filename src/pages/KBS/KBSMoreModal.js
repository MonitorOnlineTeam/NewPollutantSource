import React, { PureComponent } from 'react'
import { Modal, Tooltip, Divider, message } from 'antd';
import { connect } from 'dva'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import { ProfileOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons'
import OpenFileModal from './OpenFileModal'

const CONFIG_ID = "KBMModel"

@connect(({ KBS, loading }) => ({
  KBSMoreModalVisible: KBS.KBSMoreModalVisible,
  viewFileModalVisible: KBS.viewFileModalVisible,
}))
class KBSMoreModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchParams: props.searchParams
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.searchParams !== prevProps.searchParams) {
      this.setState({
        searchParams: this.props.searchParams
      })
    }
  }


  onOpenViewFileModal = () => {
    // this.props.dispatch({
    //   type: "KBS/updateState",
    //   payload: {
    //     viewFileModalVisible: true
    //   }
    // })
    this.setState({
      visible: true
    })
  }


  onCloseModal = () => {
    this.props.dispatch({
      type: "KBS/updateState",
      payload: {
        KBSMoreModalVisible: false
      }
    })
  }

  onViewFile = (data) => {
    let file = data["dbo.T_Bas_Repository.Attachment"]
    if (file) {
      let fileName = file.split("|")[0];
      if (fileName) {
        let suffix = fileName.split(".")[1];
        this.setState({
          fileType: suffix,
          filePath: fileName
        }, () => {
          this.onOpenViewFileModal()
        })
        let id = data["dbo.T_Bas_Repository.ID"];
        this.updViewForKBM(id, "view")
      } else {
        message.error("文件不存在！")
      }
    } else {
      message.error("文件不存在！")
    }
  }

  onDownload = (data) => {
    let file = data["dbo.T_Bas_Repository.Attachment"]
    if (file) {
      let fileName = file.split("|")[0];
      if (fileName) {
        let suffix = fileName.split(".")[1];
        let id = data["dbo.T_Bas_Repository.ID"];
        this.updViewForKBM(id, "down")
        window.open(`/upload/${fileName}`);
      } else {
        message.error("文件不存在！")
      }
    } else {
      message.error("文件不存在！")
    }
  }

  updViewForKBM = (id, type) => {
    this.props.dispatch({
      type: "KBS/updViewForKBM",
      payload: {
        ID: id,
        Type: type
      },
      callback: () => {
        this.reloadTable()
      }
    })
  }

  reloadTable = () => {
    this.props.dispatch({
      type: 'autoForm/getAutoFormData',
      payload: {
        configId: CONFIG_ID,
        searchParams: this.state.searchParams,
      },
    })
  }

  render() {
    const { KBSMoreModalVisible, viewFileModalVisible } = this.props;
    const { searchParams, fileType, filePath, visible } = this.state;
    return (
      <>
        <Modal
          title="知识库"
          width={"70vw"}
          footer={false}
          visible={KBSMoreModalVisible}
          onCancel={this.onCloseModal}
        >
          {/* [{"Key":"dbo__T_Bas_Repository__RepositoryType","Value":"1","Where":"$="}] */}
          <SearchWrapper
            configId={CONFIG_ID}
            searchParams={searchParams}
          />
          <AutoFormTable
            getPageConfig
            searchParams={searchParams}
            configId={CONFIG_ID}
            appendHandleRows={(row) => {
              return (
                <>
                  <Tooltip title="查看">
                    <a onClick={() => this.onViewFile(row)}><SearchOutlined style={{ fontSize: 16 }} /></a>
                  </Tooltip>
                  <Divider type="vertical" />
                  <Tooltip title="下载">
                    <a onClick={() => this.onDownload(row)}><DownloadOutlined style={{ fontSize: 16 }} /></a>
                  </Tooltip>
                </>
              )
            }}
          />
        </Modal>
        {visible && <OpenFileModal fileType={fileType} filePath={filePath} onClose={() => {
          this.setState({
            visible: false
          })
        }} />}
      </>
    );
  }
}

export default KBSMoreModal;
