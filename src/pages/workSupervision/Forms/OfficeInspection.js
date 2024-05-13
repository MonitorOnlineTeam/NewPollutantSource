/*
 * @Author: JiaQi
 * @Date: 2023-04-20 16:43:45
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-09 15:40:55
 * @Description: 办事处检查任务单填写、编辑
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Row,
  Col,
  Divider,
  Space,
  Button,
  Input,
  Select,
  Radio,
  InputNumber,
  Table,
  Rate,
} from 'antd';
import styles from './styles.less';
import TaskAlart from './TaskAlart';

const { TextArea } = Input;
const dataSource = [
  {
    key: 'title1',
    type: '办事处设施',
    isTitle: true,
  },
  {
    key: 'BusinessCulture',
    type: '企业文化是否上墙',
    dataIndex: 'BusinessCulture',
  },
  {
    key: 'OfficeNeatness',
    type: '办事处整洁度（1-5分）',
    dataIndex: 'OfficeNeatness',
  },
  {
    key: 'title2',
    type: '库房',
    isTitle: true,
  },
  {
    key: 'IsLock',
    type: '是否上锁',
    dataIndex: 'IsLock',
  },
  {
    key: 'StorehouseNeatness',
    type: '库房整洁度（1-5分）',
    dataIndex: 'StorehouseNeatness',
  },
  {
    key: 'AccountSpecification',
    type: '出入库台账规范（1-5分）',
    dataIndex: 'AccountSpecification',
  },
  {
    key: 'SluggishMaterials',
    type: '呆滞物料情况（1-5分）',
    dataIndex: 'SluggishMaterials',
  },
  {
    key: 'title3',
    type: '车辆',
    isTitle: true,
  },
  {
    key: 'PlateNumber',
    type: '车牌号',
    dataIndex: 'PlateNumber',
  },
  {
    key: 'CarNeatness',
    type: '整洁度（含后备箱）（1-5分）',
    dataIndex: 'CarNeatness',
  },
  {
    key: 'CarUseRecord',
    type: '云上管车使用记录（1-5分）',
    dataIndex: 'CarUseRecord',
  },
];

const dvaPropsData = ({ loading, wordSupervision }) => ({
  largeRegionList: wordSupervision.largeRegionList,
  officeList: wordSupervision.officeList,
  submitLoading: loading.effects['wordSupervision/InsOrUpdOfficeCheck'],
});

const OfficeInspection = props => {
  const [form] = Form.useForm();
  const {
    taskInfo,
    editData,
    officeList,
    largeRegionList,
    submitLoading,
    onCancel,
    onSubmitCallback,
  } = props;
  const [currentTodoItem, setCurrentTodoItem] = useState({});
  const [provinceList, setProvinceList] = useState([]);

  useEffect(() => {
    GetLargeRegion();
    GetOfficeList();
  }, []);

  const findLargeRegionByRegionCode = (data, code) => {
    let result = {};
    // 遍历整个数据列表
    data.some(item => {
      // 尝试在 ChildList 中找到匹配的 RegionCode
      let child = item.ChildList.find(child => child.RegionCode === code);

      if (child) {
        // 如果找到了匹配的 RegionCode，则设置结果为对应的 LargeRegion 和 Child
        result = item;
        return true;
      }

      return false;
    });

    return result;
  };

  // 获取大区和省份
  const GetLargeRegion = () => {
    props.dispatch({
      type: 'wordSupervision/GetLargeRegion',
      payload: {},
      callback: res => {
        let region = findLargeRegionByRegionCode(res, taskInfo.RegionCode);
        form.setFieldsValue({ LargeRegion: region.LargeRegion, RegionCode: taskInfo.RegionCode });
        setProvinceList(region.ChildList);
      },
    });
  };

  // 获取办事处列表
  const GetOfficeList = () => {
    props.dispatch({
      type: 'wordSupervision/GetOfficeList',
      payload: {
        regionCode: taskInfo.RegionCode,
      },
    });
  };

  // 提交任务单
  const onFinish = async () => {
    const values = await form.validateFields();
    // console.log('values', values);
    // return;
    let body = {
      ...values,
      LargeRegion: undefined,
      RegionCode: undefined,
      DailyTaskID: taskInfo.ID,
      ID: editData.ID,
      CreateTime: editData.CreateTime,
    };
    console.log('body', body);
    // return;
    props.dispatch({
      type: 'wordSupervision/InsOrUpdOfficeCheck',
      payload: body,
      callback: () => {
        onSubmitCallback();
        onCancel();
      },
    });
  };

  // 列头
  const getColumns = () => {
    return [
      {
        title: '检查内容',
        dataIndex: 'type',
        key: 'type',
        width: 200,
        align: 'center',
        // className: styles.hideColumn,
        render: (text, record, index) => {
          return {
            children: (
              <div
                className={styles.required}
                style={record.isTitle ? { fontWeight: 'bold', color: '#000' } : {}}
              >
                {text}
              </div>
            ),
            props: { colSpan: record.isTitle ? 2 : 1 },
          };
        },
      },
      {
        title: '检查结果',
        dataIndex: 'address',
        key: 'address',
        width: 200,
        align: 'center',
        // className: styles.hideColumn,
        render: (text, record, index) => {
          let el = '';
          if (record.dataIndex === 'IsLock' || record.dataIndex === 'BusinessCulture') {
            el = (
              <Form.Item
                name={record.dataIndex}
                style={{ marginBottom: 0 }}
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value={'1'}>是</Radio>
                  <Radio value={'0'}>否</Radio>
                </Radio.Group>
              </Form.Item>
            );
          } else {
            el = (
              <Form.Item
                name={record.dataIndex}
                style={{ marginBottom: 0 }}
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: '不能为空！',
                  },
                ]}
              >
                <Rate />
              </Form.Item>
            );
          }

          return {
            children: el,
            props: { colSpan: record.isTitle ? 0 : 1 },
          };
        },
      },
    ];
  };
  console.log('taskInfo', taskInfo);
  return (
    <>
      <h2 className={styles.formTitle}>办事处检查任务单</h2>
      <div className={styles.formContent}>
        <Form
          form={form}
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          initialValues={{
            BusinessCulture: '1',
            IsLock: '1',
            ...editData,
            // UserGroup_Name: editData.LargeRegion,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row style={{ width: '100%' }}>
            <Col span={8}>
              <Form.Item
                label="大区"
                name="LargeRegion"
                rules={[
                  {
                    required: true,
                    message: '大区不能为空！',
                  },
                ]}
              >
                <Select
                  placeholder="请选择大区"
                  style={{ width: '100%' }}
                  disabled
                  // onChange={(value, option) => {
                  //   // debugger;
                  //   // formRef.current.setFieldsValue({
                  //   setProvinceList(option['data-childList']);
                  //   form.setFieldsValue({
                  //     ProvinceName: option['data-childList'][0].RegionCode,
                  //     OfficeCode: undefined,
                  //   });
                  //   GetOfficeList();
                  // }}
                >
                  {largeRegionList.map(item => {
                    return (
                      <Option
                        value={item.LargeRegion}
                        key={item.LargeRegion}
                        data-childList={item.ChildList}
                      >
                        {item.LargeRegion}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="省份"
                name="RegionCode"
                rules={[
                  {
                    required: true,
                    message: '省份不能为空！',
                  },
                ]}
              >
                <Select
                  placeholder="请选择大区"
                  style={{ width: '100%' }}
                  disabled
                  // onChange={(value, option) => {
                  //   GetOfficeList();
                  //   form.setFieldsValue({
                  //     OfficeCode: undefined,
                  //   });
                  // }}
                >
                  {provinceList.map(item => {
                    return (
                      <Option value={item.RegionCode} key={item.RegionCode}>
                        {item.RegionName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="办事处"
                // style={{ marginBottom: 0 }}
                name="OfficeCode"
                rules={[
                  {
                    required: true,
                    message: '请选择办事处！',
                  },
                ]}
              >
                <Select placeholder="请选择办事处" style={{ width: '100%' }}>
                  {officeList.map(item => {
                    return (
                      <Option value={item.ID} key={item.ID}>
                        {item.OfficeName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Table
            size="small"
            bordered
            dataSource={dataSource}
            columns={getColumns()}
            pagination={false}
          />
          <Col span={24} style={{ marginTop: 20 }}>
            <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="备注" name="Remark">
              <TextArea rows={3} placeholder="请输入备注" />
            </Form.Item>
          </Col>
          <Divider orientation="right" style={{ color: '#d9d9d9' }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                提交
              </Button>
              <Button onClick={onCancel}>取消</Button>
            </Space>
          </Divider>
        </Form>
      </div>
    </>
  );
};

export default connect(dvaPropsData)(OfficeInspection);
