/*
 * @Author: JiaQi
 * @Date: 2023-04-23 09:53:26
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-04-24 10:29:23
 * @Description：
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import HFKH from './components/HFKH';
import RYPX from './components/RYPX';
import OfficeCheck from './components/OfficeCheck';
import XCGZ from './components/XCGZ';
import BranchInside from './components/BranchInside';
import BranchOther from './components/BranchOther';
import KQRZ from './components/KQRZ';

import { Tabs } from 'antd';

const { TabPane } = Tabs;

const dvaPropsData = ({ loading, wordSupervision }) => ({
  todoList: wordSupervision.todoList,
  messageList: wordSupervision.messageList,
  todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
  messageListLoading: loading.effects['wordSupervision/GetWorkBenchMsg'],
});

const TaskRecordQuery = props => {
  const {} = props;
  // flag: 区分自己还是全部。
  // 自己(oneself)：有操作列，可以编辑删除。
  // 全部(all)：没有操作列，只能查看
  const [flag, setFlag] = useState(props.match.params.type);

  // type: 区分运维还是成套
  // 空：运维。 非空：成套
  const [type, setType] = useState(props.location.query.type);

  useEffect(() => {
    // let flag = props.match.params.type === 'oneself' ? true : false;
    // setFlag(flag);
    // let type = props.location.query.type === '1' ? true : false;
    // setType(type);
  }, []);

  //
  console.log('props', props);
  return (
    <BreadcrumbWrapper>
      <Tabs tabPosition="left" style={{ marginTop: 16 }}>
        <TabPane tab="回访客户" key="1">
          <HFKH flag={flag} type={type} />
        </TabPane>
        <TabPane tab="办事处检查" key="2">
          <OfficeCheck flag={flag} type={type} />
        </TabPane>
        <TabPane tab="人员培训" key="3">
          <RYPX flag={flag} type={type} />
        </TabPane>
        <TabPane tab="检查考勤和日志" key="4">
          <KQRZ flag={flag} type={type} />
        </TabPane>
        <TabPane tab="现场工作" key="5">
          <XCGZ flag={flag} type={type} />
        </TabPane>
        <TabPane tab="部门内其他工作事项" key="6">
          <BranchInside flag={flag} type={type} />
        </TabPane>
        <TabPane tab="支持其他部门工作" key="7">
          <BranchOther flag={flag} type={type} />
        </TabPane>
        <TabPane tab="应收账款催收" key="8"></TabPane>
      </Tabs>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(TaskRecordQuery);
