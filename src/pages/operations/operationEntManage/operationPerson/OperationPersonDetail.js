/*
 * @Author: Jiaqi 
 * @Date: 2019-11-06 14:32:53 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-06 14:33:15
 * @desc: 标准库详情页面
 */
import React, { Component } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import { Card, Button } from 'antd';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import AutoFormViewItems from '@/pages/AutoFormManager/AutoFormViewItems'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'

class ViewLibrary extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { match:{params:{configId,personId}} } = this.props;
    return (
      <BreadcrumbWrapper title="运维人员详情">
        <Card
          title="详情"
          className="contentContainer"
          extra={
            <Button
              style={{ float: "right", marginRight: 10 }}
              onClick={() => {
                history.go(-1);
              }}
            ><LeftOutlined />返回
            </Button>
          }>
          <AutoFormViewItems
            configId={configId}
            keysParams={{ "dbo.T_Bas_OperationMaintenancePersonnel.PersonnelID": personId }}
          />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default ViewLibrary;