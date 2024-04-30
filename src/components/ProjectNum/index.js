import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, Form,Popover, Button, Select, Row, Space } from 'antd';
import SdlTable from '@/components/SdlTable'
import { connect } from "dva";
import styles from "./styles.less"


const dvaPropsData = ({ loading, wordSupervision, }) => ({
  getProjectInfoListLoading: loading.effects['wordSupervision/GetProjectInfoList'],

})

const Index = (props) => {


    const {label,onChange, getProjectInfoListLoading } = props;

    const [projectInfoList, setProjectInfoList] = useState([]);
    const [projectNum, setProjectNum] = useState('');
    const [popVisible, setPopVisible] = useState(false);





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
        },
        {
          title: '运维结束日期',
          dataIndex: 'EndTime',
          key: 'EndTime',
          align: 'center',
          ellipsis: true,
        },
        {
          title: <span>操作</span>,
          align: 'center',
          ellipsis: true,
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
      const [projectName, setProjectName] = useState();
      const setPorjectInfo = record => {
        setProjectName(record.ProjectName || undefined)
        setPopVisible(false);
        onChange&&onChange(record.ProjectCode)
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




    return (
        <Popover
            overlayClassName={styles.popSty}
            content={
                <>
                    <Row>
                        <Space>
                        <Form.Item  label={label}>
                            <Input
                                allowClear
                                placeholder="请输入"
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
                        scroll={{ y: 'calc(100vh - 400px)' }}
                        style={{ width: 800 }}
                        loading={getProjectInfoListLoading}
                        bordered
                        dataSource={projectInfoList}
                        columns={projectNumCol}
                    />
                </>
            }
            trigger="click"
            visible={popVisible}
            onVisibleChange={visible => {
                setPopVisible(visible);
                getProjectInfoList()
            }}
            placement="bottom"
            getPopupContainer={trigger => trigger.parentNode}
        >
            <Select
                allowClear
                showSearch={false}
                value={projectName}
                dropdownStyle={{display:'none'}}
                placeholder="请选择"
                onClear={()=>{setProjectName(undefined);onChange&&onChange(undefined)}}
            ></Select>
        </Popover>
    );
};
Index.defaultProps={
  label:'项目编号'
}
export default connect(dvaPropsData)(Index);