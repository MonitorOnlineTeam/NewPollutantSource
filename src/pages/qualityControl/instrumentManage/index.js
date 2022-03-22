/*
 * @Author: Jiaqi 
 * @Date: 2019-11-07 10:54:34 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-08 09:54:49
 * @desc: 质控仪管理
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
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
    console.log("porps=",this.props.match.path)
    return (
      <BreadcrumbWrapper>
        <Card>
          <AutoFormTable
            configId={configId}
            getPageConfig
            onAdd={() => {
              router.push(`${this.props.match.path}/add`);
            }}
            onEdit={(record, key) => {
              router.push(`${this.props.match.path}/edit/${key}/${record["dbo.T_Bas_QCAnalyzerInfo.QCAMN"]}`);
            }}
            onView={(record, key) => {
              router.push(`${this.props.match.path}/view/${key}`);
            }}
          />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default InstrumentManage;