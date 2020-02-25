/*
 * @Author: Jiaqi 
 * @Date: 2019-11-07 10:54:34 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-08 09:54:49
 * @desc: 质控仪管理
 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card } from 'antd';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import { router } from 'umi';

class InstrumentManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configId: "QCAnalyzerInfo"
    };
  }
  render() {
    const { configId } = this.state;
    return (
      <PageHeaderWrapper>
        <Card>
          <AutoFormTable
            configId={configId}
            getPageConfig
            onAdd={() => {
              router.push("/qualityControl/qcaManager/instrumentManage/add");
            }}
            onEdit={(record, key) => {
              router.push(`/qualityControl/qcaManager/instrumentManage/edit/${key}`);
            }}
            onView={(record, key) => {
              router.push(`/qualityControl/qcaManager/instrumentManage/view/${key}`);
            }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default InstrumentManage;