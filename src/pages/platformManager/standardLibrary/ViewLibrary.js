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
      configId: "StandardLibrary",
      tableConfigId: "StandardLibraryPollutant"
    };
  }
  render() {
    const { configId, tableConfigId } = this.state;
    return (
      <BreadcrumbWrapper title="标准库详情">
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
            keysParams={{ "dbo.T_Base_StandardLibrary.Guid": this.props.match.params.guid }}
          />
          <Card
            style={{ marginTop: 16 }}
            type="inner"
            title="污染物列表"
            bordered={false}
          >
            <AutoFormTable
              configId={tableConfigId}
              getPageConfig
              rowKey={(record, index) => index}
              // scroll={{ y: 'calc(100vh - 600px)' }}
            />
          </Card>
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default ViewLibrary;