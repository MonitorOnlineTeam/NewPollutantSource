import React, { Component, Fragment } from 'react';
import {
    Card, Spin,
} from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import NavigationTree from '../../../components/NavigationTree'
import EquipmentInfoManage from './components/index'
import PageLoading from '@/components/PageLoading'

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
            dgimn: '',
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
            <div id="EquipmentInfoManage">
                <PageHeaderWrapper>
                 {this.state.dgimn?<EquipmentInfoManage DGIMN={this.state.dgimn} configId={configId} {...this.props} />:<PageLoading/>}
                </PageHeaderWrapper>
                <NavigationTree domId="#EquipmentInfoManage" choice={false} onItemClick={value => {
                            if (value.length > 0 && !value[0].IsEnt) {
                            this.changeDgimn(value[0].key)
                            }
                        }} />
            </div>
        );
    }
}
export default Index;
