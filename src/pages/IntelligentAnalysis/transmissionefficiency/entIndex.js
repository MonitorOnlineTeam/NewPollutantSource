/**
 * 功  能：传输有效率
 * 创建人：吴建伟
 * 创建时间：2019.08.12
 */
import React, { Component } from 'react';
import {
    Card,
    Table,
    DatePicker,
    Progress,
    Row,
    Popover,
    Col,
    Icon,
    Badge
} from 'antd';
import moment from 'moment';
import styles from './style.less';
import { connect } from 'dva';
import Link from 'umi/link';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SdlTable from '@/components/SdlTable';
const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY-MM';
const pageUrl = {
    updateState: 'transmissionefficiency/updateState',
    getData: 'transmissionefficiency/getEntData'
};
@connect(({
    loading,
    transmissionefficiency
}) => ({
    loading: loading.effects[pageUrl.getData],
    total: transmissionefficiency.total,
    pageSize: transmissionefficiency.pageSize,
    pageIndex: transmissionefficiency.pageIndex,
    tableDatas: transmissionefficiency.enttableDatas,
}))
export default class EntTransmissionEfficiency extends Component {
    constructor(props) {
        super(props);

        this.state = {
            beginTime: moment(moment().format('YYYY-MM')),
            endTime: ''
        };
    }
    componentWillMount() {
        this.getTableData(1);
    }
    updateState = (payload) => {
        this.props.dispatch({
            type: pageUrl.updateState,
            payload: payload,
        });
    }
    getTableData = (pageIndex) => {
        this.props.dispatch({
            type: pageUrl.getData,
            payload: {
                pageIndex: pageIndex,
            },
        });
    }
    handleTableChange = (pagination, filters, sorter) => {
        if (sorter.order) {
            this.updateState({
                transmissionEffectiveRate: sorter.order,
                pageIndex: pagination.current,
                pageSize: pagination.pageSize
            });
        } else {
            this.updateState({
                transmissionEffectiveRate: 'ascend',
                pageIndex: pagination.current,
                pageSize: pagination.pageSize
            });
        }
        this.getTableData(pagination.current);
    }
    onDateChange = (value, dateString) => {
        let endTime = moment(dateString).add(1, 'months').format('YYYY-MM-01 00:00:00');

        // if (moment(dateString).format('YYYY-MM-DD HH:mm:ss') > moment().format('YYYY-MM-DD HH:mm:ss')) {
        //     endTime = moment().format('YYYY-MM-DD HH:mm:ss');
        // }
        this.updateState({
            beginTime: moment(dateString).format('YYYY-MM-01 HH:mm:ss'),
            endTime: endTime
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
                title: (<span style={{ fontWeight: 'bold' }}>企业名称</span>),
                dataIndex: 'EnterpriseName',
                key: 'EnterpriseName',
                width: '30%',
                align: 'left',
                render: (text, record) => {
                    return text;
                }
            },
            {
                title: (<span style={{ fontWeight: 'bold' }}>传输率</span>),
                dataIndex: 'TransmissionRate',
                key: 'TransmissionRate',
                width: '25%',
                align: 'left',
                render: (text, record) => {
                    if (record.AvgTransmissionRate <= text) {
                        return <span className={styles.normaldata}>{(parseFloat(text) * 100).toFixed(2) + '%'}</span>;
                    }
                    const content = (<span><Icon type="warning" style={{ color: '#EEC900' }} />平均值{(parseFloat(record.AvgTransmissionRate) * 100).toFixed(2) + '%'}</span>)
                    return (<Popover content={content} trigger="hover">
                        <span className={styles.avgtext}><Badge className={styles.warningdata} status="warning" />{(parseFloat(text) * 100).toFixed(2) + '%'}
                        </span> </Popover>);
                }
            },
            {
                title: (<span style={{ fontWeight: 'bold' }}>有效率</span>),
                dataIndex: 'EffectiveRate',
                key: 'EffectiveRate',
                width: '25%',
                align: 'left',
                sorter: (a, b) => a.EffectiveRate - b.EffectiveRate,
                render: (text, record) => {
                    if (record.AvgEffectiveRate <= text) {
                        return <span className={styles.normaldata}>{(parseFloat(text) * 100).toFixed(2) + '%'}</span>;
                    }
                    const content = (<span><Icon type="warning" style={{ color: '#EEC900' }} />平均值{(parseFloat(record.AvgEffectiveRate) * 100).toFixed(2) + '%'}</span>)
                    return (<Popover content={content} trigger="hover">
                        <span className={styles.avgtext}><Badge className={styles.warningdata} status="warning" />{(parseFloat(text) * 100).toFixed(2) + '%'}
                        </span> </Popover>);
                }
            },
            {
                title: (<span style={{ fontWeight: 'bold' }}>传输有效率</span>),
                dataIndex: 'TransmissionEffectiveRate',
                key: 'TransmissionEffectiveRate',
                // width: '250px',
                width: '10%',
                // align: 'center',
                sorter: true,
                render: (text, record) => {
                    // 红色：#f5222d 绿色：#52c41a
                    const percent = (parseFloat(text) * 100).toFixed(2);
                    if (percent >= 90) {
                        return (<div>
                            <Progress
                                successPercent={percent}
                                percent={percent - 0}
                                size="small" format={percent => (<span style={{ color: 'black' }}>{percent}%</span>)}
                            />
                        </div>);
                    }
                    return (<div>
                        <Progress
                            successPercent={0}
                            percent={percent - 0}
                            status="exception"
                            size="small"
                            format={percent => (<span style={{ color: 'black' }}>{percent}%</span>)}
                        />
                    </div>);
                }
            },
            {
                title: (<span style={{ fontWeight: 'bold' }}>操作</span>),
                dataIndex: 'opt',
                key: 'opt',
                width: '10%',
                align: 'center',
                render: (text, record) => {
                    return (
                        <Link to={`/Intelligentanalysis/transmissionefficiency/point/${record.EnterpriseCode}/${record.EnterpriseName}`}> 查看详情 </Link>
                    );
                }
            }
        ];
        return (
            <PageHeaderWrapper title="传输有效率">
                <Row className={styles.cardTitle}>
                    <Card
                        bordered={false}
                        extra={
                            <span style={{ color: '#b3b3b3' }}>
                                时间选择：
                                <MonthPicker defaultValue={this.state.beginTime} format={monthFormat} onChange={this.onDateChange} />
                            </span>
                        }
                    >
                        <Row>
                            <Col span={24}>
                                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                    <div style={{
                                        width: 20,
                                        height: 9,
                                        backgroundColor: '#52c41a',
                                        display: 'inline-block',
                                        borderRadius: '20%',
                                        cursor: 'pointer',
                                        marginRight: 3
                                    }} /> <span style={{ cursor: 'pointer' }}> 排口传输有效率达标</span>
                                    <div style={{
                                        width: 20,
                                        height: 9,
                                        backgroundColor: '#f5222d',
                                        display: 'inline-block',
                                        borderRadius: '20%',
                                        cursor: 'pointer',
                                        marginLeft: 100,
                                        marginRight: 3
                                    }} /><span style={{ cursor: 'pointer' }}> 排口传输有效率未达标</span>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <SdlTable 
                                rowKey={(record, index) => `complete${index}`}
                                loading={this.props.loading}
                                columns={columns}
                                bordered={false}
                                onChange={this.handleTableChange}
                                dataSource={this.props.tableDatas}
                                scroll={{ y: 'calc(100vh - 390px)' }}
                                // scroll={{ y: 550 }}
                                pagination={{
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    sorter: true,
                                    'total': this.props.total,
                                    'pageSize': this.props.pageSize,
                                    'current': this.props.pageIndex,
                                    pageSizeOptions: ['10', '20', '30', '40', '50']
                                }}
                            />
                        </Row>
                    </Card>
                </Row>
            </PageHeaderWrapper>
        );
    }
}
