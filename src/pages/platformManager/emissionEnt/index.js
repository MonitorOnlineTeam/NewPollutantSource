/*
 * @Author: xpy
 * @Date: 2020-06-28 15:21:22
 * @desc: 任务记录页面
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button, Tooltip, Popconfirm, Icon, Divider, Modal, Form, Select, Input, Row, Spin, Col, Tag, Badge, TimePicker, Transfer, Switch, Table, message } from 'antd';
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
    updateState: 'emissionEnt/updateState',
    getData: 'emissionEnt/getTransmissionEfficiencyForRegion',
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
    },
    {
        dataIndex: 'PointName',
        title: '监测点名称',
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
    },
    {
        dataIndex: 'PointName',
        title: '监测点名称',
    },
];

@connect(({ loading, emissionEnt, autoForm }) => ({
    RegionCode: emissionEnt.RegionCode,
    regionList: autoForm.regionList,
    pollutantType: emissionEnt.pollutantType,
    priseList: emissionEnt.priseList,
    queryPar: emissionEnt.qutletQueryPar,
    entData: emissionEnt.entData,
    entDataTotal: emissionEnt.entDataTotal,
    pageSize: emissionEnt.pageSize,
    pageIndex: emissionEnt.pageIndex,
    AssessYear: emissionEnt.AssessYear,
    AssessYearStr: emissionEnt.AssessYearStr,
    loading: loading.effects['emissionEnt/GetEmissionEntList'],
    noSelectEnt: emissionEnt.noSelectEnt,
    selectEnt: emissionEnt.selectEnt
}))
@Form.create()
class emissionEnt extends Component {
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
            configId: 'emissionEnt',

        }
    }

    componentDidMount() {

        // this.getTableData();
        this.props.dispatch({
            type: 'autoForm/getRegions',
            payload: {
                RegionCode: '',
                PointMark: '2',
            },
        });
        this.getEntData();
    }

    onChangeTranTable = nextTargetKeys => {
        this.updateState({ selectEnt: nextTargetKeys });
    };

    addEntAndPoint = () => {

        var selectData = this.props.noSelectEnt.filter(item => this.props.selectEnt.includes(item.key));
        this.props.dispatch({
            type: 'emissionEnt/AddEmissionEnt',
            payload: {
                EmissionEntList: selectData,
                // AssessYear: this.props.AssessYearStr
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
            type: 'emissionEnt/GetEmissionEntList',
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
            type: 'emissionEnt/getEntByRegion',
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
            type: 'emissionEnt/DeleteEmissionEntByID',
            payload: {
                ID: ID
            }
        })
    }
    IsEnabled = (type, ID) => {
        this.props.dispatch({
            type: 'emissionEnt/updateEntFlag',
            payload: {
                ID:ID,
                EntFlag:type
            },
        });
    };
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
                width: '15%',
                align: 'center',
            },
            {
                title: '企业名称',
                dataIndex: 'EntName',
                key: 'EntName',
                width: '30%',
            },
            {
                title: '监测点名称',
                dataIndex: 'PointName',
                key: 'PointName',
                width: '30%',
            },
            {
                title: '参与企业整体排放量计算标识',
                dataIndex: 'EntFlag',
                key: 'EntFlag',
                width: '15%',
                render: (text, record, index) => {
                    if (text === 0) {
                        return (
                            <span>
                                <Button size="small" type="dashed">
                                    <a
                                        title="单击设置为参与"
                                        style={{ color: '#D1D1D1' }}
                                        onClick={() => this.IsEnabled(1, record.ID)}
                                    >
                                        <Icon type="exclamation-circle" /> 不参与
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
                                <a title="单击设置为不参与" onClick={() => this.IsEnabled(0, record.ID)}>
                                    <Icon type="setting" spin={true} /> 参与
                </a>
                            </Button>
                        </span>
                    );
                }
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                width: '10%',
                align: 'center',
                render: (text, record, index) => {
                    const TaskID = record.ID;
                    return <Tooltip title="删除"><Popconfirm
                        title="确定删除吗?"
                        onConfirm={() => this.confirm(TaskID)}
                        onCancel={this.cancel}
                        okText="是"
                        cancelText="否"
                    >
                        <a><Icon type="delete" /></a>
                    </Popconfirm>
                    </Tooltip>

                }
            },
        ];
        return (
            <BreadcrumbWrapper>
                <Card className="contentContainer">
                    <Form layout="inline" style={{ marginBottom: '10' }}>
                        <Row >
                            <Col md={4} sm={24}>
                                <FormItem label="行政区" style={{ width: '100%' }}>
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
                            </Col>
                            <Col md={4} sm={24}>
                                <FormItem label="企业类型" style={{ width: '100%' }}>
                                    <Select
                                        allowClear
                                        placeholder="请选择企业类型"
                                        onChange={this.typeChange}
                                        value={this.props.pollutantType}
                                        style={{ width: 200, marginLeft: 10 }}
                                    >
                                        <Option value="1">废水</Option>
                                        <Option value="2">废气</Option>
                                    </Select>
                                </FormItem>
                            </Col>
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
                            <Button type="primary" style={{ marginLeft: 10 }} onClick={() => {
                                this.getEntData()
                            }}>查询</Button>
                            <Button type="primary" style={{ marginLeft: 10 }} onClick={() => {
                                this.props.dispatch({
                                    type: 'emissionEnt/GetEmissionEntAndPoint',
                                    payload: {
                                    }
                                })
                                this.setState({
                                    visible: true,
                                })
                            }}>添加</Button>
                            {/* <Button type="primary" style={{ marginLeft: 10 }} onClick={() => {
                                this.props.dispatch({
                                    type: 'emissionEnt/ExportAnnualAssessmentEnt',
                                    payload: {
                                    }
                                })
                            }}>导出</Button> */}
                            <Button style={{ marginLeft: 10 }} onClick={() => {
                                this.props.dispatch({
                                    type: 'emissionEnt/ExportEmissionEnt',
                                    payload: {
                                    }
                                })
                            }}><Icon type="export" />导出</Button>
                        </Row>
                            <span style={{ color: 'red', fontSize: 12 }}>设置参与排放量计算的监测点名单</span>
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
                    title={'添加监测点'}
                    visible={this.state.visible}
                    width={1600}
                    destroyOnClose
                    //   confirmLoading={loading}
                    onOk={this.addEntAndPoint}
                    onCancel={() => {
                        this.setState({ visible: false })
                    }}
                >
                    <TableTransfer
                        rowKey={record => record.key}
                        titles={['待选企业监测点', '参与排放量计算的监测点']}
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

export default emissionEnt;
