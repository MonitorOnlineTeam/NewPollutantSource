import React, { Component, Fragment } from 'react';
import { Button, Card, Spin, Divider, Modal, Form, message } from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import styles from './index.less';
import MonitorContent from '@/components/MonitorContent/index';
import SdlTable from '@/components/AutoForm/Table';
import SearchWrapper from '@/components/AutoForm/SearchWrapper';
import SdlForm from '@/components/AutoForm/SdlForm';

@connect(({ loading, autoForm }) => ({
  loading: loading.effects['autoForm/getPageConfig'],
  autoForm,
  searchConfigItems: autoForm.searchConfigItems,
  // columns: autoForm.columns,
  tableInfo: autoForm.tableInfo,
  searchForm: autoForm.searchForm,
}))
@Form.create()
class YsyCameraIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      FormDatas: {},
    };
  }

  /** 初始化加载table配置 */
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId: 'CameraMonitor',
      },
    });
    dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId: 'VideoCamera',
      },
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const FormData = {};
        for (const key in values) {
          if (values[key] && values[key].fileList) {
            FormData[key] = uid;
          } else {
            FormData[key] = values[key] && values[key].toString();
          }
        }
        dispatch({
          type: 'video/IsTrueSerialNumber',
          payload: {
            SerialNumber: FormData.VedioCamera_No,
            callback: result => {
              if (result.Datas) {
                dispatch({
                  type: 'video/AddDevice',
                  payload: {
                    configId: 'VideoCamera',
                    FormData: {
                      ...FormData,
                      VedioDevice_ID: 1,
                    },
                    PointCode: this.props.match.params.Pointcode,
                    callback: result => {
                      this.setState({
                        visible: false,
                      });
                    },
                  },
                });
              } else {
                message.error('序列号或验证码不正确，请重新填写');
              }
            },
          },
        });
      }
    });
  };

  render() {
    const { dispatch, loading, match } = this.props;
    const pointDataWhere = [
      {
        Key: '[dbo]__[T_Bas_CameraMonitor]__BusinessCode',
        Value: match.params.Pointcode,
        Where: '$=',
      },
    ];
    if (loading) {
      return (
        <Spin
          style={{
            width: '100%',
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
      <MonitorContent
        breadCrumbList={[
          { Name: '首页', Url: '/' },
          { Name: '系统管理', Url: '' },
          { Name: '企业管理', Url: '' },
          { Name: '排口管理', Url: '' },
          { Name: '视频管理', Url: '' },
        ]}
      >
        <div className={styles.cardTitle}>
          <Card title={`${match.params.Pointname}-视频管理`}>
            <SearchWrapper configId="VideoCamera" />
            <SdlTable
              style={{ marginTop: 10 }}
              configId="CameraMonitor"
              searchParams={pointDataWhere}
              rowChange={(key, row) => {
                this.setState({
                  key,
                  row,
                });
              }}
              onAdd={() => {
                this.showModal();
              }}
              appendHandleRows={row => (
                <Fragment>
                  <Divider type="vertical" />
                  <a
                    onClick={() => {
                      dispatch(
                        routerRedux.push(
                          `/platformconfig/ysyshowvideo/${
                            row['dbo.T_Bas_VideoCamera.VedioCamera_ID']
                          }/${this.props.match.params.DGIMN}`,
                        ),
                      );
                    }}
                  >
                    播放
                  </a>
                  <Divider type="vertical" />
                </Fragment>
              )}
            />
          </Card>
          <Modal
            title="摄像头管理"
            visible={this.state.visible}
            destroyOnClose // 清除上次数据
            onOk={this.handleOk}
            okText="保存"
            cancelText="关闭"
            onCancel={() => {
              this.setState({
                visible: false,
              });
            }}
            width="50%"
          >
            <SdlForm configId="VideoCamera" form={this.props.form} noLoad hideBtns />
          </Modal>
        </div>
      </MonitorContent>
    );
  }
}
export default YsyCameraIndex;
