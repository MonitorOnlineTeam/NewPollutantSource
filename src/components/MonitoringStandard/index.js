/**
 * 功  能：监测标准管理
 * 创建人：wjw
 * 修改人：-
 * 创建时间：2019.10.21
 */
import React, { Component, Fragment } from 'react';
import { ExclamationCircleOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import {
    Card,
    Divider,
    Table,
    message,
    Tag,
    Modal,
    Pagination,
    Popconfirm,
    Button,
    Row,
    Col,
    Empty,
    Tooltip,
    Switch,
} from 'antd';
import { connect } from 'dva';
import EditPollutant from './editPollutant';
import EditPollutantDay from './editPollutantDay';
import styles from './index.less';
import MonitorContent from '@/components/MonitorContent';
import SdlTable from '@/components/SdlTable';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { EditIcon } from '@/utils/icon'

@connect(({ loading, standardLibrary, autoForm }) => ({
    ...loading,
    list: standardLibrary.uselist,
    total: standardLibrary.total,
    pageSize: standardLibrary.pageSize,
    pageIndex: standardLibrary.pageIndex,
    requstresult: standardLibrary.requstresult,
    standardTableDatas: standardLibrary.PollutantListByDGIMN,
}))
class MonitoringStandard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DGIMN: this.props.DGIMN,
            Fvisible: false,
            Pvisible: false,
            title: '',
            width: '500',
            PollutantCode: null,
            standardLibraryModal: false,
        };
    }

    onRef1 = ref => {
        this.child = ref;
    };

    oncancel = () => {
        this.setState({
            Fvisible: false,
        });
    };
    componentDidMount() {
        const { dispatch, match, DGIMN } = this.props;
        !this.props.noload && dispatch({
            type: 'autoForm/getPageConfig',
            payload: {
                configId: 'service_StandardLibrary',
            },
        });
        this.getpollutantbydgimn(DGIMN);
    }

    componentWillReceiveProps(nextProps) {

        if (this.props.DGIMN != nextProps.DGIMN) {
            this.getpollutantbydgimn(nextProps.DGIMN);
        }

    }

    getpollutantbydgimn(DGIMN) {
        this.setState({
            DGIMN: DGIMN
        });
        // if (DGIMN)
        this.props.dispatch({
            type: 'standardLibrary/getpollutantbydgimn',
            payload: {
                DGIMN: DGIMN,
            },
        });
    }

    UseALL(StandardLibraryID) {
        this.props.dispatch({
            type: 'standardLibrary/useStandard',
            payload: {
                DGIMN: this.state.DGIMN,
                StandardLibraryID: StandardLibraryID,
                callback: (res) => {
                    this.setState({
                        standardlibraryModal: false,
                    });
                    if (res.IsSuccess) {
                        message.success('应用成功');
                    } else {
                        message.error('应用失败');
                    }
                },
            },
        });
    }

    IsEnabled = (type, record) => {
        this.props.dispatch({
            type: 'standardLibrary/isusepollutant',
            payload: {
                PollutantCode: record.PollutantCode,
                DGIMN: this.state.DGIMN,
                Enalbe: type,
                StandardLibraryID: null,
            },
        });
    };

    changeUseStatisti = (record, Enalbe) => {
        this.props.dispatch({
            type: 'standardLibrary/changeUseStatisti',
            payload: {
                DGIMN: this.state.DGIMN,
                PollutantCode: record.PollutantCode,
                Enalbe: Enalbe ? Enalbe : (record.IsStatisti == 1 ? 0 : 1)
            }
        })
    }


    render() {
        const columns = [
            {
                title: '污染物编号',
                dataIndex: 'PollutantCode',
                key: 'PollutantCode',
                // width: '10%',
                align: 'left',
                fixed: 'left',
                render: (text, record) => text,

            },
            {
                title: '污染物名称',
                dataIndex: 'PollutantName',
                key: 'PollutantName',
                // width: '10%',
                align: 'left',
                fixed: 'left',
                render: (text, record) => text,
            },

            {
                title: '报警类型',
                dataIndex: 'AlarmType',
                key: 'AlarmType',
                // width: 200,
                fixed: 'left',
                render: (text, record) => {
                    if (text === 0) {
                        return (
                            <span>
                                {' '}
                                <Tag> 无报警 </Tag>{' '}
                            </span>
                        );
                    }
                    if (text === 1) {
                        return (
                            <span>
                                {' '}
                                <Tag color="green"> 上限报警 </Tag>{' '}
                            </span>
                        );
                    }
                    if (text === 2) {
                        return (
                            <span>
                                {' '}
                                <Tag color="cyan"> 下限报警 </Tag>{' '}
                            </span>
                        );
                    }
                    if (text === 3) {
                        return (
                            <span>
                                {' '}
                                <Tag color="lime"> 区间报警 </Tag>{' '}
                            </span>
                        );
                    }
                },
            },
            {
                title: '检出上限',
                dataIndex: 'AbnormalUpperLimit',
                key: 'AbnormalUpperLimit',
                // width: '10%',
                align: 'center',
                render: (text, record) => text,
            },
            {
                title: '检出下限',
                dataIndex: 'AbnormalLowerLimit',
                key: 'AbnormalLowerLimit',
                // width: '10%',
                align: 'center',
                render: (text, record) => text,
            },
            {
                title: '报警上限',
                dataIndex: 'UpperLimit',
                key: 'UpperLimit',
                // width: '10%',
                align: 'center',
                render: (text, record) => {
                    if (text === '0') {
                        return '-';
                    }

                    return text;
                },
            },
            {
                title: '报警下限',
                dataIndex: 'LowerLimit',
                key: 'LowerLimit',
                // width: '10%',
                align: 'center',
                render: (text, record) => {
                    if (text === '0') {
                        return '-';
                    }

                    return text;
                },
            },
            {
                title: '标准值',
                dataIndex: 'StandardValue',
                key: 'StandardValue',
                // width: '10%',
                align: 'center',
                render: (text, record) => {
                    if (text === 0) {
                        return '-';
                    }

                    return text;
                },
            },
            {
                title: '监测状态',
                dataIndex: 'IsUse',
                key: 'IsUse',
                // width: '10%',
                align: 'center',
                render: (text, record) => {
                    if (text === '0') {
                        return (
                            <span>
                                <Button size="small" type="dashed">
                                    <a
                                        title="单击设置为监测中"
                                        style={{ color: '#D1D1D1' }}
                                        onClick={() => this.IsEnabled(1, record)}
                                    >
                                        <ExclamationCircleOutlined /> 未监测
                                    </a>
                                </Button>
                            </span>
                        );
                    }
                    return (
                        <span>
                            {' '}
                            <Button size="small" color="blue">
                                {' '}
                                <a title="单击从监测中移除" onClick={() => this.IsEnabled(0, record)}>
                                    <SettingOutlined spin={true} /> 监测中
                                </a>
                            </Button>
                        </span>
                    );
                },
            },
            {
                title: '是否参与考核',
                dataIndex: 'IsStatisti',
                key: 'IsStatisti',
                // width: '10%',
                align: 'center',
                render: (text, record) => {
                    return <Switch onChange={() => {
                        this.changeUseStatisti(record)
                    }} disabled={record.IsUse === '0'} checkedChildren="是" unCheckedChildren="否" checked={text == 1} />
                },
            },
            {
                title: '操作',
                // width: '10%',
                align: 'center',
                render: (text, record) => {
                    if (record.IsUse === '1') {
                        return (

                            <Tooltip title="编辑污染物">
                                <a
                                    onClick={() =>
                                        this.setState({
                                            Fvisible: true,
                                            title: '编辑污染物',
                                            width: '50%',
                                            PollutantCode: record.PollutantCode,
                                        })
                                    }
                                ><EditIcon /></a>
                            </Tooltip>

                        );
                    }
                    return <Tooltip >
                        <a style={{ color: '#D1D1D1' }}><EditIcon /></a>
                    </Tooltip>;
                },
            },
        ];
        const columnsDay = [
            {
                title: '污染物编号',
                dataIndex: 'PollutantCode',
                key: 'PollutantCode',
                // width: '10%',
                align: 'left',
                fixed: 'left',
                render: (text, record) => text,

            },
            {
                title: '污染物名称',
                dataIndex: 'PollutantName',
                key: 'PollutantName',
                // width: '10%',
                align: 'left',
                fixed: 'left',
                render: (text, record) => text,
            },

            {
                title: '报警类型',
                dataIndex: 'AlarmType',
                key: 'AlarmType',
                // width: 200,
                fixed: 'left',
                render: (text, record) => {
                    if (text === 0) {
                        return (
                            <span>
                                {' '}
                                <Tag> 无报警 </Tag>{' '}
                            </span>
                        );
                    }
                    if (text === 1) {
                        return (
                            <span>
                                {' '}
                                <Tag color="green"> 上限报警 </Tag>{' '}
                            </span>
                        );
                    }
                    if (text === 2) {
                        return (
                            <span>
                                {' '}
                                <Tag color="cyan"> 下限报警 </Tag>{' '}
                            </span>
                        );
                    }
                    if (text === 3) {
                        return (
                            <span>
                                {' '}
                                <Tag color="lime"> 区间报警 </Tag>{' '}
                            </span>
                        );
                    }
                },
            },
            {
                title: '检出上限',
                dataIndex: 'AbnormalUpperLimit',
                key: 'AbnormalUpperLimit',
                // width: '10%',
                align: 'center',
                render: (text, record) => text,
            },
            {
                title: '检出下限',
                dataIndex: 'AbnormalLowerLimit',
                key: 'AbnormalLowerLimit',
                // width: '10%',
                align: 'center',
                render: (text, record) => text,
            },
            {
                title: '小时报警上限',
                dataIndex: 'UpperLimit',
                key: 'UpperLimit',
                // width: '10%',
                align: 'center',
                render: (text, record) => {
                    if (text === '0') {
                        return '-';
                    }

                    return text;
                },
            },
            {
                title: '小时报警下限',
                dataIndex: 'LowerLimit',
                key: 'LowerLimit',
                // width: '10%',
                align: 'center',
                render: (text, record) => {
                    if (text === '0') {
                        return '-';
                    }

                    return text;
                },
            },
            {
                title: '小时标准值',
                dataIndex: 'StandardValue',
                key: 'StandardValue',
                // width: '10%',
                align: 'center',
                render: (text, record) => {
                    if (text === 0) {
                        return '-';
                    }

                    return text;
                },
            },
            {
                title: '日报警上限',
                dataIndex: 'DayUpperLimit',
                key: 'DayUpperLimit',
                // width: '10%',
                align: 'center',
                render: (text, record) => {
                    if (text === '0') {
                        return '-';
                    }

                    return text;
                },
            },
            {
                title: '日报警下限',
                dataIndex: 'DayLowerLimit',
                key: 'DayLowerLimit',
                // width: '10%',
                align: 'center',
                render: (text, record) => {
                    if (text === '0') {
                        return '-';
                    }

                    return text;
                },
            },
            {
                title: '日标准值',
                dataIndex: 'DayStandardValue',
                key: 'DayStandardValue',
                // width: '10%',
                align: 'center',
                render: (text, record) => {
                    if (text === 0) {
                        return '-';
                    }

                    return text;
                },
            },
            {
                title: '监测状态',
                dataIndex: 'IsUse',
                key: 'IsUse',
                // width: '10%',
                align: 'center',
                render: (text, record) => {
                    if (text === '0') {
                        return (
                            <span>
                                <Button size="small" type="dashed">
                                    <a
                                        title="单击设置为监测中"
                                        style={{ color: '#D1D1D1' }}
                                        onClick={() => this.IsEnabled(1, record)}
                                    >
                                        <ExclamationCircleOutlined /> 未监测
                                    </a>
                                </Button>
                            </span>
                        );
                    }
                    return (
                        <span>
                            {' '}
                            <Button size="small" color="blue">
                                {' '}
                                <a title="单击从监测中移除" onClick={() => this.IsEnabled(0, record)}>
                                    <SettingOutlined spin={true} /> 监测中
                                </a>
                            </Button>
                        </span>
                    );
                },
            },
            {
                title: '是否参与考核',
                dataIndex: 'IsStatisti',
                key: 'IsStatisti',
                // width: '10%',
                align: 'center',
                render: (text, record) => {
                    return <Switch onChange={() => {
                        this.changeUseStatisti(record)
                    }} disabled={record.IsUse === '0'} checkedChildren="是" unCheckedChildren="否" checked={text == 1} />
                },
            },
            {
                title: '操作',
                // width: '10%',
                align: 'center',
                render: (text, record) => {
                    if (record.IsUse === '1') {
                        return (

                            <Tooltip title="编辑污染物">
                                <a
                                    onClick={() =>
                                        this.setState({
                                            Fvisible: true,
                                            title: '编辑污染物',
                                            width: '50%',
                                            PollutantCode: record.PollutantCode,
                                        })
                                    }
                                ><EditIcon /></a>
                            </Tooltip>

                        );
                    }
                    return <Tooltip >
                        <a style={{ color: '#D1D1D1' }}><EditIcon /></a>
                    </Tooltip>;
                },
            },
        ];
        const {
            searchConfigItems,
            searchForm,
            tableInfo,
            //   match: {
            //     params: { targetName, configId, targetId },
            //   },
            dispatch,
            pointDataWhere,
            isEdit,
            pollutantType,
            standardTableDatas,

        } = this.props;

        const { standardlibraryModal, Fvisible } = this.state;
        return (
            <Card
                bordered={false}
                style={{ width: '100%' }}
                bodyStyle={{ paddingBottom: 0 }}
                extra={
                    <>{pollutantType == "5" ? "" : <Button
                        onClick={() => {
                            this.setState({
                                standardlibraryModal: true,
                            });
                        }}
                        icon={<SearchOutlined />}
                    >
                        查看标准库
                    </Button>}
                    </>

                }
            >
                <SdlTable
                    rowKey={(record, index) => `complete${index}`}
                    bordered={false}
                    loading={this.props.effects['standardLibrary/getpollutantbydgimn']}
                    columns={pollutantType == "5" ? columnsDay : columns}
                    dataSource={standardTableDatas}
                    className={styles.tableSty}
                //  pagination={{ pageSize: 20 }}
                />
                <Modal
                    visible={standardlibraryModal}
                    title={'选择标准库'}
                    width={'50%'}
                    footer={false}
                    destroyOnClose={true} // 清除上次数据
                    onCancel={() => {
                        this.setState({
                            standardlibraryModal: false,
                        });
                    }}
                >
                    {
                        <AutoFormTable
                            style={{ marginTop: 10 }}
                            configId={'service_StandardLibrary'}
                            searchParams={[
                                {
                                    Key: 'dbo__T_Cod_PollutantType__PollutantTypeCode',
                                    Value: `${pollutantType}`,
                                    Where: '$=',
                                },
                                {
                                    Key: 'dbo__T_Base_StandardLibrary__IsUsed',
                                    Value: 1,
                                    Where: '$=',
                                },
                            ]}
                            appendHandleRows={row => {
                                return (
                                    <Fragment>
                                        <Popconfirm
                                            title="确认要应用标准吗?"
                                            onConfirm={() => {
                                                this.UseALL(row['dbo.T_Base_StandardLibrary.Guid']);
                                            }}
                                            onCancel={this.cancel}
                                            okText="是"
                                            cancelText="否"
                                        >
                                            <a href="#">应用标准</a>
                                        </Popconfirm>
                                    </Fragment>
                                );
                            }}
                        />
                    }
                </Modal>
                <Modal
                    visible={Fvisible}
                    title={this.state.title}
                    width={this.state.width}
                    footer={false}
                    destroyOnClose={true} // 清除上次数据
                    onCancel={() => {
                        this.setState({
                            Fvisible: false,
                        });
                    }}
                >
                    {
                        Fvisible && <>{
                            pollutantType == "5" ? <EditPollutantDay
                                pid={this.state.PollutantCode}
                                DGIMN={this.state.DGIMN}
                                onRef={this.onRef1}
                                oncancel={this.oncancel}
                            /> :
                                <EditPollutant
                                    pid={this.state.PollutantCode}
                                    DGIMN={this.state.DGIMN}
                                    onRef={this.onRef1}
                                    oncancel={this.oncancel}
                                />
                        } </>
                    }
                </Modal>
            </Card>
        );
    }
}
export default MonitoringStandard;
