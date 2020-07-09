import React, { PureComponent } from 'react';
import { Card, Select, Timeline, Tag, Pagination, Empty, Modal, Upload, message } from 'antd';
import { connect } from 'dva';
import Lightbox from 'react-image-lightbox-rotate';
import 'react-image-lightbox/style.css';
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
      MainFormID: '',
      photoIndex: 0,
      previewVisible: false,
    };
  }

  modalHandleCancel = e => {
    // this.setState({
    //   visible: false,
    // });
    this.props.dispatch({
      type: 'common/updateState',
      payload: {
        imageListVisible: false,
      },
    });
  };

  // handlePreview = async file => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj);
  //   }
  //   this.setState({
  //     previewImage: file.url || file.preview,
  //     previewVisible: true,
  //   });
  // };
  //点击图片放大
  handlePreview = (file, images) => {
    let ImageList = 0;
    images.map((item, index) => {
      if (item.uid === file.uid) {
        ImageList = index;
      }
    });
    this.setState({
      previewVisible: true,
      photoIndex: ImageList,
    });
  };

  render() {
    const { imageList } = this.props;
    const { photoIndex } = this.state;

    const UrlList = [];
    if (imageList) {
      //拼接放大的图片地址列表
      imageList.map((item, key) => {
        UrlList.push(item.url);
      });
    }

    const upload = {
      showUploadList: { showPreviewIcon: true, showRemoveIcon: false },
      listType: 'picture-card',
      fileList: [...imageList],
    };

    return (
      <Modal
        title="详情"
        visible={this.props.imageListVisible}
        footer=""
        // onOk={this.handleOk}
        onCancel={this.modalHandleCancel}
      >
        <div style={{ overflow: 'hidden' }}>
          {/* <Upload
            action=""
            listType="picture-card"
            fileList={this.props.imageList}
            disabled
            // onPreview={this.handlePreview}
            onPreview={file => {
              this.handlePreview(file, imageList);
            }}
          >
          </Upload> */}
          {/* <Modal visible={this.state.previewVisible} width={800} footer={null} onCancel={() => {
            this.setState({
              previewVisible: false
            })
          }}>
            <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
          </Modal> */}
          <Upload
            {...upload}
            onPreview={file => {
              this.handlePreview(file, imageList);
            }}
          />
          {/* 放大的图片控件 */}
          {this.state.previewVisible && (
            <Lightbox
              mainSrc={UrlList[photoIndex]}
              nextSrc={UrlList[(photoIndex + 1) % UrlList.length]}
              prevSrc={UrlList[(photoIndex + UrlList.length - 1) % UrlList.length]}
              onCloseRequest={() => this.setState({ previewVisible: false })}
              onPreMovePrevRequest={() =>
                this.setState({
                  photoIndex: (photoIndex + UrlList.length - 1) % UrlList.length,
                })
              }
              onPreMoveNextRequest={() =>
                this.setState({
                  photoIndex: (photoIndex + 1) % UrlList.length,
                })
              }
            />
          )}
        </div>
      </Modal>
    );
  }
}

export default ViewImagesModal;
