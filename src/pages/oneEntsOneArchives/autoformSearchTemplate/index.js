import React, { Component, Fragment } from 'react';
import {
    Card, Spin,
} from 'antd';
import { connect } from 'dva';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import AutoFormTable from '../../AutoFormManager/AutoFormTable';
import SearchWrapper from '../../AutoFormManager/SearchWrapper';
import styles from './index.less';

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
        this.state = {};
    }

    componentDidMount() {
        const { match } = this.props;
        this.reloadPage(match.params.configId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            if (nextProps.match.params.configId !== this.props.routerConfig) { this.reloadPage(nextProps.match.params.configId); }
        }
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
        const { match: { params: { configId } } } = this.props;

        const entCode = sessionStorage.getItem('oneEntCode')
        if (this.props.loading) {
            return (<Spin
                style={{
                    width: '100%',
                    height: 'calc(100vh/2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                size="large"
            />);
        }
        return (
            <BreadcrumbWrapper>
                <div className={styles.cardTitle}>
                    <Card>
                    <SearchWrapper
                        onSubmitForm={form => this.loadReportList(form)}
                        configId={configId}
                        searchParams={[{
                            Key: 'dbo.T_Bas_Enterprise.EntCode',
                            Value: `${entCode}`,
                            Where: '$=',
                         },
                       ]}
                    />
                        <AutoFormTable
                            style={{ marginTop: 10 }}
                            configId={configId}
                            searchParams={[{
                                Key: 'dbo.T_Bas_Enterprise.EntCode',
                                Value: `${entCode}`,
                                Where: '$=',
                             },
                           ]}
                            rowChange={(key, row) => {
                                console.log('key=', key);
                                this.setState({
                                    key, row,
                                })
                            }}
                            
                            {...this.props}
                        />
                    </Card>
                </div>
            </BreadcrumbWrapper>
        );
    }
}
export default Index;
