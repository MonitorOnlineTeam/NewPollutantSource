import React, { Component } from 'react'
import { Form, Select, Input, Button, Drawer, Radio, Collapse, Table, Badge, Icon, Divider, Row, Tree, Empty, Col, Tooltip, Card } from 'antd';
import { connect } from 'dva';
import Center from '@/pages/account/center';
import RangePicker_ from '@/components/RangePicker'
import moment from 'moment';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';

const { Option } = Select;

@connect(({ operationform, loading }) => ({
    RecordTypeTree: operationform.RecordTypeTree,
    RecordTypeTreeLoading: loading.effects['operationform/getrecordtypebymn'],
}))
@Form.create()
class OperationRecord extends Component {
    constructor(props) {
        super(props);
        this.defaultKey = ""
        this.state = {
            rangeDate: [moment(new Date()).add(-3, 'month'), moment(new Date())],
            formats: 'YYYY-MM-DD',
            beginTime: "",
            endTime: "",
            RecordType: "",
            DGIMN: "",
            configName: "",
            search: []
        }
    }

    onTreeChange = (value) => {
        this.props.dispatch({
            type: 'autoForm/getPageConfig',
            payload: {
                configId: this.getRecordType(value)
            }
        })
        this.setState({
            RecordType: value
        })

    }
    onTreeSearch = (val) => {
        console.log('search:', val);
    }
    componentDidMount() {
        // console.log(1231231231231)
        // this.props.dispatch({
        //     type: 'autoForm/getPageConfig',
        //     payload: {
        //         configId: "FormMainInfoCon"
        //     }
        // })
        // this.props.dispatch({
        //     type: 'autoForm/getPageConfig',
        //     payload: {
        //         configId: "FormMainInfoGas"
        //     }
        // })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.DGIMN != nextProps.DGIMN) {
            this.props.dispatch({
                type: 'operationform/getrecordtypebymn',
                payload: {
                    DGIMN: nextProps.DGIMN
                }
            });
            this.setState({
                DGIMN: nextProps.DGIMN,
                PollutantTypeByPoint: nextProps.PollutantType
            })
        }
        if (this.props.RecordTypeTree != nextProps.RecordTypeTree) {
            var key = nextProps.RecordTypeTree.length > 0 ? nextProps.RecordTypeTree[0].key : -1
            this.props.dispatch({
                type: 'autoForm/getPageConfig',
                payload: {
                    configId: this.getRecordType(key)
                }
            })
            this.setState({
                RecordType: key
            })
        }
    }

    getRecordType = (key) => {
        var configid = ''
        var search = []
        if (this.state.PollutantTypeByPoint == "2") {
            switch (key) {
                case 1://维修记录表
                    configid = 'FormMainInfoRepair'
                    break;
                case 2://停机记录表
                    configid = ''
                    break;
                case 3://易耗品更换记录表
                    configid = 'FormMainInfoCon'
                    break;
                case 4://标准气体更换记录表
                    configid = 'FormMainInfoGas'
                    break;
                case 5://完全抽取法CEMS日常巡检记录表
                    configid = 'FormMainInfoPatrol'
                    break;
                case 6://稀释采样法CEMS日常巡检记录表
                    configid = 'FormMainInfoPatrol'
                    break;
                case 7://直接测量法CEMS日常巡检记录表
                    configid = 'FormMainInfoPatrol'
                    break;
                case 8://CEMS零点量程漂移与校准记录表
                    configid = ''
                    break;
                case 9://CEMS校验测试记录
                    configid = 'FormMainInfoTestResult'
                    break;
                case 10://CEMS设备数据异常记录表
                    configid = 'FormMainInfoDeviceExce'
                    break;
            }
        }
        else {
            configid = 'FormMainInfoPic'
        }
        search = [{ "Key": "dbo__T_Bas_Task__DGIMN", "Value": this.state.DGIMN, "Where": "$=" },
        { "Key": "dbo__T_Bas_FormMainInfo__TypeID", "Value": this.state.RecordType, "Where": "$=" },
        { "Key": "dbo__T_Bas_FormMainInfo__CreateTime", "Value": this.state.beginTime, "Where": "$gte" },
        { "Key": "dbo__T_Bas_FormMainInfo__CreateTime", "Value": this.state.endTime, "Where": "$lte" }]
        this.setState({
            configName: configid,
            search
        })
        return configid
    }

    /** 切换时间 */
    _handleDateChange = (date, dateString) => {
        this.setState({
            rangeDate: date,
            beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
            endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
        });
    };

    render() {
        const { RecordTypeTree } = this.props
        return (
            <div >
                <Card
                    extra={
                        <Select
                            style={{ width: 270 }}
                            onChange={this.onTreeChange}
                            onSearch={this.onTreeSearch}
                            value={this.state.RecordType}
                            placeholder="请选择表单类型"
                            loading={this.props.RecordTypeTreeLoading}
                        >
                            {
                                RecordTypeTree.map(option => {
                                    return RecordTypeTree.length ?
                                        <Option key={option.key} value={option.key}>{option.value}</Option> :
                                        ""
                                })
                            }
                        </Select>
                    }
                    title={
                        <Row gutter={7}>
                            <Col span={2}>
                                <span style={{ display: 'block', marginTop: 7, fontSize: 14 }}>记录时间：</span>
                            </Col>
                            <Col span={2}>
                                <RangePicker_ style={{ width: 350, textAlign: 'left', marginRight: 10, }} dateValue={this.state.rangeDate} allowClear={false} format={this.state.formats} onChange={this._handleDateChange} />
                            </Col>
                        </Row>
                    }
                >
                    <Card.Grid style={{ width: '100%', height: 'calc(100vh - 230px)', overflow: "auto", ...this.props.style, }}>
                        <AutoFormTable
                            configId={this.state.configName}
                            rowChange={(key, row) => {
                                this.setState({
                                    key, row
                                })
                            }}
                            appendHandleRows={row => {
                                return <Tooltip title="详情">
                                    <a onClick={() => {
                                        console.log('row',row)
                                    }}><Icon type="profile" style={{ fontSize: 16 }} /></ a>
                                </Tooltip>

                            }}
                            searchParams={this.state.search}
                            {...this.props}
                        // searchParams={[
                        //   {
                        //     Key: "test",
                        //     Value: false,
                        //     Where: "$like"
                        //   }
                        // ]}
                        ></AutoFormTable>

                    </Card.Grid>
                </Card>
            </div>
        );
    }
}

export default OperationRecord

