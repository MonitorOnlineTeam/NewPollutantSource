/*
 * @Author: JiaQi
 * @Date: 2023-05-30 14:30:45
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-08-31 10:20:59
 * @Description：报警记录
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Spin, Button, Space, Select, Badge, Tooltip } from 'antd';
import styles from '../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import RegionList from '@/components/RegionList';
import EntAtmoList from '@/components/EntAtmoList';
import { DetailIcon } from '@/utils/icon';
import { router } from 'umi';

const textStyle = {
  width: '100%',
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const dvaPropsData = ({ loading, dataModel }) => ({
  warningForm: dataModel.warningForm,
  modelMenuNumber: dataModel.modelMenuNumber,
  // modelList: dataModel.modelList,
  modelListLoading: loading.effects['dataModel/GetModelList'],
  queryLoading: loading.effects['dataModel/GetWarningList'],
  pointListLoading: loading.effects['dataModel/GetNoFilterPointByEntCode'],
});

const WarningRecord = props => {
  const [form] = Form.useForm();
  const {
    dispatch,
    warningForm,
    modelListLoading,
    queryLoading,
    modelMenuNumber,
    pointListLoading,
  } = props;
  const modelNumber = props.match.params.modelNumber;
  const [modelList, setModelList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [pointList, setPointList] = useState([]);
  const [modelIdDatas, setModelIdDatas] = useState();
  const [total, setTotal] = useState(0);
  useEffect(() => {
    getModelIdsByModelNumber(true);
    handleLocationParams();
    if (modelNumber) {
      if (modelMenuNumber === modelNumber) {
        onFinish();
      } else {
        onTableChange(1, 20);
      }
    } else {
      onFinish();
    }
    GetModelList();
    if (warningForm.EntCode) {
      getPointList(warningForm.EntCode);
    }

    props.dispatch({
      type: 'dataModel/updateState',
      payload: {
        modelMenuNumber: modelNumber,
      },
    });

    console.log('modelNumber', modelNumber);
  }, [modelNumber]);

  // 处理地址栏参数
  const handleLocationParams = () => {
    let locationParams = props.history.location.query.params;
    if (locationParams) {
      let values = JSON.parse(locationParams);
      values.date = [moment(values.date[0]), moment(values.date[1])];
      form.setFieldsValue(values);
      // onFinish();
    }
  };

  // 获取数据模型列表
  const GetModelList = () => {
    const modelIds = form.getFieldValue('warningTypeCode');
    dispatch({
      type: 'dataModel/GetModelList',
      payload: {},
      callback: (res, unfoldModelList) => {
        let _modelList = unfoldModelList;
        console.log('unfoldModelList', unfoldModelList);
        if (modelNumber) {
          _modelList = _modelList.filter(item => modelIds.includes(item.ModelGuid));
          // _modelList = modelType.split(',')
        }
        setModelList(_modelList);
      },
    });
  };

  // 根据模型类型编号获取模型id
  const getModelIdsByModelNumber = isInitValue => {
    if (!modelNumber) return;

    let modelIds = '';
    switch (modelNumber) {
      // 波动范围异常分析
      case '2.2':
        // 疑似篡改分析仪量程
        // 疑似人为修改颗粒物斜率截距
        modelIds = ['069ab699-428a-4f4b-8df7-915d6b4f3215', '5bfd23c7-03da-4f4b-a258-a9c618774ab9'];
        break;

      // 样气异常识别
      case '4.1':
        // 疑似监测样品为空气,
        // 疑似监测样品混入氮气,
        // 疑似监测样品混入空气,
        // 疑似监测样品混入氧混合气
        modelIds = [
          '9104ab9f-d3f3-4bd9-a0d9-898d87def4dd',
          '1fed575c-48d7-4eef-9266-735fe4bbdb2a',
          '5520e6f2-ac4a-4f24-bafd-48746a13f4a4',
          '1b9afa8d-1200-4fb1-aab0-a59936c3f22d',
        ];
        break;

      // 参数变化识别
      case '5.1':
        // 疑似人为修改烟道截面积
        // 疑似人为修改过量空气系数
        // 疑似人为修改速度场系数
        // 疑似计算公式错误
        modelIds = [
          'c934b575-a357-4a2c-b493-02849ce9cee3',
          '3d209ce2-da92-44c4-916b-8874d05da558',
          'ce61d9a9-5d0d-4b66-abbd-72a89e823ee2',
          'a59cce2a-8558-4c42-8a45-4d8402e4b29d',
        ];
        break;

      // 模拟监测数据
      case '5.2':
        // 疑似超过预设值数据恒定
        // 疑似疑似使用随机数产生数据
        // 疑似按预设公式处理数据
        // 疑似远程控制监测数据
        modelIds = [
          '1a606047-6f21-4357-a459-03ef7788e09a',
          '39680c93-e03f-42cf-a21f-115255251d4e',
          '983cd7b9-55e1-47f3-b369-2df7bc0a6111',
          'b52087fb-563c-4939-a11f-f86b10da63c1',
        ];
        break;

      // 多排放源数据一致性分析
      case '6.1':
        // 疑似借用其他合格监测设备数据
        // 疑似替换分析仪监测样气
        modelIds = ['c0af25fb-220b-45c6-a3de-f6c8142de8f1', 'ab2bf5ec-3ade-43fc-a720-c8fd92ede402'];
        break;

      // 同一排放源时间序列数据相似分析
      case '6.2':
        // 疑似借用本设备合格历史数据
        modelIds = ['d5dea4cc-bd6c-44fa-a122-a1f44514b465'];
        break;

      // 多组分数据相关性分析
      case '6.3':
        // 疑似引用错误、虚假原始信号值
        modelIds = ['f021147d-e7c6-4c1d-9634-1d814ff9880a'];
        break;

      // 虚假标记异常识别
      case '7.1':
        // 疑似机组停运未及时上报
        // 疑似机组停运虚假标记
        // 疑似超过标准标记数据无效
        // 疑似恒定值微小波动
        // 疑似零值微小波动
        modelIds = [
          '928ec327-d30d-4803-ae83-eab3a93538c1',
          '3568b3c6-d8db-42f1-bbff-e76406a67f7f',
          '6675e28e-271a-4fb7-955b-79bf0b858e8e',
          'cda1f2e2-ec5f-425b-93d2-94ba62b17146',
          '0fa091a3-7a19-4c9e-91bd-c5a4bf2e9827',
        ];
        break;
    }
    // 初始化场景类别默认值
    isInitValue &&
      form.setFieldsValue({
        warningTypeCode: modelIds,
      });

    setModelIdDatas(modelIds);
    // return modelIds;
  };

  const getColumns = () => {
    return [
      {
        title: '编号',
        dataIndex: 'index',
        key: 'index',
        width: 80,
        ellipsis: true,
        render: (text, record, index) => {
          return (warningForm.pageIndex - 1) * warningForm.pageSize + index + 1;
        },
      },
      {
        title: '企业',
        dataIndex: 'EntNmae',
        key: 'EntNmae',
        width: 200,
        ellipsis: true,
      },
      {
        title: '排口',
        dataIndex: 'PointName',
        key: 'PointName',
        width: 200,
        ellipsis: true,
      },
      {
        title: '发现线索时间',
        dataIndex: 'WarningTime',
        key: 'WarningTime',
        width: 180,
        ellipsis: true,
        sorter: (a, b) => moment(a.WarningTime).valueOf() - moment(b.WarningTime).valueOf(),
      },
      {
        title: '场景类别',
        dataIndex: 'WarningTypeName',
        key: 'WarningTypeName',
        width: 180,
        ellipsis: true,
        render: (text, record) => {
          return (
            <Tooltip title={text}>
              <span style={textStyle}>{text}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '线索内容',
        dataIndex: 'WarningContent',
        key: 'WarningContent',
        width: 240,
        ellipsis: true,
        render: (text, record) => {
          return (
            <Tooltip title={text}>
              <span style={textStyle}>{text}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '核实结果',
        dataIndex: 'CheckedResultCode',
        key: 'CheckedResultCode',
        width: 120,
        render: (text, record) => {
          switch (text) {
            case '3':
              return <Badge status="default" text="未核实" />;
            case '2':
              return <Badge status="success" text="有异常" />;
            case '1':
              return <Badge status="error" text="系统误报" />;
          }
        },
      },
      {
        title: '操作',
        key: 'handle',
        width: 100,
        render: (text, record) => {
          return (
            <Tooltip title="查看">
              <a
                onClick={e => {
                  router.push(
                    `/DataAnalyticalWarningModel/Warning/ModelType/${modelNumber}/WarningVerify/${record.ModelWarningGuid}`,
                  );
                }}
              >
                <DetailIcon />
              </a>
            </Tooltip>
          );
        },
      },
    ];
  };

  // 查询数据
  const onFinish = () => {
    const values = form.getFieldsValue();
    console.log('values', values);
    let warningTypeCode = values.warningTypeCode.toString();

    if (modelNumber && !warningTypeCode) {
      warningTypeCode = modelIdDatas.toString();
    }

    props.dispatch({
      type: 'dataModel/GetWarningList',
      payload: {
        ...values,
        Dgimn: values.DGIMN,
        warningTypeCode: warningTypeCode,
        date: undefined,
        beginTime: values.date[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.date[1].format('YYYY-MM-DD HH:mm:ss'),
        // pageIndex,
        // pageSize,
      },
      callback: res => {
        setDataSource(res.Datas);
        setTotal(res.Total);
      },
    });
  };

  // 重置表单
  const onReset = () => {
    dispatch({
      type: 'dataModel/onReset',
      payload: {},
    }).then(() => {
      form.resetFields();
      onTableChange(1, 20);
    });
  };

  // 分页
  const onTableChange = (current, pageSize) => {
    props.dispatch({
      type: 'dataModel/updateState',
      payload: {
        warningForm: {
          ...warningForm,
          pageSize,
          pageIndex: current,
        },
      },
    });
    onFinish();
  };

  // 根据企业获取排口
  const getPointList = EntCode => {
    dispatch({
      type: 'dataModel/GetNoFilterPointByEntCode',
      payload: {
        EntCode,
      },
      callback: res => {
        setPointList(res);
      },
    });
  };
  console.log('pointListLoading', pointListLoading);
  return (
    <BreadcrumbWrapper>
      <Card className={styles.warningWrapper}>
        <Form
          name="basic"
          form={form}
          layout="inline"
          style={{ padding: '10px 0' }}
          initialValues={{
            ...warningForm,
          }}
          autoComplete="off"
          // onValuesChange={onValuesChange}
          onValuesChange={(changedFields, allFields) => {
            console.log('changedFields', changedFields);
            console.log('allFields', allFields);
            dispatch({
              type: 'dataModel/updateState',
              payload: {
                warningForm: {
                  ...props.warningForm,
                  ...changedFields,
                },
              },
            });
          }}
        >
          <Form.Item label="日期" name="date">
            <RangePicker_
              allowClear={false}
              dataType="day"
              format="YYYY-MM-DD"
              style={{ width: 250 }}
            />
          </Form.Item>
          <Form.Item label="行政区" name="regionCode">
            <RegionList noFilter style={{ width: 140 }} />
          </Form.Item>
          <Form.Item label="企业" name="EntCode">
            <EntAtmoList
              noFilter
              style={{ width: 200 }}
              onChange={value => {
                if (!value) {
                  form.setFieldsValue({ DGIMN: undefined });
                } else {
                  form.setFieldsValue({ DGIMN: undefined });
                  getPointList(value);
                }
              }}
            />
          </Form.Item>
          <Spin spinning={!!pointListLoading} size="small">
            <Form.Item label="监测点名称" name="DGIMN">
              <Select
                placeholder="请选择"
                showSearch
                allowClear
                optionFilterProp="children"
                style={{ width: 150 }}
              >
                {pointList.map(item => {
                  return (
                    <Option key={item.DGIMN} value={item.DGIMN}>
                      {item.PointName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Spin>
          <Spin spinning={modelListLoading} size="small">
            <Form.Item label="场景类别" name="warningTypeCode">
              <Select
                allowClear
                mode="multiple"
                maxTagCount={2}
                maxTagTextLength={6}
                maxTagPlaceholder="..."
                placeholder="请选择场景类别"
                style={{ width: 340 }}
                showSearch
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {modelList.map(item => {
                  return (
                    <Option key={item.ModelGuid} value={item.ModelGuid}>
                      {item.ModelName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Spin>
          <Form.Item label="核实结果" name="checkedResultCode">
            <Select allowClear style={{ width: 120 }} placeholder="请选择核实结果">
              <Option value="2">有异常</Option>
              <Option value="1">系统误报</Option>
              <Option value="3">未核实</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                loading={queryLoading}
                onClick={() => {
                  onTableChange(1, 20);
                  // onFinish();
                }}
              >
                查询
              </Button>
              <Button onClick={() => onReset()}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
        <SdlTable
          rowKey="ModelWarningGuid"
          align="center"
          columns={getColumns()}
          dataSource={dataSource}
          loading={queryLoading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize: warningForm.pageSize,
            current: warningForm.pageIndex,
            onChange: onTableChange,
            total: total,
          }}
        />
      </Card>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(WarningRecord);
