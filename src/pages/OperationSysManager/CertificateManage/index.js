import React, { Component, Fragment } from 'react';
import {
    Card, Spin,
} from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
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

  changeDgimn = dgimn => {
    this.setState({
      dgimn,
    })
  }

    render() {
        const { match: { params: { configId } } } = this.props;

        return (
            < div id = "CertificateManage" >
                <PageHeaderWrapper>
                 <CertificateManage UserID={this.state.userId} configId={configId} {...this.props} />
                </PageHeaderWrapper>
                <UserTree domId="#CertificateManage" onItemClick={value => {
                            if (value.length > 0 && !value[0].IsEnt) {
                            this.changeDgimn(value[0].UserID)
                            }
                        }} />
            </div>
        );
    }
}
export default Index;
