import React, { PureComponent } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, DatePicker, Row, Col, Select, Input, Upload, message } from "antd";
import { connect } from "dva"
import cuid from 'cuid';
import moment from 'moment'
import {  API } from '@config/API';


const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14,
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
    if (this.props.id && prevProps.fileList !== this.props.fileList) {
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
        if (values.ExceptionBeginTime >= values.ExceptionEndTime) {
          message.error("截至时间必须大于开始时间，请重新选择时间！");
          return;
        }
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
            ExceptionBeginTime: values.ExceptionBeginTime ? moment(values.ExceptionBeginTime).format("YYYY-MM-DD HH:mm:ss") : undefined,
            ExceptionEndTime: values.ExceptionEndTime ? moment(values.ExceptionEndTime).format("YYYY-MM-DD HH:mm:ss") : undefined,
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
    const { form: { getFieldDecorator, getFieldValue }, pollutantListByDgimn, addExceptionModalVisible, id, loading, exceptionReportedData } = this.props;
    const { cuid, fileList } = this.state;
    const props = {
      action: API.UploadApi.UploadFiles,
      onChange: (info) => {
        let fileList = info.fileList;
        if (info.file.status === 'done') {
          this.props.form.setFieldsValue({ Attachments: cuid })
          fileList[fileList.length - 1].url = "/upload/" + fileList[fileList.length - 1].response.Datas
          fileList[fileList.length - 1].thumbUrl = "/upload/" + fileList[fileList.length - 1].response.Datas
          // delete fileList[fileList.length - 1].thumbUrl
        } else if (info.file.status === 'error') {
          message.error('上传文件失败！')
        }
        this.setState({
          fileList: fileList
        }, () => {
          if (!info.fileList.length) {
            this.props.form.setFieldsValue({ Attachments: [] })
          }
        })
      },
      onRemove: (file) => {
        this.props.dispatch({
          type: "autoForm/deleteAttach",
          payload: {
            Guid: file.response && file.response.Datas ? file.response.Datas : file.uid,
          }
        })
      },
      onPreview: (file) => {
        if (file.url) {
          window.open(file.url)
        } else {
          message.error("出现错误")
        }
      },
      multiple: true,
      listType: "picture-card",
      data: {
        FileUuid: cuid,
        FileActualType: '0',
      },
    };
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
                  <DatePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:00:00" />
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
                  <DatePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:00:00" />
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
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 19 }} label="异常描述" style={{ width: '100%' }}>
                {getFieldDecorator("ExceptionMsg", {
                  initialValue: id ? exceptionReportedData.ExceptionMsg : undefined,
                })(
                  <TextArea style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 19 }} label="异常报告" style={{ width: '100%' }}>
                {getFieldDecorator("Attachments", {
                  initialValue: id ? exceptionReportedData.Attachments : [],
                  rules: [
                    {
                      required: true,
                      message: "请上传文件",
                    }
                  ],
                })(
                  <>
                    <Upload fileList={this.state.fileList} {...props}>
                      <div>
                        <PlusOutlined />
                        <div className="ant-upload-text">文件上传</div>
                      </div>
                    </Upload>
                  </>
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
