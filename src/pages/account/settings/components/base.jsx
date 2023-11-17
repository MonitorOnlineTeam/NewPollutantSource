import React, { Component } from 'react';
import Cookie from 'js-cookie';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Row, Col, Card, Radio, Avatar, Select, message, Divider } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import SdlForm from "@/pages/AutoFormManager/SdlForm"

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const children = [];
for (let i = 0; i < 21; i++) {
  children.push(<Option key={i}>{i}</Option>);
}
@connect(({
  loading,
  user
}) => ({

}))
@Form.create()
class BaseView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: null,

    };
    this.postFormDatas = this.postFormDatas.bind(this)
    this.onSubmitForm = this.onSubmitForm.bind(this)
  }

  componentWillMount() {

  }


  onSubmitForm() {

  }

  postFormDatas() {
    // this.onSubmitForm();
    const { dispatch, form, RolesTreeData } = this.props;
    const { leafTreeDatas, checkedKeySel, checkedKeysSel } = this.state;
    const userCookie = Cookie.get('currentUser');
    if (userCookie) {
      const user = JSON.parse(userCookie);

      form.validateFields((err, values) => {
        if (!err) {
          let FormData = {};
          for (let key in values) {
            if (values[key] && values[key]["fileList"]) {
              FormData[key] = uid;
            } else {
              FormData[key] = values[key] && values[key].toString()
            }
          }
          dispatch({
            type: 'user/editUserInfo',
            payload: {
              configId: 'UserInfoAdd',
              FormData: {
                "User_ID": user.User_ID,
                ...FormData
              },
            }
          })
        }
      });
    }
  }
  render() {
    const userCookie = Cookie.get('currentUser');
    let userId = '';
    if (userCookie) {
      userId = JSON.parse(userCookie).User_ID;
    }
    return (
      <div>
        <Card bordered={false} style={{ height: 'calc(100vh - 200px)' }} loading={this.props.userinfoloading}>
          <SdlForm
            configId={"UserInfoAdd"}
            onSubmitForm={this.onSubmitForm}
            form={this.props.form}
            isEdit={true}
            hideBtns={true}
            keysParams={{ "dbo.Base_UserInfo.User_ID": userId }}
          >
            <Divider orientation="right" style={{ border: '1px dashed #FFFFFF' }}>
              <Button
                type="primary"
                onClick={this.postFormDatas}
              >更新个人设置
              </Button>
            </Divider>

          </SdlForm>
        </Card>
      </div>
    );
  }
}
export default BaseView;

