import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Card,
  Transfer,
  Button,
  Modal,
  Divider,
  Spin,
  Table,
  Tooltip,
  Popconfirm,
  message,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import difference from 'lodash/difference';
import SelectPollutantType from '@/components/SelectPollutantType';
import RegionList from '@/components/RegionList';
import TreeTransfer from '@/components/TreeTransfer';

const TableTransfer = ({
  leftColumns,
  rightColumns,
  tableChange,
  pageNumber,
  pageSize,
  ...restProps
}) => (
  <Transfer {...restProps} showSelectAll={false}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection = {
        getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          scroll={{ y: 'calc(100vh - 450px)' }}
          style={{ pointerEvents: listDisabled ? 'none' : null, paddingBottom: 10 }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
          pagination={{
            onChange: tableChange,
            pageNumber: pageNumber,
            pageSize: pageSize,
          }}
        />
      );
    }}
  </Transfer>
);

const leftTableColumns = [
  {
    dataIndex: 'User_Account',
    title: '账号',
    ellipsis: true,
  },
  {
    dataIndex: 'User_Name',
    title: '名称',
    ellipsis: true,
  },
  {
    dataIndex: 'Phone',
    title: '手机',
    ellipsis: true,
  },
];
const rightTableColumns = [
  {
    dataIndex: 'User_Account',
    title: '账号',
    ellipsis: true,
  },
  {
    dataIndex: 'User_Name',
    title: '名称',
    ellipsis: true,
  },
  {
    dataIndex: 'Phone',
    title: '手机',
    ellipsis: true,
  },
];

const dvaPropsData = ({ projectManage, loading }) => ({
  projectList: projectManage.projectList,
  allUser: projectManage.allUser,
  pollutantLoading: loading.effects['common/getPollutantTypeList'],
  queryLoading: loading.effects['projectManage/GetUserProjectList'],
  userModalLoading: loading.effects['projectManage/getAllUser'],
  getEntAndPointLoading: loading.effects['common/GetEntAndPointNoFilter'],
  pointModalLoading:
    loading.effects[
      'common/entAndPointNoFilterList' ||
        'projectManage/GetProjectPointList' ||
        'common/getPollutantTypeList'
    ],
  clientHeight: global.clientHeight,
});

const ProjectManage = props => {
  const [form] = Form.useForm();
  const [pointForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [userTargetKeys, setUserTargetKeys] = useState([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [current, setCurrent] = useState({});
  const [pointCheckedKes, setPointCheckedKes] = useState([]);
  const [isPointModalOpen, setIsPointModalOpen] = useState(false);
  const [entAndPointList, setEntAndPointList] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPointLoading, setSelectedPointLoading] = useState(true);
  const [entLoading, setEntLoading] = useState(true);

  const {
    dispatch,
    queryLoading,
    projectList,
    allUser,
    userModalLoading,
    pointModalLoading,
    pollutantLoading,
    getEntAndPointLoading,
  } = props;

  useEffect(() => {
    GetUserProjectList();
  }, []);

  // 获取项目列表
  const GetUserProjectList = () => {
    dispatch({
      type: 'projectManage/GetUserProjectList',
      payload: {},
    });
  };

  // 获取所有用户
  const getAllUser = () => {
    dispatch({
      type: 'projectManage/getAllUser',
      payload: {},
    });
  };

  // 关联用户
  const onUserTransferChange = (nextTargetKeys, direction, moveKeys) => {
    setUserTargetKeys(nextTargetKeys);
    dispatch({
      type: 'projectManage/InsertProjectUser',
      payload: {
        state: direction === 'right' ? 1 : 2,
        projectCode: current.ID,
        userList: moveKeys,
      },
    });
  };

  // 获取已分配用户
  const GetProjectUserList = projectCode => {
    dispatch({
      type: 'projectManage/GetProjectUserList',
      payload: {
        projectCode,
      },
      callback: res => {
        setUserTargetKeys(res);
      },
    });
  };

  // 关联监测点
  const InsertProjectUserPoint = (keys, state, callback) => {
    const values = pointForm.getFieldsValue();
    dispatch({
      type: 'projectManage/InsertProjectUserPoint',
      payload: {
        state: state,
        projectCode: current.ID,
        mnList: keys,
        polluntatType: values.PollutantTypes,
      },
      callback: res => {
        callback();
        message.success('操作成功！');
      },
    });
  };

  // 获取已关联的监测点
  const GetProjectPointList = () => {
    setSelectedPointLoading(true);
    const values = pointForm.getFieldsValue();
    dispatch({
      type: 'projectManage/GetProjectPointList',
      payload: {
        projectCode: current.ID,
        polluntatType: values.PollutantTypes,
      },
      callback: res => {
        if (res.IsSuccess) {
          setPointCheckedKes(res.Datas);
        } else {
          setPointCheckedKes([]);
        }
        setSelectedPointLoading(false);
      },
    });
  };

  // 获取企业及排口
  const getEntAndPointList = () => {
    setEntLoading(true);
    const values = pointForm.getFieldsValue();
    dispatch({
      type: 'common/GetEntAndPointNoFilter',
      payload: {
        ...values,
        Status: [],
      },
      callback: res => {
        setEntAndPointList(res);
        setEntLoading(false);
      },
    });
  };

  // 编辑项目信息
  const onUpdateProjectInfo = () => {
    editForm.validateFields().then(values => {
      dispatch({
        type: 'projectManage/UpdateOrAddUserProject',
        payload: {
          ID: current.ID,
          ...values,
        },
        callback: res => {
          setIsEditModalOpen(false);
          editForm.resetFields();
          GetUserProjectList();
        },
      });
    });
  };

  // 删除项目
  const onDelete = record => {
    dispatch({
      type: 'projectManage/DeleteUserProject',
      payload: {
        ID: record.ID,
      },
      callback: res => {
        GetUserProjectList();
      },
    });
  };

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'ProjectName',
      key: 'ProjectName',
    },
    {
      title: '项目描述',
      dataIndex: 'Remark',
      key: 'Remark',
    },
    {
      title: '创建人',
      dataIndex: 'CreateUserName',
      key: 'CreateUserName',
    },
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <>
            <a
              onClick={() => {
                setIsEditModalOpen(true);
                setCurrent(record);
                editForm.setFieldsValue({ ...record });
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <Tooltip title="删除">
              <Popconfirm
                placement="left"
                title="确认是否删除?"
                onConfirm={() => {
                  onDelete(record);
                }}
                okText="是"
                cancelText="否"
              >
                <a>删除</a>
              </Popconfirm>
            </Tooltip>
            <Divider type="vertical" />
            <a
              onClick={() => {
                setIsPointModalOpen(true);
                setCurrent(record);
              }}
            >
              分配点位
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                setIsUserModalOpen(true);
                getAllUser();
                setCurrent(record);
                GetProjectUserList(record.ID);
              }}
            >
              分配用户
            </a>
          </>
        );
      },
    },
  ];
  console.log('getEntAndPointLoading', getEntAndPointLoading);
  return (
    <BreadcrumbWrapper>
      <Card>
        <Form
          name="searchForm"
          form={form}
          layout="inline"
          initialValues={{}}
          autoComplete="off"
          style={{ marginBottom: 10 }}
        >
          <Form.Item label="项目名称" name="date">
            <Input placeholder="请输入项目名称" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" loading={queryLoading} onClick={() => {}}>
              查询
            </Button>
          </Form.Item>
        </Form>
        <SdlTable loading={queryLoading} dataSource={projectList} columns={columns} />
        <Modal
          title={`${current.ProjectName} - 编辑`}
          open={isEditModalOpen}
          onCancel={() => {
            setIsEditModalOpen(false);
          }}
          onOk={onUpdateProjectInfo}
        >
          <Form
            name="searchForm"
            form={editForm}
            // layout="inline"
            initialValues={{}}
            autoComplete="off"
          >
            <Form.Item
              label="项目名称"
              name="ProjectName"
              rules={[{ required: true, message: '请输入项目名称!' }]}
            >
              <Input placeholder="请输入项目名称" />
            </Form.Item>
            <Form.Item
              label="项目描述"
              name="Remark"
              rules={[{ required: true, message: '请输入项目描述!' }]}
            >
              <Input placeholder="请输入项目描述" />
            </Form.Item>
          </Form>
        </Modal>

        {isUserModalOpen && (
          <Modal
            title={`${current.ProjectName} - 分配用户`}
            open={isUserModalOpen}
            destroyOnClose="true"
            onCancel={() => {
              setIsUserModalOpen(false);
            }}
            width={'70%'}
            footer={null}
          >
            <Spin spinning={userModalLoading}>
              <TableTransfer
                rowKey={record => record.User_ID}
                titles={['待分配用户', '已分配用户']}
                dataSource={allUser}
                targetKeys={userTargetKeys}
                showSearch={true}
                onChange={onUserTransferChange}
                filterOption={(inputValue, item) =>
                  (item.User_Name && item.User_Name.indexOf(inputValue) !== -1) ||
                  (item.User_Account && item.User_Account.indexOf(inputValue) !== -1) ||
                  (item.Phone && item.Phone.indexOf(inputValue) !== -1)
                }
                leftColumns={leftTableColumns}
                rightColumns={rightTableColumns}
                style={{ width: '100%' }}
                // tableChange={this.tableChange}
                // pageNumber={this.state.pageNumber}
                // pageSize={this.state.pageSize}
              />
            </Spin>
          </Modal>
        )}

        {isPointModalOpen && (
          <Modal
            title={`${current.ProjectName} - 设置点位访问权限`}
            open={isPointModalOpen}
            destroyOnClose={true}
            onCancel={() => {
              setIsPointModalOpen(false);
              setSelectedPointLoading(true);
              pointForm.resetFields();
              setEntAndPointList([]);
            }}
            width={1100}
            footer={null}
            bodyStyle={{
              overflowY: 'auto',
              height: 704,
            }}
          >
            <div>
              <Form
                name="searchForm"
                form={pointForm}
                layout="inline"
                initialValues={{}}
                autoComplete="off"
              >
                <Form.Item label="" name="PollutantTypes">
                  <SelectPollutantType
                    loading={pollutantLoading}
                    showType="radio"
                    initCallback={value => {
                      console.log('isPointModalOpen', isPointModalOpen);
                      if (isPointModalOpen) {
                        pointForm.setFieldsValue({ PollutantTypes: value });
                        getEntAndPointList();
                        GetProjectPointList();
                      }
                    }}
                    onChange={e => {
                      pointForm.setFieldsValue({ PollutantTypes: e.target.value });
                      getEntAndPointList();
                      GetProjectPointList();
                    }}
                  />
                </Form.Item>
                <Form.Item label="" name="RegionCode">
                  <RegionList
                    noFilter
                    style={{ width: 140 }}
                    onChange={value => {
                      pointForm.setFieldsValue({ RegionCode: value });
                      getEntAndPointList();
                    }}
                  />
                </Form.Item>
                <Form.Item label="" name="Name">
                  <Input style={{ width: 200 }} allowClear placeholder="请输入企业名称" />
                </Form.Item>
                <Form.Item style={{ marginLeft: -16 }}>
                  <Button
                    type="primary"
                    loading={getEntAndPointLoading}
                    onClick={getEntAndPointList}
                  >
                    查询
                  </Button>
                </Form.Item>
              </Form>
              {(selectedPointLoading || pointModalLoading) && entLoading ? (
                <div className="center">
                  <Spin spinning={true}></Spin>
                </div>
              ) : !entLoading ? (
                <TreeTransfer
                  key="key"
                  treeData={entAndPointList}
                  checkedKeys={[...pointCheckedKes]}
                  targetKeysChange={(key, type, callback) => {
                    // this.setState({ checkedKeys: key }, () => {
                    //   this.handleDataOK(type == 1 ? 1 : 2, callback);
                    // })
                    console.log('key', key);
                    console.log('type', type);
                    // console.log('callback', callback);
                    setPointCheckedKes(key);
                    InsertProjectUserPoint(key, type, callback);
                  }}
                />
              ) : (
                <div className="center">
                  <Spin spinning={true}></Spin>
                </div>
              )}
            </div>
          </Modal>
        )}
      </Card>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(ProjectManage);
