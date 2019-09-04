import React, { Component } from 'react'
import { Form, Select, Input, Button, Drawer, Radio, Collapse, Table, Badge, Icon, Divider, Row, Tree, Empty, Col, Tooltip, Card, Tag } from 'antd';
import { connect } from 'dva';
import Center from '@/pages/account/center';
import RangePicker_ from '@/components/RangePicker'
import moment from 'moment';
import { router } from 'umi'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import BdTestRecordContent from '@/pages/EmergencyTodoList/BdTestRecordContent'
import SDLTable from '@/components/SdlTable'
import { routerRedux } from 'dva/router';
import ViewImagesModal from '@/pages/operations/components/ViewImagesModal'

const { Option } = Select;

@connect(({ operationform, loading }) => ({
    RecordTypeTree: operationform.RecordTypeTree,
    RecordTypeTreeLoading: loading.effects['operationform/getrecordtypebymn'],
    JZDatas: operationform.JZDatas,
    rangDate: operationform.rangDate,
    RecordType: operationform.RecordType,
    PollutantTypes: operationform.PollutantTypes
}))
@Form.create()
class OperationRecord extends Component {
    constructor(props) {
        super(props);
        this.defaultKey = ""
        this.state = {
            rangeDate: [moment(new Date()).add(-3, 'month'), moment(new Date())],
            formats: 'YYYY-MM-DD',
            BeginTime: "",
            EndTime: "",
            RecordType: "",
            DGIMN: "",
            configName: "",
            PollutantTypeByPoint: '',
            search: [],
            columns: [
                {
                    title: '运维人',
                    dataIndex: 'CreateUserID',
                    key: 'CreateUserID',
                },
                {
                    title: '分析仪校准是否正常',
                    dataIndex: 'Content',
                    key: 'Content',
                    render: (text, record) => {
                        var item = record.Content.split('),')
                        var itemlist = []
                        item.map((m, index) =>
                            itemlist.push(<Tag>{m + (index != item.length - 1 ? ')' : '')}</Tag>)
                        )
                        return itemlist
                    }
                },
                {
                    title: '记录时间',
                    dataIndex: 'CreateTime',
                    key: 'CreateTime',
                },
                {
                    title: '操作',
                    dataIndex: 'TaskID',
                    key: 'TaskID',
                    render: (text, record) => {
                        return <Tooltip title="详情">
                            <a onClick={() => {
                                router.push('/operations/recordForm/' + record.TypeID + '/' + record.TaskID)
                            }}><Icon type="profile" style={{ fontSize: 16 }} /></ a>
                        </Tooltip>
                    }
                },
            ]
        }
    }

    onTreeChange = (value) => {
        this.props.dispatch({
            type: 'autoForm/getPageConfig',
            payload: {
                configId: this.getRecordType(value)
            }
        })
        this.props.dispatch({
            type: "operationform/updateState",
            payload: {
                RecordType: value
            }
        })
        console.log('props', this.props)
        this.setState({
            RecordType: value
        })
        if (value == '8') {
            this.props.dispatch({
                type: 'operationform/getjzhistoryinfo',
                payload: {
                    DGIMN: this.props.DGIMN,
                    BeginTime: this.props.BeginTime,
                    EndTime: this.props.EndTime
                }
            })
        }
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
            if (this.props.PollutantTypes != nextProps.PollutantType) {
                this.props.dispatch({
                    type: "operationform/updateState",
                    payload: {
                        RecordType: '',
                        PollutantTypes: nextProps.PollutantType
                    }
                })
            }
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
            if (this.props.RecordType == '') {
                this.props.dispatch({
                    type: "operationform/updateState",
                    payload: {
                        RecordType: key,
                    }
                })
            }
        }
    }

    getRecordType = (key) => {
        var configid = ''
        var type = this.state.PollutantTypeByPoint || this.props.PollutantTypes
        // debugger
        if (type == "2") {
            switch (key) {
                case 1://维修记录表
                    configid = 'FormMainInfoRepair'
                    break;
                case 2://停机记录表
                    configid = 'FormMainInfoStop'
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
        this.setState({
            configName: configid,
        })
        return configid
    }

    /** 切换时间 */
    _handleDateChange = (date, dateString) => {
        this.setState({
            rangeDate: date,
            BeginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
            EndTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
        });
        this.props.dispatch({
            type: "operationform/updateState",
            payload: {
                rangDate: date,
                BeginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
                EndTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
            }
        })
        if (this.props.RecordType == '8') {
            this.props.dispatch({
                type: 'operationform/getjzhistoryinfo',
                payload: {
                    DGIMN: this.state.DGIMN,
                    BeginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
                    EndTime: date[1].format('YYYY-MM-DD HH:mm:ss')
                }
            })
        }
    };

    render() {
        const { RecordTypeTree } = this.props
        const { columns } = this.state
        return (
            <div >
                <Card
                    extra={
                        <Select
                            style={{ width: 270 }}
                            onChange={this.onTreeChange}
                            onSearch={this.onTreeSearch}
                            value={this.props.RecordType}
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
                                <RangePicker_ style={{ width: 350, textAlign: 'left', marginRight: 10, }} dateValue={this.props.rangDate} allowClear={false} format={this.state.formats} onChange={this._handleDateChange} />
                            </Col>
                        </Row>
                    }
                >
                    <Card.Grid style={{ width: '100%', height: 'calc(100vh - 270px)', overflow: "auto", ...this.props.style, }}>
                        {console.log('state=', this.state)}
                        {this.props.RecordType == '8' ?
                            <SDLTable
                                dataSource={this.props.JZDatas}
                                columns={columns}
                            >

                            </SDLTable>
                            :
                            (this.state.configName ? <AutoFormTable
                                configId={this.state.configName}
                                rowChange={(key, row) => {
                                    this.setState({
                                        key, row
                                    })
                                }}
                                appendHandleRows={row => {
                                    return <Tooltip title="详情">
                                        <a onClick={() => {
                                            if (this.state.PollutantTypeByPoint == "2") {
                                                router.push('/operations/recordForm/' + this.props.RecordType + '/' + row['dbo.T_Bas_Task.ID'])
                                            } else {
                                                // 获取详情图片
                                                this.props.dispatch({
                                                    type: "common/getOperationImageList",
                                                    payload: {
                                                        FormMainID: row['dbo.T_Bas_RecordFormPic.FormMainID']
                                                        // FormMainID:"c521b4a0-5b67-45a8-9ad1-d6ca67bdadda"
                                                    },
                                                    callback: (res) => {
                                                        this.setState({
                                                            visible: true
                                                        })
                                                    }
                                                })
                                            }
                                        }}><Icon type="profile" style={{ fontSize: 16 }} /></ a>
                                    </Tooltip>
                                }}
                                searchParams={[{ "Key": "dbo__T_Bas_Task__DGIMN", "Value": this.state.DGIMN || this.props.DGIMN, "Where": "$=" },
                                { "Key": "dbo__T_Bas_FormMainInfo__TypeID", "Value": this.props.RecordType, "Where": "$=" },
                                { "Key": "dbo__T_Bas_FormMainInfo__CreateTime", "Value": this.state.BeginTime, "Where": "$gte" },
                                { "Key": "dbo__T_Bas_FormMainInfo__CreateTime", "Value": this.state.EndTime, "Where": "$lte" }
                                ]}
                                {...this.props}
                            ></AutoFormTable> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />)}
                        {this.state.visible && <ViewImagesModal />}
                        {/* <BdTestRecordContent TaskID="1f22ede2-68a0-4594-a93b-a5f706fe6662" /> */}
                    </Card.Grid>
                </Card>
            </div>
        );
    }
}

export default OperationRecord

