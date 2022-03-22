import React, { Component, Fragment } from 'react';
import {
    Card, Spin,
} from 'antd';
import { connect } from 'dva';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import styles from './index.less';
import UserTree from '../../../components/UserTree'
import CertificateManage from './components/index'


@connect(({ loading, autoForm }) => ({
    loading: loading.effects['autoForm/getPageConfig'],
    autoForm,
    searchConfigItems: autoForm.searchConfigItems,
    tableInfo: autoForm.tableInfo,
    searchForm: autoForm.searchForm,
    routerConfig: autoForm.routerConfig,
}))

 class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
        };
    }

  changeDgimn = UserId => {
    this.setState({
      UserId,
    })
  }

    render() {
        const { match: { params: { configId } } } = this.props;

        return (
            <div id = "CertificateManage" >
                <BreadcrumbWrapper>
                 {this.state.UserId&&<CertificateManage UserID={this.state.UserId} configId={configId} {...this.props} />}
                </BreadcrumbWrapper>
                <UserTree RoleID="eec719c2-7c94-4132-be32-39fe57e738c9" domId="#CertificateManage" onItemClick={value => {
                            if (value.length > 0) {
                            this.changeDgimn(value[0].UserID)
                            }
                        }} />
            </div>
        );
    }
}
export default Index;
