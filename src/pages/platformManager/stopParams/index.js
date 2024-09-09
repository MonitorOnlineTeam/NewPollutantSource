import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  InputNumber,
  Modal,
  Select,
  Space,
  Button,
  Divider,
  message,
  Popconfirm,
  Tooltip,
} from 'antd';
import NavigationTree from '@/components/NavigationTree';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import { API } from '@config/API';

const { Option } = Select;

const PollutantList = [
  {
    pollutantCode: '02',
    pollutantName: '实测SO2',
    unit: 'mg/m³',
  },
  {
    pollutantCode: 's03',
    pollutantName: '烟气温度',
    unit: '℃',
  },
  {
    pollutantCode: '03',
    pollutantName: '实测NOx',
    unit: 'mg/m³',
  },
  {
    pollutantCode: 's05',
    pollutantName: '烟气湿度',
    unit: '%',
  },
  {
    pollutantCode: '01',
    pollutantName: '实测烟尘',
    unit: 'mg/m³',
  },
  {
    pollutantCode: 's08',
    pollutantName: '烟气静压',
    unit: 'KPa',
  },
  {
    pollutantCode: 's01',
    pollutantName: 'O2',
    unit: '%',
  },
  {
    pollutantCode: 's02',
    pollutantName: '烟气流速',
    unit: 'm/s',
  },
];

const dvaPropsData = ({ loading, dataModel }) => ({});

const StopParams = props => {
  const [form] = Form.useForm();
  const { dispatch } = props;
  const [DGIMN, setDGIMN] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [paramCodeList, setParamCodeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DGIMN) {
      loadData();
      GetParamCodeList();
    }
  }, [DGIMN]);

  // 加载数据
  const loadData = () => {
    setLoading(true);
    dispatch({
      type: 'AbnormalIdentifyModel/GenericPostRequest',
      url: API.AbnormalIdentifyModel.GetStopParamList,
      payload: {
        DGIMN,
      },
      callback: res => {
        setLoading(false);
        setDataSource(res.Datas);
      },
    });
  };

  // 获取参数名称
  const GetParamCodeList = () => {
    dispatch({
      type: 'AbnormalIdentifyModel/GenericPostRequest',
      url: API.AbnormalIdentifyModel.GetParamCodeList,
      payload: {
        DGIMN,
      },
      callback: res => {
        console.log('res', res);
        setParamCodeList(res.Datas);
      },
    });
  };

  // 提交任务单
  const onFinish = async () => {
    const values = await form.validateFields();
    props.dispatch({
      type: 'AbnormalIdentifyModel/GenericPostRequest',
      url: API.AbnormalIdentifyModel.AddOrUpdStopParam,
      payload: {
        ...values,
        DGIMN,
        ID: currentRow.ID,
      },
      callback: () => {
        message.success('操作成功！');
        loadData();
        setIsModalOpen(false);
        form.resetFields();
      },
    });
  };

  // 删除
  const onDelete = row => {
    props.dispatch({
      type: 'AbnormalIdentifyModel/GenericPostRequest',
      url: API.AbnormalIdentifyModel.DelStopParam,
      payload: {
        ID: row.ID,
      },
      callback: () => {
        message.success('删除成功！');
        loadData();
      },
    });
  };

  const columns = [
    {
      title: '参数类别',
      dataIndex: 'ParamTypeName',
      key: 'ParamTypeName',
    },
    {
      title: '参数名称',
      dataIndex: 'PollutantName',
      key: 'PollutantName',
    },
    {
      title: '单位',
      dataIndex: 'Unit',
      key: 'Unit',
    },
    {
      title: '上限',
      dataIndex: 'UpperLimit',
      key: 'UpperLimit',
    },
    {
      title: '下限',
      dataIndex: 'LowerLimit',
      key: 'LowerLimit',
    },
    {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      render: (text, record) => {
        return (
          <div>
            <a
              onClick={() => {
                setIsModalOpen(true);
                setCurrentRow(record);
                form.setFieldsValue(record);
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除吗?"
              onConfirm={() => {
                onDelete(record);
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <NavigationTree
        showIndustry
        propsParams={{
          IsRela: 1, // 只查询模型关联的排口
          outputType: 0,
          StopPointFlag: true,
        }}
        checkpPol="2"
        polShow
        domId="#StopParams"
        onItemClick={value => {
          console.log('value', value);
          if (value[0].IsEnt === false) {
            setDGIMN(value[0].key);
          }
        }}
      />
      <div id="StopParams">
        <BreadcrumbWrapper>
          {/* <div className={styles.CardPageWrapper}>
            
          </div> */}
          <Card title="停运参数管理">
            <Button
              type="primary"
              style={{ marginBottom: 10 }}
              loading={loading}
              onClick={() => {
                setIsModalOpen(true);
                setCurrentRow({});
                form.resetFields();
              }}
            >
              新增
            </Button>
            <SdlTable dataSource={dataSource} columns={columns} loading={loading} />
          </Card>
          <Modal
            title={`${currentRow.ID ? '新增' : '编辑'}停运参数`}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={() => {
              onFinish();
            }}
            destroyOnClose
          >
            <Form
              form={form}
              initialValues={{}}
              autoComplete="off"
              labelCol={{ flex: '100px' }}
              wrapperCol={{ flex: 1 }}
            >
              <Form.Item
                label="参数类别"
                name="ParamType"
                rules={[
                  {
                    required: true,
                    message: '不能为空',
                  },
                ]}
              >
                <Select placeholder="请选择" showSearch allowClear optionFilterProp="children">
                  <Option key={1} value={'1'}>
                    正常生产波动范围
                  </Option>
                  <Option key={2} value={'2'}>
                    工况停运波动范围
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="参数名称"
                name="PollutantCode"
                rules={[
                  {
                    required: true,
                    message: '不能为空',
                  },
                ]}
              >
                <Select placeholder="请选择" showSearch allowClear optionFilterProp="children">
                  {paramCodeList.map(item => {
                    return (
                      <Option key={item.pollutantCode} value={item.pollutantCode}>
                        {item.PollutantName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                label="上限"
                name="UpperLimit"
                rules={[
                  {
                    required: true,
                    message: '不能为空',
                  },
                ]}
              >
                <InputNumber placeholder="请输入上限值" min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label="下限"
                name="LowerLimit"
                rules={[
                  {
                    required: true,
                    message: '不能为空',
                  },
                ]}
              >
                <InputNumber placeholder="请输入下限值" min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Form>
          </Modal>
        </BreadcrumbWrapper>
      </div>
    </>
  );
};

export default connect(dvaPropsData)(StopParams);
