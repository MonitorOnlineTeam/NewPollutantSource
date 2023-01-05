/*
 * @Author: Jiaqi
 * @Date: 2019-11-05 17:18:49
 * @Last Modified by: JiaQi
 * @Last Modified time: 2022-12-30 14:22:27
 * @desc: 上传组件
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getBase64 } from './utils'
import { LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Upload, Button, Modal, Carousel, message } from 'antd';
import cuid from 'cuid';
import config from '@/config';
import { connect } from 'dva';
import styles from './index.less'
import { MapInteractionCSS } from 'react-map-interaction';
import { API } from '@config/API'
import Cookie from 'js-cookie';

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
      previewVisible: false,
      fileList: props.fileList
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
    const nameSplit = file.name.split('.');
    const postfix = nameSplit[nameSplit.length - 1];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    if (postfix === 'gif' || postfix === 'jpg' || postfix === 'png' || postfix === 'bmp') {
      this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
      });
    }

  };

  render() {
    const { configId, fileList, dispatch, accept, uploadNumber } = this.props;
    const { cuid } = this._SELF_;
    let acceptProps = {};
    if (accept) {
      acceptProps.accept = accept;
    }
    const props = {
      // action: `/api/rest/PollutantSourceApi/UploadApi/PostFiles`,
      action: API.commonApi.UploadFiles,
      beforeUpload: (file) => {
        if (accept === 'image/*') {
          const isImage = file.type.indexOf("image") !== -1;
          if (!isImage) {
            message.error('上传文件失败，请选择照片！');
            return isImage;
          }
        }
      },
      onChange: (info) => {
        let fileList = info.fileList;
        console.log('info=', info)
        if (info.file.status === 'done') {
          // setFieldsValue({ cuid: cuid })
          this.props.uploadSuccess && this.props.uploadSuccess(cuid);
          fileList[fileList.length - 1].url = "/" + fileList[fileList.length - 1].response.Datas
          fileList[fileList.length - 1].thumbUrl = "/" + fileList[fileList.length - 1].response.Datas
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
          console.log('file=', file);
          let fileName = file.name;
          if (file.response && file.response.Datas) {
            let filePath = file.response.Datas.split('/');
            fileName = filePath[filePath.length - 1];
          }
          dispatch({
            type: "autoForm/deleteAttach",
            payload: {
              // FileName: file.response && file.response.Datas ? "/" + file.response.Datas : file.name,
              Guid: fileName,
            }
          })
        }
      },
      // onPreview: this.handlePreview,
      ...acceptProps,
      multiple: true,
      listType: "picture-card",
      headers: {
        Authorization: "Bearer " + Cookie.get(config.cookieName)
      },
      data: {
        FileUuid: cuid,
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
      <Modal visible={this.state.previewVisible} footer={null} onCancel={() => {
        this.setState({ previewVisible: false })
      }}>
        {/* <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} /> */}
        <div style={{ position: 'relative', display: "flex", alignItems: "center" }}>
          <div className={styles.controller}>
            <LeftOutlined
              onClick={() => {
                this.carousel.prev()
              }} />
            <RightOutlined
              onClick={() => {
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
                  const nameSplit = item.name.split('.');
                  const postfix = nameSplit[nameSplit.length - 1];
                  if (postfix === 'gif' || postfix === 'jpg' || postfix === 'png' || postfix === 'bmp') {
                    return <div key={item.Guid}>
                      <img alt="example" style={{ width: '100%' }} src={item.url} />
                    </div>
                  }
                })
              }
            </Carousel>
          </MapInteractionCSS>
        </div>
      </Modal>
    </>;
  }
}


export default SdlUpload;
