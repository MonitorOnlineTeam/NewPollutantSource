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
    Badge,
    Modal
} from 'antd';
import moment from 'moment';
import styles from './style.less';
import { connect } from 'dva';
import Link from 'umi/link';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import PointIndex from './pointIndex';
import { router } from "umi"
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
            endTime: '',
            EnterpriseCode: '',
            EnterpriseName: '',
            visible: false,
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
    onDateChange = (value, beginTime, endTime) => {
        this.updateState({
            beginTime: beginTime,
            endTime: endTime
        });
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
                width: '15%',
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
                width: '15%',
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
                width: '30%',
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
                    return <a onClick={() => {
                        this.setState({
                            visible: true,
                            EnterpriseCode: record.EnterpriseCode,
                            EnterpriseName: record.EnterpriseName,
                        })
                        // router.push({
                        //     pathname: `/Intelligentanalysis/transmissionefficiency/point/${record.EnterpriseCode}/${record.EnterpriseName}`,
                        //     query: {
                        //         tabName: "传输有效率 - 详情"
                        //     }
                        // })
                    }}>查看详情</a>
                    // return (
                    //     <Link to={`/Intelligentanalysis/transmissionefficiency/point/${record.EnterpriseCode}/${record.EnterpriseName}?tabName=`}> 查看详情 </Link>
                    // );
                }
            }
        ];
        return (
            <BreadcrumbWrapper title="传输有效率">
                {/* <div className="contentContainer"> */}
                <Card
                    bordered={false}
                    extra={
                        <div>
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
                                marginLeft: 60,
                                marginRight: 3
                            }} /><span style={{ cursor: 'pointer' }}> 排口传输有效率未达标</span>
                            <div
                                style={{
                                    display: 'inline-block',
                                    borderRadius: '20%',
                                    marginLeft: 60,
                                    marginRight: 3
                                }}
                            >
                                <span style={{ color: '#b3b3b3' }}>
                                    时间选择：
                                <DatePickerTool defaultValue={this.state.beginTime} picker="month" callback={this.onDateChange} />
                                    {/* <MonthPicker defaultValue={this.state.beginTime} format={monthFormat} onChange={this.onDateChange} /> */}
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
                        dataSource={this.props.tableDatas}
                        // scroll={{ y: 'calc(100vh - 450px)' }}
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

                    <Modal
                        title="传输有效率 - 详情"
                        destroyOnClose
                        footer={[]}
                        visible={this.state.visible}
                        width={"90%"}
                        // style={{ height: "90vh" }}
                        onCancel={() => { this.setState({ visible: false }) }}
                    >
                        <PointIndex entcode={this.state.EnterpriseCode} entname={this.state.EnterpriseName} ></PointIndex>
                    </Modal>

                </Card>
                {/* </div> */}
            </BreadcrumbWrapper>
        );
    }
}
