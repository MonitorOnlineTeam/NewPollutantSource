import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import NavigationTree from '@/components/NavigationTree'
import { PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Modal,
  Button,
  Row,
  Col,
  Select,
  DatePicker,
  Tooltip,
  Divider,
  Popconfirm,
} from "antd";
import { connect } from "dva"
import moment from 'moment'
import SdlTable from '@/components/SdlTable'
import { EditIcon, DetailIcon, DelIcon } from '@/utils/icon'
import AttachmentView from '@/components/AttachmentView'
import AddExceptionModal from './AddExceptionModal'
import TableText from '@/components/TableText'
import { uploadPrefix } from '@/config'

const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ loading, common, entExceptionReported }) => ({
  pollutantListByDgimn: common.pollutantListByDgimn,
  tableDataSource: entExceptionReported.tableDataSource,
  addExceptionModalVisible: entExceptionReported.addExceptionModalVisible,
  queryLoding: loading.effects['entExceptionReported/getTableData'],
}))
@Form.create()
class Test extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      DGIMN: "",
      PollutantCodes: [],
      columns: [
        {
          title: '异常开始时间',
          dataIndex: 'BeginTime',
          key: 'BeginTime',
        },
        {
          title: '异常截止时间',
          dataIndex: 'EndTime',
          key: 'EndTime',
        },
        {
          title: '异常数据类型',
          dataIndex: 'DataType',
          key: 'DataType',
          width: 100,
        },
        {
          title: '异常监测因子',
          dataIndex: 'PollutantNames',
          key: 'PollutantNames',
        },
        {
          title: '异常描述',
          dataIndex: 'Msg',
          key: 'Msg',
          render: (text, record) => {
            return <TableText content={text} />
          }
        },
        {
          title: '附件',
          dataIndex: 'Attachments',
          key: 'Attachments',
          render: (value, record) => {
            const fileInfo = value.ImgNameList ? value.ImgNameList : [];
            let dataSource = fileInfo.map(item => {
              return {
                name: item,
                attach: `${uploadPrefix}/${item}`
              }
            })
            return (
              <AttachmentView dataSource={dataSource} />
            )
          }
        },
        {
          title: '上报人',
          dataIndex: 'ReportName',
          key: 'ReportName',
        },
        {
          title: '上报时间',
          dataIndex: 'ReportTime',
          key: 'ReportTime',
        },
        {
          title: '操作',
          render: (text, record) => {
            return <>
              <Tooltip title="编辑">
                <a onClick={() => {
                  this.props.dispatch({ type: "entExceptionReported/updateState", payload: { addExceptionModalVisible: true } })
                  this.setState({
                    id: record.ID,
                    cuid: record.AttachmentsID
                  })
                }}><EditIcon /></a>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="删除">
                <Popconfirm
                  placement="left"
                  title="确认是否删除?"
                  onConfirm={() => {
                    this.deleteExceptionItem(record.ID);
                  }}
                  okText="是"
                  cancelText="否">
                  <a ><DelIcon /></a>
                </Popconfirm>
              </Tooltip>
            </>
          }
        },
      ],
    };
  }





  getTableData = () => {
    let values = this.props.form.getFieldsValue();
    let ExceptionBBtime = values.time1 && values.time1.length ? moment(values.time1[0]).format('YYYY-MM-DD HH:00:00') : undefined;
    let ExceptionBEtime = values.time1 && values.time1.length ? moment(values.time1[1]).format('YYYY-MM-DD HH:00:00') : undefined;
    let ExceptionEBtime = values.time2 && values.time2.length ? moment(values.time2[0]).format('YYYY-MM-DD HH:00:00') : undefined;
    let ExceptionEEtime = values.time2 && values.time2.length ? moment(values.time2[1]).format('YYYY-MM-DD HH:00:00') : undefined;
    this.props.dispatch({
      type: "entExceptionReported/getTableData",
      payload: {
        ExceptionBBtime,
        ExceptionBEtime,
        ExceptionEBtime,
        ExceptionEEtime,
        DataType: values.DataType ? values.DataType.toString() : undefined,
        DGIMN: this.state.DGIMN,
      }
    })
  }

  // 删除
  deleteExceptionItem = (id) => {
    this.props.dispatch({
      type: "entExceptionReported/deleteExceptionItem",
      payload: {
        ID: id
      },
      callback: () => {
        this.getTableData()
      }
    })
  }



  render() {
    const { DGIMN, columns, id, cuid } = this.state;
    const { form: { getFieldDecorator }, pollutantListByDgimn, tableDataSource, queryLoding, addExceptionModalVisible } = this.props;
    return <>
      <NavigationTree domId="#entExceptionReported" choice={false} onItemClick={value => {
        if (value.length > 0 && !value[0].IsEnt) {
          this.setState({
            DGIMN: value[0].key,
          }, () => {
            this.getTableData()
          })
        }
      }} />
      <div id="entExceptionReported">
        <BreadcrumbWrapper>
          <Card>
            <Form layout="inline" style={{ marginBottom: 10 }}>
              <Row>
                <FormItem label={<span >异常开始时间</span>}>
                  {getFieldDecorator('time1', {
                    initialValue: [moment().subtract(1, 'month'), moment()]
                  })(
                    <RangePicker showTime format="YYYY-MM-DD HH" />
                  )}
                </FormItem>
                <FormItem label={<span>异常结束时间</span>}>
                  {getFieldDecorator('time2', {
                    // initialValue: [moment().subtract(1, 'month'), moment()]
                  })(
                    <RangePicker showTime format="YYYY-MM-DD HH" />
                  )}
                </FormItem>
              </Row>
              <Row>
                <FormItem label={<span >异常数据类型</span>}>
                  {getFieldDecorator('DataType', {
                    // initialValue: ["HourData"]
                  })(
                    <Select mode="multiple" allowClear style={{ width: 314 }} placeholder="请选择异常数据类型">
                      <Option key="HourData" value="HourData">小时数据</Option>
                      <Option key="DayData" value="DayData">日均数据</Option>
                    </Select>
                  )}
                </FormItem>
                <div style={{ display: 'inline-block', lineHeight: "40px" }}>
                  <Button loading={queryLoding} type="primary" onClick={() => {
                    this.getTableData()
                  }}>
                    查询
                  </Button>
                  <Button
                    type="primary"
                    style={{ margin: '0 5px' }}
                    icon={<PlusOutlined />}
                    onClick={() => {
                      this.setState({ id: undefined, cuid: undefined })
                      this.props.dispatch({ type: "entExceptionReported/updateState", payload: { addExceptionModalVisible: true } })
                    }}
                  >
                    添加
                  </Button>
                  <span style={{ color: "red", marginLeft: 10 }}>上报停运时段以外，监测数据发生异常的异常报告信息。</span>
                </div>
              </Row>
            </Form>
            <SdlTable align="center" loading={queryLoding} columns={columns} dataSource={tableDataSource} />
          </Card>
        </BreadcrumbWrapper>
        {addExceptionModalVisible && <AddExceptionModal DGIMN={DGIMN} id={id} cuid={cuid} onSuccess={() => {
          this.getTableData();
        }} />}
      </div>
    </>;
  }
}

export default Test;