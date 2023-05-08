/*
 * @Author: JiaQi
 * @Date: 2023-04-23 09:53:26
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-08 17:01:39
 * @Description：
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import XCJC from './components/XCJC';
import HFKH from './components/HFKH';
import RYPX from './components/RYPX';
import XCGZ from './components/XCGZ';
import BranchInside from './components/BranchInside';
import BranchOther from './components/BranchOther';
import KQRZ from './components/KQRZ';
import OfficeCheck from './components/OfficeCheck';
import ZKCS from './components/ZKCS';

import { Tabs } from 'antd';

const { TabPane } = Tabs;

const dvaPropsData = ({ loading, wordSupervision }) => ({});

const Statistics = props => {
  const {} = props;

  // type: 区分运维还是成套
  // 空：运维。 非空：成套
  const [type, setType] = useState(props.location.query.type);

  useEffect(() => {
    // let flag = props.match.params.type === 'oneself' ? true : false;
    // setFlag(flag);
    // let type = props.location.query.type === '1' ? true : false;
    // setType(type);
    setType(props.location.query.type);
  }, [props.location.query.type]);

  //
  return (
    <BreadcrumbWrapper>
      <Tabs tabPosition="left" style={{ marginTop: 16 }}>
        <TabPane tab="现场检查" key="0">
          <XCJC type={type} />
        </TabPane>
        <TabPane tab="回访客户" key="1">
          <HFKH type={type} />
        </TabPane>
        <TabPane tab="办事处检查" key="2">
          <OfficeCheck type={type} />
        </TabPane>
        <TabPane tab="人员培训" key="3">
          <RYPX type={type} />
        </TabPane>
        <TabPane tab="检查考勤和日志" key="4">
          <KQRZ type={type} />
        </TabPane>
        <TabPane tab="现场工作" key="5">
          <XCGZ type={type} />
        </TabPane>
        <TabPane tab="部门内其他工作事项" key="6">
          <BranchInside type={type} />
        </TabPane>
        <TabPane tab="支持其他部门工作" key="7">
          <BranchOther type={type} />
        </TabPane>
        <TabPane tab="应收账款催收" key="8">
          <ZKCS type={type} />
        </TabPane>
      </Tabs>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(Statistics);
