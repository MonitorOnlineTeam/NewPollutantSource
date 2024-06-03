import React, { useState, useEffect } from 'react';
import { Button, Form, InputNumber, Select } from 'antd';
import ReactDOMServer from 'react-dom/server';
import Cookies from 'js-cookie';
import { connect } from 'dva';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({});
const Test = props => {
  const [form] = Form.useForm();
  const {} = props;
  // const [modelList, setModelList] = useState([]);

  const replacePlaceholdersWithComponents = str => {
    const replacedStr = str.replace(/{([^_]+)_([^}]+)}/g, (match, componentType, componentName) => {
      let component;

      switch (componentType) {
        case 'number':
          component = <InputNumber />;
          break;
        case 'select':
          component = (
            <Select
              defaultValue="lucy"
              style={{
                width: 120,
              }}
              options={[
                {
                  value: 'jack',
                  label: 'Jack',
                },
                {
                  value: 'lucy',
                  label: 'Lucy',
                },
                {
                  value: 'disabled',
                  disabled: true,
                  label: 'Disabled',
                },
                {
                  value: 'Yiminghe',
                  label: 'yiminghe',
                },
              ]}
            />
          );
          break;
        default:
          component = null;
          break;
      }
      console.log('componentName', componentName);
      let formItem = (
        <Form.Item
          name={componentName}
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          {component}
        </Form.Item>
      );
      const componentString = ReactDOMServer.renderToStaticMarkup(formItem);
      return componentString;
      // const componentString = ReactDOMServer.renderToStaticMarkup(component);
      //  return componentString; // 去除包裹的 div 标签
      // return React.cloneElement(componentString, { name: componentName });
    });

    return replacedStr;
  };

  const renderText = () => {
    const str = '这是{number_key1}段占位符{select_key2}';
    const replacedStr = replacePlaceholdersWithComponents(str);
    // return replacedStr;
    // let str1 = `'这是'+{number_key1}+'段占位符'`;
    // // let str = str1.replace("{number_key1}", <Input />)
    // // return str;
    // let str = `<span>这是${number_key1}段占位符${number_key2}</span>`;
    // const componentString = ReactDOMServer.renderToStaticMarkup(str);
    return <div dangerouslySetInnerHTML={{ __html: replacedStr }}></div>;
  };

  const onFinish = values => {
    console.log('Success:', values);
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Form
        name="searchForm"
        form={form}
        layout="inline"
        // style={{ padding: '10px 0' }}
        initialValues={{}}
        autoComplete="off"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        // onValuesChange={onValuesChange}
        onValuesChange={(changedFields, allFields) => {}}
      >
        {renderText()}
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      {/* <Button
        type="primary"
        onClick={() => {
          let values = form.getFieldsValue();
          console.log('values', values);
        }}
      >
        查询
      </Button> */}
    </>
  );
};

export default connect(dvaPropsData)(Test);
