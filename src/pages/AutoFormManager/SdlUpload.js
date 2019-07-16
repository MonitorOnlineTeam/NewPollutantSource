
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
      action: 'http://172.16.9.52:8095/rest/PollutantSourceApi/UploadApi/PostFiles',
      multiple: true,
      data: {
        FileUuid: uid,
        FileActualType: "1"
      }
    };

    return (
      <Upload {...props} {...this.props} defaultFileList={[fileList]}>
        <Button>
          <Icon type="upload" /> Upload
      </Button>
      </Upload>
    );
  }
}


export default SdlUpload;