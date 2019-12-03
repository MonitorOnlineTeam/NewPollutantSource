/*
 * @Author: Jiaqi
 * @Date: 2019-11-15 15:46:20
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-12-03 11:53:30
 * @desc: 远程质控根页面
 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Input, Select, Alert, InputNumber, Tabs, Form, Row, Col, Divider, Result } from 'antd';
import { connect } from 'dva';
import NavigationTree from '@/components/NavigationTree'
import RemoteControlPage from './RemoteControlPage'
import PageLoading from '@/components/PageLoading'
import { router } from "umi"


const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

@Form.create()
@connect(({ loading, qualityControl }) => ({
  standardGasList: qualityControl.standardGasList,
  loading: loading.effects["navigationtree/getentandpoint"],
}))
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      QCAMN: null,
    };
    this._SELF_ = {
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
    }
  }

  render() {
    return (
      <>
        <NavigationTree QCAUse="1" onItemClick={value => {
          this.setState({
            initLoadSuccess: true
          })
          if (value.length > 0 && !value[0].IsEnt && value[0].QCAType == "2") {
            console.log("123123=", value[0])
            this.setState({
              QCAMN: value[0].key
            })
            this.props.dispatch({
              type: "qualityControl/updateState",
              payload: {
                currentQCAMN: value[0].key,
                qualityControlName: null, // 质控仪名称
                gasData: {  // 气瓶信息
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
              }
            })
          }
        }} />
        <div id="contentWrapper">
          <PageHeaderWrapper>
            {
              // 有质控仪
              (this.state.initLoadSuccess && this.state.QCAMN) &&
              <RemoteControlPage QCAMN={this.state.QCAMN} />
            }
            {
              // 无质控仪
              (this.state.initLoadSuccess && !this.state.QCAMN) &&
              <Result
                status="404"
                title="暂无数据"
                subTitle="请先去添加质控仪！"
                extra={
                  <Button type="primary" onClick={() => router.push('/qualityControl/instrumentManage/add')}>
                    添加质控仪
                  </Button>
                }
              ></Result>
            }
            {
              // 防止右侧内容空白，显示loading
              !this.state.initLoadSuccess &&
              <Card className="contentContainer">
                <PageLoading />
              </Card>
            }
          </PageHeaderWrapper>
        </div>
      </>
    );
  }
}

export default index;
