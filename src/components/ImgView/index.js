import React, { PureComponent } from 'react';
import { Modal, Upload, message } from 'antd'
import { connect } from 'dva';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@connect(({ autoForm, loading }) => ({
  imageList: autoForm.fileList,
  isloading: loading.effects['autoForm/getAttachmentList'],
}))
class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
    };
  }

  componentDidMount() {
      const { dispatch } = this.props;
       dispatch({
             type: 'autoForm/getAttachmentList',
             payload: {
               FileUuid: this.props.FileUuid,
               uid: this.props.FileUuid,
             },
            });
  }

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
      const { imageList, isloading } = this.props;
      console.log('imageList', imageList);
    return (
            !isloading && imageList ? <div style={{ overflow: 'hidden' }}>
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
          <Modal destroyOnClose="true" visible={this.state.previewVisible} width={800} footer={null} onCancel={() => {
            this.setState({
              previewVisible: false,
            })
          }}>
            <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
          </Modal>
        </div> : <div>dddd</div>
    );
  }
}

export default Index;
