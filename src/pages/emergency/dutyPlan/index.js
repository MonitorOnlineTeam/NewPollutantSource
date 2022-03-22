import React, { PureComponent } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { Card, Tooltip, Divider, Modal, Form, Select, Row, Col } from 'antd';
import { RetweetOutlined } from '@ant-design/icons'
import { connect } from 'dva';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const { Option } = Select;

const CONFIGID = "ViewDuty"


@connect(({ loading, emergency }) => ({
  dutyUserInfo: emergency.dutyUserInfo,
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'emergency/getDutyUser',
      payload: {}
    })
  }

  // 保存
  onSubmit = () => {
    this.formRef.current.validateFields().then((values) => {
      this.props.dispatch({
        type: 'emergency/shiftChangeDuty',
        payload: {
          ...values,
          DutyPlanCode: this.state.row['dbo.View_Duty.DutyPlanCode'],
          ReplaceTime: this.state.row['dbo.View_Duty.TimeStr'] + ' 00:00:00',
        },
        callback: (res) => {
          this.getTableList();
          this.setState({ isModalVisible: false })
        }
      })
    })
  }

  getTableList = () => {
    this.props.dispatch({
      type: 'autoForm/getAutoFormData',
      payload: {
        configId: CONFIGID,
      },
    });
  }

  onCancel = () => {
    this.setState({ isModalVisible: false })
  }

  render() {
    const { dutyUserInfo } = this.props;
    const { isModalVisible } = this.state;
    return (
      <BreadcrumbWrapper>
        <Card>
          <SearchWrapper configId={CONFIGID} />
          <AutoFormTable getPageConfig configId={CONFIGID}
            appendHandleRows={row => {
              return (
                <>
                  <Divider type="vertical" />
                  <Tooltip title="换班">
                    <a onClick={() => {
                      this.setState({ isModalVisible: true, row: row })
                    }}
                    >
                      <RetweetOutlined style={{ fontSize: 16 }} />
                    </a>
                  </Tooltip>
                </>
              );
            }}
          />
        </Card>
        <Modal title="值班计划管理" visible={isModalVisible} onOk={this.onSubmit} onCancel={this.onCancel}>
          <Form
            {...layout}
            ref={this.formRef}
            initialValues={{
            }}
          >
            <Row>
              <Col span={24}>
                <Form.Item
                  name="DutyType"
                  label="类别"
                  rules={[{ required: true, message: '请选择类别!' }]}
                >
                  <Select placeholder="请选择监测类型">
                    <Option value="1">人员换班</Option>
                    <Option value="2">人员变更</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="DutyPerson"
                  label="值班人员"
                  rules={[{ required: true, message: '请选择值班人员!' }]}
                >
                  <Select placeholder="请选择值班人员">
                    {
                      dutyUserInfo.DutyPerson.map(item => {
                        return <Option value={item.User_ID} key={item.User_ID}>{item.User_Name}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="DutyLeader"
                  label="值班领导"
                  rules={[{ required: true, message: '请选择值班领导!' }]}
                >
                  <Select placeholder="请选择值班领导">
                    {
                      dutyUserInfo.DutyLeader.map(item => {
                        return <Option value={item.User_ID} key={item.User_ID}>{item.User_Name}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </BreadcrumbWrapper>

    );
  }
}

export default index;