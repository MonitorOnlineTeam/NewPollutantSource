import React, { Component, Fragment } from 'react';
import {
    Card, Spin,
} from 'antd';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import NavigationTree from '../../../components/NavigationTree'
import OutputStopManage from './components/index'


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
            <div id = "OutputStopManage" >
                <BreadcrumbWrapper>
                 {this.state.dgimn && <OutputStopManage DGIMN={this.state.dgimn} configId={configId} {...this.props} />}
                </BreadcrumbWrapper>
                <NavigationTree domId="#OutputStopManage"  polShow type='ent' choice={false} onItemClick={value => {
                            if (value.length > 0 && !value[0].IsEnt) {
                            this.changeDgimn(value[0].key)
                            }
                        }} />
            </div>
        );
    }
}
export default Index;
