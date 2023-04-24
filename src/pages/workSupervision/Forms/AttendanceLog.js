import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Input, Radio, Select, Button, Divider, Space, Popconfirm } from 'antd';
import styles from './styles.less';
import TaskAlart from './TaskAlart';
import SdlTable from '@/components/SdlTable';

const { TextArea } = Input;

const dvaPropsData = ({ loading, wordSupervision }) => ({
  allUser: wordSupervision.allUser,
  todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
});

const AttendanceLog = props => {
  const [form] = Form.useForm();
  const { taskInfo, editData, onCancel, onSubmitCallback, allUser } = props;
  const [dataSource, setDataSource] = useState(editData.dataSource || []);
  // useState([
  //   {
  //     ID: 1,
  //     RegionalArea: '1',
  //     UserName: '1',
  //     CheckInState: 1,
  //     UnqualifiedDate: '1',
  //     UnqualifiedReason: '1',
  //     RecordUnqualifiedDate: '1',
  //   },
  //   {
  //     ID: 2,
  //     UserName: '1',
  //     CheckInState: 0,
  //     UnqualifiedDate: '1',
  //     UnqualifiedReason: '1',
  //     RecordUnqualifiedDate: '1',
  //   },
  // ]);

  useEffect(() => {
    getAllUser();
  }, []);

  // 获取所有用户
  const getAllUser = () => {
    props.dispatch({
      type: 'wordSupervision/GetAllUser',
      payload: {},
    });
  };

  // 提交任务单
  const onFinish = async () => {
    const values = await form.validateFields();
    console.log('values', values);
    console.log('dataSource', dataSource);
    props.dispatch({
      type: 'wordSupervision/InsOrUpdCheckAttendance',
      payload: {
        DailyTaskID: taskInfo.ID,
        Model: dataSource,
        recordID: editData.ID,
      },
      callback: () => {
        onSubmitCallback();
      },
    });
  };

  // 添加一行
  const onAdd = () => {
    let tempDataSource = [...dataSource];
    let Key = tempDataSource.at(-1) ? tempDataSource.at(-1).Key + 1 : 0;
    tempDataSource.push({
      Key: Key,
      RegionalArea: taskInfo.RegionCode,
      UserName: undefined,
      CheckInState: 1,
      UnqualifiedDate: '',
      UnqualifiedReason: '',
      RecordUnqualifiedDate: '',
    });
    setDataSource(tempDataSource);
  };

  // 删除
  const onDelete = index => {
    let tempDataSource = [...dataSource];
    tempDataSource.splice(index, 1);
    // let newId = this.state.id;
    // this.setState({
    //   id: ++newId,
    // });
    setDataSource(tempDataSource);
  };

  // 改变数据源
  const changeDataSource = (value, index, key) => {
    let tempDataSource = [...dataSource];
    // const key = value.currentTarget.id.replace(/\d+/g,'');
    tempDataSource[index][key] = value;
    // if (key === 'PollutantName') {
    //   dataSource[index]['PollutantCode'] = value;
    // }
    setDataSource(tempDataSource);
  };
  console.log('dataSource', dataSource)
  //
  const getColumns = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 80,
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: <div className={styles.required}>大区</div>,
        dataIndex: 'RegionalArea',
        key: 'RegionalArea',
        width: 140,
        render: (text, record, index) => {
          return (
            <Form.Item
              name={'RegionalArea' + record.Key}
              style={{ marginBottom: 0 }}
              initialValue={text}
              // rules={[
              //   {
              //     required: true,
              //     message: '请选择大区！',
              //   },
              // ]}
            >
              <span>{taskInfo.RegionName}</span>
            </Form.Item>
          );
        },
      },
      {
        title: <div className={styles.required}>姓名</div>,
        dataIndex: 'UserID',
        key: 'UserID',
        width: 160,
        render: (text, record, index) => {
          return (
            <Form.Item
              style={{ marginBottom: 0 }}
              name={'UserID' + record.Key}
              initialValue={text}
              rules={[
                {
                  required: true,
                  message: '请选择姓名！',
                },
              ]}
            >
              <Select
                placeholder="请选择姓名！"
                onChange={value => {
                  changeDataSource(value, index, 'UserID');
                }}
              >
                {allUser.map((item, index) => {
                  return (
                    <Option value={item.User_ID} key={item.User_ID}>
                      {item.User_Name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          );
        },
      },
      {
        title: <div className={styles.required}>签到是否合格</div>,
        dataIndex: 'CheckInState',
        key: 'CheckInState',
        width: 180,
        render: (text, record, index) => {
          return (
            <Form.Item
              style={{ marginBottom: 0 }}
              name={'CheckInState' + record.Key}
              initialValue={text}
              rules={[{ required: true }]}
            >
              <Radio.Group
                onChange={e => {
                  changeDataSource(e.target.value, index, 'CheckInState');
                }}
              >
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            </Form.Item>
          );
        },
      },
      {
        title: '签到不合格日期',
        dataIndex: 'UnqualifiedDate',
        key: 'UnqualifiedDate',
        width: 300,
        render: (text, record, index) => {
          return (
            <Form.Item
              style={{ marginBottom: 0 }}
              name={'UnqualifiedDate' + record.Key}
              initialValue={text}
            >
              <TextArea
                onChange={e => {
                  changeDataSource(e.target.value, index, 'UnqualifiedDate');
                }}
                rows={1}
                placeholder="请输入"
              />
            </Form.Item>
          );
        },
      },
      {
        title: '签到不合格原因',
        dataIndex: 'UnqualifiedReason',
        key: 'UnqualifiedReason',
        width: 300,
        render: (text, record, index) => {
          return (
            <Form.Item
              style={{ marginBottom: 0 }}
              name={'UnqualifiedReason' + record.Key}
              initialValue={text}
              // rules={[{ required: true }]}
            >
              <TextArea
                onChange={e => {
                  changeDataSource(e.target.value, index, 'UnqualifiedReason');
                }}
                rows={1}
                placeholder="请输入"
              />
            </Form.Item>
          );
        },
      },
      {
        title: '日志不合格日期',
        dataIndex: 'RecordUnqualifiedDate',
        key: 'RecordUnqualifiedDate',
        width: 300,
        render: (text, record, index) => {
          return (
            <Form.Item
              style={{ marginBottom: 0 }}
              name={'RecordUnqualifiedDate' + record.Key}
              initialValue={text}
            >
              <TextArea
                onChange={e => {
                  changeDataSource(e.target.value, index, 'RecordUnqualifiedDate');
                }}
                rows={1}
                placeholder="请输入"
              />
            </Form.Item>
          );
        },
      },
      {
        title: '操作',
        render: (text, record, index) => {
          return (
            <Popconfirm
              title="确认删除吗?"
              onConfirm={() => {
                onDelete(index);
              }}
              okText="确认"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>
          );
        },
      },
    ];

    return columns;
  };

  return (
    <>
      <TaskAlart taskInfo={taskInfo} />
      <h2 className={styles.formTitle}>检查考勤和日志</h2>
      <div>
        <Form form={form} onFinish={onFinish} autoComplete="off">
          <SdlTable
            // rowKey={'Key'}
            rowKey={(record, index) => record.ID || record.Key}
            dataSource={dataSource}
            columns={getColumns()}
            pagination={false}
            footer={() => (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Button type="dashed" onClick={() => onAdd()}>
                  添加一行
                </Button>
              </div>
            )}
          />
          <Divider orientation="right" style={{ color: '#d9d9d9' }}>
            <Space>
              <Button type="primary" htmlType="submit">
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

export default connect(dvaPropsData)(AttendanceLog);
