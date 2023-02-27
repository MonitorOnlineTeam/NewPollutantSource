/**
 * 功  能：AutoForm数据源配置-添加字段
 * 创建人：靳雯娟
 * 创建时间：2020.11.13
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { message, Button, Modal, Select, Table } from 'antd';
import { routerRedux } from 'dva/router';
import { Form } from '@ant-design/compatible';


const { confirm } = Modal;
const FormItem = Form.Item;
const pageUrl = {
    GetNotinCfgField: 'fieldConfigModel/GetAddfieldData',
    SavefieldData: 'fieldConfigModel/SavefieldData'

};

@connect(({ loading, fieldConfigModel }) => ({

    tableData: fieldConfigModel.tableData
}))

class DatasourceAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [], // Check here to configure the default column
            loading: false
        };
        // this.windowResize = this.windowResize.bind(this);
    }

    componentDidMount() {
        // this.props.onRef(this)
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
        this.reloadData(1)
    };

    handleOk = e => {
        let { selectedRowKeys } = this.state;
        let { id, dbKey } = this.props;
        let Cfg_Field = [];
        if (selectedRowKeys && selectedRowKeys.length > 0) {
            selectedRowKeys.forEach(item => {
                Cfg_Field.push({
                    DF_NAME: item
                })
            })
            //console.log(Cfg_Field)
            this.props.dispatch({
                type: pageUrl.SavefieldData,
                payload: {
                    id: this.props.id,
                    //dbKey: this.props.dbKey,
                    tableName: this.props.tableName,
                    Cfg_Field: Cfg_Field
                }
            }).then(e => {
                this.props.FieldReloadData(1, id, dbKey);   //引用父组件的这个方法，在点保存时更新字段配置页面列表，使弹框保存的数据在页面列表上自动显示出来
                this.setState({
                    visible: false,
                    selectedRowKeys: []
                })
            });

        }

    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
        //this.props.form.resetFields();
    };

    //更新查询条件
    updateState = (payload) => {
        this.props.dispatch({
            type: pageUrl.updateState,
            payload: payload,
        });
    }

    onSelectChange = selectedRowKeys => {
        //console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    // 加载数据用于打开弹框时显示的列表信息
    reloadData = () => {
        this.props.dispatch({
            type: pageUrl.GetNotinCfgField,
            payload: {
                //pageIndex,
                id: this.props.id,
                dbKey: this.props.dbKey,
                tableName: this.props.tableName
            }
        });
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 12 },
                sm: { span: 12 },
            },
            wrapperCol: {
                xs: { span: 12 },
                sm: { span: 12 },
            },
        };
        const addTitle = '增加字段';
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        let columns = [
            {
                title: '字段名',
                dataIndex: 'DF_NAME',
                width: '45%',
                align: 'center',
                editable: true,
            },
            {
                title: '显示名称',
                dataIndex: 'DF_NAME_CN',
                width: '45%',
                align: 'center',
                editable: true,
            },
        ];
        //测试数据需删除
        //  let TableDatas=[{
        //     fieldname:'测试',
        //     displayname:'加油'

        // }]
        let { tableData, tableName } = this.props;  //后期从接口数据
        return (
            <>
                <Button type="primary" onClick={this.showModal} disabled={tableName != '' ? false : true}> 增加字段</Button>
                <Modal
                    // bodyStyle={{height:300}}
                    width={800}
                    centered={true}
                    title={addTitle}
                    className='addTitle'
                    classTitle='addTitle'
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    isCardHeight={true}
                    footer={[]}
                >
                    <Button key="submit" type="primary" disabled={!hasSelected} loading={this.state.loading} onClick={this.handleOk} style={{ marginBottom: 10 }}>
                        确定保存
                    </Button>
                    {/* <Button key="back" type="dashed"  onClick={this.handleCancel} style={{marginBottom:10}}>
                    关闭
                </Button> */}
                    <Table
                        bordered
                        columns={columns}
                        dataSource={tableData} //需要恢复
                        //dataSource={TableDatas} //测试数据待删除
                        rowSelection={rowSelection}
                        loading={this.props.loading}
                        // rowClassName="editable-row"
                        rowKey={
                            (record, index) => record.DF_NAME
                        }
                    // pagination={{
                    //     showSizeChanger: true,
                    //     showQuickJumper: true,
                    //     sorter: true,
                    //     size:"small",
                    //     'total': this.props.total,
                    //     'pageSize': this.props.pageSize,
                    //     'current': this.props.pageIndex,
                    //     pageSizeOptions: ['30', '45', '60', '75', '90']
                    // }}
                    />

                </Modal>
            </>
        );
    }
}
export default Form.create()(DatasourceAdd);
