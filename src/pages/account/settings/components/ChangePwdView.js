import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Spin, Divider, Button } from 'antd';
import Cookie from 'js-cookie';

const FormItem = Form.Item;
const response = Cookie.get('currentUser');
let user = null;
if (response) {
    user = JSON.parse(response);
}

@connect(({ user, loading }) => ({
    isload: loading.effects['user/changepwd'],
}))
@Form.create()
class ChangePwdView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            showchangepwd: false,
        };
    }

    componentDidMount() {
        //this.props.onRef(this);
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.changepwd();
            }
        });
    };

    changepwd = () => {
        const form = this.props.form;
        const oldpassword = form.getFieldValue('oldpassword');
        const password = form.getFieldValue('password');
        const confirm = form.getFieldValue('confirm');
        const { dispatch } = this.props;

        dispatch({
            type: 'user/vertifyOldPwd',
            payload: {
                pwd: oldpassword,
                callback: (re) => {
                    if (re.IsSuccess) {
                        this.props.dispatch({
                            type: 'user/changePwd',
                            payload: { pwd: password },
                        });
                    }
                }

            },
        });


    };

    validateToOldPassword = (rule, value, callback) => {
        const oldpassword = this.props.form.getFieldValue('oldpassword');
        if (value) {
            this.props.dispatch({
                type: 'user/vertifyOldPwd',
                payload: {
                    pwd: oldpassword,
                    callback: (re) => {
                        if (re.IsSuccess) {
                            callback();
                        } else {
                            callback(re.Message);
                        }
                    }

                },
            });
        } else
            callback();

    }

    handleConfirmBlur = e => {
        const value = e.target.value;
        const confirmDirty = this.state.confirmDirty || !!value;
        this.setState({ confirmDirty: confirmDirty });
    };


    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };
    validatePassStrenth=(rule,value,callback)=>{

        let strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
        let mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
        let enoughRegex = new RegExp("(?=.{6,}).*", "g");
  
        let strength=1;
        if (enoughRegex.test(value) == false) {
            //密码小于六位的时候，密码强度图片都为灰色
            strength=1;
        } else if (strongRegex.test(value)) {
            //强,密码为八位及以上并且字母数字特殊字符三项都包括
            strength=3;
        } else if (mediumRegex.test(value)) {
            //中等,密码为七位及以上并且字母、数字、特殊字符三项中有两项，强度是中等
            strength=2;
        } else {
            //弱,如果密码为6为及以下，就算字母、数字、特殊字符三项都包括，强度也是弱的
            strength=1;
        }
        if(strength==1) {
            callback("密码强度不够，密码要求7位以上并且包含字母、数字、特殊字符三项");
        }else {
            callback();
        }
  
    }
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次新密码输入不一致!');
        } else {
            callback();
        }
    };

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 10 },
                sm: { span: 10 },
            },
        };
        const { getFieldDecorator } = this.props.form;

        const SCREEN_HEIGHT = document.querySelector('body').offsetHeight;
        const SCREEN_WIDTH = document.querySelector('body').offsetWidth;

        return (

            <Form onSubmit={this.handleSubmit}>
                {/* <FormItem {...formItemLayout} label="账户">
                    <label value={user == null ? '' : `${user.User_Name}(${user.User_Account})`}>
                        {user == null ? '' : `${user.User_Name}(${user.User_Account})`}
                    </label>
                </FormItem> */}
                <FormItem {...formItemLayout} label="旧密码">
                    {getFieldDecorator('oldpassword', {
                        rules: [
                            {
                                required: true,
                                message: '请输入旧密码!',
                            },
                            // {
                            //     validator: this.validateToOldPassword,
                            // },
                        ],
                    })(<Input type="password" placeholder="请输入旧密码" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="新密码">
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                                message: '请输入新密码!',
                            },
                            {
                                validator: this.validateToNextPassword,
                            }, {
                                validator: this.validatePassStrenth
                            }
                        ],
                    })(<Input type="password" placeholder="请输入新密码" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="确认密码">
                    {getFieldDecorator('confirm', {
                        rules: [
                            {
                                required: true,
                                message: '请再次输入新密码!',
                            },
                            {
                                validator: this.compareToFirstPassword,
                            },
                        ],
                    })(
                        <Input
                            type="password"
                            onBlur={this.handleConfirmBlur}
                            placeholder="请再次输入新密码"
                        />,
                    )}
                </FormItem>
                <Divider orientation="right" style={{ border: '1px dashed #FFFFFF' }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={this.handleSubmit}
                    >更新设置
              </Button>
                </Divider>
            </Form>
            //   </Modal>
        );
    }
}
export default ChangePwdView;
