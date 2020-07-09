/*
 * @Author: Jiaqi
 * @Date: 2019-11-15 15:46:20
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-12-05 14:23:07
 * @desc: 远程质控根页面
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Button,
  Input,
  Select,
  Alert,
  InputNumber,
  Tabs,
  Row,
  Col,
  Divider,
  Result,
} from 'antd';
import { connect } from 'dva';
import NavigationTree from '@/components/NavigationTree';
import NavigationTreeQCA from '@/components/NavigationTreeQCA';
import RemoteControlPage from './RemoteControlPage';
import PageLoading from '@/components/PageLoading';
import { router } from 'umi';

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

@Form.create()
@connect(({ loading, qualityControl }) => ({
  standardGasList: qualityControl.standardGasList,
  loading: loading.effects['navigationtree/getentandpoint'],
}))
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      QCAMN: null,
      subTitle: '请先去添加质控仪！',
      extra: '',
    };
    this._SELF_ = {
      treeType: this.props.history.location.query.treeType,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
      },
    };
  }

  render() {
    const { loading } = this.props;
    const { extra, subTitle } = this.state;
    return (
      <>
        {this._SELF_.treeType === 'MN' ? (
          <NavigationTree
            domId="#remoteControl"
            onItemClick={value => {
              this.setState({
                initLoadSuccess: true,
              });
              if (value.length > 0 && !value[0].IsEnt) {
                this.props.dispatch({
                  type: 'qualityControl/getQCAMNByDGIMN',
                  payload: {
                    DGIMN: value[0].key,
                  },
                  callback: QCAMN => {
                    if (this.state.QCAMN !== QCAMN) {
                      this.props.dispatch({
                        type: 'qualityControl/updateState',
                        payload: {
                          currentQCAMN: QCAMN,
                          qualityControlName: null, // 质控仪名称
                          gasData: {
                            // 气瓶信息
                            N2Info: {},
                            NOxInfo: {},
                            SO2Info: {},
                            O2Info: {},
                          },
                          cemsList: [{}, {}, {}, {}], // CEMS列表
                          valveStatus: {}, // 阀门状态
                          flowList: {}, // 气瓶流量
                          p2Pressure: {},
                          p1Pressure: {},
                          QCStatus: undefined,
                          standardValueUtin: null,
                        },
                      });
                    }
                    this.setState({
                      QCAMN: QCAMN,
                      subTitle: '当前排口暂未关联质控仪！',
                      extra: '',
                    });
                  },
                });
              }
            }}
          />
        ) : (
          <NavigationTreeQCA
            QCAUse="1"
            domId="#remoteControl"
            onItemClick={value => {
              this.setState({
                initLoadSuccess: true,
              });
              if (value.length > 0 && !value[0].IsEnt && value[0].QCAType == '2') {
                if (this.state.QCAMN !== value[0].key) {
                  this.props.dispatch({
                    type: 'qualityControl/updateState',
                    payload: {
                      currentQCAMN: value[0].key,
                      qualityControlName: null, // 质控仪名称
                      gasData: {
                        // 气瓶信息
                        N2Info: {},
                        NOxInfo: {},
                        SO2Info: {},
                        O2Info: {},
                      },
                      cemsList: [{}, {}, {}, {}], // CEMS列表
                      valveStatus: {}, // 阀门状态
                      flowList: {}, // 气瓶流量
                      p2Pressure: {},
                      p1Pressure: {},
                      QCStatus: undefined,
                      standardValueUtin: null,
                    },
                  });
                }
                this.setState({
                  QCAMN: value[0].key,
                  extra: (
                    <Button
                      type="primary"
                      onClick={() =>
                        router.push(
                          '/qualityControl/qcaManager/instrumentManage/add?tabName=质控仪 - 添加',
                        )
                      }
                    >
                      添加质控仪
                    </Button>
                  ),
                });
              }
            }}
          />
        )}

        <div id="remoteControl">
          <BreadcrumbWrapper>
            {// 有质控仪
            this.state.initLoadSuccess && this.state.QCAMN && (
              <RemoteControlPage QCAMN={this.state.QCAMN} />
            )}
            {// 无质控仪
            !this.state.QCAMN && loading ? (
              <Card className="contentContainer">
                <PageLoading />
              </Card>
            ) : !loading && !this.state.QCAMN ? (
              <Result status="404" title="暂无数据" subTitle={subTitle} extra={extra}></Result>
            ) : null}
            {/* {
              // 防止右侧内容空白，显示loading
              (!this.state.initLoadSuccess && !this.state.QCAMN) &&  
              <Card className="contentContainer">
                <PageLoading />
              </Card>
            } */}
          </BreadcrumbWrapper>
        </div>
      </>
    );
  }
}

export default index;
