
import React, { PureComponent } from 'react'
import { Modal, Tooltip, Divider, message } from 'antd';
import FileViewer from 'react-file-viewer';
import { connect } from 'dva'
import { CustomErrorComponent } from 'custom-error';

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
    // this.props.dispatch({
    //   type: "KBS/updateState",
    //   payload: {
    //     viewFileModalVisible: false
    //   }
    // })
    this.props.onClose && this.props.onClose();
  }

  render() {
    const { fileType, filePath, viewFileModalVisible } = this.props;
    const { searchParams } = this.state;
    return (
      <Modal
        width={"70vw"}
        bodyStyle={{ height: "72vh" }}
        footer={false}
        visible={true}
        onCancel={this.onCloseModal}
      >
        <FileViewer
          fileType={fileType}
          filePath={`/upload/${filePath}`}
          // errorComponent={message.error("文件打开失败")}
          errorComponent={CustomErrorComponent}
          onError={() => {
            message.error("文件打开失败")
          }}
        />
      </Modal>
    );
  }
}

export default OpenFileModal;
