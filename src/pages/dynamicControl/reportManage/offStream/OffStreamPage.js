import React, { PureComponent } from 'react'
import { Card, Modal, Form, Select, Input, DatePicker, Upload, message, Button } from 'antd';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import { UploadOutlined } from '@ant-design/icons';
import cuid from 'cuid';
import moment from 'moment';
import { connect } from 'dva'

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
const stopTypes = {
  1: "停产",
  2: "停炉",
  3: "停运"
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const configId = "OutputStopNew"

@connect(({ offStream, loading }) => ({
  loading: loading.effects['offStream/saveOutputStop'],
}))
class OffStreamPage extends PureComponent {
  formRef = React.createRef();
  state = {
    uuid: cuid(),
    StopHours: "",
    searchParams: [{
      Key: '[dbo]__[T_Bas_OutputStop]__DGIMN',
      Value: this.props.DGIMN,
      Where: '$=',
    }],
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.DGIMN !== prevProps.DGIMN) {
      this.setState({
        searchParams: [{
          Key: '[dbo]__[T_Bas_OutputStop]__DGIMN',
          Value: this.props.DGIMN,
          Where: '$=',
        }]
      }, () => {
        this.getAutoFormData()
      })
    }
  }

  getAutoFormData = () => {
    this.props.dispatch({
      type: 'autoForm/getAutoFormData',
      payload: {
        configId: configId,
        searchParams: this.state.searchParams,
      },
    })
  }

  onDeleteStop = (record) => {
    this.props.dispatch({
      type: 'offStream/deleteStop',
      payload: {
        id: record["dbo.T_Bas_OutputStop.OutputStopID"],
      },
      callback: () => {
        this.getAutoFormData()
      }
    })
  }

  onFinish = () => {
    const { DGIMN } = this.props;
    const { StopHours } = this.state;
    this.formRef.current.validateFields().then((values) => {
      // return;
      this.props.dispatch({
        type: "offStream/saveOutputStop",
        payload: {
          beginTime: values["time"][0].format('YYYY-MM-DD HH:00:00'),
          endTime: values["time"][1].format('YYYY-MM-DD HH:00:00'),
          DGIMN: DGIMN,
          StopHours: StopHours,
          StopType: values.StopType,
          StopDescription: values.StopDescription,
          Attachment: values.Attachment,
        },
        callback: () => {
          this.setState({ visible: false, StopHours: "" })
          this.getAutoFormData()
        }
      })
    })
  };




  render() {
    const { uuid, searchParams } = this.state;
    const { loading } = this.props;

    const uploadProps = {
      name: 'file',
      action: '/api/rest/PollutantSourceApi/UploadApi/PostFiles',
      data: {
        FileUuid: uuid,
        FileActualType: '0',
      },
      headers: {
        authorization: 'authorization-text',
      },
      onChange: (info) => {
        if (info.file.status === 'done') {
          this.formRef.current.setFieldsValue({ Attachment: uuid })
        } else if (info.file.status === 'error') {
          message.error('上传文件失败！')
        }
        // this.setState({
        //   fileList: info.fileList
        // })
      },
      onRemove(file) {
        this.props.dispatch({
          type: "autoForm/deleteAttach",
          payload: {
            Guid: file.uid,
          }
        })
      },
    };


    return (
      <Card>
        <SearchWrapper
          configId={configId}
          searchParams={searchParams}
        />
        <AutoFormTable
          getPageConfig
          configId={configId}
          searchParams={searchParams}
          onDelete={(record, keys) => {
            this.onDeleteStop(record)
          }}
          onAdd={() => {
            this.setState({
              visible: true
            })
          }}
        />
        <Modal
          title="添加停运记录"
          width="600px"
          confirmLoading={loading}
          destroyOnClose
          visible={this.state.visible}
          onOk={this.onFinish}
          onCancel={() => { this.setState({ visible: false, StopHours: undefined }) }}
        >
          <Form
            {...layout}
            name="basic"
            ref={this.formRef}
            scrollToFirstError
          // initialValues={{ remember: true }}
          >
            <Form.Item
              label="停运类型"
              name="StopType"
              rules={[{ required: true, message: '请选择停运类型！' }]}
            >
              <Select placeholder="请选择停运类型">
                {
                  Object.keys(stopTypes).map((key) => {
                    return <Option key={key} value={key}>{stopTypes[key]}</Option>
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item
              label="停运时间"
              name="time"
              rules={[{ required: true, message: '请选择停运时间！' }]}
            >
              <RangePicker
                showTime={{ format: 'HH' }}
                format="YYYY-MM-DD HH"
                placeholder={['开始时间', '结束时间']}
                onChange={(dates, dateString) => {
                  if (dates) {
                    // console.log("dates-", dates)
                    // console.log("dateString-", dateString)
                    this.formRef.current.setFieldsValue({ time: dates })
                    const startTime = moment(dates[0]);
                    const endTime = moment(dates[1]);
                    // const diffHours = endTime.diff(startTime, "hours");//计算相差的小时数
                    const diffHours = moment(dateString[1]).diff(moment(dateString[0]), "hours");//计算相差的小时数
                    const day = Math.floor(diffHours / 24);//相差的天数
                    const hour = diffHours % 24;//计算相差天后余下的小时数
                    // console.log("diffHours=", diffHours)
                    // console.log("day=", day)
                    // console.log("hour=", hour)
                    let StopHours = `${day}天${hour}小时`;
                    this.setState({ StopHours: StopHours })
                  }else{
                    this.setState({ StopHours: "" })
                    this.formRef.current.setFieldsValue({ time: undefined })
                  }
                }}
              />
              {
                <span style={{ marginLeft: 10, color: "#ff9900d8" }}>{this.state.StopHours}</span>
              }
            </Form.Item>
            <Form.Item
              label="停运原因"
              name="StopDescription"
              rules={[{ required: true, message: '请输入停运原因!' }]}
            >
              <TextArea row={4} />
            </Form.Item>
            <Form.Item
              label="佐证材料"
              name="Attachment"
              rules={[{ required: true, message: '请上传佐证材料!' }]}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>上传</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    );
  }
}

export default OffStreamPage;