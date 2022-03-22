import React, { PureComponent } from 'react';
import { Card, Upload, message, Spin } from 'antd'
import Cookie from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import config from '@/config'
import { InboxOutlined } from "@ant-design/icons"
import { connect } from 'dva';

const { Dragger } = Upload;

@connect(({ loading, emergency }) => ({
  loading: loading.effects['emergency/getRelationTable'],
}))
class FileUpload extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'emergency/getRelationTable',
      payload: {
        Type: 3,
        AlarmInfoCode: this.props.AlarmInfoCode,
      },
      callback: (res) => {
        console.log('res=', res)
        let fileNameList = res.length ? res.split(',') : [];
        let fileList = [];
        if (fileNameList.length) {
          fileList = fileNameList.map((item, index) => {
            return {
              uid: index,
              name: item,
              status: 'done',
              url: `/upload/${item}`,
            }
          })
        }
        this.setState({
          fileList: fileList
        })
      }
    })
  }


  render() {
    const { fileList } = this.state;
    const { AlarmInfoCode, loading, dispatch } = this.props;

    console.log('fileList=', fileList)
    const props = {
      name: 'file',
      multiple: true,
      showUploadList: {
        showDownloadIcon: true,
        showRemoveIcon: true,
      },
      defaultFileList: fileList,
      action: '/api/rest/PollutantSourceApi/UploadApi/PostFiles',
      headers: {
        Authorization: "Bearer " + Cookie.get(config.cookieName)
      },
      data: {
        // ssoToken: Cookie.get(config.cookieName),
        FileUuid: AlarmInfoCode,
      },
      onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          // message.success(`${info.file.name} file uploaded successfully.`);
          if (info.file.response.IsSuccess) {
            message.success('上传成功');
          }
        } else if (status === 'error') {
          message.error(info.file.response.Message);
        }
      },
      onRemove(file) {
        if (!file.error) {
          dispatch({
            type: "autoForm/deleteAttach",
            payload: {
              FileName: file.response && file.response.Datas ? file.response.Datas : file.name,
              Guid: file.response && file.response.Datas ? file.response.Datas : file.name,
              FileUuid: AlarmInfoCode
            }
          })
        }
      },
      onDrop(e) {
        // console.log('Dropped files', e.dataTransfer.files);
      },
    };

    return (
      <Card title="音视频材料" type="inner">
        {
          loading ? <div className="example"><Spin></Spin></div> :
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">单击或拖动文件到该区域进行上传</p>
              <p className="ant-upload-hint">
                支持单个或批量上传.
              </p>
            </Dragger>
        }
      </Card>
    );
  }
}

export default FileUpload;