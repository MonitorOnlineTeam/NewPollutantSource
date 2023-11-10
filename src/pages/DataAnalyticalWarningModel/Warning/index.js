/*
 * @Author: JiaQi
 * @Date: 2023-05-30 14:30:45
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-11-09 17:04:03
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
import { ModelNumberIdsDatas, ModalNameConversion } from '../CONST';
import SearchSelect from '@/pages/AutoFormManager/SearchSelect';

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
  const [total, setTotal] = useState(0);

  console.log('warningForm', warningForm);
  useEffect(() => {
    // getModelIdsByModelNumber(false);
    // handleLocationParams();
    if (modelNumber) {
      if (modelMenuNumber === modelNumber) {
        // 页面没跳转
        debugger;
        onFinish();
      } else {
        // 页面跳转，清空查询条件并重置分页
        if (props.history.location.query.notResetForm) {
          onReset(true);
        } else {
          onReset();
        }
        // form.setFieldsValue({ warningTypeCode: [] });
        // onTableChange(1, 20);
      }
    } else {
      onFinish();
    }
    GetModelList();
    if (warningForm[modelNumber].EntCode) {
      getPointList(warningForm[modelNumber].EntCode);
    }

    props.dispatch({
      type: 'dataModel/updateState',
      payload: {
        modelMenuNumber: modelNumber,
      },
    });

    console.log('modelNumber', modelNumber);
  }, [modelNumber]);

  // useEffect(() => {
  //   onFinish();
  //   console.log('pageIndex', warningForm[modelNumber].pageIndex);
  // }, [warningForm[modelNumber].pageIndex, warningForm[modelNumber].pageSize]);

  // 处理地址栏参数
  const handleLocationParams = () => {
    let locationParams = props.history.location.query.params;
    if (locationParams) {
      // onReset();
      let values = JSON.parse(locationParams);
      values.date = [moment(values.date[0]), moment(values.date[1])];
      form.setFieldsValue(values);
      if (values.EntCode) {
        getPointList(values.EntCode);
      }
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
        if (modelNumber && modelNumber !== 'all') {
          _modelList = _modelList.filter(item =>
            ModelNumberIdsDatas[modelNumber].includes(item.ModelGuid),
          );
          // _modelList = modelType.split(',')
        }
        setModelList(_modelList);
      },
    });
  };

  // 根据模型类型编号获取模型id
  const getModelIdsByModelNumber = isInitValue => {
    if (!modelNumber) return;

    let modelIds = ModelNumberIdsDatas[modelNumber];
    // 初始化场景类别默认值
    isInitValue &&
      form.setFieldsValue({
        warningTypeCode: modelIds,
      });

    // setModelIdDatas(modelIds);
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
          return (
            (warningForm[modelNumber].pageIndex - 1) * warningForm[modelNumber].pageSize + index + 1
          );
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
        title: '行业',
        dataIndex: 'IndustryTypeName',
        key: 'IndustryTypeName',
        width: 120,
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
          let _text = ModalNameConversion(text);
          return (
            <Tooltip title={_text}>
              <span className={styles.textOverflow}>{_text}</span>
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
              return <Badge status="warning" text="有异常" />;
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
                  let scrollTop = 0;
                  let el = document.querySelector('.ant-table-body');
                  el ? (scrollTop = el.scrollTop) : '';
                  props.dispatch({
                    type: 'dataModel/updateState',
                    payload: {
                      warningForm: {
                        ...warningForm,
                        [modelNumber]: {
                          ...warningForm[modelNumber],
                          rowKey: record.ModelWarningGuid,
                          scrollTop: scrollTop,
                        },
                      },
                    },
                  });
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
    let warningTypeCode = values.warningTypeCode.toString();

    if (modelNumber && !warningTypeCode && modelNumber !== 'all') {
      warningTypeCode = ModelNumberIdsDatas[modelNumber].toString();
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
        modelNumber: modelNumber,
        // pageSize: warningForm[modelNumber].pageSize,
        // pageIndex: warningForm[modelNumber].pageIndex,
      },
      callback: res => {
        setDataSource(res.Datas);
        setTotal(res.Total);

        // 设置滚动条高度，定位到点击详情的行号
        let currentForm = warningForm[modelNumber];
        // if (currentForm.scrollTop !== undefined && currentForm.rowKey) {
        //   let tableBody = document.querySelector('.ant-table-body');
        //   let rowEl = document.querySelector(`[data-row-key="${currentForm.rowKey}"]`);
        //   el
        //     ? el.scrollIntoView({ block: 'nearest' })
        //     : (document.querySelector('.ant-table-body').scrollTop = 0);
        //   debugger;
        //   el && (el.scrollTop = currentForm.scrollTop);
        // }
        let el = document.querySelector(`[data-row-key="${currentForm.rowKey}"]`);
        let body = document.querySelector('.ant-table-body');
        console.log('el', el);
        el && body
          ? (document.querySelector('.ant-table-body').scrollTop = currentForm.scrollTop)
          : (document.querySelector('.ant-table-body').scrollTop = 0);
      },
    });
  };

  // 重置表单
  const onReset = notResetForm => {
    dispatch({
      type: 'dataModel/onReset',
      payload: {
        modelNumber,
      },
    }).then(() => {
      !notResetForm && form.resetFields();
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
          [modelNumber]: {
            ...warningForm[modelNumber],
            pageSize,
            pageIndex: current,
            rowKey: undefined,
            scrollTop: 0,
          },
        },
      },
    });
    setTimeout(() => {
      onFinish();
    }, 0);
    // onFinish();
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
        form.setFieldsValue({
          ...warningForm[modelNumber],
        });
      },
    });
  };
  return (
    <BreadcrumbWrapper>
      <Card className={styles.warningWrapper}>
        <Form
          name="basic"
          form={form}
          layout="inline"
          style={{ padding: '10px 0' }}
          initialValues={{}}
          autoComplete="off"
          // onValuesChange={onValuesChange}
          onValuesChange={(changedFields, allFields) => {
            console.log('changedFields', changedFields);
            console.log('allFields', allFields);
            dispatch({
              type: 'dataModel/updateState',
              payload: {
                warningForm: {
                  ...warningForm,
                  [modelNumber]: {
                    ...props.warningForm[modelNumber],
                    ...changedFields,
                  },
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
          {// 脱敏角色不显示企业
          !currentUser.RoleIds.includes('1dd68676-cd35-43bb-8e16-40f0fde55c6c') && (
            <>
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
            </>
          )}
          <Form.Item label="行业" name="IndustryType">
            <SearchSelect
              placeholder="排口所属行业"
              style={{ width: 130 }}
              configId={'IndustryType'}
              itemName={'dbo.T_Cod_IndustryType.IndustryTypeName'}
              itemValue={'dbo.T_Cod_IndustryType.IndustryTypeCode'}
            />
          </Form.Item>
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
                      {ModalNameConversion(item.ModelName)}
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
            pageSize: warningForm[modelNumber].pageSize,
            current: warningForm[modelNumber].pageIndex,
            onChange: onTableChange,
            total: total,
          }}
        />
      </Card>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(WarningRecord);
