import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import Style from './index.less';
import ExceptionVerify from './ExceptionVerify';
import OperationVerify from './OperationVerify';
/**
 * 指挥调度表报 超标报警详细
 */
@connect(({ loading, autoForm }) => ({
    loading: loading.effects['autoForm/getPageConfig'],
    autoForm,
    searchConfigItems: autoForm.searchConfigItems,
    tableInfo: autoForm.tableInfo,
    searchForm: autoForm.searchForm,
    routerConfig: autoForm.routerConfig,
}))
class AlermIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DataWhere: [],
            DataWhere1: [],
            DataWhere2: [],
        };
    }

    componentDidMount() {
        const { ID, EID, PID } = this.props;
        const DataWhere = [{
            Key: '[dbo]__[T_Cod_ExceptionProcessing]__ID',
            Value: ID,
            Where: '$=',
          },
          ];
          this.setState({
            DataWhere,
          })
         this.reloadPage('ExceptionProcessing');
        if (EID != null) {
            const DataWhere1 = [{
                Key: '[dbo]__[T_Cod_ExceptionVerify]__ID',
                Value: EID,
                Where: '$=',
              },
              ];
              this.setState({
                DataWhere1,
              })
            // this.reloadPage('ExceptionVerifyService');
        }
        if (PID != null) {
            const DataWhere2 = [{
                Key: '[dbo]__[T_Cod_OperationVerify]__ID',
                Value: PID,
                Where: '$=',
              },
              ];
              this.setState({
                DataWhere2,
              })
            // this.reloadPage('OperationVerify');
        }
    }

    reloadPage = configId => {
        const { dispatch } = this.props;

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
                <Card bordered={false} title="超标详情" loading={this.props.loading}>
                    <Card.Grid style={{ width: '100%' }} className={Style.hidpage}>
                        {
                            (this.state.DataWhere && this.state.DataWhere.length) ? <AutoFormTable
                            configId="ExceptionProcessing"
                            {...this.props}
                            searchParams={this.state.DataWhere}
                        >
                        </AutoFormTable> : ''
                        }

                    </Card.Grid>
                </Card>
                {this.props.PID == null ? '' : <OperationVerify DataWhere2={this.state.DataWhere2}/>}
                {this.props.EID == null ? '' : <ExceptionVerify DataWhere1={this.state.DataWhere1}/>}

            </>
        );
    }
}
export default AlermIndex;
