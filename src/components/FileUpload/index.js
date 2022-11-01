import React, { Component } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Upload, Button, Carousel, message } from 'antd';
import cuid from 'cuid';
import { connect } from 'dva';
import { API } from '@config/API'

@connect(({ loading, autoForm }) => ({
  // fileList: autoForm.fileList,
}))

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this._SELF_ = {
      fileUUID: this.props.fileUUID || cuid(),
    }
    this.state = {
      fileList: this.props.fileList || [],
    };
  }

  componentDidMount() {
    const { fileUUID } = this.props;
    fileUUID && this.props.dispatch({
      type: 'autoForm/getAttachmentList',
      payload: {
        FileUuid: fileUUID,
      },
      callback: (res) => {
        this.setState({
          fileList: res,
        })
      }
    })
  }

  componentWillUnmount() {
    
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.fileList !== nextProps.fileList) {
      this.setState({
        fileList: nextProps.fileList,
      })
    }
  }


  render() {
    const { configId, fileList, dispatch, accept, uploadNumber } = this.props;
    const { fileUUID } = this._SELF_;
    // console.log('fileList=', fileList)
    // console.log('fileList2=', this.state.fileList)
    let imageProps = {};
    if (accept) {
      imageProps.accept = accept;
    }
    const props = {
      action: API.commonApi.UploadFiles,
      accept: '.xls,.xlsx,.doc,.docx,.ppt,.pdf,.pptx,.txt,image/*',
      // beforeUpload: (file) => {
      //   if (accept === 'image/*') {
      //     const isImage = file.type.indexOf("image") !== -1;
      //     if (!isImage) {
      //       message.error('上传文件失败，请选择照片！');
      //       return isImage;
      //     }
      //   }
      // },
      onChange: (info) => {
        let fileList = info.fileList;
        console.log('info=', info)
        if (info.file.status === 'done') {
          // setFieldsValue({ cuid: cuid })
          console.log(fileList)
          this.props.uploadSuccess && this.props.uploadSuccess(fileUUID);
          fileList[fileList.length - 1].url = "/upload/" + fileList[fileList.length - 1].response.Datas
          fileList[fileList.length - 1].thumbUrl = "/upload/" + fileList[fileList.length - 1].response.Datas
        } else if (info.file.status === 'error') {
          let msg = fileList[fileList.length - 1].response.Message;
          console.log("msg=", msg)
          message.error(msg || '上传文件失败！')
        }
        this.setState({
          fileList: fileList
        })
        if (!fileList.length) {
          this.props.uploadSuccess && this.props.uploadSuccess(undefined);
        }
      },
      onRemove(file) {
        if (!file.error) {
          dispatch({
            type: "autoForm/deleteAttach",
            payload: {
              FileName: file.response && file.response.Datas ? file.response.Datas : file.name,
              Guid: file.response && file.response.Datas ? file.response.Datas : file.name,
            }
          })
        }
      },
      ...imageProps,
      multiple: true,
      listType: "picture-card",
      data: {
        FileUuid: fileUUID,
        FileActualType: '0',
      },
    };
    return <>
      <Upload {...props} fileList={this.state.fileList}>
        {
          uploadNumber ?
            (this.state.fileList.length >= uploadNumber ? null : <div>
              <PlusOutlined />
              <div className="ant-upload-text">文件上传</div>
            </div>)
            : <div>
              <PlusOutlined />
              <div className="ant-upload-text">文件上传</div>
            </div>
        }
      </Upload>
    </>
  }
}


export default FileUpload;
