import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Row, Select, Col, DatePicker, Button, Form, Input, Alert } from "antd"
import SdlTable from '@/components/SdlTable';
import { connect } from "dva";
import SelectPollutantType from '@/components/SelectPollutantType'
import SdlCascader from '../AutoFormManager/SdlCascader'
import NavigationTree from '@/components/NavigationTree'
import moment from 'moment'
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
      PollutantType: null,
      columns: []
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
            render: (text, record) => {
              
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
          defaultPollutant={"undefined"}
          choice
          onItemClick={value => {
            if (value.length) {
              console.log('value=', value)
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
        <div id="contentWrapper">
          <PageHeaderWrapper>
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
          </PageHeaderWrapper>
        </div>
      </>
    );
  }
}

export default DataGainRatePage;