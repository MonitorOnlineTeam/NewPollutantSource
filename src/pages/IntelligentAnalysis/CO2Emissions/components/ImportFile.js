/*
 * @Author: Jiaqi 
 * @Date: 2022-06-30 15:39:45 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2022-07-01 11:56:34
 * @Description: 核算法导入组件
 */
import React, { PureComponent } from 'react';
import { Button, Row, Col, Upload, Modal, message, Spin } from 'antd'
import { ImportOutlined, UploadOutlined } from '@ant-design/icons'
import { connect } from 'dva'
import Cookie from 'js-cookie';
import config from '@/config'

@connect(({ loading, autoForm, CO2Emissions }) => ({
  
}))
class ImportFile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      uploadLoading: false,
      visible: false
    };
  }

  // 显示导入弹窗
  onShowModal = e => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };


  render() {
    const { uploadLoading } = this.state;
    const { industry } = this.props;
    const props = {
      name: 'file',
      multiple: true,
      headers: {
        Authorization: "Bearer " + Cookie.get(config.cookieName)
      },
      action: '/api/rest/PollutantSourceApi/BaseDataApi/PostCO2GHGData',
      data: {
      },
      beforeUpload: (file) => {
        this.setState({
          uploadLoading: true
        })
      },
      onChange: (info) => {
        if (info.file.status === 'done') {
          console.log("info-err=", info)
          message.success(info.file.response.Message, 10);
          this.props.onSuccess();
          this.setState({
            visible: false,
            uploadLoading: false
          })
        } else if (info.file.status === 'error') {
          console.error("info-err=", info)
          this.setState({
            uploadLoading: false
          })
          message.error(info.file.response.Message, 10)
        }
      },
    };
    return (
      <>
        <Button type="primary" icon={<ImportOutlined />} onClick={this.onShowModal}>导入</Button>
        <Modal
          title="导入"
          footer={[]}
          visible={this.state.visible}
          maskClosable={false}
          destroyOnClose
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Spin spinning={uploadLoading}>
            <Row>
              <Col span={18}>
                <Upload {...props}>
                  <Button>
                    <UploadOutlined /> 请选择文件
                  </Button>
                </Upload>
              </Col>
              <Col span={6} style={{ marginTop: 6 }}>
                <a onClick={() => {
                  this.props.dispatch({
                    type: 'CO2Material/GetGHGUploadTempletUrl',
                    payload: {
                      IndustryCode: industry
                    },
                  })
                }}>下载导入模板</a></Col>
            </Row>
          </Spin>
        </Modal>
      </>
    );
  }
}

export default ImportFile;