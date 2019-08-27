import React, { PureComponent } from 'react';
import { Card, Select, Timeline, Icon, Tag, Pagination, Empty, Modal, Upload, message } from 'antd'
import { connect } from 'dva';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@connect(({ common }) => ({
  imageList: common.imageList,
  imageListVisible: common.imageListVisible,
}))
class ViewImagesModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      MainFormID: ""
    };
  }

  modalHandleCancel = e => {
    // this.setState({
    //   visible: false,
    // });
    this.props.dispatch({
      type: "common/updateState",
      payload: {
        imageListVisible: false
      }
    })
  };

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };


  render() {
    return (
      <Modal
        title="详情"
        visible={this.props.imageListVisible}
        footer=""
        // onOk={this.handleOk}
        onCancel={this.modalHandleCancel}
      >
        <div style={{ overflow: "hidden" }}>
          <Upload
            action=""
            listType="picture-card"
            fileList={this.props.imageList}
            disabled
            onPreview={this.handlePreview}
          // onChange={this.handleChange}
          >
            {/* {fileList.length >= 8 ? null : uploadButton} */}
          </Upload>
          <Modal visible={this.state.previewVisible} width={800} footer={null} onCancel={() => {
            this.setState({
              previewVisible: false
            })
          }}>
            <img alt="example" style={{ width: '100%' }} src={this.props.previewImage} />
          </Modal>
        </div>
      </Modal>
    );
  }
}

export default ViewImagesModal;