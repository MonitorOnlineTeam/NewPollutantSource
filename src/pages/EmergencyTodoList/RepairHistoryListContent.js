import React, { Component } from 'react';
import {
    Card,
    Row,
    Col,
    Table,
    Form,
    Spin,
    Tag
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import RangePicker_ from '../../components/PointDetail/RangePicker_';
import styles from './RepairHistoryListContent.less';

@connect(({ maintenancelist, loading }) => ({
    loading: loading.effects['maintenancelist/GetRepairHistoryList'],
    HistoryRepairHistoryRecods: maintenancelist.RepairHistoryList,
    HistoryRepairHistoryRecodsCount: maintenancelist.total,
    pageIndex: maintenancelist.pageIndex,
    pageSize: maintenancelist.pageSize,
    beginTime:maintenancelist.beginTime, //开始时间
    endTime:maintenancelist.endTime, //结束时间
    DGIMN:maintenancelist.DGIMN
}))
/*
页面：维修历史记录
*/
class RepairHistoryListContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rangeDate: [moment(moment(new Date()).subtract(3, 'month').format('YYYY-MM-DD 00:00:00')), moment(moment(new Date()).format('YYYY-MM-DD 23:59:59'))], // 最近七天
        };
    }

    componentDidMount() {
        const condition={
            pageIndex: 1,
            pageSize: 10,
            beginTime:moment().subtract(3, 'month').format('YYYY-MM-DD 00:00:00'), //运维大事记开始时间
            endTime:moment().format('YYYY-MM-DD 23:59:59'), //运维大事记结束时间
            DGIMN: this.props.pointcode
        };
        this.ChangeModelState(condition);
        // if(this.props.operation!=="menu/intelligentOperation"){
            this.GetHistoryRecord();
        // }
    }

    GetHistoryRecord = () => {
        this.props.dispatch({
            type: 'maintenancelist/GetRepairHistoryList',
            payload: {
            }
        });
    };

    _handleDateChange = (date, dateString) => {
        const condition={
            beginTime: date[0].format("YYYY-MM-DD HH:mm:ss"),
            endTime: date[1].format("YYYY-MM-DD HH:mm:ss"),
            pageIndex:1
        };
        this.ChangeModelState(condition);
        this.setState(
            {
                rangeDate: date
            }
        );
        this.GetHistoryRecord();
    };

    onShowSizeChange = (pageIndex, pageSize) => {
        const condition={
            pageIndex,
            pageSize
        };
        this.ChangeModelState(condition);
        this.GetHistoryRecord();
    }

    onChange = (pageIndex, pageSize) => {
        const condition={
            pageIndex,
            pageSize
        };
        this.ChangeModelState(condition);
        this.GetHistoryRecord();
    }

    seeDetail = (record) => {
        if(this.props.operation===undefined){
            this.props.dispatch(routerRedux.push(`/PatrolForm/RepairRecord/${this.props.DGIMN}/${this.props.viewtype}/operationlist/RepairHistoryList/${record.TaskID}`));
        }else{
            this.props.dispatch(routerRedux.push(`/PatrolForm/RepairRecord/${this.props.DGIMN}/${this.props.operation}/RepairHistoryList/${record.TaskID}`));
        }
        
    }

    ChangeModelState=(condition)=>{
        this.props.dispatch({
            type: 'maintenancelist/updateState',
            payload: {...condition}
        });
    }

    render() {
        const dataSource = this.props.HistoryRepairHistoryRecods === null ? null : this.props.HistoryRepairHistoryRecods;
        const columns = [{
            title: '运维人',
            width: '20%',
            dataIndex: 'CreateUserID',
            key: 'CreateUserID'
        }, {
            title: '维修项目',
            width: '45%',
            dataIndex: 'RecordItem',
            key: 'RecordItem',
            render: (text, record) => {
                if (text !== undefined) {
                    let content = text.split(',');
                    var resu = [];
                    content.map((item, key) => {
                        resu.push(
                            <Tag key={key} style={{ marginBottom: 1.5, marginTop: 1.5 }} color="#108ee9">{item}</Tag>
                        );
                    });
                }

                return resu;
            }
        }, {
            title: '记录时间',
            dataIndex: 'CreateTime',
            width: '20%',
            key: 'CreateTime',
            sorter: (a, b) => Date.parse(a.CreateTime) - Date.parse(b.CreateTime),
        }, {
            title: '详细',
            dataIndex: 'TaskID',
            width: '15%',
            key: 'TaskID',
            render: (text, record) => <a onClick={
                    () => this.seeDetail(record)
                } > 详细 </a>
        }];
        if (this.props.loading) {
            return (<Spin
                style={{
                    width: '100%',
                    height: 'calc(100vh/2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                size="large"
            />);
        }
        return (
            <div className={styles.cardTitle}>
                <Card bordered={false}>
                    <div className={styles.conditionDiv}>
                        <Row gutter={8}>
                            <Col span={3}>
                                <label className={styles.conditionLabel}>记录时间：</label>
                            </Col>
                            <Col span={21}>
                                <RangePicker_ style={{ width: 350 }} onChange={this._handleDateChange} format="YYYY-MM-DD" dateValue={this.state.rangeDate} />
                            </Col>

                        </Row>
                    </div>
                    <Table
                        rowKey={(record, index) => `complete${index}`}
                        size="middle"
                        scroll={{ y: this.props.height }}
                        loading={this.props.loading}
                        className={styles.dataTable}
                        columns={columns}
                        dataSource={dataSource}
                        rowClassName={
                            (record, index) => {
                                if (index === 0) {
                                    return;
                                }
                                if (index % 2 !== 0) {
                                    return 'light';
                                }
                            }
                        }
                        pagination={{
                            showSizeChanger: true,
                            showQuickJumper: true,
                            'total': this.props.HistoryRepairHistoryRecodsCount,
                            'pageSize': this.props.pageSize,
                            'current': this.props.pageIndex,
                            onChange: this.onChange,
                            onShowSizeChange: this.onShowSizeChange,
                            pageSizeOptions: ['10', '20', '30', '40']
                        }}
                    />
                </Card>
            </div>
        );
    }
}
export default RepairHistoryListContent;