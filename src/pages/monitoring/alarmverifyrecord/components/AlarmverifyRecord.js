import React, { Component, Fragment } from 'react';
import { SnippetsTwoTone } from '@ant-design/icons';
import { Card, Spin, Tooltip, Modal, Divider } from 'antd';
import {
    PointIcon,
    DetailIcon,
} from '@/utils/icon'
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import AlarmRecordDetails from './AlarmRecordDetails';

@connect(({ loading, autoForm }) => ({
    loading: loading.effects['autoForm/getPageConfig'],
    autoForm,
    searchConfigItems: autoForm.searchConfigItems,
    tableInfo: autoForm.tableInfo,
    searchForm: autoForm.searchForm,
    routerConfig: autoForm.routerConfig,
}))

class AlarmverifyRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            ID: '',
        };
    }

    componentDidMount() {
        const { configId } = this.props;
        this.reloadPage(configId);
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
        const { configId } = this.props;
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
            <div>
                <Card>
                    <SearchWrapper
                        onSubmitForm={form => this.loadReportList(form)}
                        configId={configId}
                    ></SearchWrapper>
                    <AutoFormTable
                        style={{ marginTop: 10 }}
                        configId={configId}
                        parentcode="alarmmanager/alarmverifyrecord"
                        {...this.props}
                        appendHandleRows={row => (
                            <Fragment>
                                <Tooltip title="报警记录详情">
                                    <a
                                        onClick={() => {
                                            console.log('row', row);
                                            this.setState({
                                                visible: true,
                                                ID: `${row['dbo.T_Cod_ExceptionVerify.ID']}`,
                                            })
                                        }}
                                    >
                                        <SnippetsTwoTone />
                                    </a>
                                </Tooltip>
                            </Fragment>
                        )}
                    >
                    </AutoFormTable>
                    <Modal
                        title="报警记录详细"
                        visible={this.state.visible}
                        destroyOnClose // 清除上次数据
                        onCancel={() => {
                            this.setState({
                                visible: false,
                            });
                        }}
                        footer={false}
                        width="90%"
                    >
                        <AlarmRecordDetails ID={this.state.ID} />
                    </Modal>
                </Card>
            </div>
        );
    }
}
export default AlarmverifyRecord;
