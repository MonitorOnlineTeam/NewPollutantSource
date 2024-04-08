/*
 * @Author: JiaQi 
 * @Date: 2024-04-07 17:29:46 
 * @Last Modified by:   JiaQi 
 * @Last Modified time: 2024-04-07 17:29:46 
 * @Description:  导入弹窗
 */
import React, { PureComponent } from 'react';
import { Button, Row, Col, Upload, Modal, message, Spin } from 'antd';
import { ImportOutlined, UploadOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import Cookie from 'js-cookie';
import config from '@/config';
import { API } from '@config/API';

@connect(({ loading, autoForm, CO2Emissions }) => ({}))
class ImportFile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      uploadLoading: false,
      visible: false,
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
      name: 'files',
      // multiple: true,
      headers: {
        Authorization: 'Bearer ' + Cookie.get(config.cookieName),
      },
      action: API.CtAPI_WJQ.StandardGasValidity.ImportStandardAir,
      data: {},
      beforeUpload: file => {
        this.setState({
          uploadLoading: true,
        });
      },
      onChange: info => {
        if (info.file.status === 'done') {
          console.log('info-err=', info);
          if (info.file.response.IsSuccess) {
            message.success('导入成功');
            this.props.onSuccess();
          } else {
            message.error(info.file.response.Message, 6);
          }
          this.setState({
            visible: false,
            uploadLoading: false,
          });
        } else if (info.file.status === 'error') {
          console.error('info-err=', info);
          this.setState({
            uploadLoading: false,
          });
          message.error(`导入失败，出现错误：${info.file.response.Message}`, 6);
        }
      },
    };
    return (
      <>
        <Button type="primary" icon={<ImportOutlined />} onClick={this.onShowModal}>
          导入
        </Button>
        <Modal
          title="导入"
          footer={null}
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
                <a
                  onClick={() => {
                    this.props.dispatch({
                      type: 'standardGasValidity/GetStandardAirTemplate',
                      payload: {},
                    });
                  }}
                >
                  下载导入模板
                </a>
              </Col>
            </Row>
          </Spin>
        </Modal>
      </>
    );
  }
}

export default ImportFile;
