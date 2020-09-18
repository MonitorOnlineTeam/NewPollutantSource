import React, { Component } from 'react'
import { Modal, Form, Row, Col, Space, Input, Button, Radio, Upload, TreeSelect, message } from "antd"
import { connect } from "dva"
import { LoadingOutlined, PlusOutlined, ZoomInOutlined } from "@ant-design/icons"
import { v4 as uuidv4 } from 'uuid';
import Cookie from 'js-cookie';
import config from '@/config'
import { checkRules } from '@/utils/validator';


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
  handleUserModalVisible: qualityUser.handleUserModalVisible,
  entAndPointList: common.entAndPointList,
  viewUserData: qualityUser.viewUserData,
  addLoading: loading.effects['qualityUser/addOperator'],
  updateLoading: loading.effects['qualityUser/updateOperatorUser'],
}))
class HandleUserModal extends Component {
  formRef = React.createRef();
  state = {
    loading: false,
    uuid: this.props.id ? this.props.id : uuidv4(),
    fileList: [],
  }

  componentDidMount() {
    this.getEntAndPointList()
    // this.getViewUser();
    if (this.props.id) {
      this.setState({
        fileList: [
          {
            uid: '-4',
            name: 'image.png',
            status: 'done',
            url: `/upload/${this.props.viewUserData.Pic}`,
          }
        ],
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.viewUserData !== prevProps.viewUserData) {
      this.setState({
        fileList: [
          {
            uid: '-4',
            name: 'image.png',
            status: 'done',
            url: `/upload/${this.props.viewUserData.Pic}`,
          }
        ],
      })
    }
  }

  getViewUser = () => {
    if (this.props.id) {
      this.props.dispatch({
        type: "qualityUser/getViewUser",
        payload: {
          UserID: this.props.id
        }
      })
    }
  }

  // 获取企业和排口
  getEntAndPointList = () => {
    this.props.dispatch({
      type: "common/getEntAndPointList",
      payload: { "Status": [], "RunState": "1", "PollutantTypes": "1,2" }
    })
  }

  closeModal = () => {
    this.props.dispatch({
      type: "qualityUser/updateState",
      payload: {
        handleUserModalVisible: false
      }
    })
  }

  // 添加
  handleOk = () => {
    this.formRef.current.validateFields().then((values) => {
      console.log("values=", values)
      // return;
      let actionType = this.props.id ? "qualityUser/updateOperatorUser" : "qualityUser/addOperator";
      this.props.dispatch({
        type: actionType,
        payload: {
          ...values,
          userId: this.state.uuid
        }
      })
    })
  }


  handleChange = info => {
    console.log("info=", info)
    let fileList = [...info.fileList];
    if (!info.fileList.length) {
      this.formRef.current.setFieldsValue({ "OpenID": undefined })
    }
    if (info.file.status === 'done') {
      if (info.fileList[0].response.IsSuccess) {
        fileList = [{
          uid: '-4',
          name: 'image.png',
          status: 'done',
          url: `/upload/${info.fileList[0].response.Datas}`,
        }]
        this.formRef.current.setFieldsValue({ "OpenID": info.fileList[0].response.Datas })
      } else {
        message.error(info.fileList[0].response.Message)
        fileList = [{
          uid: '-5',
          name: 'image.png',
          status: 'error',
        }]
      }
    }
    this.setState({
      fileList: fileList
    })
  };


  render() {
    const { handleUserModalVisible, entAndPointList, addLoading, updateLoading, viewUserData, id } = this.props;
    const { uuid, fileList } = this.state;
    const tProps = {
      treeData: entAndPointList,
      treeDefaultExpandAll: true,
      treeCheckable: true,
      treeNodeFilterProp: "title",
      placeholder: '请选择运维站点！',
      style: {
        width: '100%',
      },
    };

    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">文件上传</div>
      </div>
    );
    return (
      <Modal
        title={id ? "编辑运维人信息" : "添加运维人信息"}
        width="600px"
        confirmLoading={id ? updateLoading : addLoading}
        visible={handleUserModalVisible}
        onOk={this.handleOk}
        onCancel={() => this.closeModal()}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          ref={this.formRef}
          layout="horizontal"
          scrollToFirstError
        // initialValues={initialValues}
        // onValuesChange={onFormLayoutChange}
        // size={componentSize}
        >
          <Form.Item
            label="姓名"
            name="UserName"
            initialValue={id ? viewUserData.User_Name : undefined}
            rules={[{ required: true, message: '请输入姓名!' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="Phone"
            initialValue={id ? viewUserData.Phone : undefined}
            rules={[{ required: true, message: '请输入手机号!' }, { ...checkRules.mobile }]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            label="性别"
            name="Sex"
            initialValue={id ? viewUserData.Sex : 1}
            rules={[{ required: true, message: '请选择性别!' }]}
          >
            <Radio.Group>
              <Radio key={1} value={1}>男</Radio>
              <Radio key={0} value={0}>女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="上传照片"
            name="OpenID"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValue={id ? viewUserData.Pic : undefined}
            rules={[{ required: true, message: '请上传照片!' }]}
          >
            <>
              <Upload
                accept=".jpg,.png,.jpeg,.bmp"
                listType="picture-card"
                fileList={fileList}
                style={{ width: 120 }}
                action={id ? "/api/rest/PollutantSourceApi/UploadApi/UpdOperator" : "/api/rest/PollutantSourceApi/UploadApi/AddOperator"}
                headers={{
                  Authorization: "Bearer " + Cookie.get(config.cookieName)
                }}
                data={{
                  ssoToken: Cookie.get(config.cookieName),
                  UserId: uuid
                }}
                onChange={this.handleChange}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
              <div>
                <div style={{ display: "flex" }}>
                  <div style={{ ...figureStyle }}>
                    <img src="/u33.png" alt="" width="100%" />
                  示例图&nbsp;&nbsp;<ZoomInOutlined />
                  </div>
                  <div style={{ ...instructionsStyle }}>
                    * 请确保上传的照片光线良好照片清晰；眼睛、鼻子、嘴巴、脸颊、下巴不能被遮挡；人脸部分不小于100*100像素；照片中仅一人。<br />
                    * 支持扩展名：.PNG、.JPG、.JPEG、.BMP
                </div>
                </div>
              </div>
            </>
          </Form.Item>
          <Form.Item
            label="运维站点"
            name="DGIMNList"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValue={id ? viewUserData.DGIMN : []}
            rules={[{ required: true, message: '请选择运维站点!' }]}
          >
            <TreeSelect {...tProps} />
            {/* <TreeNode value="parent 1" title="parent 1">
                <TreeNode value="parent 1-0" title="parent 1-0">
                  <TreeNode value="leaf1" title="my leaf" />
                  <TreeNode value="leaf2" title="your leaf" />
                </TreeNode>
                <TreeNode value="parent 1-1" title="parent 1-1">
                  <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} />
                </TreeNode>
              </TreeNode>
            </TreeSelect> */}
          </Form.Item>
        </Form>
      </Modal >
    );
  }
}

export default HandleUserModal;