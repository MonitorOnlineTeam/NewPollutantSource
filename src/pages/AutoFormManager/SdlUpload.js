/*
 * @Author: Jiaqi 
 * @Date: 2019-11-05 17:18:49 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-05 17:37:14
 * @desc: 上传组件
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getBase64 } from './utils'
import {
  Upload,
  Button,
  Icon,
  Modal,
  Carousel,
} from 'antd'
import cuid from 'cuid';
import config from '@/config';
import { connect } from 'dva';
import styles from './index.less'
import { MapInteractionCSS } from 'react-map-interaction';

@connect(({ loading, autoForm }) => ({
  // fileList: autoForm.fileList,
}))

class SdlUpload extends Component {
  constructor(props) {
    super(props);
    this._SELF_ = {
      cuid: this.props.cuid
    }
    this.state = {
      previewVisible: false
    };
  }

  componentDidMount() {
    // const { dispatch, uid } = this.props;
    // uid && dispatch({
    //   type: "autoForm/getAttachmentList",
    //   payload: {
    //     FileUuid: uid
    //   }
    // })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.fileList !== nextProps.fileList) {
      this.setState({
        fileList: nextProps.fileList,
      })
    }
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
    const { configId, fileList, dispatch } = this.props;
    const { cuid } = this._SELF_;
    console.log('fileList=', fileList)
    const props = {
      action: `${config.uploadHost}rest/PollutantSourceApi/UploadApi/PostFiles`,
      onChange: (info) => {
        if (info.file.status === 'done') {
          // setFieldsValue({ cuid: cuid })
          this.props.uploadSuccess && this.props.uploadSuccess(cuid);
        } else if (info.file.status === 'error') {
          message.error('上传文件失败！')
        }
        this.setState({
          fileList: info.fileList
        })
      },
      onRemove(file) {
        dispatch({
          type: "autoForm/deleteAttach",
          payload: {
            Guid: file.uid,
          }
        })
      },
      onPreview: this.handlePreview,
      multiple: true,
      listType: "picture-card",
      data: {
        FileUuid: cuid,
        FileActualType: '1',
      },
    };

    return (
      <>
        <Upload {...props} fileList={this.state.fileList}>
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">文件上传</div>
          </div>
        </Upload>

        <Modal visible={this.state.previewVisible} footer={null} onCancel={() => {
          this.setState({ previewVisible: false })
        }}>
          {/* <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} /> */}
          <div style={{ position: 'relative', display: "flex", alignItems: "center" }}>
            <div className={styles.controller}>
              <Icon type="left" onClick={() => {
                this.carousel.prev()
              }} />
              <Icon type="right" onClick={() => {
                this.carousel.next()
              }} />
            </div>
            <MapInteractionCSS>
              <Carousel
                dots={false}
                ref={(carousel) => { this.carousel = carousel; }}
              >
                {
                  this.props.fileList && this.props.fileList.map(item => {
                    return <div key={item.Guid}>
                      <img alt="example" style={{ width: '100%' }} src={item.url} />
                    </div>
                  })
                }
              </Carousel>
            </MapInteractionCSS>
          </div>
        </Modal>
      </>

    );
  }
}


export default SdlUpload;