/*
 * @Author: JiaQi
 * @Date: 2023-04-11 10:17:19
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-11 11:46:31
 * @Description: 省区/大区日常监管配置
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Button, Modal, Form, Cascader, Select, InputNumber, Space, Popconfirm } from 'antd';
import SdlTable from '@/components/SdlTable';

const FormItem = Form.Item;

const dvaPropsData = ({ loading, departinfo }) => ({
  AllUser: departinfo.AllUser,
  AllProvince: departinfo.AllProvince,
  provinceList: departinfo.provinceList,
  regionalList: departinfo.regionalList,
  handleLoading: loading.effects['departinfo/InsOrUpdProvinceOrRegional'],
  tableLoading: loading.effects['departinfo/GetProvinceOrRegionalList'],
});

const SupervisionConfigModal = props => {
  const {
    onCancel,
    visible,
    AllProvince,
    AllUser,
    UserGroup_ID,
    provinceList,
    regionalList,
    handleLoading,
    tableLoading,
    UserGroup_Name,
  } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [handleType, setHandleType] = useState(1);
  const [currentRow, setCurrentRow] = useState({});
  const formRef = React.createRef();

  useEffect(() => {
    GetProvinceOrRegionalList();
    GetAllProvince();
    GetAllUser();
  }, []);

  const getColums = type => {
    const columns = [
      {
        title: '省区',
        dataIndex: 'ProvinceName',
        key: 'ProvinceName',
        align: 'center',
      },
      {
        title: '经理姓名',
        dataIndex: 'ManagerName',
        key: 'ManagerName',
        align: 'center',
      },
      {
        title: '现场检查',
        children: [
          {
            title: '覆盖监测点数',
            dataIndex: 'InspectEquNum',
            key: 'InspectEquNum',
            align: 'center',
            width: 120,
            render: text => {
              return text + '次/月';
            },
          },
          {
            title: '覆盖运维人员数量',
            dataIndex: 'InspectPersonNum',
            key: 'InspectPersonNum',
            align: 'center',
            width: 120,
            render: text => {
              return text + '次/月';
            },
          },
        ],
      },
      {
        title: '回访客户次数',
        dataIndex: 'ReturnNum',
        key: 'ReturnNum',
        align: 'center',
        render: text => {
          return text + '次/月';
        },
      },
      {
        title: '办事处检查次数',
        dataIndex: 'OfficeCheckNum',
        key: 'OfficeCheckNum',
        align: 'center',
        render: text => {
          return text + ' 次/月';
        },
      },
      {
        title: '人员培训次数',
        dataIndex: 'PersonnelTrainingNum',
        key: 'PersonnelTrainingNum',
        align: 'center',
        render: text => {
          return text + ' 次/月';
        },
      },
      {
        title: '检查考勤和日志',
        dataIndex: 'CheckAttendanceNum',
        key: 'CheckAttendanceNum',
        align: 'center',
        render: text => {
          return text + ' 次/周';
        },
      },
      {
        title: '操作',
        fixed: 'right',
        align: 'center',
        render: (text, record) => {
          return (
            <Space>
              <a
                onClick={() => {
                  setCurrentRow(record);
                  setIsModalOpen(true);
                  setHandleType(type);
                }}
              >
                编辑
              </a>

              <Popconfirm
                title="确认删除吗?"
                onConfirm={() => {
                  onDeleteProvinceOrRegionalOne(record.ID, type);
                }}
                okText="确认"
                cancelText="取消"
              >
                <a>删除</a>
              </Popconfirm>
            </Space>
          );
        },
      },
    ];
    if (type === 2) {
      return columns.filter(item => item.dataIndex !== 'ProvinceName');
    }
    return columns;
  };

  // 获取数据  - 大区下的所有经理详情
  const GetProvinceOrRegionalList = () => {
    props.dispatch({
      type: 'departinfo/GetProvinceOrRegionalList',
      payload: {
        UserGroup_ID: UserGroup_ID,
      },
    });
  };

  // 获取省区
  const GetAllProvince = () => {
    props.dispatch({
      type: 'departinfo/GetAllProvince',
      payload: {},
    });
  };

  // 获取经理下拉列表 - 所有用户
  const GetAllUser = () => {
    props.dispatch({
      type: 'departinfo/getalluser',
      payload: {},
    });
  };

  // 删除
  const onDeleteProvinceOrRegionalOne = (id, handleType) => {
    let type = handleType === 1 ? 'Province' : 'Regional';
    props.dispatch({
      type: 'departinfo/DeleteProvinceOrRegionalOne',
      payload: {
        id,
        type,
      },
      callback: () => {
        GetProvinceOrRegionalList();
      },
    });
  };

  // 添加、编辑大区经理省区经理
  const InsOrUpdProvinceOrRegional = () => {
    // type： 大区：Regional  省区：Province
    formRef.current.validateFields().then(values => {
      let type = handleType === 1 ? 'Province' : 'Regional';
      let body = {
        type: type,
        [type]: {
          ID: currentRow.ID,
          UserGroup_ID: UserGroup_ID,
          ...values,
        },
      };

      props.dispatch({
        type: 'departinfo/InsOrUpdProvinceOrRegional',
        payload: body,
        callback: () => {
          setIsModalOpen(false);
          GetProvinceOrRegionalList();
        },
      });
    });
  };

  let title = '添加省区经理及日常监管配置';
  if (handleType === 2) {
    title = '添加大区经理及日常监管配置';
  }

  console.log('currentRow', currentRow);

  return (
    <>
      <Modal
        title={UserGroup_Name + ' - 日常监管配置'}
        visible={visible}
        width={'100vw'}
        wrapClassName="spreadOverModal"
        footer={false}
        onCancel={onCancel}
      >
        <Card title="运维省区配置" bordered={false}>
          <Button
            type="primary"
            style={{ marginBottom: 10 }}
            onClick={() => {
              setCurrentRow({});
              setIsModalOpen(true);
              setHandleType(1);
            }}
          >
            添加
          </Button>
          <SdlTable
            columns={getColums(1)}
            dataSource={provinceList}
            loading={tableLoading}
            pagination={false}
          />
        </Card>
        <Card title="大区配置" bordered={false} style={{ marginTop: 10 }}>
          <Button
            type="primary"
            style={{ marginBottom: 10 }}
            onClick={() => {
              setCurrentRow({});
              setIsModalOpen(true);
              setHandleType(2);
            }}
            disabled={regionalList.length === 1}
          >
            添加
          </Button>
          <SdlTable
            columns={getColums(2)}
            dataSource={regionalList}
            loading={tableLoading}
            pagination={false}
          />
        </Card>
      </Modal>
      <Modal
        title={title}
        visible={isModalOpen}
        confirmLoading={handleLoading}
        onOk={() => InsOrUpdProvinceOrRegional()}
        destroyOnClose
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <Form
          ref={formRef}
          labelCol={{
            span: 10,
          }}
          wrapperCol={{
            span: 14,
          }}
          requiredMark
          initialValues={{
            InspectEquNum: 5,
            InspectPersonNum: 5,
            ReturnNum: 4,
            OfficeCheckNum: 1,
            PersonnelTrainingNum: 1,
            CheckAttendanceNum: 1,
            ...currentRow,
          }}
        >
          {handleType === 1 && (
            <FormItem
              label={<span>省区</span>}
              name="Province"
              rules={[
                {
                  required: true,
                  message: '请选择省区',
                },
              ]}
            >
              <Select
                showSearch
                placeholder="请选择省区"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {AllProvince.map(item => {
                  return (
                    <Option key={item.RegionCode} value={item.RegionCode} title={item.RegionName}>
                      {item.RegionName}
                    </Option>
                  );
                })}
              </Select>
            </FormItem>
          )}
          <FormItem
            label={<span>经理</span>}
            name="Manager"
            rules={[
              {
                required: true,
                message: '请选择经理',
              },
            ]}
          >
            <Select
              showSearch
              placeholder="请选择经理"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              // filterOption={(input, option) =>
              //   (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              // }
            >
              {AllUser.map(item => {
                return (
                  <Option key={item.User_ID} value={item.User_ID} title={item.User_Name}>
                    {item.User_Name}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <FormItem
            label={<span>覆盖监测点套数 (次/月)</span>}
            name="InspectEquNum"
            rules={[
              {
                required: true,
                message: '请输入覆盖监测点套数',
              },
            ]}
          >
            <InputNumber min={0} addonAfter="次/月" style={{ width: '100%' }} />
          </FormItem>
          <FormItem
            label={<span>运维人员数量 (次/月)</span>}
            name="InspectPersonNum"
            rules={[
              {
                required: true,
                message: '请输入运维人员数量',
              },
            ]}
          >
            <InputNumber min={0} addonAfter="次/月" style={{ width: '100%' }} />
          </FormItem>
          <FormItem
            label={<span>回访客户 (次/月)</span>}
            name="ReturnNum"
            rules={[
              {
                required: true,
                message: '请输入回访客户',
              },
            ]}
          >
            <InputNumber min={0} addonAfter="次/月" style={{ width: '100%' }} />
          </FormItem>
          <FormItem
            label={<span>办事处检查 (次/月)</span>}
            name="OfficeCheckNum"
            rules={[
              {
                required: true,
                message: '请输入办事处检查次数',
              },
            ]}
          >
            <InputNumber min={0} addonAfter="次/月" style={{ width: '100%' }} />
          </FormItem>
          <FormItem
            label={<span>人员培训 (次/月)</span>}
            name="PersonnelTrainingNum"
            rules={[
              {
                required: true,
                message: '请输入人员培训次数',
              },
            ]}
          >
            <InputNumber min={0} addonAfter="次/月" style={{ width: '100%' }} />
          </FormItem>
          <FormItem
            label={<span>检查考勤和日志 (次/周)</span>}
            name="CheckAttendanceNum"
            rules={[
              {
                required: true,
                message: '请输入检查考勤和日志次数',
              },
            ]}
          >
            <InputNumber min={0} addonAfter="次/周" style={{ width: '100%' }} />
          </FormItem>
        </Form>
      </Modal>
    </>
  );
};

export default connect(dvaPropsData)(SupervisionConfigModal);
