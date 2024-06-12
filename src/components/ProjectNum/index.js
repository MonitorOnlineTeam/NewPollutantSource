import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, Form, Popover, Button, Select, Row, Space } from 'antd';
import SdlTable from '@/components/SdlTable'
import { connect } from "dva";
import styles from "./styles.less"


const dvaPropsData = ({ loading, wordSupervision, }) => ({
  getProjectInfoListLoading: loading.effects['wordSupervision/GetProjectInfoList'],

})

const Index = (props) => {


  const { label, onChange, callback, getProjectInfoListLoading } = props;

  const [projectInfoList, setProjectInfoList] = useState([]);
  const [projectNum, setProjectNum] = useState();
  const [popVisible, setPopVisible] = useState(false);


  const [projectCode, setProjectCode] = useState(props.projectCode);

  const projectNumCol = [
    {
      title: '合同名称',
      dataIndex: 'ProjectName',
      key: 'ProjectName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目编号',
      dataIndex: 'ProjectCode',
      key: 'ProjectCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '卖方公司名称',
      dataIndex: 'SellCompanyName',
      key: 'SellCompanyName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维起始日期',
      dataIndex: 'BeginTime',
      key: 'BeginTime',
      align: 'center',
      ellipsis: true,
      width: 140,
    },
    {
      title: '运维结束日期',
      dataIndex: 'EndTime',
      key: 'EndTime',
      align: 'center',
      ellipsis: true,
      width: 140,
    },
    {
      title: <span>操作</span>,
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text, record) => {
        return (
          <Button
            size="small"
            type="primary"
            onClick={() => {
              setPorjectInfo(record);
            }}
          >
            选择
          </Button>
        );
      },
    },
  ];
  const setPorjectInfo = record => {
    setProjectCode(record.ProjectCode || undefined)
    setPopVisible(false);
    onChange && onChange(record)
  };


  // 获取项目
  const getProjectInfoList = () => {
    props.dispatch({
      type: 'wordSupervision/GetProjectInfoList',
      payload: {
        ProjectCode: projectNum,
      },
      callback: res => {
        setProjectInfoList(res);
      },
    });
  };
  useEffect(() => {
    if (!popVisible) {
      setProjectNum()
    }
  }, [popVisible])



  return (
    <Popover
      overlayClassName={styles.popSty}
      content={
        <>
          <Row>
            <Space>
              <Form.Item label={label}>
                <Input
                  allowClear
                  placeholder="请输入"
                  value={projectNum}
                  onChange={e => {
                    setProjectNum(e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  onClick={() => {
                    getProjectInfoList();
                  }}
                >
                  查询
                          </Button>
              </Form.Item>
            </Space>
          </Row>
          <SdlTable
            resizable
            scroll={{ y: 'calc(100vh - 460px)' }}
            style={{ width: 800 }}
            loading={getProjectInfoListLoading}
            bordered
            dataSource={projectInfoList}
            columns={projectNumCol}
          />
        </>
      }
      trigger="click"
      placement='right'
      visible={popVisible}
      onVisibleChange={visible => {
        setPopVisible(visible);
        if (visible) {
          getProjectInfoList()
          setProjectNum()
        }
      }}
      placement="bottom"
    // getPopupContainer={trigger => trigger.parentNode}
    >
      <Select
        allowClear
        showSearch={false}
        value={projectCode}
        dropdownStyle={{ display: 'none' }}
        placeholder="请选择"
        onClear={() => { setProjectCode(undefined); onChange && onChange(undefined) }}
      ></Select>
    </Popover>
  );
};
Index.defaultProps = {
  label: '项目编号'
}
export default connect(dvaPropsData)(Index);