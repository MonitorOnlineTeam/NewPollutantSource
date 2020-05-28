import React, { Component } from 'react';
import SdlTable from '@/components/SdlTable';
import { Popover, Popconfirm, Row, Input, message, Alert, Form } from 'antd'
import { connect } from 'dva'
import { getDirLevel } from "@/utils/utils"
import moment from 'moment'
const { TextArea } = Input;

const _style = {
  flagBox: { position: 'relative' },
  flag: {
    position: "absolute",
    right: "-4px",
    top: "-8px",
    color: "red",
    fontSize: 12,
  }
}


@connect()
@Form.create()
class DataAuditTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: ""
    };
  }

  popconfirmContent = (flag) => {
    const { form: { getFieldDecorator } } = this.props;
    const { msg } = this.state;
    let color = "#34c066"
    let text = "有效数据";
    if (flag === "N") {
      color = "red";
      text = "无效数据"
    }
    return <div>
      <p style={{ marginBottom: 4 }}>数据将被修改为<span style={{ color: color }}>{text}</span>，请填写 </p>
      <label className="ant-form-item-required">修改原因：</label>
      <Form>
        <Form.Item>
          {getFieldDecorator('msg', {})(
            <Input style={{ marginTop: 4 }} />
          )}
        </Form.Item>
      </Form>
    </div>
  }

  changeValueStatus = (record, pollutantCode, flag) => {
    if (!this.props.form.getFieldValue("msg")) {
      message.error("请填写修改原因！");
      return;
    }
    let time = this.props.dataType === "hour" ? record.MonitorTime + ":00:00" : record.MonitorTime + " 00:00:00"
    this.props.dispatch({
      type: "dataquery/updateDataFlag",
      payload: {
        MonitorTime: time,
        UpdateState: flag === "N" ? "RM" : "N",
        Msg: this.props.form.getFieldValue("msg"),
        DataType: this.props.dataType,
        PollutantCode: pollutantCode,
        DataGatherCode: record.DataGatherCode
      },
      callback: () => {
        this.props.updateData && this.props.updateData()
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.columnsData !== nextProps.columnsData) {
      let columns = nextProps.columnsData.map(item => {
        return {
          title: item.PollutantName,
          dataIndex: item.PollutantCode,
          render: (text, record) => {
            let _text = item.PollutantName === "风向" ? getDirLevel(text) : text;
            let content = _text != undefined ? _text : "-";
            let flag = record[item.PollutantCode + "_Flag"];
            if (flag && flag !== "N") {
              content = (
                <div style={_style.flagBox}>
                  <span style={_style.flag}>{flag}</span>
                  {content}
                </div>
              )
            }
            if (this.props.isShowFlag) {
              return (
                <Popconfirm
                  title={this.popconfirmContent(flag)}
                  onConfirm={(e) => {
                    this.changeValueStatus(record, item.PollutantCode, flag)
                  }}
                  onCancel={(e) => {
                    this.props.form.setFieldsValue({ "msg": "" })
                  }}
                  okText="确认"
                  cancelText="取消"
                >
                  <div style={{ cursor: 'pointer' }} onClick={() => { this.props.form.setFieldsValue({ "msg": "" }) }}>
                    {content}
                  </div>
                </Popconfirm>)
            }
            return <div>
              {content}
            </div>
          }
        }
      })

      this.setState({
        columns: [
          {
            title: '监测点名称',
            dataIndex: 'PointName',
            key: 'PointName',
            width: 150,
            // fixed: "left",
          },
          {
            title: '时间',
            dataIndex: 'MonitorTime',
            key: 'MonitorTime',
            // fixed: "left",
            render: (text, record) => {
              return this.props.dataType === "hour" ? moment(text).format("YYYY-MM-DD HH") + "时" : moment(text).format("YYYY-MM-DD")
            }
          },
          ...columns
        ]
      })
    }
  }

  render() {
    const { columns } = this.state;
    const { dataType, isShowFlag } = this.props;
    return (
      <>
        {
          isShowFlag && (dataType === "hour" ? <Alert message={
            <p className="ant-result-subtitle" style={{ textAlign: "left", color: "#6f6868", fontSize: 12 }}>
              H：有效数据不足 BB：连接不良 B：运行不良 W：等待数据恢复 HSp：数据超上限 LSp：数据超下限 PS：跨度检查 PZ：零点检查 AS：精度检查 CZ：零点校准 CS：跨度校准 RM：自动或人工审核为无效 E或D：站点有效个数不足 LT：缺仪器温度 LP：缺仪器压力 NT：无温度值 NP：无压力值
          </p>
          } type="warning" showIcon style={{ marginBottom: 10 }} />
            : <Alert message={
              <p className="ant-result-subtitle" style={{ textAlign: "left", color: "#6f6868", fontSize: 12 }}>
                H：有效数据不足 BB：连接不良 B：运行不良 W：等待数据恢复 HSp：数据超上限 LSp：数据超下限 PS：跨度检查 PZ：零点检查 AS：精度检查 CZ：零点校准 CS：跨度校准 RM：自动或人工审核为无效 E或D：站点有效个数不足
          </p>
            } type="warning" showIcon style={{ marginBottom: 10 }} />)
        }

        <SdlTable columns={columns} {...this.props} defaultWidth={70} />
      </>
    );
  }
}

export default DataAuditTable;
