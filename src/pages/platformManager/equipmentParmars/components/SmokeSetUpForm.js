import { Form, Input, Button, Checkbox,Divider,Row,Col, InputNumber,Card  } from 'antd';

import styles from '../style.less'
import { connect } from "dva";

const { TextArea } = Input;
const namespace = 'equipmentParmars'

const dvaPropsData =  ({ loading,equipmentParmars }) => ({

  })
  
const  dvaDispatch = (dispatch) => {
    return {
      addOrUpdateEquipmentParametersInfo : (payload,callback) =>{ //添加 设定参数
        dispatch({
          type: `${namespace}/addOrUpdateEquipmentParametersInfo`,
          payload:payload,
          callback:callback
        })
        
      },
    }
  }

const SmokeSetUpForm = (props) => {
    console.log(props)
   const onFinish = (values) => {

    props.addOrUpdateEquipmentParametersInfo({},()=>{
      console.log('Success:', values);
       
     })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);

  };

  return (
    <Form
      className='smokeSetUpForm'
      name="basic"
      initialValues={{
        remember: true,
      }}
      layout='vertical'
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >  
        <>
        <div className={styles.title}>烟气流量设定</div>
        <div className={styles.divider}> </div>
        </>
        <Row gutter={[40,24]}>
        <Col  span={8}>
      <Form.Item label="皮托管系数" name="aa" rules={[{ required: true,message: '请输入皮托管系数!', } ]}>
        <InputNumber />
      </Form.Item>
      </Col>
      <Col  span={8}>
      <Form.Item label="速度场系数" name="bb" rules={[{ required: true,message: '请输入速度场系数!', } ]}>
        <InputNumber />
      </Form.Item>
      </Col>
      <Col  span={8}>
      <Form.Item label="烟道截面积(㎡)" name="cc" rules={[{ required: true,message: '请输入烟道截面积!', } ]}>
        <InputNumber />
      </Form.Item>
      </Col>
      </Row>

      <>
        <div className={styles.title}>颗粒物参数设定</div>
        <div className={styles.divider}> </div>
        </>
        <Row gutter={[40,24]}>
        <Col  span={8}>
      <Form.Item label="斜率" name="aa" rules={[{ required: true,message: '请输入斜率!', } ]}>
        <InputNumber />
      </Form.Item>
      </Col>
      <Col  span={8}>
      <Form.Item label="截距" name="bb" rules={[{ required: true,message: '请输入截距!', } ]}>
        <InputNumber />
      </Form.Item>
      </Col>
      </Row>
      <>
        <div className={styles.title}>其他参数设定</div>
        <div className={styles.divider}> </div>
        </>
      <Row gutter={[40,24]}>
        <Col  span={8}>
      <Form.Item label="当地大气压(Pa)" name="aa" rules={[{ required: true,message: '请输入当地大气压!', } ]}>
        <InputNumber />
      </Form.Item>
      </Col>
      <Col  span={8}>
      <Form.Item label="标准过量空气系数" name="bb" rules={[{ required: true,message: '请输入标准过量空气系数!', } ]}>
        <InputNumber />
      </Form.Item>
      </Col>
      </Row>

      <>
        <div className={styles.title}>其他情况说明</div>
        <div className={styles.divider}> </div>
        </>
      <Row gutter={[16,24]} style={{paddingBottom:10}}>
        <Col  span={24}>
      <Form.Item label="" name="aa" >
        <TextArea rows={2} />
      </Form.Item>
      </Col>
      </Row>

      <div className={styles.submitCard}>
      {/* <Form.Item> */}
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      {/* </Form.Item> */}
      </div>

    </Form>
  );
};

export default connect(dvaPropsData,dvaDispatch)(SmokeSetUpForm);