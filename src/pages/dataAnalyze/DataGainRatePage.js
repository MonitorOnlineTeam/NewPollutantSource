/*
 * @Author: Jiaqi 
 * @Date: 2020-01-10 10:44:13 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-01-10 17:58:46
 * @Description: 数据获取率
 */
import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { Card, Row, Select, Col, DatePicker, Button, Form, Input, Alert, Icon, Modal, message } from "antd"
import SdlTable from '@/components/SdlTable';
import { connect } from "dva";
import SelectPollutantType from '@/components/SelectPollutantType'
import SdlCascader from '../AutoFormManager/SdlCascader'
import NavigationTree from '@/components/NavigationTree'
import moment from 'moment'
import DataDetailPage from './DataDetailPage'
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

@Form.create({})
@connect(({ loading, global, dataAnalyze }) => ({
  configInfo: global.configInfo,
  dataGainRateColumn: dataAnalyze.dataGainRateColumn,
  dataGainRateTableData: dataAnalyze.dataGainRateTableData,
  loading: loading.effects["dataAnalyze/getDataGainRateTableData"]
}))
class DataGainRatePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      DGIMNs: [],
      DGIMN: [],
      PollutantType: null,
      columns: [],
      visible: false,
    };
  }

  // 获取表头
  getDataGainRateColumn = () => {
    this.props.dispatch({
      type: "dataAnalyze/getDataGainRateColumn",
      payload: {
        PollutantType: this.state.PollutantType,
        DGIMN: this.state.DGIMNs
      }
    })
  }

  // 获取table数据
  getDataGainRateTableData = () => {
    const recordTime = moment();
    this.props.dispatch({
      type: "dataAnalyze/getDataGainRateTableData",
      payload: {
        PollutantType: this.state.PollutantType,
        DGIMN: this.state.DGIMNs,
        Time: moment(recordTime).format("YYYY-MM-DD HH:mm:ss")
      },
      callback: () => {
        this.setState({
          recordTime
        })
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dataGainRateColumn !== nextProps.dataGainRateColumn) {
      let columns = nextProps.dataGainRateColumn.map(item => {
        return {
          title: `${item.PollutantName}`,
          dataIndex: item.PollutantCode,
          render: (text, record) => {
            let color = "";
            let _text = text ? text : "-";
            if (record[item.PollutantCode + "_Color"]) {
              color = record[item.PollutantCode + "_Color"];
            }
            color = color === "#000" ? "" : color;
            return <span style={{ color: color }}>{_text}</span>
          }
        }
      })
      this.setState({
        columns: [
          {
            title: "站点",
            dataIndex: "PointName",
            fixed: "left",
            width: 200,
          },
          ...columns,
          {
            title: "操作",
            width: 200,
            fixed: "right",
            align: "center",
            render: (text, record) => {
              return <a onClick={() => {
                this.setState({
                  visible: true,
                  DGIMN: record.DGIMN
                })
              }}><Icon type="profile" /></a>
            }
          },
        ]
      })
    }
  }


  render() {
    const { columns } = this.state;
    const { dataGainRateTableData, loading } = this.props;
    return (
      <>
        <NavigationTree
          // defaultPollutant={"undefined"}
          choice
          checkpPol="5"
          polShow
          domId="#dataGainRatePage"
          onItemClick={value => {
            if (value.length) {
              let DGIMNsList = value.filter(item => item.IsEnt === false);
              this.setState({
                DGIMNs: DGIMNsList.map(item => item.key),
                PollutantType: DGIMNsList[0].Type
              }, () => {
                this.getDataGainRateColumn();
                this.getDataGainRateTableData();
              })
            } else {
              message.error("请在左侧勾选监测点")
            }
          }}
        />
        <div id="dataGainRatePage">
          <BreadcrumbWrapper>
            <Card
              className="contentContainer"
            // title={this.cardTitle()}
            >
              <Alert message={
                <p className="ant-result-subtitle" style={{ textAlign: "left", color: "#6f6868" }}>
                  最近24小时各子站数据获取情况，不足24条时：大于19条颜色为 <span style={{ color: "#efbe0f" }}>橙色</span>，小于等于19条颜色为 <span style={{ color: "#ea2d0e" }}>红色</span>，无该项目显示为 -
              </p>
              } type="warning" showIcon style={{ marginBottom: 10 }} />
              {/* <p className="ant-result-subtitle" style={{ textAlign: "left", color: "#6f6868", marginBottom: 10 }}>
                最近24小时各子站数据获取情况，不足24条时：大于19条颜色为<span style={{ color: "#efbe0f" }}>橙色</span>，小于等于19条颜色为<span style={{ color: "#ea2d0e" }}>红色</span>，无该项目显示为-
              </p> */}
              <SdlTable loading={loading} dataSource={dataGainRateTableData} columns={columns} defaultWidth={100} pagination={{ pageSize: 20 }} />
            </Card>
          </BreadcrumbWrapper>
          <Modal
            title="查看详情"
            destroyOnClose
            footer={[]}
            visible={this.state.visible}
            onOk={this.handleOk}
            width={"90%"}
            // style={{ height: "90vh" }}
            onCancel={() => { this.setState({ visible: false }) }}
          >
            <DataDetailPage DGIMN={this.state.DGIMN} time={[moment(this.state.recordTime).add(-23, "hour"), moment(this.state.recordTime)]} dataType={"hour"} />
          </Modal>
        </div>
      </>
    );
  }
}

export default DataGainRatePage;