import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import Style from './index.less';
/**
 * 指挥调度表报 处置详细
 */
@connect(({ loading, autoForm }) => ({
    loading: loading.effects['autoForm/getPageConfig'],
    autoForm,
    searchConfigItems: autoForm.searchConfigItems,
    tableInfo: autoForm.tableInfo,
    searchForm: autoForm.searchForm,
    routerConfig: autoForm.routerConfig,
}))
class ExceptionVerify extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.reloadPage('ExceptionVerifyService');
    }

    reloadPage = configId => {
        const { dispatch } = this.props;
        dispatch({
            type: 'autoForm/updateState',
            payload: {
                routerConfig: configId,
            },
        });
        dispatch({
            type: 'autoForm/getPageConfig',
            payload: {
                configId,
            },
        })
    }

    render() {
        return (
            <>
                <Card bordered={false} title="处置详情" loading={this.props.loading}>
                    <Card.Grid style={{ width: '100%' }} className={Style.hidpage}>
                        <AutoFormTable
                            configId="ExceptionVerifyService"
                            {...this.props}
                            searchParams={this.props.DataWhere1}
                        >
                        </AutoFormTable>
                    </Card.Grid>
                </Card>
            </>
        );
    }
}
export default ExceptionVerify;
