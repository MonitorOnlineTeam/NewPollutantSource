import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { Modal, Form, Row, Col, Card, Input, Button, Radio, Spin, message, Select, Space, DatePicker } from "antd"
import config from '@/config'
import Cookie from 'js-cookie';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import cuid from 'cuid';
import SdlMap from '@/pages/AutoFormManager/SdlMap';
import SdlCascader from '@/pages/AutoFormManager/SdlCascader';
import moment from 'moment';
import { connect } from 'dva';
import Ent from './components/Ent'
import MinGan from './components/MinGan'
import FileUpload from './components/FileUpload'

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ loading, emergency }) => ({
  loading: loading.effects['emergency/getDutyOne'],
  dictionaryList: emergency.dictionaryList,
  dutyOneData: emergency.dutyOneData,
}))
class Details extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {

    };

    this._SELF_ = {
      AlarmInfoCode: this.props.history.location.query.code
    }
  }

  componentDidMount() {
    const { AlarmInfoCode } = this._SELF_;
    //获取数据
    this._dispatch('emergency/getDutyOne', { AlarmInfoCode: AlarmInfoCode })
    // 获取时间类型
    this.getDictionaryList()
  }

  // 获取下拉列表数据
  getDictionaryList = () => {
    this._dispatch('emergency/getDictionaryList')
  }

  _dispatch = (actionType, payload, callback) => {
    this.props.dispatch({
      type: actionType,
      payload: payload || {},
      callback: (res) => {
        callback && callback(res)
      }
    })
  }

  // 保存甄别基本信息
  onSubmit = () => {
    this.formRef.current.validateFields().then((values) => {
      console.log("values=", values)
      let postData = {
        ...values,
        RegionCode: values.RegionCode.toString(),
        AlarmInfoCode: this._SELF_.AlarmInfoCode,
        ScreenBeginTime: values.time[0].format("YYYY-MM-DD 00:00:00"),
        ScreenEndTime: values.time[1].format("YYYY-MM-DD 23:59:59"),
      }
      this._dispatch('emergency/saveIdentifyInfo', postData)
    })
    // let values = this.formRef.current.getFieldsValue();
  }

  render() {
    const { dutyOneData, loading, dictionaryList } = this.props;
    const { AlarmInfoCode } = this._SELF_;

    let Longitude = this.formRef.current ? this.formRef.current.getFieldValue('Longitude') : '';
    let Latitude = this.formRef.current ? this.formRef.current.getFieldValue('Latitude') : '';

    return (
      <div id="autoHeight">

        <BreadcrumbWrapper title="甄别详情">
          <Card bodyStyle={{ paddingBottom: 20, overflow: 'auto', height: 'calc(100vh - 200px)' }} title="甄别基本信息" extra={
            <Space>
              <Button type="primary" onClick={() => this.onSubmit()}>保存</Button>
              <Button onClick={() => history.back()}>返回</Button>
            </Space>
          }>
            {
              loading ? <div className="example"><Spin></Spin></div> :
                <Form
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 14 }}
                  ref={this.formRef}
                  // layout="horizontal"
                  scrollToFirstError
                  initialValues={{
                    ...dutyOneData,
                    RegionCode: dutyOneData.RegionCode ? dutyOneData.RegionCode.split(',') : [],
                    time: dutyOneData.ScreenBeginTime ? [moment(dutyOneData.ScreenBeginTime), moment(dutyOneData.ScreenEndTime)] : [],
                  }}
                // onValuesChange={onFormLayoutChange}
                // size={componentSize}
                >
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        label="事件名称"
                        name="Comment"
                        rules={[{ required: true, message: '请输入事件名称!' }]}
                      >
                        <Input placeholder="请输入事件名称" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="行政区"
                        name="RegionCode"
                        rules={[{ required: true, message: '请选择行政区!' }]}
                      >
                        <SdlCascader
                          itemName={"dbo.View_Region.RegionName"}
                          itemValue={"dbo.View_Region.RegionCode"}
                          configId={'View_Region'}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="详细地址"
                        name="Address"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="经度"
                        name="Latitude"
                        rules={[{ required: true, message: '经度不能为空!' }]}
                      >
                        <SdlMap
                          onOk={map => {
                            this.formRef.current.setFieldsValue({ Longitude: map.longitude, Latitude: map.latitude });
                          }}
                          longitude={Longitude}
                          latitude={Latitude}
                          path={undefined}
                          handleMarker
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="纬度"
                        name="Longitude"
                        rules={[{ required: true, message: '纬度不能为空!' }]}
                      >
                        <SdlMap
                          onOk={map => {
                            this.formRef.current.setFieldsValue({ Longitude: map.longitude, Latitude: map.latitude });
                          }}
                          longitude={Longitude}
                          latitude={Latitude}
                          path={undefined}
                          handleMarker
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="InfoType"
                        label="事件类型"
                        rules={[{ required: true, message: '请选择事件类型' }]}
                      >
                        <Select>
                          {
                            dictionaryList.InfoType.map(item => {
                              return <Option value={item.InfoTypeCode} key={item.InfoTypeCode}>{item.InfoTypeName}</Option>
                            })
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="InfoLevel"
                        label="事故级别"
                        rules={[{ required: true, message: '请选择事故级别' }]}
                      >
                        <Select>
                          <Option value={1}>一般</Option>
                          <Option value={2}>较大</Option>
                          <Option value={3}>重大</Option>
                          <Option value={4}>特大</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="ScreenPerson"
                        label="甄别人"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="time"
                        label="甄别时间"
                      >
                        <RangePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="ScreenInfo"
                        label="甄别分析"
                      >
                        <TextArea />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="Pollutant"
                        label="主要污染物"
                      >
                        <TextArea />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
            }
            <Ent AlarmInfoCode={AlarmInfoCode} />
            <MinGan AlarmInfoCode={AlarmInfoCode} />
            <FileUpload AlarmInfoCode={AlarmInfoCode} />
          </Card>
        </BreadcrumbWrapper>
      </div>
    );
  }
}

export default Details;