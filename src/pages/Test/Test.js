import React, { Component } from 'react'
import { Form, Select, Input, Button } from 'antd';
import { connect } from 'dva';
import EnterprisePointCascadeMultiSelect from '../../components/EnterprisePointCascadeMultiSelect'
import NavigationTree from '../../components/NavigationTree'

@Form.create()
@connect(({ navigationtree, loading }) => ({
  selectTreeKeys: navigationtree.selectTreeKeys,
}))
class Test extends Component {
  // constructor(props, context) {
  //   super(props, context);
  //   this.state = {
  //     demo1: ['shanghai'],
  //   }
  // }
  // render() {
  //   let { loopData } = this.state;
  //   return (
  //     <div style={{ margin: 15 }}>
  //       <EnterprisePointCascadeMultiSelect />
  //     </div>
  //   )
  // }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.form.resetFields()
      }
    });
  };

  handleSelectChange = value => {
    console.log(value);
    this.props.form.setFieldsValue({
      note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <NavigationTree choice={false} onItemClick={(value)=>{
          console.log("test=",value)
          console.log("test1=",this.props.selectTreeKeys)
        }} />
      {/* <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
        <Form.Item label="Note">
          {getFieldDecorator('note', {
            // rules: [{ required: true, message: 'Please input your note!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Gender">
          {getFieldDecorator('gender', {
            rules: [{ required: true, message: 'Please select your gender!' }],
          })(
            <EnterprisePointCascadeMultiSelect 
            // searchEnterprise={true}
            searchRegion={true}
            onChange={(val)=>{
              console.log("asdasda",val)
              this.props.form.setFieldsValue({gender: val})
            }}/>
          )}
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form> */}
      </div>
    );
  }
}

export default Test