import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Divider, Tooltip } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import { PartitionOutlined } from '@ant-design/icons';
import { router } from 'umi';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  todoList: wordSupervision.todoList,
  messageList: wordSupervision.messageList,
  todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
  messageListLoading: loading.effects['wordSupervision/GetWorkBenchMsg'],
});

const GroupManage = props => {
  const { taskInfo } = props;
  const [currentTodoItem, setCurrentTodoItem] = useState({});
  const CONFIG_ID = 'Bloc';

  useEffect(() => {
    loadData();
  }, []);

  //
  const loadData = () => {};

  return (
    <BreadcrumbWrapper>
      <Card>
        <SearchWrapper configId={CONFIG_ID} />
        <AutoFormTable
          getPageConfig
          configId={CONFIG_ID}
          handleMode="modal"
          appendHandleRows={row => {
            return (
              <>
                <Divider type="vertical" />
                <Tooltip title="查看企业">
                  <a
                    onClick={e => {
                      router.push(`/platformconfig/monitortarget/AEnterpriseTest/1?BlocCode=aabc1ceb-d64f-4dcf-be13-b8bf09fc8a58`);
                    }}
                  >
                    <PartitionOutlined style={{ fontSize: 16 }} />
                  </a>
                </Tooltip>
              </>
            );
          }}
          // onEdit={(record, key) => {
          //   router.push('/Intelligentanalysis/CO2Material/supplementData/addOrEditPage?key=' + key);
          // }}
        />
      </Card>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(GroupManage);
