
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Upload,
  Button,
  Icon
} from 'antd'
import cuid from 'cuid';
import { connect } from 'dva';

@connect(({ loading, autoForm }) => ({
  fileList: autoForm.fileList,
}))

class SdlUpload extends Component {
  constructor(props) {
    super(props);
    this._SELF_ = {
      uid: this.props.uid || cuid()
    }
    this.state = {};
  }

  componentDidMount() {
    const { dispatch, uid } = this.props;
    uid && dispatch({
      type: "autoForm/getAttachmentList",
      payload: {
        FileUuid: uid
      }
    })
  }
  render() {
    const { configId, fileList } = this.props;
    const { uid } = this._SELF_;

    const props = {
      action: 'http://172.16.9.52:8096/rest/PollutantSourceApi/UploadApi/PostFiles',
      // action: (file) => {
      //   console.log("file=",file)
      //   this.props.dispatch({
      //     type: "autoForm/fileUpload",
      //     // payload: {
      //     //   file
      //     // }
      //   })
      // },
      multiple: true,
      data: {
        FileUuid: uid,
        FileActualType: "1"
      },
      onChange(info) {
        // if (info.file.status !== 'uploading') {
        //   console.log(info.file, info.fileList);
        // }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error("上传文件失败！")
        }
      },
    };

    return (
      <Upload {...props} {...this.props} defaultFileList={fileList}>
        <Button>
          <Icon type="upload" /> Upload
      </Button>
      </Upload>
    );
  }
}


export default SdlUpload;