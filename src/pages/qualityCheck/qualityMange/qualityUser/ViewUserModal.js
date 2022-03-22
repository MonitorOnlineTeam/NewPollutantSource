import React, { Component } from 'react'
import { Modal, Form, Row, Col, Space, Input, Button, Radio, Upload, TreeSelect, message, Tag } from "antd"
import { connect } from "dva"
import { LoadingOutlined, PlusOutlined, ZoomInOutlined } from "@ant-design/icons"
import { v4 as uuidv4 } from 'uuid';
import Cookie from 'js-cookie';
import config from '@/config'


const { SHOW_PARENT, TreeNode } = TreeSelect;


const figureStyle = {
  width: 102,
  height: 88,
  border: "1px dashed #d9d9d9",
  padding: 4,
  color: "#666",
  textAlign: "center",
}

const instructionsStyle = {
  flex: 1,
  marginLeft: 10,
  border: "1px dashed rgb(217, 217, 217)",
  height: 88,
  color: "#666",
  fontSize: 13,
  padding: 4,
  lineHeight: "18px"
}

@connect(({ qualityUser, common, loading }) => ({
  viewUserModalVisible: qualityUser.viewUserModalVisible,
  viewUserData: qualityUser.viewUserData,
}))
class ViewUserModal extends Component {
  formRef = React.createRef();
  state = {
    loading: false,
    fileList: [],
  }

  componentDidMount() {
    this.getViewUser();
  }

  getViewUser = () => {
    this.props.dispatch({
      type: "qualityUser/getViewUser",
      payload: {
        UserID: this.props.id
      }
    })
  }

  closeModal = () => {
    this.props.dispatch({
      type: "qualityUser/updateState",
      payload: {
        viewUserModalVisible: false
      }
    })
  }

  render() {
    const { viewUserModalVisible, entAndPointList, addLoading, viewUserData } = this.props;
    const { uuid, fileList } = this.state;

    const { imageUrl } = this.state;
    return (
      <Modal
        title="查看运维人信息"
        // width="600px"
        footer={false}
        confirmLoading={addLoading}
        visible={viewUserModalVisible}
        onOk={this.handleOk}
        onCancel={() => this.closeModal()}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          ref={this.formRef}
          layout="horizontal"
          scrollToFirstError
          initialValues={{ Sex: 1 }}
        >
          <Form.Item
            label="姓名"
            name="UserName"
          >
            <p>{viewUserData.User_Name}</p>
          </Form.Item>
          <Form.Item
            label="联系方式"
            name="Phone"
          >
            <p>{viewUserData.Phone}</p>
          </Form.Item>
          <Form.Item
            label="性别"
            name="Sex"
          >
            <p>{viewUserData.Sex == 1 ? "男" : "女"}</p>
          </Form.Item>
          <Form.Item
            label="上传照片"
            name="OpenID"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Upload
              disabled
              accept=".jpg,.png,.jpeg,.bmp"
              listType="picture-card"
              fileList={[{
                uid: '-4',
                name: 'image.png',
                status: 'done',
                url: `/upload/${viewUserData.Pic}`,
              }]}
              style={{ width: 120 }}
              action="/api/rest/PollutantSourceApi/UploadApi/AddOperator"
              headers={{
                Authorization: "Bearer " + Cookie.get(config.cookieName)
              }}
              data={{
                ssoToken: Cookie.get(config.cookieName),
                UserId: uuid
              }}
            >
            </Upload>
          </Form.Item>
          <Form.Item
            label="运维站点"
            name="DGIMNList"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            {
              (viewUserData.PointName || []).map(item => {
                return <Tag>{item}</Tag>
              })
            }
          </Form.Item>
        </Form>
      </Modal >
    );
  }
}

export default ViewUserModal;