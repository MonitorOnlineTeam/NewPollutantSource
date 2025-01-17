/*
 * @Author: JiaQi
 * @Date: 2025-01-16 11:40:22
 * @Last Modified by: JiaQi
 * @Last Modified time: 2025-01-17 12:00:06
 * @Description:  成套现场质量检查任务单
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { connect } from 'dva';
import {
  Alert,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  InputNumber,
  Divider,
  Row,
  Col,
  Space,
  Table,
  Rate,
  Radio,
  Spin,
  message,
} from 'antd';
import styles from './styles.less';
import HandleCustomer from './HandleCustomer';
import Cookie from 'js-cookie';
import moment from 'moment';
import debounce from 'lodash/debounce';
import LargeRegionList from '@/components/largeRegionList';
import SdlCascader from '@/pages/AutoFormManager/SdlCascader';
import { cookieName } from '@/config';
import { API } from '@config/API';

const { TextArea } = Input;

const dvaPropsData = ({ loading, wordSupervision, common }) => ({
  TYPE: wordSupervision.TYPE, // 1: 成套 “”：运维
  cemsModelList: wordSupervision.cemsModelList, // 系统型号
  getAlluserLoading: loading.effects[`common/getAlluser`],
  getEntAndPointLoading: loading.effects[`wordSupervision/GetProjectPointRelationList`],
  getDetailLoading: loading.effects[`wordSupervision/GetOnsiteInspectionRecordView`],
  cemsModelListLoading: loading.effects[`wordSupervision/GetMonitorCategorySystemList`],
  allUser: common.allUser,
});

const SiteQualityInspection = props => {
  const {
    customerList,
    submitLoading,
    onCancel,
    editData,
    onSubmitCallback,
    TYPE,
    taskInfo,
    visitEnvironmentalParameterLoading,
    mode,
    rowData,
    getEntAndPointLoading,
    cemsModelList,
    cemsModelListLoading,
    getDetailLoading,
  } = props;
  const [form] = Form.useForm();

  const [projectInfoList, setProjectInfoList] = useState([]);
  const [entAndPointList, setEntAndPointList] = useState([]);
  const [pointList, setPointList] = useState([]);
  const [inspectionInfo, setInspectionInfo] = useState({});
  const [editDetail, setEditDetail] = useState(null);
  const [isEditLoading, setIsEditLoading] = useState(false);

  let timeout;
  useEffect(() => {
    GetMonitorCategorySystemList();
    GetUserInfo();
    return () => {
      form.resetFields();
    };
  }, []);

  // 编辑或查看时的初始化
  useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && rowData?.ID) {
      setIsEditLoading(true);
      // 先获取企业和排口数据
      GetProjectPointRelationList(rowData.ProjectId);
    }
  }, [mode, rowData]);

  // 监听 entAndPointList 变化
  useEffect(() => {
    if (
      (mode === 'edit' || mode === 'view') &&
      rowData?.ID &&
      entAndPointList.length > 0 &&
      isEditLoading
    ) {
      // 在获取到企业排口数据后，再获取详情数据
      GetOnsiteInspectionRecordView({
        id: rowData.ID,
      });
      setIsEditLoading(false);
    }
  }, [entAndPointList]);

  // 获取用户信息
  const GetUserInfo = () => {
    props.dispatch({
      type: `common/getAlluser`,
      payload: {},
    });
  };

  // 根据项目ID获取企业和排口
  const GetProjectPointRelationList = projectID => {
    props.dispatch({
      type: 'wordSupervision/GetProjectPointRelationList',
      payload: {
        projectID,
      },
      callback: res => {
        setEntAndPointList(res);
      },
    });
  };

  // 获取系统型号
  const GetMonitorCategorySystemList = () => {
    props.dispatch({
      type: 'wordSupervision/GetMonitorCategorySystemList',
      payload: {},
    });
  };

  // 获取现场质量检查 - 详情/表格内容
  const GetOnsiteInspectionRecordView = payload => {
    props.dispatch({
      type: 'wordSupervision/GetOnsiteInspectionRecordView',
      payload,
      callback: res => {
        if (payload.cemsModel) {
          // 选择系统型号时的处理
          setInspectionInfo(res.model);
          
          // 添加时返填默认值
          if (res.model?.OnsiteInspectionRecordInfoList?.length) {
            // 设置检查记录的默认值
            res.model.OnsiteInspectionRecordInfoList.forEach(item => {
              form.setFieldsValue({
                [`SetValue_${item.TemplateId}`]: item.SetValue || '/',
                [`DisplayValue_${item.TemplateId}`]: item.DisplayValue || '/',
                [`IsQualified_${item.TemplateId}`]: item.IsQualified || '/',
              });
            });
          }
        } else if (payload.id) {
          // 编辑或查看时的处理
          const { MainModel, model } = res;

          // 设置检查记录列表
          setInspectionInfo(model);

          // 设置表单基础信息
          form.setFieldsValue({
            ...MainModel,
            ServerUserName: MainModel.ServerUserId,
            InstallDate: moment(MainModel.InstallDate),
            VerificationDate: moment(MainModel.VerificationDate),
            Remark: model.Remark,
          });

          // 设置检查记录的值
          model.OnsiteInspectionRecordInfoList.forEach(item => {
            form.setFieldsValue({
              [`SetValue_${item.TemplateId}`]: item.SetValue,
              [`DisplayValue_${item.TemplateId}`]: item.DisplayValue,
              [`IsQualified_${item.TemplateId}`]: item.IsQualified,
            });
          });

          // 如果有企业ID，设置监测点位列表
          if (MainModel.EntId) {
            const targetEnt = entAndPointList.find(ent => ent.EntId === MainModel.EntId);
            if (targetEnt) {
              setPointList(targetEnt.PointList || []);
            }
          }
        }
      },
    });
  };

  // 合并单元格的通用方法
  const getMergedCellProps = (text, record, index, fieldName) => {
    // 只合并相同值的行
    let count = 1;
    for (let i = index + 1; i < inspectionInfo?.OnsiteInspectionRecordInfoList?.length; i++) {
      if (record[fieldName] === inspectionInfo.OnsiteInspectionRecordInfoList[i][fieldName]) {
        count++;
      } else {
        break;
      }
    }

    if (
      index === 0 ||
      record[fieldName] !== inspectionInfo.OnsiteInspectionRecordInfoList[index - 1][fieldName]
    ) {
      return {
        children: text,
        props: {
          rowSpan: count,
        },
      };
    }
    return {
      children: text,
      props: {
        rowSpan: 0,
      },
    };
  };

  // 根据 mode 判断是否禁用表单
  const isView = mode === 'view';

  const getColumns = () => {
    return [
      {
        title: '检查项目',
        dataIndex: 'Inspection',
        key: 'Inspection',
        width: 100,
        align: 'center',
        render: (text, record, index) => getMergedCellProps(text, record, index, 'Inspection'),
      },
      {
        title: '监测点位',
        dataIndex: 'InspectionProject',
        key: 'InspectionProject',
        align: 'center',
        width: 100,
        render: (text, record, index) =>
          getMergedCellProps(text, record, index, 'InspectionProject'),
      },
      {
        title: '要求',
        dataIndex: 'Require',
        key: 'Require',
        width: 200,
        align: 'center',
      },
      {
        title: () => <div className={styles.required}>设定值</div>,
        dataIndex: 'SetValue',
        key: 'SetValue',
        width: 100,
        align: 'center',
        render: (text, record) => {
          if (isView) {
            return text || '/';
          }
          return (
            <Form.Item
              name={`SetValue_${record.TemplateId}`}
              style={{ marginBottom: 0 }}
              wrapperCol={{ span: 24 }}
              rules={[{ required: true, message: '请输入设定值' }]}
            >
              <InputNumber placeholder="请输入" allowClear />
            </Form.Item>
          );
        },
      },
      {
        title: () => <div className={styles.required}>显示值</div>,
        dataIndex: 'DisplayValue',
        key: 'DisplayValue',
        width: 100,
        align: 'center',
        render: (text, record) => {
          if (isView) {
            return text || '/';
          }
          return (
            <Form.Item
              name={`DisplayValue_${record.TemplateId}`}
              style={{ marginBottom: 0 }}
              wrapperCol={{ span: 24 }}
              rules={[{ required: true, message: '请输入显示值' }]}
            >
              <InputNumber placeholder="请输入" allowClear />
            </Form.Item>
          );
        },
      },
      {
        title: () => <div className={styles.required}>是否符合</div>,
        dataIndex: 'IsQualified',
        key: 'IsQualified',
        width: 200,
        align: 'center',
        render: (text, record) => {
          if (isView) {
            const valueMap = {
              1: '√',
              2: '×',
              3: '/',
            };
            return valueMap[text] || '/';
          }
          return (
            <Form.Item
              name={`IsQualified_${record.TemplateId}`}
              style={{ marginBottom: 0 }}
              wrapperCol={{ span: 24 }}
              rules={[{ required: true, message: '请选择是否符合' }]}
            >
              <Radio.Group>
                <Radio value={1}>√</Radio>
                <Radio value={2}>×</Radio>
                <Radio value={3}>/</Radio>
              </Radio.Group>
            </Form.Item>
          );
        },
      },
    ];
  };

  const onOK = async () => {
    try {
      const values = await form.validateFields();

      // 构建检查记录列表
      const inspectionRecordList = inspectionInfo?.OnsiteInspectionRecordInfoList?.map(item => {
        return {
          TemplateId: item.TemplateId,
          Num: item.Num,
          Sort: item.Sort,
          InspectionProject: item.InspectionProject,
          Inspection: item.Inspection,
          Require: item.Require,
          // 从表单值中获取对应的设定值、显示值和是否符合
          SetValue: values[`SetValue_${item.TemplateId}`],
          DisplayValue: values[`DisplayValue_${item.TemplateId}`],
          IsQualified: values[`IsQualified_${item.TemplateId}`],
          Remark: values.Remark,
        };
      });

      // 构建提交的数据
      const submitData = {
        // 基础信息
        ...values,
        id: rowData?.ID, // 编辑时需要传入ID
        DailyTaskID: taskInfo.ID,
        InstallDate: values.InstallDate?.format('YYYY-MM-DD HH:mm:ss'),
        VerificationDate: values.VerificationDate?.format('YYYY-MM-DD HH:mm:ss'),
        // 检查记录列表
        childList: inspectionRecordList,
      };

      console.log('submitData', submitData);
        // return;
      // 调用提交接口
      props.dispatch({
        type: 'wordSupervision/AddOrUpdateOnsiteInspectionRecord',
        payload: submitData,
        callback: res => {
          if (res.IsSuccess) {
            message.success('提交成功');
            onSubmitCallback && onSubmitCallback();
          }
        },
      });
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const userCookie = Cookie.get('currentUser');
  if (userCookie) {
    form.setFieldsValue({ ReturnUser: JSON.parse(userCookie).UserName });
  }

  function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);
    const fetchRef = useRef(0);

    const debounceFetcher = useMemo(() => {
      const loadOptions = value => {
        fetchRef.current += 1;
        const fetchId = fetchRef.current;
        setOptions([]);
        setFetching(true);
        fetchOptions(value).then(newOptions => {
          if (fetchId !== fetchRef.current) {
            return;
          }
          setOptions(newOptions);
          setFetching(false);
        });
      };
      return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);

    return (
      <Select
        labelInValue
        filterOption={false}
        onSearch={debounceFetcher}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        {...props}
        options={options}
        onChange={(e, option) => {
          setIsEditLoading(false);

          // 如果选择了值，则设置新的值并获取数据
          if (e) {
            form.setFieldsValue({
              ProjectName: options.find(item => item.ProjectId == e.value)?.ProjectName,
              ProjectCode: e.label,
              ProjectId: e.value,
              EntId: undefined,
              PointId: undefined,
            });

            // 获取新的企业和排口数据
            GetProjectPointRelationList(e.value);
          }
        }}
      />
    );
  }

  async function fetchProjectList(value) {
    if (value) {
      return fetch(API.CtAPI_WJQ.CTBaseDataApi.GetCheckInProjectList, {
        method: 'POST',
        body: JSON.stringify({ keyValue: value }),
        headers: {
          'Content-Type': 'application/json',
          Cookie: null,
          Authorization: 'Bearer ' + Cookie.get(cookieName),
        },
      })
        .then(response => response?.json())
        .then(body => {
          return body?.Datas?.map(item => ({
            label: item.ProjectCode,
            value: item.ProjectId,
            ...item,
          }));
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }
  return (
    <>
      <h2 className={styles.formTitle}>{inspectionInfo.InspectionName}</h2>
      <div className={styles.formContent}>
        <Spin spinning={!!getDetailLoading}>
          <Form
            className={styles.siteQualityInspectionForm}
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            initialValues={{}}
            onFinish={onOK}
            autoComplete="off"
            disabled={isView} // 查看模式下禁用所有表单项
          >
            <Row style={{ width: '100%' }}>
              <Col span={12}>
                <Form.Item
                  label="订货单位"
                  name="OrderingUnit"
                  rules={[{ required: true, message: '请输入订货单位' }]}
                >
                  <Input placeholder="请输入" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="用户姓名"
                  name="UserName"
                  rules={[{ required: true, message: '请输入用户姓名' }]}
                >
                  <Input placeholder="请输入" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="项目编号"
                  name="ProjectCode"
                  rules={[{ required: true, message: '请选择项目编号' }]}
                >
                  <DebounceSelect
                    placeholder="请选择"
                    showSearch
                    allowClear
                    defaultActiveFirstOption={false}
                    fetchOptions={fetchProjectList}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="用户电话"
                  name="PhoneNum"
                  rules={[
                    {
                      required: true,
                      message: '请输入用户电话',
                    },
                    {
                      pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                      message: '请输入正确的手机号！',
                    },
                  ]}
                >
                  <Input placeholder="请输入手机号" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="项目名称"
                  name="ProjectName"
                  rules={[{ required: true, message: '请输入项目名称' }]}
                >
                  <Input placeholder="请输入" allowClear />
                </Form.Item>
              </Col>
              <Col span={12} style={{ display: 'none' }}>
                <Form.Item
                  label="项目ID"
                  name="ProjectId"
                  rules={[{ required: true, message: '请输入项目名称' }]}
                >
                  <Input placeholder="请输入" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="用户地址"
                  name="Address"
                  rules={[{ required: true, message: '请输入用户地址' }]}
                >
                  <Input placeholder="请输入" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="产品名称"
                  name="ProductName"
                  rules={[{ required: true, message: '请输入产品名称' }]}
                >
                  <Input placeholder="请输入" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="服务人员姓名"
                  name="ServerUserName"
                  rules={[{ required: true, message: '请选择服务人员姓名' }]}
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder="请输入"
                    optionFilterProp="User_Name"
                    fieldNames={{ label: 'User_Name', value: 'User_ID' }}
                    loading={props.getAlluserLoading}
                    options={props.allUser}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="系统型号"
                  name="CemsModel"
                  rules={[{ required: true, message: '请选择系统型号' }]}
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder="请输入"
                    optionFilterProp="children"
                    fieldNames={{ label: 'Name', value: 'ChildID' }}
                    loading={cemsModelListLoading}
                    options={cemsModelList}
                    onChange={value => {
                      // 根据系统型号获取检查项目
                      GetOnsiteInspectionRecordView({
                        cemsModel: value,
                      });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="服务人员电话"
                  name="ServerUserPhone"
                  rules={[
                    {
                      required: true,
                      message: '请输入服务人员电话',
                    },
                    {
                      pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                      message: '请输入正确的电话！',
                    },
                  ]}
                >
                  <Input placeholder="请输入手机" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="分析仪型号"
                  name="AnalyzerModel"
                  rules={[{ required: true, message: '请输入分析仪型号' }]}
                >
                  <Input placeholder="请输入" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="安装日期"
                  name="InstallDate"
                  rules={[{ required: true, message: '请选择安装日期' }]}
                >
                  <DatePicker
                    disabledDate={current => {
                      return current && current > moment().endOf('day');
                    }}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="核查日期"
                  name="VerificationDate"
                  rules={[{ required: true, message: '请选择核查日期' }]}
                >
                  <DatePicker
                    disabledDate={current => {
                      return current && current > moment().endOf('day');
                    }}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="center">
              <Col span={20}>
                <Table
                  size="small"
                  bordered
                  dataSource={[1]}
                  columns={[
                    {
                      title: '检查内容、要求及结果',
                      colSpan: 4,
                      width: 100,
                      align: 'center',
                      render: (text, record) => {
                        return <div className={styles.required}>用户单位</div>;
                      },
                    },
                    {
                      colSpan: 0,
                      width: 300,
                      render: (text, record) => {
                        return (
                          <Form.Item
                            name="EntId"
                            rules={[{ required: true, message: '请选择用户单位' }]}
                            wrapperCol={{ span: 24 }}
                            style={{ marginBottom: 0 }}
                          >
                            <Select
                              showSearch
                              allowClear
                              style={{ width: '100%' }}
                              placeholder="请输入用户单位"
                              optionFilterProp="User_Name"
                              fieldNames={{ label: 'EntName', value: 'EntId' }}
                              loading={getEntAndPointLoading}
                              options={entAndPointList}
                              onChange={(value, option) => {
                                // 清空监测点位
                                form.resetFields(['PointId']);
                                // 设置新的监测点位列表或清空
                                setPointList(value ? option?.PointList || [] : []);
                              }}
                            />
                          </Form.Item>
                        );
                      },
                    },
                    {
                      colSpan: 0,
                      dataIndex: 'c',
                      width: 100,
                      align: 'center',
                      render: (text, record) => {
                        return <div className={styles.required}>监测点位</div>;
                      },
                    },
                    {
                      colSpan: 0,
                      width: 300,
                      render: (text, record) => {
                        return (
                          <Form.Item
                            name="PointId"
                            rules={[{ required: true, message: '请选择监测点位' }]}
                            wrapperCol={{ span: 24 }}
                            style={{ marginBottom: 0 }}
                          >
                            <Select
                              showSearch
                              allowClear
                              style={{ width: '100%' }}
                              placeholder="请输入监测点位"
                              optionFilterProp="EntName"
                              fieldNames={{ label: 'PointName', value: 'PointId' }}
                              loading={getEntAndPointLoading}
                              options={pointList}
                            />
                          </Form.Item>
                        );
                      },
                    },
                  ]}
                  pagination={false}
                />
                {console.log('inspectionInfo', inspectionInfo)}
                <Table
                  rowKey={'TemplateId'}
                  size="small"
                  bordered
                  dataSource={inspectionInfo?.OnsiteInspectionRecordInfoList}
                  className={styles.siteQualityInspeTable}
                  columns={getColumns()}
                  pagination={false}
                />
                <Table
                  size="small"
                  bordered
                  showHeader={false}
                  className={styles.siteQualityInspeTable}
                  dataSource={[{ name: '其他情况说明' }, { name: '备注' }]}
                  columns={[
                    {
                      width: 100,
                      dataIndex: 'name',
                      align: 'center',
                      render: (text, record) => {
                        return text;
                      },
                    },
                    {
                      width: 700,
                      render: (text, record, index) => {
                        if (index == 0) {
                          return (
                            <Form.Item
                              wrapperCol={{ span: 24 }}
                              name="Remark"
                              style={{ marginBottom: 0 }}
                            >
                              <TextArea
                                allowClear
                                style={{ width: '100%' }}
                                rows={3}
                                placeholder="请输入"
                              />
                            </Form.Item>
                          );
                        } else {
                          return (
                            <div>
                              <div>
                                1、“设定值”和“显示值”列，如该项目存在具体的设定值和显示值，请在该处填写实际数值；若无则填写“/”；{' '}
                              </div>
                              <div>2、“是否符合”列，符合清打“√”；不符合请打“×”，不适用请打“/” </div>
                            </div>
                          );
                        }
                      },
                    },
                  ]}
                  pagination={false}
                />
              </Col>
            </Row>
            <Divider orientation="right" style={{ color: '#d9d9d9' }}>
              <Space>
                {!isView && (
                  <Button type="primary" htmlType="submit" loading={submitLoading}>
                    提交
                  </Button>
                )}
                <Button disabled={false} onClick={onCancel}>
                  {isView ? '关闭' : '取消'}
                </Button>
              </Space>
            </Divider>
          </Form>
        </Spin>
      </div>
    </>
  );
};

export default connect(dvaPropsData)(SiteQualityInspection);
