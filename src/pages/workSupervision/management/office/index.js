/*
 * @Author: JiaQi
 * @Date: 2023-04-11 17:00:58
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-18 10:33:19
 * @Description: 办事处管理
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import {
  Card,
  Col,
  Row,
  Button,
  Space,
  Select,
  DatePicker,
  Table,
  Tag,
  Modal,
  Divider,
  Tooltip,
  Transfer,
  message,
} from 'antd';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import Cookie from 'js-cookie';
import { UsergroupAddOutlined, UserSwitchOutlined } from '@ant-design/icons';

const CONFIGID = 'T_Bas_OfficeLocation';

const dvaPropsData = ({ loading, wordSupervisionManage }) => ({
  allUserByOffice: wordSupervisionManage.allUserByOffice,
  allManager: wordSupervisionManage.allManager,
  getUserLoading: loading.effects['wordSupervisionManage/GetAllUserByOffice'],
  bindUserLoading: loading.effects['wordSupervisionManage/InsertOfficeByUser'],
});

const TableTransfer = ({ leftColumns, rightColumns, loading, ...restProps }) => (
  <Transfer {...restProps}>
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
        getCheckboxProps: item => ({
          disabled: listDisabled || item.disabled,
        }),
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
          loading={loading}
          size="small"
          style={{
            pointerEvents: listDisabled ? 'none' : undefined,
          }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
        />
      );
    }}
  </Transfer>
);

const Office = props => {
  const { allUserByOffice, allManager, getUserLoading, bindUserLoading } = props;
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [targetKeys, setTargetKeys] = useState([]);
  const [currentID, setCurrentID] = useState(undefined);
  const [currentManager, setCurrentManager] = useState();

  useEffect(() => {}, []);

  // 删除办事处
  const onDeleteOffice = (record, key) => {
    props.dispatch({
      type: 'wordSupervisionManage/DeleteOffice',
      payload: {
        id: key,
      },
      callback: () => {
        props.dispatch({
          type: 'autoForm/getAutoFormData',
          payload: {
            configId: CONFIGID,
          },
        });
      },
    });
  };

  // 获取所有人员(已经选过的办事处用户不会出现)
  const getAllUserByOffice = id => {
    props.dispatch({
      type: 'wordSupervisionManage/GetAllUserByOffice',
      payload: {
        id,
      },
      callback: () => {
        props.dispatch({
          type: 'autoForm/getAutoFormData',
          payload: {
            configId: CONFIGID,
          },
        });
      },
    });
  };

  // 绑定办事处人员
  const onBindOfficeByUser = () => {
    props.dispatch({
      type: 'wordSupervisionManage/InsertOfficeByUser',
      payload: {
        id: currentID,
        user_ID: targetKeys,
      },
      callback: () => {
        setVisible(false);
      },
    });
  };

  // 获取已绑定的办事处用户
  const GetUserByOfficeCode = id => {
    props.dispatch({
      type: 'wordSupervisionManage/GetUserByOfficeCode',
      payload: {
        id,
      },
      callback: res => {
        console.log('res', res);
        let keys = res.map(item => item.key);
        setTargetKeys(keys);
      },
    });
  };

  // 获取办事处所有经理
  const GetAllManager = id => {
    props.dispatch({
      type: 'wordSupervisionManage/GetAllManager',
      payload: {},
      callback: res => {},
    });
  };

  // 设置办事处经理
  const SetOfficeManager = () => {
    if (!currentManager) {
      message.error('请选择经理！');
      return;
    }
    props.dispatch({
      type: 'wordSupervisionManage/SetOfficeManager',
      payload: {
        id: currentID,
        manager: currentManager,
      },
      callback: res => {
        setVisible2(false);
      },
    });
  };

  const filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;
  const handleChange = newTargetKeys => {
    console.log('newTargetKeys', newTargetKeys);
    setTargetKeys(newTargetKeys);
  };
  const columns = [
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
  ];

  return (
    <BreadcrumbWrapper>
      <Card>
        <SearchWrapper configId={CONFIGID} />
        <AutoFormTable
          noload
          getPageConfig
          handleMode="modal"
          style={{ marginTop: 10 }}
          configId={CONFIGID}
          isFixedOpera
          isCenter
          onDelete={(record, key) => {
            onDeleteOffice(record, key);
          }}
          appendHandleRows={row => {
            return (
              <>
                <Divider type="vertical" />
                <Tooltip title="关联办事处人员">
                  <a
                    onClick={() => {
                      setVisible(true);
                      setCurrentID(row['dbo.T_Bas_OfficeLocation.ID']);
                      getAllUserByOffice(row['dbo.T_Bas_OfficeLocation.ID']);
                      GetUserByOfficeCode(row['dbo.T_Bas_OfficeLocation.ID']);
                    }}
                  >
                    <UsergroupAddOutlined style={{ fontSize: 16 }} />
                  </a>
                </Tooltip>
                {/* <Divider type="vertical" />
                <Tooltip title="设置成套大区经理/省区运维经理">
                  <a
                    onClick={() => {
                      setVisible2(true);
                      setCurrentID(row['dbo.T_Bas_OfficeLocation.ID']);
                      setCurrentManager(row['dbo.T_Bas_OfficeLocation.Manager']);
                      GetAllManager();
                    }}
                  >
                    <UserSwitchOutlined style={{ fontSize: 16 }} />
                  </a>
                </Tooltip> */}
              </>
            );
          }}
        />

        <Modal
          title="关联办事处人员"
          visible={visible}
          width={800}
          onOk={onBindOfficeByUser}
          onCancel={() => setVisible(false)}
          confirmLoading={bindUserLoading}
        >
          <TableTransfer
            dataSource={allUserByOffice}
            targetKeys={targetKeys}
            showSearch
            loading={getUserLoading}
            onChange={handleChange}
            filterOption={(inputValue, item) =>
              (item.User_Name && item.User_Name.indexOf(inputValue) !== -1) ||
              (item.User_Account && item.User_Account.indexOf(inputValue) !== -1)
            }
            leftColumns={columns}
            rightColumns={columns}
          />
        </Modal>
        <Modal
          title="设置成套大区经理/省区运维经理"
          visible={visible2}
          onOk={SetOfficeManager}
          onCancel={() => setVisible2(false)}
          confirmLoading={false}
          bodyStyle={{ paddingTop: 10 }}
        >
          <Row>
            <span style={{ color: 'red' }}>设置管理该办事处的成套大区经理/省区运维经理。</span>
          </Row>
          <Row style={{ marginTop: 20 }}>
            <Col className="ant-form-item-label" span={7}>
              <label className="ant-form-item-required">选择经理</label>
            </Col>
            <Col span={13}>
              <Select
                showSearch
                placeholder="请选择经理"
                style={{ width: '100%' }}
                value={currentManager}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={value => {
                  setCurrentManager(value);
                }}
              >
                {allManager.map(item => {
                  return (
                    <Option
                      key={item.User_ID}
                      value={item.User_ID}
                      title={`${item.Manager} - ${item.User_Name}`}
                    >
                      {item.User_Name}
                    </Option>
                  );
                })}
              </Select>
            </Col>
          </Row>
        </Modal>
      </Card>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(Office);
