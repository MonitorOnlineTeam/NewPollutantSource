/**
 * 功  能：有效传输率
 * 创建人：吴建伟
 * 创建时间：2018.12.08
 */
import React, { Component } from 'react';
import { WarningOutlined } from '@ant-design/icons';
import { Card, Table, DatePicker, Progress, Row, Popover, Col, Badge, Button } from 'antd';
import moment from 'moment';
import styles from './style.less';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import SdlTable from '@/components/SdlTable';
import { onlyOneEnt } from '@/config';

const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY-MM';
const pageUrl = {
    updateState: 'transmissionefficiency/updateState',
    getData: 'transmissionefficiency/getData',
};
@connect(({
    loading,
    transmissionefficiency,
}) => ({
    loading: loading.effects[pageUrl.getData],
    total: transmissionefficiency.total,
    pageSize: transmissionefficiency.pageSize,
    pageIndex: transmissionefficiency.pageIndex,
    tableDatas: transmissionefficiency.tableDatas,
    beginTime: transmissionefficiency.beginTime,
}))
export default class TransmissionEfficiency extends Component {
    constructor(props) {
        super(props);

        this.state = {
            beginTime: moment(this.props.beginTime),
            endTime: '',
        };
    }

    componentWillMount() {
        this.getTableData(1);
    }

    updateState = payload => {
        this.props.dispatch({
            type: pageUrl.updateState,
            payload,
        });
    }

    getTableData = pageIndex => {
        const { entcode } = this.props;
        if (entcode) {
            this.props.dispatch({
                type: pageUrl.getData,
                payload: {
                    entcode,
                    pageIndex,
                },
            });
        }
    }

    handleTableChange = (pagination, filters, sorter) => {
        if (sorter.order) {
            this.updateState({
                transmissionEffectiveRate: sorter.order,
                pageIndex: pagination.current,
                pageSize: pagination.pageSize,
            });
        } else {
            this.updateState({
                transmissionEffectiveRate: 'ascend',
                pageIndex: pagination.current,
                pageSize: pagination.pageSize,
            });
        }
        this.getTableData(pagination.current);
    }

    onDateChange = (value, dateString) => {
        const endTime = moment(dateString).add(1, 'months').format('YYYY-MM-01 00:00:00');

        // if (moment(dateString).format('YYYY-MM-DD HH:mm:ss') > moment().format('YYYY-MM-DD HH:mm:ss')) {
        //     endTime = moment().format('YYYY-MM-DD HH:mm:ss');
        // }
        this.updateState({
            beginTime: moment(dateString).format('YYYY-MM-01 HH:mm:ss'),
            endTime,
        });
        // let endTime = moment(dateString).add(1, 'months').add(-1, 'days').format('YYYY-MM-DD HH:mm:ss');

        // if (moment(dateString).add(1, 'months').add(-1, 'days') > moment()) {
        //     endTime = moment().format('YYYY-MM-DD HH:mm:ss');
        // }
        // this.updateState({
        //     beginTime: moment(dateString).format('YYYY-MM-01 HH:mm:ss'),
        //     endTime: endTime
        // });
        this.getTableData(this.props.pageIndex);
    }

    render() {
        const columns = [
            {
                title: (<span style={{ fontWeight: 'bold' }}>污染物名称</span>),
                dataIndex: 'PollutantTypeName',
                key: 'PollutantTypeName',
                width: '12%',
                align: 'left',
                render: (text, record) => text,
            },
            {
                title: (<span style={{ fontWeight: 'bold' }}>排口名称</span>),
                dataIndex: 'PointName',
                key: 'PointName',
                width: '12%',
                align: 'left',
                render: (text, record) => text,
            },
            {
                title: (<span style={{ fontWeight: 'bold' }}>应传个数</span>),
                dataIndex: 'ShouldNumber',
                key: 'ShouldNumber',
                width: '10%',
                align: 'left',
                render: (text, record) => {
                    if (record.IsStop) {
                        return <span className={styles.normaldata}>停运</span>;
                    }

                        return text;
                },
            },
            {
                title: (<span style={{ fontWeight: 'bold' }}>实传个数</span>),
                dataIndex: 'TransmissionNumber',
                key: 'TransmissionNumber',
                width: '10%',
                align: 'left',
                render: (text, record) => {
                    if (record.IsStop) {
                        return <span className={styles.normaldata}>停运</span>;
                    }
                    if (record.AvgTransmissionNumber <= text) {
                        return <span className={styles.normaldata}>{text}</span>;
                    }
                    const content = (<span><WarningOutlined style={{ color: '#EEC900' }} />平均值{record.AvgTransmissionNumber}</span>)
                    return (<Popover content={content} trigger="hover">
                        <span className={styles.avgtext}> <Badge className={styles.warningdata} status="warning" />{text}
                        </span> </Popover>);
                },
            },
            {
                title: (<span style={{ fontWeight: 'bold' }}>有效个数</span>),
                dataIndex: 'EffectiveNumber',
                key: 'EffectiveNumber',
                width: '11.3%',
                align: 'left',
                render: (text, record) => {
                    if (record.IsStop) {
                        return <span className={styles.normaldata}>停运</span>;
                    }
                    if (record.AvgEffectiveNumber <= text) {
                        return <span className={styles.normaldata}>{text}</span>;
                    }
                    const content = (<span><WarningOutlined style={{ color: '#EEC900' }} />平均值{record.AvgEffectiveNumber}</span>)
                    return (<Popover content={content} trigger="hover">
                        <span className={styles.avgtext}><Badge className={styles.warningdata} status="warning" />{text}
                        </span> </Popover>);
                },
            },
            {
                title: (<span style={{ fontWeight: 'bold' }}>传输率</span>),
                dataIndex: 'TransmissionRate',
                key: 'TransmissionRate',
                width: '12.3%',
                align: 'left',
                render: (text, record) => {
                    if (record.IsStop) {
                        return <span className={styles.normaldata}>停运</span>;
                    }
                    if (record.AvgTransmissionRate <= text) {
                        return <span className={styles.normaldata}>{`${(parseFloat(text) * 100).toFixed(2)}%`}</span>;
                    }
                    const content = (<span><WarningOutlined style={{ color: '#EEC900' }} />平均值{`${(parseFloat(record.AvgTransmissionRate) * 100).toFixed(2)}%`}</span>)
                    return (<Popover content={content} trigger="hover">
                        <span className={styles.avgtext}><Badge className={styles.warningdata} status="warning" />{`${(parseFloat(text) * 100).toFixed(2)}%`}
                        </span> </Popover>);
                },
            },
            {
                title: (<span style={{ fontWeight: 'bold' }}>有效率</span>),
                dataIndex: 'EffectiveRate',
                key: 'EffectiveRate',
                width: '12.3%',
                align: 'left',
                sorter: (a, b) => a.EffectiveRate - b.EffectiveRate,
                render: (text, record) => {
                    if (record.IsStop) {
                        return <span className={styles.normaldata}>停运</span>;
                    }
                    if (record.AvgEffectiveRate <= text) {
                        return <span className={styles.normaldata}>{`${(parseFloat(text) * 100).toFixed(2)}%`}</span>;
                    }
                    const content = (<span><WarningOutlined style={{ color: '#EEC900' }} />平均值{`${(parseFloat(record.AvgEffectiveRate) * 100).toFixed(2)}%`}</span>)
                    return (<Popover content={content} trigger="hover">
                        <span className={styles.avgtext}><Badge className={styles.warningdata} status="warning" />{`${(parseFloat(text) * 100).toFixed(2)}%`}
                        </span> </Popover>);
                },
            },
            {
                title: (<span style={{ fontWeight: 'bold' }}>有效传输率</span>),
                dataIndex: 'TransmissionEffectiveRate',
                key: 'TransmissionEffectiveRate',
                // width: '250px',
                width: '20%',
                // align: 'center',
                sorter: true,
                render: (text, record) => {
                    if (record.IsStop) {
                        return <span className={styles.normaldata}>停运</span>;
                    }
                    // 红色：#f5222d 绿色：#52c41a
                    const percent = (parseFloat(text) * 100).toFixed(2);
                    if (percent >= 90) {
                        return (<div style={{ width: 200 }}>
                            <Progress
                                successPercent={percent}
                                percent={percent - 0}
                                size="small" format={percent => (<span style={{ color: 'black' }}>{percent}%</span>)}
                            />
                        </div>);
                    }
                    return (<div style={{ width: 200 }}>
                        <Progress
                            successPercent={0}
                            percent={percent - 0}
                            status="exception"
                            size="small"
                            format={percent => (<span style={{ color: 'black' }}>{percent}%</span>)}
                        />
                    </div>);
                },
            },
        ];
        const entName = this.props.entname;
        let tableTitle = '';
        let Crumbs = [
            { Name: '智能质控', Url: '' },
        ]
        if (onlyOneEnt) {
            tableTitle = '有效传输率列表'
            Crumbs = Crumbs.concat(
                { Name: '有效传输率', Url: '' },
            )
        } else {
            tableTitle = `有效传输率列表(${entName})`
            Crumbs = Crumbs.concat(
                { Name: '企业有效传输率', Url: '/qualitycontrol/transmissionefficiency' },
                { Name: '排口有效传输率', Url: '' },
            )
        }

        return (
            // <BreadcrumbWrapper title="有效传输率-详情">
            <div>
                <Row className={styles.cardTitle}>
                    <Card
                        title={<div style={{ marginBottom: 20 }}>
                            {entName}
                            {/* <Button
                                style={{ marginLeft: 10 }}
                                onClick={() => {
                                    history.go(-1);
                                }}
                                type="link"
                                size="small"
                            >
                                <Icon type="rollback" />
                              返回上级
                            </Button> */}
                        </div>}
                        bordered={false}
                        style={{ height: 'auto' }}
                        extra={
                            <div style={{ marginBottom: 20 }}>
                                <div style={{
                                    width: 20,
                                    height: 9,
                                    backgroundColor: '#52c41a',
                                    display: 'inline-block',
                                    borderRadius: '20%',
                                    cursor: 'pointer',
                                    marginRight: 3,
                                }} /> <span style={{ cursor: 'pointer' }}> 排口有效传输率达标</span>
                                <div style={{
                                    width: 20,
                                    height: 9,
                                    backgroundColor: '#f5222d',
                                    display: 'inline-block',
                                    borderRadius: '20%',
                                    cursor: 'pointer',
                                    marginLeft: 35,
                                    marginRight: 3,
                                }} /><span style={{ cursor: 'pointer' }}> 排口有效传输率未达标</span>
                                <Badge style={{ marginLeft: 35, marginBottom: 4 }} status="warning" /><span style={{ cursor: 'pointer' }}> 未达到平均值</span>
                                <div
                                    style={{
                                        display: 'inline-block',
                                        borderRadius: '20%',
                                        marginLeft: 35,
                                        marginRight: 3,
                                    }}
                                >
                                    <span style={{ color: '#b3b3b3' }}>
                                        时间选择：
                                <MonthPicker defaultValue={this.state.beginTime} format={monthFormat} allowClear={false} onChange={this.onDateChange} />
                                    </span>
                                </div>
                            </div>


                        }
                    >
                        <SdlTable
                            rowKey={(record, index) => `complete${index}`}
                            loading={this.props.loading}
                            columns={columns}
                            bordered={false}
                            onChange={this.handleTableChange}
                            size="small"// small middle
                            dataSource={this.props.tableDatas}
                            // scroll={{ y: 'calc(100vh - 430px)' }}
                            //  scroll={{ y: 550 }}

                            pagination={{
                                showSizeChanger: true,
                                showQuickJumper: true,
                                sorter: true,
                                total: this.props.total,
                                pageSize: this.props.pageSize,
                                current: this.props.pageIndex,
                                pageSizeOptions: ['10', '20', '30', '40', '50'],
                            }}
                        />
                    </Card>
                </Row>
            </div>
            /* </BreadcrumbWrapper > */
        );
    }
}
