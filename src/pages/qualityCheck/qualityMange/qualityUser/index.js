import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import PageLoading from '@/components/PageLoading'
import { Card, Form, Row, Col, Space, Input, Button } from "antd"
import { connect } from "dva"
import SdlTable from "@/components/SdlTable"
import HandleUserModal from "./HandleUserModal"
import ViewUserModal from "./ViewUserModal"

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];


@connect(({ qualityUser, loading }) => ({
  qualityUserList: qualityUser.qualityUserList,
  handleUserModalVisible: qualityUser.handleUserModalVisible,
  viewUserModalVisible: qualityUser.viewUserModalVisible,
  tableLoading: loading.effects['qualityUser/getQualityUserList'],
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '姓名',
          dataIndex: 'User_Name',
          key: 'User_Name',
        },
        {
          title: '手机号',
          dataIndex: 'Phone',
          key: 'Phone',
        },
        {
          title: '性别',
          dataIndex: 'Sex',
          key: 'Sex',
          render: (text, record) => {
            return text ? (text == 1 ? "男" : "女") : ""
          }
        },
        {
          title: '照片信息',
          key: 'Pic',
          dataIndex: 'Pic',
          render: (text, record) => {
            return <a onClick={() => {
              window.open(`/upload/${text}`)
            }}>查看</a>
          }
        },
        {
          title: '运维排口数量（个）',
          key: 'Num',
          dataIndex: 'Num',
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <Space>
              <a onClick={() => {
                this.setState({ id: record.UserID })
                this.showModal({ viewUserModalVisible: true })
              }}>查看</a>
              <a onClick={() => {
                this.setState({ id: record.UserID })
                this.props.dispatch({
                  type: "qualityUser/getViewUser",
                  payload: {
                    UserID: record.UserID
                  }
                })
                // this.showModal({ handleUserModalVisible: true })
              }}>修改</a>
              <a onClick={() => { this.delOperatorUser(record.UserID) }}>删除</a>
            </Space>
          ),
        },
      ]
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.getQualityUserList()
  }


  // 获取列表信息
  getQualityUserList = () => {
    const fieldsValue = this.formRef.current.getFieldsValue();
    this.props.dispatch({
      type: "qualityUser/getQualityUserList",
      payload: {
        UserName: fieldsValue.userName,
        Phone: fieldsValue.phone
      }
    })
  }

  // 删除运维人
  delOperatorUser = (userId) => {
    this.props.dispatch({
      type: "qualityUser/delOperatorUser",
      payload: {
        UserID: userId
      },
      callback: () => {
        this.getQualityUserList();
      }
    })
  }

  showModal = (payload) => {
    this.props.dispatch({
      type: "qualityUser/updateState",
      payload: {
        ...payload
      }
    })
  }

  render() {
    const { columns } = this.state;
    const { handleUserModalVisible, viewUserModalVisible, qualityUserList, tableLoading } = this.props;
    return (
      <BreadcrumbWrapper>
        <Card>
          <Form
            name="global_state"
            ref={this.formRef}
            initialValues={{
              UserName: "",
            }}
          >
            <Row gutter={[24, 0]}>
              <Col span={6}>
                <Form.Item
                  name="userName"
                  label="人员姓名"
                >
                  <Input placeholder="请输入人员姓名" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="phone"
                  label="手机号码"
                >
                  <Input placeholder="请输入手机号码" />
                </Form.Item>
              </Col>
              <Space align="baseline">
                <Button type="primary" onClick={this.getQualityUserList}>查询</Button>
                <Button type="primary" onClick={() => {
                  this.setState({ id: undefined })
                  this.showModal({ handleUserModalVisible: true })
                }}>添加</Button>
                <Button type="primary">导出</Button>
              </Space>
            </Row>
          </Form>
          <SdlTable loading={tableLoading} dataSource={qualityUserList} columns={columns} />
          {handleUserModalVisible && <HandleUserModal id={this.state.id} />}
          {viewUserModalVisible && <ViewUserModal id={this.state.id} />}
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;