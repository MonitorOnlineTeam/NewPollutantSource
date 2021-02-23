/*
 * @Author: xpy
 * @Date: 2020-06-28 15:21:22
 * @desc: 任务记录页面
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
    Card,
    Button,
    Tooltip,
    Popconfirm,
    Divider,
    Modal,
    Select,
    Input,
    Row,
    Spin,
    Col,
    Tag,
    Badge,
    TimePicker,
    Transfer,
    Switch,
    Table,
    message,
} from 'antd';
import difference from 'lodash/difference';
import moment from 'moment';
import Cookie from 'js-cookie';
import { routerRedux } from 'dva/router';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import CascaderMultiple from '@/components/CascaderMultiple'
import SearchSelect from '@/pages/AutoFormManager/SearchSelect';
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import SdlTable from '@/components/SdlTable'
import YearPicker from '@/components/YearPicker'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const pageUrl = {
    updateState: 'yearCheckEnt/updateState',
    getData: 'yearCheckEnt/getTransmissionEfficiencyForRegion',
};
const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
    <Transfer {...restProps} showSelectAll={false}>
        {({
            direction,
            filteredItems,
            onItemSelectAll,
            onItemSelect,
            selectedKeys: listSelectedKeys,
            disabled: listDisabled,
        }) => {
            const columns = direction === 'left' ? leftColumns : rightColumns;

            const rowSelection = {
                getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
                onSelectAll(selected, selectedRows) {
                    const treeSelectedKeys = selectedRows
                        .filter(item => !item.disabled)
                        .map(({ key }) => key);
                    const diffKeys = selected
                        ? difference(treeSelectedKeys, listSelectedKeys)
                        : difference(listSelectedKeys, treeSelectedKeys);
                    onItemSelectAll(diffKeys, selected);
                },
                onSelect({ key }, selected) {
                    onItemSelect(key, selected);
                },
                selectedRowKeys: listSelectedKeys,
            };

            return (
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={filteredItems}
                    size="small"
                    style={{ pointerEvents: listDisabled ? 'none' : null }}
                    onRow={({ key, disabled: itemDisabled }) => ({
                        onClick: () => {
                            if (itemDisabled || listDisabled) return;
                            onItemSelect(key, !listSelectedKeys.includes(key));
                        },
                    })}
                />
            );
        }}
    </Transfer>
);
const leftTableColumns = [
    {
        dataIndex: 'RegionName',
        title: '行政区',
    },
    {
        dataIndex: 'EntName',
        title: '企业名称',
        render: (text, record, index) => {
            if(text.length>10)
            {
                return text.substr(0,10)+'...';
            }else
            {
                return text;
            }
        }
    },
    {
        dataIndex: 'PointName',
        title: '监测点名称',
        render: (text, record, index) => {
            if (text.length > 10) {
                return text.substr(0, 10) + '...';
            } else {
                return text;
            }
        }
    },
    {
        dataIndex: 'PollutantType',
        title: '监测点类型',
        render: (text, record, index) => {
            var str = ''
            switch (text) {
                case '1':
                    str = '废水';
                    break;
                case '2':
                    str = '废气';
                    break;
            }
            return str;
        }
    },
];
const rightTableColumns = [
    {
        dataIndex: 'RegionName',
        title: '行政区',
    },
    {
        dataIndex: 'EntName',
        title: '企业名称',
        render: (text, record, index) => {
            if(text.length>10)
            {
                return text.substr(0,10)+'...';
            }else
            {
                return text;
            }
        }
    },
    {
        dataIndex: 'PointName',
        title: '监测点名称',
        render: (text, record, index) => {
            if (text.length > 10) {
                return text.substr(0, 10) + '...';
            } else {
                return text;
            }
        }
    },
    {
        dataIndex: 'PollutantType',
        title: '监测点类型',
        render: (text, record, index) => {
            var str = ''
            switch (text) {
                case '1':
                    str = '废水';
                    break;
                case '2':
                    str = '废气';
                    break;
            }
            return str;
        }
    },
    
];

@connect(({ loading, yearCheckEnt, autoForm }) => ({
    RegionCode: yearCheckEnt.RegionCode,
    regionList: autoForm.regionList,
    pollutantType: yearCheckEnt.pollutantType,
    priseList: yearCheckEnt.priseList,
    queryPar: yearCheckEnt.qutletQueryPar,
    entData: yearCheckEnt.entData,
    entDataTotal: yearCheckEnt.entDataTotal,
    pageSize: yearCheckEnt.pageSize,
    pageIndex: yearCheckEnt.pageIndex,
    AssessYear: yearCheckEnt.AssessYear,
    AssessYearStr: yearCheckEnt.AssessYearStr,
    loading: loading.effects['yearCheckEnt/GetAnnualAssessmentEntList'],
    noSelectEnt: yearCheckEnt.noSelectEnt,
    selectEnt: yearCheckEnt.selectEnt
}))
@Form.create()
class yearCheckEnt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //  EntCode:null,
            // AssessYear: null,
            // targetKeys: this.props.selectEnt,
            disabled: false,
            showSearch: false,
            selectData: [],
        };
        this._SELF_ = {
            configId: 'yearCheckEnt',

        }
    }

    componentDidMount() {

        this.getTableData();
        this.props.dispatch({
            type: 'autoForm/getRegions',
            payload: {
                RegionCode: '',
                PointMark: '2',
            },
        });
        this.getEntData();
        this.initData('');
    }

    onChangeTranTable = nextTargetKeys => {
        this.updateState({ selectEnt: nextTargetKeys });
    };

    addEntAndPoint = () => {

        var selectData = this.props.noSelectEnt.filter(item => this.props.selectEnt.includes(item.key));
        this.props.dispatch({
            type: 'yearCheckEnt/AddAnnualAssessmentEnt',
            payload: {
                AnnualAssessmentEntList: selectData,
                AssessYear: this.props.AssessYearStr
            }
        })
        this.setState({ visible: false })
    }

    triggerDisable = disabled => {
        this.setState({ disabled });
    };

    triggerShowSearch = showSearch => {
        this.setState({ showSearch });
    };

    getEntData = () => {
        this.props.dispatch({
            type: 'yearCheckEnt/GetAnnualAssessmentEntList',
            payload: {
            },
        })
    }

    initData = (RegionCode) => {
        const { dispatch } = this.props;

        // this.updateQueryState({
        //     RegionCode: RegionCode,
        //     beginTime: beginTime,
        //     endTime: endTime,
        //     PageIndex: 1,
        //     PageSize: 20,
        //     EntCode: '',
        //     PollutantType: '',
        // });

        dispatch({
            //获取企业列表
            type: 'yearCheckEnt/getEntByRegion',
            payload: { RegionCode: RegionCode },
        });

        // setTimeout(() => {
        //     this.getTableData();
        // });
    };

    getTableData = () => {
        this.props.dispatch({
            type: pageUrl.getData,
        });
    };

    onChangePage = (pageIndex, pageSize) => {
        this.updateState({
            pageSize: pageSize,
            pageIndex: pageIndex
        });
        this.getEntData()
    }

    onShowSizeChange = (current, pageSize) => {
        this.updateState({
            pageSize: pageSize,
        });
    }

    changeRegion = value => {
        this.updateState({
            RegionCode: value,
        });
        this.changeEnt('');
        this.initData(value);
    };

    changeEnt = value => {
        console.log('value=', value);
        this.updateQueryState({
            EntCode: value,
        });
    };

    updateState = payload => {
        this.props.dispatch({
            type: pageUrl.updateState,
            payload,
        });
    };

    updateQueryState = payload => {
        const { queryPar, dispatch } = this.props;
        console.log('value1=', queryPar)
        dispatch({
            type: pageUrl.updateState,
            payload: { qutletQueryPar: { ...queryPar, ...payload } },
        });
    };

    delEnt = (ID) => {
        console.log('id', ID)
        this.props.dispatch({
            type: 'yearCheckEnt/DeleteAnnualAssessmentEntByID',
            payload: {
                ID: ID
            }
        })
    }

    typeChange = value => {
        this.updateState({
            pollutantType: value,
        });
    };
    confirm = (TaskID) => {
        this.delEnt(TaskID)
    }
    cancel = (e) => {
        console.log(e);
    }
    children = () => {
        const { regionList } = this.props;

        const selectList = [];
        if (regionList.length > 0) {
            regionList[0].children.map(item => {
                selectList.push(
                    <Option key={item.key} value={item.value}>
                        {item.title}
                    </Option>,
                );
            });
            return selectList;
        }
    };

    entChildren = () => {
        const { priseList } = this.props;

        const selectList = [];
        if (priseList.length > 0) {
            priseList.map(item => {
                selectList.push(
                    <Option key={item.EntCode} value={item.EntCode} title={item.EntName}>
                        {item.EntName}
                    </Option>,
                );
            });
            return selectList;
        }
    };
    render() {
        const { targetKeys, disabled, showSearch } = this.state;
        const {
            exEntloading,
            queryPar: { PollutantType, PageIndex, PageSize, EntCode },
            beginTime,
            endTime,
            entName,
        } = this.props;
        const columns = [
            {
                title: '行政区',
                dataIndex: 'RegionName',
                key: 'RegionName',
                width: '10%',
                align: 'center',
            },
            {
                title: '考核年份',
                dataIndex: 'AssessYear',
                key: 'AssessYear',
                width: '5%',
                align: 'center',
            },
            {
                title: '考核企业名称',
                dataIndex: 'EntName',
                key: 'EntName',
                width: '20%',
            },
            {
                title: '考核监测点名称',
                dataIndex: 'PointName',
                key: 'PointName',
                width: '20%',
            },
            {
                title: '监测点类型',
                dataIndex: 'PollutantType',
                key: 'PollutantType',
                width: '5%',
                render: (text, record, index) => {
                    var str = ''
                    switch (text) {
                        case '1':
                            str = '废水';
                            break;
                        case '2':
                            str = '废气';
                            break;
                    }
                    return str;
                }
            },
            {
                title: '考核开始时间',
                dataIndex: 'BeginTime',
                key: 'BeginTime',
                width: '15%',
                align: 'center',
            },
            {
                title: '考核结束时间',
                dataIndex: 'EndTime',
                key: 'EndTime',
                width: '15%',
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                width: '10%',
                align: 'center',
                render: (text, record, index) => {
                    const TaskID = record.ID;
                    return (
                        <Tooltip title="删除"><Popconfirm
                            title="确定删除吗?"
                            onConfirm={() => this.confirm(TaskID)}
                            onCancel={this.cancel}
                            okText="是"
                            cancelText="否"
                        >
                            <a><DeleteOutlined /></a>
                        </Popconfirm>
                        </Tooltip>
                    );

                }
            },
        ];
        return (
            <BreadcrumbWrapper>
                <Card className="contentContainer">
                    <Form layout="inline" style={{ marginBottom: '10' }}>
                        <Row >
                                <FormItem label="考核年份" >
                                    <YearPicker
                                        allowClear={false}
                                        // style={{ width: '100%' }}
                                        // defaultValue={moment()}
                                        value={this.props.AssessYear}
                                        _onPanelChange={v => {
                                            this.updateState({
                                                AssessYear: moment(v),
                                                AssessYearStr: moment(v).format('YYYY')
                                            })
                                            // this.props.form.setFieldsValue({ ReportTime: v });
                                        }}
                                    />
                                </FormItem>
                                <FormItem label="行政区" >
                                    <Select
                                        allowClear
                                        placeholder="请选择行政区"
                                        onChange={this.changeRegion}
                                        value={this.props.RegionCode ? this.props.RegionCode : undefined}
                                        style={{ width: 200, marginLeft: 10 }}
                                    >
                                        {this.children()}
                                    </Select>
                                </FormItem>
                                <FormItem label="监测点类型" >
                                    <Select
                                        allowClear
                                        placeholder="请选择监测点类型"
                                        onChange={this.typeChange}
                                        value={this.props.pollutantType}
                                        style={{ width: 200, marginLeft: 10 }}
                                    >
                                        <Option value="1">废水</Option>
                                        <Option value="2">废气</Option>
                                    </Select>
                                </FormItem>

                        </Row>
                        <Row style={{ marginTop: 10, marginBottom: 10 }}>
                            <FormItem label="企业列表" >
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    allowClear
                                    placeholder="企业列表"
                                    onChange={this.changeEnt}
                                    value={EntCode ? EntCode : undefined}
                                    style={{ width: 177 }}
                                >
                                    {this.entChildren()}
                                </Select>
                            </FormItem>
                            <Button type="primary" style={{ marginLeft: 46 }} onClick={() => {
                                this.getEntData()
                            }}>查询</Button>
                            <Button type="primary" style={{ marginLeft: 10 }} onClick={() => {
                                if (this.props.AssessYear == null) {
                                    message.error("请选择考核年份")
                                } else {
                                    this.props.dispatch({
                                        type: 'yearCheckEnt/GetAnnualAssessmentEntAndPoint',
                                        payload: {
                                        }
                                    })
                                    this.setState({
                                        visible: true,
                                    })
                                }

                            }}>添加</Button>
                            {/* <Button type="primary" style={{ marginLeft: 10 }} onClick={() => {
                                this.props.dispatch({
                                    type: 'yearCheckEnt/ExportAnnualAssessmentEnt',
                                    payload: {
                                    }
                                })
                            }}>导出</Button> */}
                            <Button style={{ marginLeft: 10 }} onClick={() => {
                                this.props.dispatch({
                                    type: 'yearCheckEnt/ExportAnnualAssessmentEnt',
                                    payload: {
                                        
                                    }
                                })
                            }}><ExportOutlined />导出</Button>
                             <span style={{color:'red',marginLeft:20,fontSize:12}}>设置年度参与国家有效传输率考核的企业监测点名单</span>
                        </Row>
                    </Form>
                    <SdlTable
                        loading={this.props.loading}
                        dataSource={this.props.entData}
                        pagination={{
                            showSizeChanger: true,
                            showQuickJumper: true,
                            pageSize: this.props.pageSize,
                            current: this.props.pageIndex,
                            onChange: this.onChangePage,
                            onShowSizeChange: this.onShowSizeChange,
                            total: this.props.entDataTotal,
                        }}
                        columns={columns}
                    />
                </Card>
                <Modal
                    title={'添加考核企业监测点-' + this.props.AssessYearStr + '年'}
                    visible={this.state.visible}
                    width={1200}
                    destroyOnClose
                    //   confirmLoading={loading}
                    onOk={this.addEntAndPoint}
                    onCancel={() => {
                        this.setState({ visible: false })
                    }}
                >
                    <TableTransfer
                        rowKey={record => record.key}
                        titles={['待选企业监测点', '参与考核企业监测点']}
                        dataSource={this.props.noSelectEnt}
                        targetKeys={this.props.selectEnt}
                        disabled={false}
                        showSearch={true}
                        onChange={this.onChangeTranTable}
                        filterOption={(inputValue, item) =>
                            item.EntName.indexOf(inputValue) !== -1 
                        }
                        leftColumns={leftTableColumns}
                        rightColumns={rightTableColumns}
                        style={{ width: '100%', height: '600px' }}
                    />
                </Modal>
            </BreadcrumbWrapper>
        );
    }
}

export default yearCheckEnt;
