/*
 * @Author: Jiaqi
 * @Date: 2019-11-05 17:18:49
 * @Last Modified by: JiaQi
 * @Last Modified time: 2025-04-10 11:50:15
 * @desc: 上传组件
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getBase64 } from './utils';
import { LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Upload, Button, Modal, Carousel, message } from 'antd';
import cuid from 'cuid';
import config from '@/config';
import { connect } from 'dva';
import styles from './index.less';
import { MapInteractionCSS } from 'react-map-interaction';
import { API } from '@config/API';
import Cookie from 'js-cookie';
import ImageView from '@/components/ImageView';

@connect(({ loading, autoForm }) => ({
  // fileList: autoForm.fileList,
}))
class SdlUpload extends Component {
  constructor(props) {
    super(props);
    this._SELF_ = {
      cuid: this.props.cuid,
    };
    this.state = {
      previewVisible: false,
      fileList: this.handleFileList(this.props.fileList),
    };
  }

  // 处理fileList
  handleFileList = fileList => {
    if (!fileList) return [];
    return fileList.map((item, index) => ({
      ...item,
      index,
    }));
  };

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
        fileList: this.handleFileList(nextProps.fileList),
      });
    }
  }

  handlePreview = async file => {
    // const nameSplit = file.name.split('.');
    // const postfix = nameSplit[nameSplit.length - 1];
    // if (postfix === 'gif' || postfix === 'jpg' || postfix === 'png' || postfix === 'bmp') {
    this.setState({
      previewVisible: true,
      imageIndex: file.index,
    });
    // }
  };

  isAssetTypeAnImage(ext) {
    return (
      ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(
        ext.toLowerCase(),
      ) !== -1
    );
  }
  render() {
    const {
      configId,
      dispatch,
      accept,
      uploadNumber,
      flags,
      action,
      disabled,
      isView,
    } = this.props;
    const { previewVisible, imageIndex, fileList } = this.state;
    const { cuid } = this._SELF_;
    let imageProps = {};
    if (accept) {
      imageProps.accept = accept;
      // 正则校验accept是否存在image
      if (!/image\*/.test(accept)) {
        imageProps.onPreview = this.handlePreview;
      }
    }
    const props = {
      action: action || API.UploadApi.UploadFiles,
      headers: { Cookie: null, Authorization: 'Bearer ' + Cookie.get(config.cookieName) },
      onChange: info => {
        if (flags === 'img') {
          var index = info.file.name.lastIndexOf('.');
          var ext = info.file.name.substr(index + 1);
          if (!this.isAssetTypeAnImage(ext)) {
            message.error('上传文件类型失败！');
            return;
          }

          // var index= info.file.name.split(".")[];
        }
        let fileList = info.fileList;
        console.log('info=', info);
        if (info.file.status === 'done') {
          if (info.file.response?.IsSuccess) {
            if (info.file.response.Datas?.fNameList?.length <= 0) {
              message.error('上传文件不能为空');
              return;
            }
          }
          let before = '/';
          // setFieldsValue({ cuid: cuid })
          this.props.uploadSuccess && this.props.uploadSuccess(cuid);
          fileList[fileList.length - 1].url =
            before + fileList[fileList.length - 1].response.Datas?.fNameList;
          fileList[fileList.length - 1].thumbUrl =
            before + fileList[fileList.length - 1].response.Datas?.fNameList;
        } else if (info.file.status === 'error') {
          let msg = fileList[fileList.length - 1].response.Message;
          console.log('msg=', msg);
          message.error(msg || '上传文件失败！');
        }
        this.setState({
          fileList: fileList,
        });
        if (!fileList.length) {
          this.props.uploadSuccess && this.props.uploadSuccess(undefined);
        }
      },
      onRemove(file) {
        if (!file.error) {
          dispatch({
            type: 'autoForm/deleteAttach',
            payload: {
              // FileName: file.response && file.response.Datas ? file.response.Datas : file.name,
              Guid: file.response && file.response.Datas ? file.response.Datas : file.uid,
            },
          });
        }
      },
      ...imageProps,
      multiple: true,
      listType: 'picture-card',
      data: {
        FileUuid: cuid,
        FileActualType: '0',
      },
    };

    return (
      <>
        <Upload {...props} disabled={disabled || isView} fileList={fileList}>
          {!isView && (
            <>
              {uploadNumber ? (
                this.state.fileList.length >= uploadNumber ? null : (
                  <div>
                    <PlusOutlined />
                    <div className="ant-upload-text">文件上传</div>
                  </div>
                )
              ) : (
                <div>
                  <PlusOutlined />
                  <div className="ant-upload-text">文件上传</div>
                </div>
              )}
            </>
          )}
        </Upload>
        {/* 查看附件弹窗 */}
        <ImageView
          isOpen={previewVisible}
          images={fileList.map(item => item.url)}
          imageIndex={imageIndex}
          onCloseRequest={() => {
            this.setState({
              previewVisible: false,
            });
          }}
        />
      </>
    );
  }
}

export default SdlUpload;
