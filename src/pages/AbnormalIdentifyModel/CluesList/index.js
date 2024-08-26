/*
 * @Author: JiaQi
 * @Date: 2023-05-30 14:30:45
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-08-23 17:09:47
 * @Description：线索列表
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  TreeSelect,
  Modal,
  Card,
  Spin,
  Button,
  Space,
  Select,
  Input,
  Tooltip,
  message,
  Tag,
  Popconfirm,
} from 'antd';
import styles from '../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import RegionList from '@/components/RegionList';
import EntAtmoList from '@/components/EntAtmoList';
import { DetailIcon } from '@/utils/icon';
import { router } from 'umi';
import { ModelNumberIdsDatas, ModalNameConversion, transformData } from '../CONST';
import SearchSelect from '@/pages/AutoFormManager/SearchSelect';
import CluesDetails from './CluesDetails';
import { isArray } from 'lodash';
import Cookie from 'js-cookie';
const { SHOW_PARENT } = TreeSelect;

const textStyle = {
  width: '100%',
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  cluesListTag: AbnormalIdentifyModel.cluesListTag,
  warningForm: AbnormalIdentifyModel.warningForm,
  modelMenuNumber: AbnormalIdentifyModel.modelMenuNumber,
  // modelList: AbnormalIdentifyModel.modelList,
  modelListLoading: loading.effects['AbnormalIdentifyModel/GetModelList'],
  queryLoading: loading.effects['AbnormalIdentifyModel/GetWarningList'],
  pointListLoading: loading.effects['AbnormalIdentifyModel/GetNoFilterPointByEntCode'],
  entListLoading: loading.effects['common/getEntNoFilterList'],
});

const CluesList = props => {
  const [form] = Form.useForm();
  const {
    dispatch,
    warningForm,
    modelListLoading,
    queryLoading,
    modelMenuNumber,
    pointListLoading,
    entListLoading,
    showMode,
    tableProps = {},
    cluesListTag,
  } = props;
  const modelNumber = props.match.params.modelNumber;
  // const modelNumber = 'all';
  const [modelList, setModelList] = useState([]);
  const [levelList, setLevelList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [warningTypeCounts, setWarningTypeCounts] = useState([]);
  const [pointList, setPointList] = useState([]);
  const [total, setTotal] = useState(0);
  const [cluesDetailsProps, setCluesDetailsProps] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  console.log('warningForm', warningForm);
  // useEffect(() => {
  //   // getModelIdsByModelNumber(false);
  //   // handleLocationParams();
  //   if (modelNumber) {
  //     if (modelMenuNumber === modelNumber) {
  //       // 页面没跳转
  //       onFinish();
  //     } else {
  //       // 页面跳转，清空查询条件并重置分页
  //       if (props.history && props.history.location.query.notResetForm) {
  //         onReset(true);
  //       } else {
  //         onReset();
  //       }
  //       // form.setFieldsValue({ warningTypeCode: [] });
  //       // onTableChange(1, 20);
  //     }
  //   } else {
  //     onFinish();
  //   }
  //   GetModelList();
  //   if (warningForm[modelNumber].EntCode) {
  //     getPointList(warningForm[modelNumber].EntCode);
  //   }
  //   props.dispatch({
  //     type: 'AbnormalIdentifyModel/updateState',
  //     payload: {
  //       modelMenuNumber: modelNumber,
  //     },
  //   });
  // }, [modelNumber]);
  useEffect(() => {
    form.setFieldsValue({ ...warningForm[modelNumber] });
    GetMoldTypeLevelList();
    GetModelList();
    onFinish();
  }, [modelNumber]);

  useEffect(() => {
    // 标识改变后重新加载数据（深层弹窗操作后，要刷新列表时使用）
    cluesListTag && onFinish();
  }, [cluesListTag]);

  useEffect(() => {
    form.setFieldsValue({ ...warningForm[modelNumber] });
    if (warningForm[modelNumber].EntCode) {
      getPointList(warningForm[modelNumber].EntCode);
    }
  }, [warningForm[modelNumber]]);

  // 获取数据模型列表
  const GetModelList = () => {
    const modelIds = form.getFieldValue('warningTypeCode');
    dispatch({
      type: 'AbnormalIdentifyModel/GetModelList',
      payload: {
        type: 1, // 过滤掉打标记和数据现象
      },
      callback: (res, unfoldModelList) => {
        // let _modelList = unfoldModelList;
        // if (modelNumber && modelNumber !== 'all') {
        //   _modelList = _modelList.filter(item =>
        //     ModelNumberIdsDatas[modelNumber].includes(item.ModelGuid),
        //   );
        //   // _modelList = modelType.split(',')
        // }
        // setModelList(_modelList);
        let modelList = transformData(res);
        console.log('modelList', modelList);
        setModelList(modelList);
      },
    });
  };

  // 获取级别和分类
  const GetMoldTypeLevelList = () => {
    dispatch({
      type: 'AbnormalIdentifyModel/GetMoldTypeLevelList',
      payload: {
        type: 1, // 过滤掉打标记和数据现象
      },
      callback: res => {
        let levelList = res.level.map(item => {
          return {
            ...item,
            ModelGuid: item.ModelTypeCode,
            ModelName: item.ModelTypeName,
          };
        });
        setLevelList(levelList);

        let typeList = res.type.map(item => {
          return {
            ...item,
            ModelGuid: item.ModelTypeCode,
            ModelName: item.ModelTypeName,
          };
        });
        setTypeList(typeList);
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
        width: 60,
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
        width: 160,
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
        width: 260,
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
        title: '核实结论',
        dataIndex: 'CheckedDes',
        key: 'CheckedDes',
        width: 120,
        render: (text, record) => {
          if (text) {
            return (
              <Tooltip title={text}>
                <span style={textStyle}>{text}</span>
              </Tooltip>
            );
          }
          return '-';
        },
      },
      {
        title: '操作',
        key: 'handle',
        width: 60,
        render: (text, record) => {
          return (
            <Tooltip title="查看">
              <a
                onClick={e => {
                  let scrollTop = 0;
                  let el = document.querySelector('.ant-table-body');
                  el ? (scrollTop = el.scrollTop) : '';
                  props.dispatch({
                    type: 'AbnormalIdentifyModel/updateState',
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
                  setCluesDetailsProps(record);
                  // showMode === 'modal'
                  //   ? setCluesDetailsProps(record)
                  //   : router.push(
                  //       `/AbnormalIdentifyModel/CluesList/CluesDetails/${record.ModelWarningGuid}?checkId=${record.ModelCheckedGuid}`,
                  //     );
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
    const { level = [], types = [] } = values;
    let warningTypeCode = [];
    if (values.warningTypeCode) {
      warningTypeCode = isArray(values.warningTypeCode)
        ? values.warningTypeCode
        : [values.warningTypeCode];
    }

    let codes = [...warningTypeCode, ...level, ...types];

    // if (modelNumber && !warningTypeCode && modelNumber !== 'all') {
    //   warningTypeCode = ModelNumberIdsDatas[modelNumber].toString();
    // }
    if (!values?.date?.length && !values?.date1?.length) {
      message.error('请选择日期后查询！');
      return;
    }
    console.log('values', values);

    // 判断查询实时还是历史数据
    let IsReal = undefined; // 全部
    if (location.pathname === '/AbnormalIdentifyModel/CluesList/all') {
      IsReal = 1; // 实时
    } else if (location.pathname === '/AbnormalIdentifyModel/CluesList/history') {
      IsReal = 0; // 历史
    }
    props.dispatch({
      type: 'AbnormalIdentifyModel/GetWarningList',
      payload: {
        ...values,
        Dgimn: values.DGIMN,
        warningTypeCode: codes.toString(),
        types: undefined,
        level: undefined,
        date: undefined,
        beginTime: values.date ? values.date[0]?.format('YYYY-MM-DD HH:mm:ss') : undefined,
        endTime: values.date ? values.date[1]?.format('YYYY-MM-DD HH:mm:ss') : undefined,
        date1: undefined,
        IsReal: IsReal,
        WarningBeginTime: values.date1
          ? values.date1[0]?.startOf('day').format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        WarningEndTime: values.date1
          ? values.date1[1]?.endOf('day').format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        modelNumber: modelNumber,
        // pageSize: warningForm[modelNumber].pageSize,
        // pageIndex: warningForm[modelNumber].pageIndex,
      },
      callback: res => {
        setDataSource(res.Datas.finalResult);
        setWarningTypeCounts(_.sortBy(res.Datas.warningTypeCounts, item => -item.Count));
        setTotal(res.Total);
        setSelectedRowKeys([]);
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
        let tableBody = document.querySelector('.ant-table-body');
        if (tableBody) {
          el ? (tableBody.scrollTop = currentForm.scrollTop) : (tableBody.scrollTop = 0);
        }
      },
    });
  };

  // 重置表单
  const onReset = notResetForm => {
    dispatch({
      type: 'AbnormalIdentifyModel/onReset',
      payload: {
        modelNumber,
      },
    }).then(() => {
      if (!notResetForm) {
        form.resetFields();
        form.setFieldsValue({
          ...warningForm[modelNumber],
        });
      }
      onTableChange(1, 100);
    });
  };

  // 分页
  const onTableChange = (current, pageSize) => {
    props.dispatch({
      type: 'AbnormalIdentifyModel/updateState',
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
      type: 'AbnormalIdentifyModel/GetNoFilterPointByEntCode',
      payload: {
        EntCode,
      },
      callback: res => {
        setPointList(res);
        // form.setFieldsValue({
        //   ...warningForm[modelNumber],
        // });
      },
    });
  };

  // 删除线索
  const onDelWarningModel = IsDeleteWarning => {
    dispatch({
      type: 'AbnormalIdentifyModel/DelWarningModel',
      payload: {
        ModelGuid: selectedRowKeys,
        IsDeleteWarning,
      },
      callback: res => {
        message.success('删除成功！');
        onFinish();
      },
    });
  };

  const getTreePorps = data => {
    const tProps = {
      treeData: data,
      treeCheckable: true,
      // showCheckedStrategy: SHOW_PARENT,
      maxTagCount: 3,
      maxTagTextLength: 5,
      maxTagPlaceholder: '...',
      placeholder: '请选择场景类别',
      style: {
        width: '400px',
      },
      treeDefaultExpandAll: true,
    };

    return tProps;
  };

  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys: selectedRowKeys,
    onChange: (newSelectedRowKeys, selectedRows) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const getPageContent = () => {
    let cardProps = showMode === 'modal' ? { bordered: false, bodyStyle: { padding: 0 } } : {};
    let actionTreeProps = getTreePorps(modelList);
    let levelTreeProps = getTreePorps(levelList);
    let typeTreeProps = getTreePorps(typeList);

    const userCookie = Cookie.get('currentUser');
    let isSystem = false;
    if (userCookie) {
      isSystem = JSON.parse(userCookie).User_ID === '48f3889c-af8d-401f-ada2-c383031af92d';
    }

    return (
      <Card className={styles.warningWrapper} {...cardProps}>
        <Form
          name="searchForm"
          form={form}
          layout="inline"
          // style={{ padding: '10px 0' }}
          initialValues={{
            ...warningForm[modelNumber],
            // regionCode: warningForm[modelNumber].regionCode || undefined,
          }}
          autoComplete="off"
          // onValuesChange={onValuesChange}
          onValuesChange={(changedFields, allFields) => {
            // let changedFields_temp = { ...changedFields };
            // if (!changedFields_temp.EntCode) {
            //   changedFields_temp.DGIMN = undefined;
            // }
            let DGIMN = allFields.DGIMN;
            if (!allFields.EntCode || changedFields.EntCode) {
              DGIMN = undefined;
            }
            dispatch({
              type: 'AbnormalIdentifyModel/updateState',
              payload: {
                warningForm: {
                  ...warningForm,
                  [modelNumber]: {
                    ...props.warningForm[modelNumber],
                    ...changedFields,
                    DGIMN,
                  },
                },
              },
            });
          }}
        >
          <Form.Item label="发现线索日期" name="date">
            <RangePicker_
              // allowClear={false}
              dataType="day"
              format="YYYY-MM-DD"
              style={{ width: 250 }}
            />
          </Form.Item>
          <Form.Item label="数据异常日期" name="date1">
            <RangePicker_
              // allowClear={false}
              dataType="day"
              format="YYYY-MM-DD"
              style={{ width: 250 }}
            />
          </Form.Item>
          <Form.Item label="污染物" name="PollutantCode">
            <Select
              placeholder="请选择污染物"
              showSearch
              optionFilterProp="children"
              style={{ width: 150 }}
            >
              <Option key={'1'} value={''}>
                全部
              </Option>
              <Option key={'2'} value={'01'}>
                颗粒物
              </Option>
              <Option key={'3'} value={'02'}>
                二氧化硫
              </Option>
              <Option key={'4'} value={'03'}>
                氮氧化物
              </Option>
            </Select>
          </Form.Item>
          <Form.Item label="行政区" name="regionCode">
            <RegionList
              noFilter
              style={{ width: 140 }}
              onChange={value => {
                form.setFieldsValue({ EntCode: undefined, DGIMN: undefined });
                dispatch({
                  type: 'AbnormalIdentifyModel/updateState',
                  payload: {
                    warningForm: {
                      ...warningForm,
                      [modelNumber]: {
                        ...props.warningForm[modelNumber],
                        regionCode: value,
                        EntCode: undefined,
                        DGIMN: undefined,
                      },
                    },
                  },
                });
                setPointList([]);
              }}
            />
          </Form.Item>
          {
            <>
              {/* <Spin spinning={!!entListLoading} size="small" style={{ background: '#fff' }}> */}
              <Form.Item label="企业" name="EntCode">
                <EntAtmoList
                  regionCode={form.getFieldValue('regionCode')}
                  style={{ width: 200 }}
                  onChange={value => {
                    if (!value) {
                      form.setFieldsValue({ DGIMN: undefined });
                      setPointList([]);
                    } else {
                      form.setFieldsValue({ DGIMN: undefined });
                      getPointList(value);
                    }
                  }}
                />
              </Form.Item>
              {/* </Spin> */}

              {/* // 在首页点击查询是会出现loading  */}
              {/* <Spin spinning={!!pointListLoading} size="small" style={{ background: '#fff' }}> */}
              <Spin spinning={false} size="small" style={{ background: '#fff' }}>
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
          }
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
              <TreeSelect {...actionTreeProps} allowClear showSearch treeNodeFilterProp="label" />
            </Form.Item>
          </Spin>
          <Form.Item label="异常级别" name="level">
            <TreeSelect
              {...levelTreeProps}
              fieldNames={{ label: 'ModelName', value: 'ModelGuid', children: 'ModelList' }}
              allowClear
              showSearch
              treeNodeFilterProp="label"
            />
          </Form.Item>
          <Form.Item label="异常分类" name="types">
            <TreeSelect
              {...typeTreeProps}
              fieldNames={{ label: 'ModelName', value: 'ModelGuid', children: 'ModelList' }}
              allowClear
              showSearch
              treeNodeFilterProp="label"
            />
          </Form.Item>
          <Form.Item label="线索内容" name="WarningContent">
            <Input placeholder="线索内容" style={{ width: 240 }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                loading={queryLoading}
                onClick={() => {
                  onTableChange(1, 100);
                  // onFinish();
                }}
              >
                查询
              </Button>
              {// 弹窗不显示重置按钮
              JSON.stringify(tableProps) === '{}' && (
                <Button
                  onClick={() => {
                    dispatch({
                      type: 'AbnormalIdentifyModel/onReset',
                      payload: {
                        modelNumber,
                      },
                    }).then(() => {
                      form.resetFields();
                      // onTableChange(1, 20);
                      onFinish();
                    });
                  }}
                >
                  重置
                </Button>
              )}
              {// 超级管理员显示
              isSystem && (
                <>
                  <Popconfirm
                    title="确认是否删除?"
                    onConfirm={() => onDelWarningModel(true)}
                    // okText="Yes"
                    // cancelText="No"
                  >
                    <Button type="primary" disabled={!selectedRowKeys.length} danger>
                      删除线索
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    title="确认是否删除?"
                    onConfirm={() => onDelWarningModel(false)}
                    // okText="Yes"
                    // cancelText="No"
                  >
                    <Button type="primary" disabled={!selectedRowKeys.length} danger>
                      删除核查任务
                    </Button>
                  </Popconfirm>
                </>
              )}
            </Space>
          </Form.Item>
        </Form>
        <SdlTable
          rowSelection={isSystem ? rowSelection : false}
          resizable
          rowKey="ModelWarningGuid"
          align="center"
          style={{ marginTop: 10 }}
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
          footer={() => (
            <Space wrap>
              {warningTypeCounts.map((item, index) => {
                let color = 'processing';
                if (warningTypeCounts.length >= 3) {
                  switch (index) {
                    case 0:
                      color = 'error';
                      break;
                    case 1:
                      color = 'volcano';
                      break;
                    case 2:
                      color = 'orange';
                      break;
                  }
                }
                return (
                  <Tag
                    style={{ cursor: 'pointer' }}
                    color={color}
                    key={item.WarningType}
                    onClick={() => {
                      if (form.getFieldValue('warningTypeCode') === item.WarningType) {
                        // 防止重复点击
                        return;
                      }
                      dispatch({
                        type: 'AbnormalIdentifyModel/updateState',
                        payload: {
                          warningForm: {
                            ...warningForm,
                            [modelNumber]: {
                              ...props.warningForm[modelNumber],
                              warningTypeCode: item.WarningType,
                              pageIndex: 1,
                              pageSize: 100,
                            },
                          },
                        },
                      });
                      setTimeout(() => {
                        onFinish();
                      }, 0);
                    }}
                  >{`${item.ModelName}：${item.Count}`}</Tag>
                );
              })}
            </Space>
          )}
          {...tableProps}
        />
        {console.log('cluesDetailsProps', cluesDetailsProps)}
        <Modal
          title={`${cluesDetailsProps?.EntNmae} / ${cluesDetailsProps?.PointName} - ${cluesDetailsProps?.WarningTypeName}`}
          wrapClassName="fullScreenModal"
          open={cluesDetailsProps}
          destroyOnClose
          footer={false}
          onCancel={() => {
            setCluesDetailsProps();
          }}
          bodyStyle={{
            height: 'calc(100vh - 40px)',
            overflowY: 'auto',
            backgroundColor: '#f0f2f5',
            padding: 12,
          }}
        >
          {cluesDetailsProps && (
            <CluesDetails
              // showMode={showMode}
              hideBreadcrumb={true}
              // selectedClusInfo={cluesDetailsProps}
              match={{
                params: {
                  id: cluesDetailsProps.ModelWarningGuid,
                },
              }}
              location={{
                query: {
                  checkId: cluesDetailsProps.ModelCheckedGuid,
                },
              }}
            />
          )}
        </Modal>
      </Card>
    );
  };

  if (showMode === 'modal') {
    return getPageContent();
  }

  return <BreadcrumbWrapper>{getPageContent()}</BreadcrumbWrapper>;
};

export default connect(dvaPropsData)(CluesList);
