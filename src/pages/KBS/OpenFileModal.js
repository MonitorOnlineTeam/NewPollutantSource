
import React, { PureComponent } from 'react'
import { Modal, Tooltip, Divider, message } from 'antd';
import FileViewer from 'react-file-viewer';
import { connect } from 'dva'

@connect(({ KBS, loading }) => ({
  viewFileModalVisible: KBS.viewFileModalVisible,
}))
class OpenFileModal extends PureComponent {
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

  onCloseModal = () => {
    this.props.dispatch({
      type: "KBS/updateState",
      payload: {
        viewFileModalVisible: false
      }
    })
  }

  render() {
    const { fileType, filePath, viewFileModalVisible } = this.props;
    const { searchParams } = this.state;

    return (
      <Modal
        width={"70vw"}
        bodyStyle={{ height: "72vh" }}
        footer={false}
        visible={viewFileModalVisible}
        onCancel={this.onCloseModal}
      >
        <FileViewer
          fileType={fileType}
          filePath={`/upload/${filePath}`}
          // errorComponent={message.error("文件打开失败")}
          // onError={() => {
          //   message.error("文件打开失败11")
          // }}
        />
      </Modal>
    );
  }
}

export default OpenFileModal;