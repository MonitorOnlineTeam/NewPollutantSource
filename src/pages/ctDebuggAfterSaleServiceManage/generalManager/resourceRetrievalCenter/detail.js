/*
 * @Author: outman0611
 * @Date: 2024-10-11 14:38:13
 * @LastEditors: outman0611
 * @LastEditTime: 2024-12-10 14:45:02
 * @Description: 通用管理 问题检索中心-详情
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
  Tabs
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
import ExpertInfo from './expertInfo';
import ResourceInfoProblemsSolutions from './resourceInfoProblemsSolutions';

import styles from './style.less';
import router from 'umi/router';
import { useLocation } from 'umi';
const { Option } = Select;
const { Search } = Input;
const namespace = 'generalManager';

const dvaPropsData = ({ loading, generalManager, global }) => ({
  configInfo: global.configInfo,
  resourceRetrievalCenterSelectIndex: generalManager.resourceRetrievalCenterSelectIndex
});



const Index = props => {


const {location:{query:{placeholder,selectIndex}} } = props;


const [type, setType] = useState(1)
  return (
    <BreadcrumbWrapper>
      <Card bodyStyle={{ padding: '12px 12px 0 12px' }}>
        <Tabs
          defaultActiveKey={selectIndex}
          onChange={(value)=>{
            setType(value)
          }}
          items={[
            {
              label: `专家信息`,
              key: 0,
              children: <ExpertInfo placeholder={JSON.parse(placeholder)?.[0]} selectIndex={selectIndex}/>,
            },
            {
              label: `资源信息`,
              key: 1,
              children: <ResourceInfoProblemsSolutions type={1} placeholder={JSON.parse(placeholder)?.[1]} selectIndex={selectIndex}/>,
            },
            {
              label: `问题与解决方案`,
              key: 2,
              children:  <ResourceInfoProblemsSolutions type={2} placeholder={JSON.parse(placeholder)?.[2]} selectIndex={selectIndex}/>,
            },
          ]}
        />


      </Card>
    </BreadcrumbWrapper>
  );
};
export default connect(dvaPropsData)(Index);
