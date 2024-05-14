/**
 * 功  能：通用管理 大区档案
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Spin,
  Form,
  Typography,
  Card,
  Button,
  Select,
  message,
  Row,
  Col,
  Tooltip,
  Divider,
  Modal,
  DatePicker,
} from 'antd';
import SdlTable from '@/components/SdlTable';
import {
  PlusOutlined,
  UpOutlined,
  DownOutlined,
  ExportOutlined,
  ProfileOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import styles from './style.less';
import Setting from './components/Setting';
import SettingRuleModal from './components/SettingRuleModal';
const { Option } = Select;

const namespace = 'generalManager';

const dvaPropsData = ({ loading, generalManager, global }) => ({
  configInfo: global.configInfo,
  tableDatas: generalManager.provinceTableDatas,
  tableTotal: generalManager.provinceTableTotal,
  queryPar: generalManager.provinceQueryPar,
  tableLoading: loading.effects[`${namespace}/GetProvinceList`],
  exportLoading: loading.effects[`${namespace}/ExportProvinceList`],
  managerSelectLoading: loading.effects[`${namespace}/GetManagerSelect`],
});

const dvaDispatch = dispatch => {
  return {
    updateState: payload => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      });
    },
    GetProvinceList: payload => {
      //列表
      dispatch({
        type: `${namespace}/GetProvinceList`,
        payload: payload,
      });
    },
    ExportProvinceList: payload => {
      //导出
      dispatch({
        type: `${namespace}/ExportProvinceList`,
        payload: payload,
      });
    },
    GetManagerSelect: (payload, callback) => {
      //大区或省区经理
      dispatch({
        type: `${namespace}/GetManagerSelect`,
        payload: payload,
        callback: callback,
      });
    },
  };
};
const Index = props => {
  const [form] = Form.useForm();

  const {
    queryPar,
    tableDatas,
    tableTotal,
    tableLoading,
    exportLoading,
    managerSelectLoading,
  } = props;
  console.log('props', props);
  const [managerList, setManagerList] = useState({});

  const [provinceList, setProvincelist] = useState([]);
  const [provinceAllList, setProvinceAlllist] = useState([]);
  const [settingRuleOpen, setSettingRuleOpen] = useState(false);
  const [handleOpen, setHandleOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState({});

  useEffect(() => {
    onFinish(pageIndex, pageSize);
    props.GetManagerSelect({}, res => {
      setManagerList(res);
      let data = [];
      res?.LargeRegions?.map(item => {
        if (item.LargeRegion) {
          item.ProjectRegions.map(childListItem => {
            data.push(childListItem);
          });
        }
        data = data.filter((item, index) => data.indexOf(item) === index);
        setProvincelist(data);
        setProvinceAlllist(data);
      });
    });
  }, []);
  const largeRegionChange = value => {
    form.setFieldsValue({ projectRegion: undefined });

    let data = [];
    if (value) {
      data = managerList?.LargeRegions?.filter(item => item.LargeRegion == value)?.[0]
        ?.ProjectRegions;
    } else {
      data = provinceAllList;
    }
    setProvincelist(data);
  };
  let columns = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return index + 1 + (pageIndex - 1) * pageSize;
      },
    },
    {
      title: '行业',
      dataIndex: 'Industry',
      key: 'Industry',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '成套/运维',
      dataIndex: 'CTOperation',
      key: 'CTOperation',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '执行大区',
      dataIndex: 'LargeRegion',
      key: 'LargeRegion',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '大区经理',
      dataIndex: 'LargeRegionManager',
      key: 'LargeRegionManager',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目使用地',
      dataIndex: 'ProjectRegion',
      key: 'ProjectRegion',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '省区经理',
      dataIndex: 'ProvinceManager',
      key: 'ProvinceManager',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '工程助理',
      dataIndex: 'AssistantName',
      key: 'AssistantName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '报告审核人',
      dataIndex: 'ReportAuditName',
      key: 'ReportAuditName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '总部物料助理',
      dataIndex: 'MaterialName',
      key: 'MaterialName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      align: 'center',
      ellipsis: true,
      render: (text, row) => {
        return (
          <Tooltip title="设置">
            <a>
              <SettingOutlined
                style={{ fontSize: 16 }}
                onClick={() => {
                  setHandleOpen(true);
                  setCurrentRow(row);
                }}
              />
            </a>
          </Tooltip>
        );
      },
    },
  ];
  const exports = () => {
    props.ExportProvinceList({
      ...queryPar,
      pageIndex: undefined,
      pageSize: undefined,
    });
  };

  const onFinish = async (PageIndex, PageSize, queryPar) => {
    //查询

    try {
      const values = await form.validateFields();
      props.GetProvinceList(
        queryPar
          ? { ...queryPar, pageIndex: PageIndex, pageSize: PageSize }
          : {
              ...values,
              pageIndex: PageIndex,
              pageSize: PageSize,
            },
      );
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const handleTableChange = async (PageIndex, PageSize) => {
    //分页
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    onFinish(PageIndex, PageSize, props.queryPar);
  };

  const searchComponents = () => {
    return (
      <Form
        form={form}
        name="advanced_search"
        className={'ant-advanced-search-form'}
        onFinish={() => {
          setPageIndex(1);
          setPageSize(20);
          onFinish(1, 20);
        }}
      >
        <Spin spinning={managerSelectLoading} size="small">
          <Row align="middle" gutter={16}>
            <Col span={8}>
              <Form.Item name="ctOperation" label="成套/运维">
                <Select placeholder="请选择" allowClear>
                  {managerList?.CTOperations?.map(item => (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="largeRegion" label="执行大区">
                <Select
                  placeholder="请选择"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  onChange={largeRegionChange}
                >
                  {managerList?.LargeRegions?.map(item => (
                    <Option key={item.LargeRegion} value={item.LargeRegion}>
                      {item.LargeRegion}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="projectRegion" label="项目所在地">
                <Select placeholder="请选择" allowClear showSearch optionFilterProp="children">
                  {provinceList?.map(item => (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="largeRegionManager" label="大区经理" className="minWidth">
                <Select placeholder="请选择" allowClear showSearch optionFilterProp="children">
                  {managerList?.LargeRegionManagers?.map(item => (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="provinceManager" label="省区经理">
                <Select placeholder="请选择" allowClear showSearch optionFilterProp="children">
                  {managerList?.ProvinceManagers?.map(item => (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={tableLoading}>
                  查询
                </Button>
                <Button
                  style={{ margin: '0 8px' }}
                  loading={tableLoading}
                  onClick={() => {
                    form.resetFields();
                    setPageIndex(1);
                    setPageSize(20);
                    onFinish(1, 20);
                  }}
                >
                  重置
                </Button>
                <Button
                  icon={<ExportOutlined />}
                  loading={exportLoading}
                  style={{ marginRight: 8 }}
                  onClick={() => {
                    exports();
                  }}
                >
                  导出
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setSettingRuleOpen(true);
                  }}
                >
                  设置省区经理日常管理规则
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Spin>
      </Form>
    );
  };
  return (
    <div className={`${styles.regionalArchivesSty}`}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            resizable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            pagination={{
              total: tableTotal,
              pageSize: pageSize,
              current: pageIndex,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handleTableChange,
            }}
          />
        </Card>
        <Setting
          data={currentRow}
          open={handleOpen}
          onCancel={() => {
            setHandleOpen(false);
          }}
          onSuccessCallback={res => {
            setHandleOpen(false);
            onFinish(pageIndex, pageSize);
          }}
        />
        {settingRuleOpen && (
          <SettingRuleModal
            managerList={managerList}
            open={settingRuleOpen}
            onCancel={() => {
              setSettingRuleOpen(false);
            }}
            onSettingCallback={res => {
              onFinish(pageIndex, pageSize);
            }}
          />
        )}
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);
