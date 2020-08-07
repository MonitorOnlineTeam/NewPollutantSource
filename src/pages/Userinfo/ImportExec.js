import React, { Component } from 'react';
import { Spin, Card, Icon, Divider, Row, Col, Button, Upload, message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

const pageUrl = {
  creatFiles: 'userinfo/CreatUserFiles',
  uploadfiles: 'userinfo/UploadUserfiles',
};
@connect(({ loading, importexec }) => ({
  isloading: loading.effects[pageUrl.creatFiles],
}))
class ImportExec extends Component {
  constructor(props) {
    super(props);
    const _this = this;
    this.state = {
      fileList: [],
      title: '',
      width: 200,
      Mvisible: false,
      fileLoading: false,
    };
    this.addimg = ({ file }) => {
      //验证传入类型
      const fileType = this.AuthenticationFormat(file.type);
      //验证后缀
      const postfix = this.VerificationPostfix(file.name);
      //双重验证
      if (fileType) {
        if (postfix) {
          _this.setState({
            fileLoading: true,
          });
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = function() {
            let base64 = reader.result;
            _this.props.dispatch({
              type: pageUrl.uploadfiles,
              payload: {
                file: base64.split(',')[1],
                fileName: file.name,
                callback: result => {
                  if (result.requstresult === '1') {
                    _this.setState({
                      fileLoading: false,
                    });
                    message.success('导入成功').then(() => {
                      _this.props.onback();
                    });
                  } else {
                    message.error(result.reason, 4).then(() => {
                      _this.props.onback();
                    });
                  }
                },
              },
            });
          };
        } else {
          message.error('上传格式不正确！');
        }
      } else {
        message.error('上传格式不正确！');
      }
    };
    //验证格式
    this.AuthenticationFormat = type => {
      if (
        type === 'application/vnd.ms-excel' ||
        type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        return true;
      }
      return false;
    };
    //验证后缀
    this.VerificationPostfix = name => {
      const nameSplit = name.split('.');
      const postfix = nameSplit[nameSplit.length - 1];
      if (postfix === 'xls') {
        return true;
      }
      return false;
    };
  }

  /**获取模版 */
  GetTemplet = () => {
    const { dispatch } = this.props;
    dispatch({
      type: pageUrl.creatFiles,
      payload: {
        callback: result => {
          if (result.requstresult === '1') {
            this.downloadFile('用户导入模板.xls');
          } else {
            message.error('模版初始化失败，请重试.');
          }
        },
      },
    });
  };

  /**下载模版 */
  downloadFile = returnName => {
    let a = document.createElement('a');
    a.href = `/upload/模板/${returnName}`;
    a.download = '';
    document.body.appendChild(a);
    a.click();
  };

  render() {
    const { isloading } = this.props;
    if (isloading) {
      return (
        <Spin
          style={{
            width: '768px',
            height: 'calc(100vh/2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          size="large"
        />
      );
    }
    return (
      <Card bordered={false}>
        <Row gutter={48}>
          <Col span={24}>
            {
              <span style={{ color: 'red', fontSize: '14' }}>
                <Icon type="info-circle" />
                <span>
                  注意：请先下载模版，此模版共四页，第一页内容除了备注列所有字段都是必填项，第二页为角色信息，添加是可以根据此信息选择对应编号，第三页为部门信息，添加是可以根据此信息选择对应编号，第四页为填写内容说明。
                </span>
              </span>
            }
          </Col>
        </Row>
        <Divider dashed={true} style={{ border: '1px dashed #00FFFF' }} />
        <Row gutter={48}>
          <Col span={24}>
            模版下载：
            <Button type="primary" onClick={() => this.GetTemplet()} icon="download">
              下载
            </Button>
          </Col>
        </Row>
        <Divider dashed={true} style={{ border: '1px dashed #00FFFF' }} />
        <Row gutter={48}>
          <Col span={24}>
            上传附件：
            <Upload customRequest={this.addimg}>
              <Button>
                <Icon type="upload" /> 上传
              </Button>
              <Spin
                delay={500}
                spinning={this.state.fileLoading}
                style={{
                  marginLeft: 10,
                  height: '100%',
                  width: '30px',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </Upload>
          </Col>
        </Row>
      </Card>
    );
  }
}
export default ImportExec;
