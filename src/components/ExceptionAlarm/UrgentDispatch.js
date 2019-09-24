import React, { Component } from 'react';
import {connect} from 'dva';
import { Modal, Button, Input,Form,Icon,message,Spin } from 'antd';
const FormItem = Form.Item;
@Form.create()
@connect(({urgentdispatch,loading}) => ({
    operationUserInfo:urgentdispatch.operationUserInfo,
    existTask:urgentdispatch.existTask,
    loading:loading.effects['urgentdispatch/addtaskinfo'],
}))
///紧急派单
class UrgentDispatch extends Component {
    componentWillMount(){
        const {DGIMN,dispatch}=this.props;
        debugger
        dispatch({
            type:'urgentdispatch/queryoperationInfo',
            payload:{
                dgimn:DGIMN
            }
        }) 
    }
    onSubmit=()=>{
        const {DGIMN,operationUserInfo}=this.props;
            this.props.dispatch({
                type:'urgentdispatch/addtaskinfo',
                payload:{
                    dgimn: DGIMN,
                    personId:operationUserInfo.operationUserID,
                    remark:this.props.form.getFieldValue('remark'),
                    reloadData:()=>this.props.reloadData()
                }
            })
            this.props.onCancel();
    }
    //获取运维信息文字
    getOperationText=()=>{
        const {existTask}=this.props;
        if(existTask)
        {
           return "紧急督办";             
        }
        else
        {
            return "紧急派单";      
        }
    }
    

    render() {
        const {operationUserInfo,loading,pointName}=this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                sm: { span: 5 },
            },
            wrapperCol: {
                sm: { span: 16 },
            },
        };
        return (
            <div>
                <Modal
                    title={ pointName?pointName:(operationUserInfo?operationUserInfo.pointName:'') }
                    visible={this.props.visible}
                    onOk={this.onSubmit}
                    destroyOnClose={true}
                    onCancel={this.props.onCancel}
                >
                    <Form className="login-form">
                        <FormItem
                            {...formItemLayout}
                            label="运维人员"
                        >
                            {getFieldDecorator('operationName', {
                                initialValue:operationUserInfo?operationUserInfo.operationUserName:'',
                                rules: [{ required: true, message: '请输入运维人名称' }],
                            })(
                                <Input disabled={true} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                            )}
                        </FormItem>
                        <FormItem
                            label="联系电话"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('phone', {

                                initialValue:operationUserInfo?operationUserInfo.operationtel:'',
                                rules: [{ required: true, message: '请输入电话号码' }],
                            })(
                                <Input disabled={true} prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />} type="phone" />
                            )}
                        </FormItem>
                        <FormItem
                            label="备注"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('remark', {
                                  initialValue:null,
                            })(
                                <Input.TextArea rows='3' prefix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="备注" />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default UrgentDispatch;
 
