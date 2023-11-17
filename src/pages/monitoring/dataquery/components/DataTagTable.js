import React, { Component, Fragment } from 'react';
import SdlTable from '@/components/SdlTable';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Popover,
  Popconfirm,
  Row,
  Input,
  message,
  Alert,
  Divider,
  Table,
  Checkbox,
  Button,
  Modal,
  Select,
} from 'antd';
import { connect } from 'dva'
import { getDirLevel } from "@/utils/utils"
import moment from 'moment'
import styles from "../index.less"
const { TextArea } = Input;
const Option = Select.Option;

const _style = {
  flagBox: { position: 'relative' },
  flag: {
    position: "absolute",
    right: "12px",
    top: "-8px",
    color: "red",
    fontSize: 12,
  }
}

const hourFlag = [
  {
    value: "N",
    label: "参数正常 >45min",
  },
  {
    value: "F",
    label: "停运状态 ≥45min",
  },
  {
    value: "St",
    label: "启炉状态 ≥45min",
  },
  {
    value: "Sd",
    label: "停炉状态 ≥45min",
  },
  {
    value: "B",
    label: "闷炉状态 ≥45min",
  },
  {
    value: "T",
    label: "超测定上限",
  },
  {
    value: "C",
    label: "停炉状态 >15min",
  },
  {
    value: "M",
    label: "维护、修理状态 >15min",
  },
  {
    value: "D",
    label: "故障、断电状态 >15min",
  },
  {
    value: "Md",
    label: "无数据",
  }
]

const minuteFlag = [
  {
    value: "N",
    label: "参数正常"
  },
  {
    value: "F",
    label: "排放源停运"
  },
  {
    value: "St",
    label: "排放源启炉过程"
  },
  {
    value: "Sd",
    label: "排放源停炉过程"
  },
  {
    value: "B",
    label: "排放源闷炉"
  },
  {
    value: "C",
    label: "校准"
  },
  {
    value: "M",
    label: "维护保养"
  },
  {
    value: "Md",
    label: "系统无数据"
  },
  {
    value: "T",
    label: "超测定上限"
  },
  {
    value: "D",
    label: "系统故障"
  },
]



@connect(({ loading, dataquery }) => ({
  dataFlagDataSource: dataquery.dataFlagDataSource,
  updateLoading: loading.effects['dataquery/updateDataWryFlag']
}))
@Form.create()
class DataTagTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      dataSource: [],
      visible: false,
      prevQuarterStart: moment().quarter(moment().quarter() - 1).startOf('quarter').valueOf(),
      prevQuarterEnd: moment().quarter(moment().quarter() - 1).endOf('quarter').valueOf(),
      checkedRowList: {}, // 保存分页选中数据
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  // 判断时间是否在规定范围内（当前时间为本季度前5天，时间范围是否在上个季度内）
  isQualifiedTime = (time) => {
    let startQuarter = moment().startOf('quarter')
    let workingDays = [];
    // 获取本季度前5个工作日
    for (var i = 0; i < 31; i++) {
      let day = moment().startOf('quarter').add(i, "day").day();
      if (day !== 6 && day !== 0) {
        if (workingDays.length < 5) {
          workingDays.push(moment().startOf('quarter').add(i, "day").format("YYYY-MM-DD HH:mm:ss"))
        } else {
          break;
        }
      }
    }
    console.log("本季度前5个工作日=", workingDays)

    // 当期时间是否在本季度前5个工作日内
    let isBeforeFiveWorkday = workingDays.indexOf(moment().format("YYYY-MM-DD 00:00:00")) > -1;
    // 传入的时间是否是在上个季度内
    let timeIsInsideQuarter = moment(time).isBefore(this.state.prevQuarterEnd) && moment(time).isAfter(this.state.prevQuarterStart)
    // console.log("上季度开始时间"=", moment(this.state.prevQuarterStart).format("YYYY-MM-DD HH:mm:ss"))
    // console.log("上季度结束时间=", moment(this.state.prevQuarterEnd).format("YYYY-MM-DD HH:mm:ss"))
    // console.log("isBeforeFiveWorkday=", isBeforeFiveWorkday)
    // console.log("timeIsInsideQuarter=", timeIsInsideQuarter)
    return (isBeforeFiveWorkday && timeIsInsideQuarter);
  }


  resetCheckedRowList() {
    this.setState({ checkedRowList: {} })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dataFlagDataSource !== nextProps.dataFlagDataSource) {
      let dataSource = nextProps.dataFlagDataSource.map(item => {
        let newItem = item;
        for (const key in this.state.checkedRowList) {
          if (key === item.DataGatherCode + "/" + item.MonitorTime) {
            newItem = this.state.checkedRowList[key]
          }
        }
        return newItem
      })

      this.setState({
        dataSource
      })
    }
    if (this.props.columnsData !== nextProps.columnsData) {
      console.log("nextProps.columnsData=", nextProps.columnsData)
      let columns = nextProps.columnsData.map(item => {
        return {
          title: item.PollutantName,
          dataIndex: item.PollutantCode,
          render: (text, record, index) => {
            let _text = item.PollutantName === "风向" ? getDirLevel(text) : text;
            let content = _text != undefined ? _text : "-";
            let flag = record[item.PollutantCode + "_Flag"];
            // 判断是否显示复选框，时间在上个季度范围内时显示
            let isShowCheckBox = content !== "-" && this.isQualifiedTime(record.MonitorTime)
            if (flag && flag !== "N") {
              content = (
                <div style={_style.flagBox}>
                  <span style={_style.flag}>{flag}</span>
                  {content}
                </div>
              )
            }
            return (
              <div className={styles.tdItemBox}>
                {content}
                {
                  isShowCheckBox && <Checkbox checked={record[item.PollutantCode + "_checked"]} onChange={(e) => {
                    let newDataSource = [...this.state.dataSource];
                    let checkedRowList = { ...this.state.checkedRowList }
                    let currentListItem = newDataSource[index];
                    currentListItem[item.PollutantCode + "_checked"] = e.target.checked;
                    let checkedNum = currentListItem["checkedNum"] || 0;
                    if (e.target.checked) {
                      currentListItem["checkedNum"] = ++checkedNum;
                      // 选中后新增一条数据
                      checkedRowList[currentListItem.DataGatherCode + "/" + currentListItem.MonitorTime] = currentListItem;
                    } else {
                      currentListItem["checkedNum"] = --checkedNum;
                      // 如果行内没有选中的单元格，删除对应的key
                      currentListItem["checkedNum"] === 0 && delete checkedRowList[currentListItem.DataGatherCode + "/" + currentListItem.MonitorTime]
                    }
                    this.setState({
                      dataSource: newDataSource,
                      checkedRowList: checkedRowList,
                    })
                  }} />
                }

              </div>
            )
          }
        }
      })
      this.setState({
        columns: [
          {
            // title: <Checkbox
            //   onChange={(e) => { this.onCheckAll(e) }}
            // ></Checkbox>,
            title: "",
            width: 40,
            key: "checkbox",
            align: "center",
            // fixed: "left",
            render: (text, record, index) => {
              return <Checkbox
                indeterminate={record.checkedNum > 0 && record.checkedNum != nextProps.columnsData.length}
                onChange={(e) => { this.onCheckRowChange(e, record, index) }}
                checked={record.checkedNum == nextProps.columnsData.length}
                disabled={!this.isQualifiedTime(record.MonitorTime)}
              >
              </Checkbox>
            }
          },
          {
            title: '监测点名称',
            dataIndex: 'PointName',
            key: 'PointName',
            // fixed: "left",
          },
          {
            title: '时间',
            dataIndex: 'MonitorTime',
            key: 'MonitorTime',
            // fixed: "left",
            // render: (text, record) => {
            //   return this.props.dataType === "hour" ? moment(text).format("YYYY-MM-DD HH") + "时" : moment(text).format("YYYY-MM-DD")
            // }
          },
          ...columns
        ]
      })
    }
  }

  // 全选
  onCheckAll = (e) => {
    if (e.target.checked) {
      let dataSource = this.state.dataSource.map(item => {
        let newItem = item;
        this.props.columnsData.map(column => {
          newItem[column.PollutantCode + "_checked"] = true;
        })
        return newItem
      })
      this.setState({
        dataSource
      })
    }
  }


  // 选择行
  onCheckRowChange = (e, record, index) => {
    let newDataSource = [...this.state.dataSource];
    let currentListItem = newDataSource[index];
    let checkedRowList = { ...this.state.checkedRowList };
    let isShowCheckBox = moment(currentListItem.time).isBefore(this.state.prevQuarterEnd) && moment(currentListItem.time).isAfter(this.state.prevQuarterStart)
    if (e.target.checked) {
      // 全选行
      this.props.columnsData.map(item => {
        // 有数据、并且在规定范围之内
        // if (currentListItem[item.PollutantCode] !== undefined && isShowCheckBox) {
          newDataSource[index][item.PollutantCode + "_checked"] = true;
          // 选中后新增一条数据
          // checkedRowList[currentListItem.DataGatherCode + "/" + currentListItem.MonitorTime] = {
          //   ...currentListItem,
          //   checkedNum: this.props.columnsData.length
          // };
          checkedRowList[currentListItem.DataGatherCode + "/" + currentListItem.MonitorTime] = currentListItem;
        // }
      })
      newDataSource[index]["checkedNum"] = this.props.columnsData.length;
      checkedRowList[currentListItem.DataGatherCode + "/" + currentListItem.MonitorTime].checkedNum = this.props.columnsData.length
    } else {
      // 取消全选行
      this.props.columnsData.map(item => {
        newDataSource[index][item.PollutantCode + "_checked"] = false;
        // 选中后新增一条数据
        delete checkedRowList[currentListItem.DataGatherCode + "/" + currentListItem.MonitorTime]
      })
      newDataSource[index]["checkedNum"] = 0;
    }
    // console.log("newDataSource=", newDataSource)
    // console.log("checkedRowList=", checkedRowList)
    this.setState({
      dataSource: newDataSource,
      checkedRowList: checkedRowList
    })
  }

  // 改变状态
  changeStatus = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // let postData = [];
        // this.state.dataSource.map(item => {
        //   let itemObj = {};
        //   for (let key in item) {
        //     if (key.indexOf("_checked") && item[key] === true) {
        //       let keyFlag = key.split("_")[0];
        //       itemObj[keyFlag + "_Flag"] = values.status
        //       itemObj.flag = true;
        //       // postData.push({
        //       //   ...item,
        //       //   [keyFlag +"_Flag"]: values.status
        //       // })
        //     }
        //   }
        //   if (itemObj.flag) {
        //     postData.push({
        //       ...item,
        //       ...itemObj
        //     })
        //   }
        // })
        // const { checkedRowList } = this.state;
        const checkedRowList = { ...this.state.checkedRowList };
        let postData = {
          Data: [],
          DataType: this.props.dataType,
          Msg: values.msg,
        };
        for (const item in checkedRowList) {
          // let itemObj = {};
          for (const key in checkedRowList[item]) {
            // 替换 xx_Flag 为 values.status
            let keyFlag = key.split("_")[0];
            if (checkedRowList[item][keyFlag + "_checked"]) {
              checkedRowList[item][keyFlag + "_Flag"] = values.status
            }
            checkedRowList[item]["MonitorTime"] = this.props.dataType === "mins" ? moment(checkedRowList[item]["MonitorTime"]).format("YYYY-MM-DD HH:mm:00") : moment(checkedRowList[item]["MonitorTime"]).format("YYYY-MM-DD HH:00:00")
            // itemObj[keyFlag + "_Flag"] = values.status
          }
          postData.Data.push({
            ...checkedRowList[item],
            // ...itemObj
          })
        }

        if (!postData.Data.length) {
          message.error("请勾选要改变的数据");
          return;
        }
        console.log("postData=", postData);
        // return;
        this.props.dispatch({
          type: "dataquery/updateDataWryFlag",
          payload: postData,
          callback: () => {
            this.setState({ visible: false, checkedRowList: {} })
            this.props.form.resetFields();
            this.props.updateData()
          }
        })
      }
    });
  }

  cancelModal = () => {
    this.setState({
      visible: false
    })
  }


  render() {
    const { columns, dataSource, pageIndex, pageSize, checkedRowList } = this.state;
    const { dataType, isShowFlag, form: { getFieldDecorator }, tagTableTotal, updateLoading } = this.props;
    const flagList = dataType === "hour" ? hourFlag : minuteFlag;
    const _dataSource = [
      {

      }
    ]
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
      },
    };
    return (
      <>
        <Alert message={
          <p className="ant-result-subtitle" style={{ textAlign: "left", color: "#6f6868", fontSize: 12 }}>
            {
              flagList.map((item, index) => {
                return <Fragment key={index}>
                  <span>{item.value}：{item.label}</span>
                  {flagList.length != index + 1 && <Divider type="vertical" />}
                </Fragment>
              })
            }
          </p>
        } type="warning" showIcon style={{ marginBottom: 10 }} />
        <Button
          type="primary"
          style={{ marginBottom: 10 }}
          onClick={() => { this.setState({ visible: true }) }}
        >
          修改数据标记
      </Button>
        <SdlTable
          columns={columns}
          {...this.props}
          dataSource={dataSource}

        />
        <Modal
          title="修改数据状态"
          visible={this.state.visible}
          loading={updateLoading}
          onOk={this.changeStatus}
          onCancel={this.cancelModal}
        >
          <Form>
            <Form.Item {...formItemLayout} style={{ width: '100%' }} label="状态">
              {getFieldDecorator('status', {
                rules: [
                  {
                    required: true,
                    message: '请选择状态!',
                  },
                ]
              })(
                <Select placeholder="请选择状态">
                  {
                    flagList.map(item => {
                      return <Option value={item.value} key={item.value}>{item.value}：{item.label}</Option>
                    })
                  }
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} style={{ width: '100%' }} label="修改原因">
              {getFieldDecorator('msg', {
                rules: [
                  {
                    required: true,
                    message: '请填写修改原因!',
                  },
                ]
              })(
                <TextArea placeholder="请填写修改原因" />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default DataTagTable;
