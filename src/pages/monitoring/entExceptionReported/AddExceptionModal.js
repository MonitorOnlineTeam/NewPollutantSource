import React, { PureComponent } from 'react';
import { Modal, DatePicker, Form, Row, Col, Select, Input, Upload, Icon } from "antd";
import { connect } from "dva"
import cuid from 'cuid';
import moment from 'moment'


const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 15,
  },
}
@connect(({ loading, common, entExceptionReported, autoForm }) => ({
  pollutantListByDgimn: common.pollutantListByDgimn,
  addExceptionModalVisible: entExceptionReported.addExceptionModalVisible,
  exceptionReportedData: entExceptionReported.exceptionReportedData,
  fileList: autoForm.fileList,
  loading: loading.effects["entExceptionReported/saveAndUpdateException"],
}))
@Form.create()
class AddExceptionModal extends PureComponent {
  state = {
    cuid: this.props.cuid || cuid(),
    fileList: []
  }

  componentDidMount() {
    this.getPollutantListByDgimn()
    if (this.props.id) {
      this.getExceptionReportedById();
      this.props.dispatch({
        type: 'autoForm/getAttachmentList',
        payload: {
          FileUuid: this.state.cuid,
        },
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.id && prevState.fileList !== this.props.fileList) {
      this.props.form.setFieldsValue({ "Attachments": this.props.fileList })
      this.setState({
        fileList: this.props.fileList,
      })
    }
  }

  getExceptionReportedById = () => {
    this.props.dispatch({
      type: "entExceptionReported/getExceptionReportedById",
      payload: {
        ID: this.props.id
      }
    })
  }

  onSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("values=", values);
        // return;
        this.props.dispatch({
          type: "entExceptionReported/saveAndUpdateException",
          payload: {
            ...values,
            ID: this.props.id,
            DGIMN: this.props.DGIMN,
            Attachments: this.state.cuid,
            ExceptionType: values.ExceptionType.toString(),
            PollutantCodes: values.PollutantCodes.toString(),
          },
          callback: () => {
            this.props.onSuccess && this.props.onSuccess()
          }
        })
      }
    })

  }


  getPollutantListByDgimn = () => {
    this.props.dispatch({
      type: "common/getPollutantListByDgimn",
      payload: {
        DGIMNs: this.props.DGIMN
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, pollutantListByDgimn, addExceptionModalVisible, id, loading, exceptionReportedData } = this.props;
    const { cuid, fileList } = this.state;
    const props = {
      action: `/api/rest/PollutantSourceApi/UploadApi/PostFiles`,
      onChange: (info) => {
        if (info.file.status === 'done') {
          // this.props.form.setFieldsValue({ Attachments: cuid })
        } else if (info.file.status === 'error') {
          message.error('上传文件失败！')
        }
        this.setState({
          fileList: info.fileList
        })
      },
      onRemove(file) {
        dispatch({
          type: "autoForm/deleteAttach",
          payload: {
            Guid: file.uid,
          }
        })
      },
      multiple: true,
      listType: "picture-card",
      data: {
        FileUuid: cuid,
        FileActualType: '0',
      },
    };
    console.log("fileList=", fileList)
    return (
      <Modal
        title={id ? "编辑" : "添加"}
        width={770}
        visible={addExceptionModalVisible}
        destroyOnClose
        confirmLoading={loading}
        onOk={this.onSubmit}
        onCancel={() => {
          this.setState({ fileList: [] })
          this.props.dispatch({
            type: "entExceptionReported/updateState",
            payload: {
              addExceptionModalVisible: false
            }
          })
        }}
      >
        <Form>
          <Row>
            <Col span={12}>
              <FormItem {...layout} label="异常开始时间" style={{ width: '100%' }}>
                {getFieldDecorator("ExceptionBeginTime", {
                  initialValue: id ? moment(exceptionReportedData.ExceptionBeginTime) : undefined,
                  rules: [
                    {
                      required: true,
                      message: "请填写异常开始时间",
                    }
                  ],
                })(
                  <DatePicker showTime format="YYYY-MM-DD HH:00:00" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...layout} label="异常截至时间">
                {getFieldDecorator("ExceptionEndTime", {
                  initialValue: id ? moment(exceptionReportedData.ExceptionEndTime) : undefined,
                  rules: [
                    {
                      required: true,
                      message: "请填写异常开始时间",
                    }
                  ],
                })(
                  <DatePicker showTime format="YYYY-MM-DD HH:00:00" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...layout} label="异常数据类型">
                {getFieldDecorator("ExceptionType", {
                  initialValue: id ? exceptionReportedData.ExceptionType.split(",") : undefined,
                  rules: [
                    {
                      required: true,
                      message: "请选择异常数据类型",
                    }
                  ],
                })(
                  <Select mode="multiple" allowClear placeholder="请选择异常数据类型">
                    <Option key="HourData" value="HourData">小时数据</Option>
                    <Option key="DayData" value="DayData">日均数据</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...layout} label="异常监测因子">
                {getFieldDecorator("PollutantCodes", {
                  initialValue: id ? exceptionReportedData.PollutantCodes.split(",") : undefined,
                  rules: [
                    {
                      required: true,
                      message: "请选择异常监测因子",
                    }
                  ],
                })(
                  <Select placeholder="请选择异常监测因子" mode="multiple">
                    {
                      pollutantListByDgimn.map(item => {
                        return <Option key={item.PollutantCode} value={item.PollutantCode}>{item.PollutantName}</Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} label="异常描述" style={{ width: '100%' }}>
                {getFieldDecorator("ExceptionMsg", {
                  initialValue: id ? exceptionReportedData.ExceptionMsg : undefined,
                })(
                  <TextArea style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} label="异常报告" style={{ width: '100%' }}>
                {getFieldDecorator("Attachments", {
                  initialValue: id ? exceptionReportedData.Attachments : [],
                  rules: [
                    {
                      required: true,
                      message: "请上传文件",
                    }
                  ],
                })(
                  <Upload fileList={this.state.fileList} {...props}>
                    <div>
                      <Icon type="plus" />
                      <div className="ant-upload-text">文件上传</div>
                    </div>
                  </Upload>
                )}
              </FormItem>
            </Col>


          </Row>
          <Row>
            <Col style={{ fontSize: 12, color: "#666" }}>
              <p style={{ fontSize: 14 }}>说明：</p>
              <p style={{ textIndent: "2em", margin: 2 }}>1、如2020-11-02 13:00至2020-11-02 16:00连续4个小时数据发生异常，请填写异常开始时间2020-11-02 13:00，异常截至时间：2020-11-02 16:00；</p>
              <p style={{ textIndent: "2em", margin: 2 }}>2、如2020-11-02 13:00、16:00两个小时数据发生异常，请填写异常开始时间2020-11-02 13:00，异常截至时间：2020-11-02 16:00；</p>
              <p style={{ textIndent: "2em", margin: 2 }}>3、如2020-11-02 13:00、16:00两个小时数据发生异常，2020-11-02 00:00一个日数据异常，请填写开始时间2020-11-02 00:00，异常截至时间：2020-11-02 23:00；</p>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default AddExceptionModal;