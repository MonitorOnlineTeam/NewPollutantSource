import React, { Component, Fragment } from 'react';
import { DownOutlined, ExportOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
    Button,
    Table,
    Select,
    Card,
    Row,
    Col,
    Upload,
    message,
    Modal,
    Divider,
    Tabs,
    Input,
    Tag,
    Tooltip,
    Spin,
    Radio,
    Menu,
    Dropdown,
} from 'antd';
import { connect } from 'dva';
import styles from './Index.less';
import { downloadFile } from '@/utils/utils';
import SdlTable from '@/components/SdlTable'
import config from '@/config'
import cuid from 'cuid';
import Cookie from 'js-cookie';
import UpdateSparepartManage from './UpdateSparepartManage';
import { EditIcon, DelIcon } from '@/utils/icon';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
const confirm = Modal.confirm;
const Option = Select.Option;
const { Search } = Input;
@connect(({ SparepartManage, loading }) => ({
    loading: loading.effects['SparepartManage/GetSparepartManageList'],
    sparepartManageDatalist: SparepartManage.sparepartManageDatalist,
    total: SparepartManage.total,
    sparepartManageParameters: SparepartManage.sparepartManageParameters,
    pageCount: SparepartManage.pageCount,
    storehouseList: SparepartManage.storehouseList,
    monitoringTypeList: SparepartManage.monitoringTypeList,
    confirmLoading: loading.effects['SparepartManage/UpdateSpareParts'],
}))
@Form.create()

/**
 * 功  能：备品备件
 * 创建人：dongxiaoyun
 * 创建时间：2020-5-21
 */

export default class Index extends Component {
    constructor(props) {
        super(props);
        const _this = this;
        this.state = {
            uid: cuid(),
            uploadLoading: false,
            visible: false,
            title: '',
            width: 1000,
        };
    }

    componentDidMount() {
        this.GetSparepartManageList();
        this.GetStorehouse();
        this.GetMonitoringTypeList();
    }
    //创建并获取模板
    Template = () => {
        //获取模板地址
        const { dispatch, sparepartManageParameters } = this.props;
        dispatch({
            type: 'SparepartManage/getUploadTemplate',
            payload: {
                callback: (data) => {
                    downloadFile(data);
                }
            }
        });
    }

    //分页等改变事件
    onChange = (PageIndex, PageSize) => {
        const { dispatch, sparepartManageParameters } = this.props;
        dispatch({
            type: 'SparepartManage/updateState',
            payload: {
                sparepartManageParameters: {
                    ...this.props.sparepartManageParameters,
                    ...{
                        // 判断条件时排序时栓过来的参数有可能为null，再此做修改
                        pageIndex: PageSize ? PageIndex : sparepartManageParameters.pageIndex,
                        pageSize: PageSize ? PageSize : sparepartManageParameters.pageSize,
                    }
                }
            }
        });
        this.GetSparepartManageList();
    }
    //分页等改变事件
    onShowSizeChange = (PageIndex, PageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'SparepartManage/updateState',
            payload: {
                sparepartManageParameters: {
                    ...this.props.sparepartManageParameters,
                    ...{
                        pageIndex: PageIndex,
                        pageSize: PageSize,
                    }
                }
            }
        });
        this.GetSparepartManageList();
    }
    GetSparepartManageList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'SparepartManage/GetSparepartManageList',
            payload: {
            }
        });
    }
    GetStorehouse = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'SparepartManage/GetStorehouse',
            payload: {
            }
        });
    }
    GetMonitoringTypeList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'SparepartManage/GetMonitoringTypeList',
            payload: {
            }
        });
    }

    //上传文件
    upload = () => {
        var that = this;
        const { uid } = this.state;
        const { sparepartManageParameters } = this.props;
        const props = {
            action: '/api/rest/PollutantSourceApi/SparepartManageApi/UploadFileSpareParts',
            onChange(info) {
                that.setState({
                    uploadLoading: true,
                });
                if (info.file.status === 'done') {
                    message.success("导入成功！")
                    that.setState({
                        uploadLoading: false
                    })
                    that.GetSparepartManageList();
                } else if (info.file.status === 'error') {

                    message.error(info.file.response.Message);

                    that.setState({
                        uploadLoading: false
                    })
                }
                that.setState({
                    visible: false,
                })
            },
            multiple: true,
            accept: ".xls,.xlsx",
            showUploadList: false,
            data: {
                FileUuid: uid,
                FileActualType: "0",
                ssoToken: Cookie.get(config.cookieName)
            }
        };
        return (
            <Upload {...props}>
                <ImportOutlined />
                <span style={{ marginLeft: 8 }}>文件导入</span>
            </Upload>
        );
    }
    //导入之前确认框
    uploadConfirm = () => {
        this.setState({
            visible: true,
        })
    }

    //关闭Modal
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
    //添加弹出层
    updateModel = (record) => {
        //修改
        if (record) {
            this.setState({
                visible: true,
                title: '编辑信息',
                width: 1000,
                data: record,
            });
        } else {
            this.setState({
                visible: true,
                title: '添加信息',
                data: null,
            });
        }
    }

    //表单提交
    handleSubmit = (e) => {
        const { dispatch, form } = this.props;
        const { data } = this.state;
        let PollutantCode = '';
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                dispatch({
                    type: 'SparepartManage/UpdateSpareParts',
                    payload: {
                        PartName: values.PartName,
                        Code: values.Code,
                        PartCode: values.PartCode,
                        Unit: values.Unit,
                        EquipmentType: values.EquipmentType,
                        IsUsed: values.IsUsed,
                        Quantity: values.Quantity,
                        SparePartsStationCode: values.SparePartsStationCode,
                        ID: values.ID,
                        callback: () => {
                            this.onCancel();
                            this.GetSparepartManageList();
                        }
                    },
                });
            }
        });
    }
    //取消Model
    onCancel = () => {
        this.setState({
            visible: false
        });
    }
    //删除数据
    DeleteSpareParts = (id) => {
        const { dispatch } = this.props;
        confirm({
            title: '确定要删除吗?',
            okText: '是',
            okType: 'primary',
            cancelText: '否',
            onOk: () => {
                dispatch({
                    type: 'SparepartManage/DeleteSpareParts',
                    payload: {
                        id,
                        callback: (flag) => {
                            if (flag) {
                                message.success("删除成功！");
                                this.GetSparepartManageList();
                            }
                            else {
                                message.error("删除失败！");
                            }

                        }
                    }
                });

            },
            onCancel() {
            },
        });


    }

    //输入编码时的回调
    PartCodeChange = (e) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'SparepartManage/updateState',
            payload: {
                sparepartManageParameters: {
                    ...this.props.sparepartManageParameters,
                    ...{
                        PartCode: e.target.value
                    }
                }
            }
        });
    }
    //备品备件名称回调
    PartNameChange = (e) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'SparepartManage/updateState',
            payload: {
                sparepartManageParameters: {
                    ...this.props.sparepartManageParameters,
                    ...{
                        PartName: e.target.value
                    }
                }
            }
        });
    }
    //备品备件编号回调
    Codechange = (e) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'SparepartManage/updateState',
            payload: {
                sparepartManageParameters: {
                    ...this.props.sparepartManageParameters,
                    ...{
                        Code: e.target.value
                    }
                }
            }
        });
    }
    //服务站回调
    SparePartsStationNameChange = (e) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'SparepartManage/updateState',
            payload: {
                sparepartManageParameters: {
                    ...this.props.sparepartManageParameters,
                    ...{
                        SparePartsStationCode: e.target.value
                    }
                }
            }
        });
    }
    //设备类型回调
    EquipmentTypeChange = (val) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'SparepartManage/updateState',
            payload: {
                sparepartManageParameters: {
                    ...this.props.sparepartManageParameters,
                    ...{
                        EquipmentType: val ? val : ''
                    }
                }
            }
        });
    }
    //仓库管理回调
    storehouseChange = (value) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'SparepartManage/updateState',
            payload: {
                sparepartManageParameters: {
                    ...this.props.sparepartManageParameters,
                    ...{
                        SparePartsStationCode: value ? value : ''
                    }
                }
            }
        });
    }
    //状态回调
    IsUsedChange = (value) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'SparepartManage/updateState',
            payload: {
                sparepartManageParameters: {
                    ...this.props.sparepartManageParameters,
                    ...{
                        IsUsed: value ? value : '',
                    }
                }
            }
        });
    }
    //查询
    changes = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'SparepartManage/updateState',
            payload: {
                sparepartManageParameters: {
                    ...this.props.sparepartManageParameters,
                    ...{
                        pageIndex: 1,
                        pageSize: 20,
                    }
                }
            }
        });
        this.GetSparepartManageList();
    }
    //重置
    resertChanges = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'SparepartManage/updateState',
            payload: {
                sparepartManageParameters: {
                    ...this.props.sparepartManageParameters,
                    ...{
                        PartCode: '',
                        PartName: '',
                        Code: '',
                        SparePartsStationCode: '',
                        EquipmentType: '',
                        IsUsed: '',
                    }
                }
            }
        });
        this.GetSparepartManageList();
    }
    //导入导出下拉菜单
    menuClick = (e) => {
        if (e.key === "item_0") {
            this.Template();
        }
    }
    render() {
        const { sparepartManageDatalist, sparepartManageParameters, pageCount, storehouseList, monitoringTypeList } = this.props;
        const { visible } = this.state;
        const columns = [
            {
                title: '存货编码',
                dataIndex: 'PartCode',
                key: 'PartCode',
                width: 100,
                align: 'center',
            },
            {
                title: '备品备件名称',
                dataIndex: 'PartName',
                key: 'PartName',
                width: 100,
                align: 'center',
            },
            {
                title: '规格型号',
                dataIndex: 'Code',
                key: 'Code',
                width: 100,
                align: 'center',
            },
            // {
            //     title: '库存数量',
            //     dataIndex: 'Quantity',
            //     key: 'Quantity',
            //     width: 100,
            //     align: 'center',
            // },
            {
                title: '单位',
                dataIndex: 'Unit',
                key: 'Unit',
                width: 100,
                align: 'center',
            },

            // {Code: "266", Name: "污染源(气)"}
            // 1: {Code: "267", Name: "大气环境"}
            // 2: {Code: "268", Name: "水环境"}
            // {
            //     title: '设备类型',
            //     dataIndex: 'EquipmentType',
            //     key: 'EquipmentType',
            //     width: 100,
            //     align: 'center',
            //     render: (text, row, index) => {
            // switch (text) {
            //     case '1':
            //         text = "废水";
            //         break;
            //     case '2':
            //         text = "废气";
            //         break;
            //     case '5':
            //         text = "环境质量";
            //         break;
            //     case '10':
            //         text = "VOC";
            //         break;
            //     case '12':
            //         text = "扬尘";
            //         break;
            // }
            // return text;
            //    return monitoringTypeList.map(item=>{
            //         if(item.Code === text){
            //            return item.Name
            //         }
            //     })
            // },
            // },
            // {
            //     title: '服务站',
            //     dataIndex: 'SparePartsStationName',
            //     key: 'SparePartsStationName',
            //     width: 100,
            //     align: 'center',
            //     sorter: (a, b) => a.SparePartsStationName.length - b.SparePartsStationName.length,
            // },
            {
                title: '仓库名称',
                dataIndex: 'SparePartsStationName',
                key: 'SparePartsStationName',
                width: 100,
                align: 'center',
            },
            {
                title: '使用状态',
                dataIndex: 'IsUsed',
                key: 'IsUsed',
                width: 100,
                align: 'center',
                render: (text, row, index) => {
                    switch (text) {
                        case 0:
                            text = <Tag color="error">停用</Tag>
                            break;
                        case 1:
                            text = <Tag color="processing">启用</Tag>
                            break;
                    }
                    return text;
                },
            },
            {
                title: '创建人',
                dataIndex: 'CreateUserName',
                key: 'CreateUserName',
                align: 'center',
            },
            {
                title: '创建时间',
                dataIndex: 'CreateTime',
                key: 'CreateTime',
                align: 'center',
            },
            {
                title: '更新人',
                dataIndex: 'UpdUserName',
                key: 'UpdUserName',
                align: 'center',
            },
            {
                title: '更新时间',
                dataIndex: 'UpdTime',
                key: 'UpdTime',
                align: 'center',
            },
            {
                title: '操作',
                key: 'action',
                width: 100,
                align: 'center',
                fixed:'right',
                render: (text, record, index) => (
                    <span>
                        <Fragment type='edit'>
                            <Tooltip title="编辑">
                                <a onClick={() => {
                                    this.updateModel(record)
                                }}><EditIcon /></a>
                            </Tooltip>
                            {<Divider type="vertical" />}
                        </Fragment>
                        <Fragment>
                            <Tooltip title="删除">
                                <a onClick={() => {
                                    this.DeleteSpareParts(record.ID);
                                }}><DelIcon /> </a>
                            </Tooltip>
                        </Fragment>
                    </span>
                ),
            }
        ];
        return (
            <BreadcrumbWrapper>
                <Card
                    style={{ height: 'calc(100vh - 150px)' }}
                    // extra={
                    //     <Button onClick={() => this.Template()}>
                    //         <Icon type="download" />模板下载
                    //     </Button>
                    // }
                    // title={

                    // }
                    bordered={false}>
                    <div>
                        <Form layout="inline">
                            <Row style={{ paddingBottom: 8 }}>
                                <Form.Item>
                                    <div style={{ minWidth: 70, display: 'inline-block', textAlign: 'right' }}> 编码 ：</div>
                                    <Input placeholder="编码" allowClear={true} style={{ width: 150 }} value={sparepartManageParameters.PartCode} onChange={this.PartCodeChange} />
                                </Form.Item>

                                <Form.Item label='备品备件名称'>
                                    <Input placeholder="备品备件名称" allowClear={true} style={{ width: 150 }} value={sparepartManageParameters.PartName} onChange={this.PartNameChange} />
                                </Form.Item>

                                <Form.Item label='规格型号'>
                                    <Input placeholder="规格型号" allowClear={true} style={{ width: 150 }} value={sparepartManageParameters.Code} onChange={this.Codechange} />
                                </Form.Item>

                                {/* <Form.Item>
                                <Input placeholder="服务站名称" allowClear={true} style={{ width: 150 }} value={sparepartManageParameters.SparePartsStationCode} onChange={this.SparePartsStationNameChange} />
                            </Form.Item> */}

                            </Row>
                            {/* <Form.Item>
                                设备类型：
                            <Select placeholder="设备类型" allowClear style={{ width: 150 }} value={sparepartManageParameters.EquipmentType? sparepartManageParameters.EquipmentType : undefined} onChange={this.EquipmentTypeChange}>
 
                                                                        {
                                      monitoringTypeList[0]&&monitoringTypeList.map(item => {
                                       return <Option key={item.Code} value={item.Code}>{item.Name}</Option>
                                          })
                                           }  
                                </Select>
                            </Form.Item> */}
                            <Form.Item>
                                仓库名称：
                            <Select placeholder="仓库名称"
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    allowClear style={{ width: 150 }} onChange={this.storehouseChange}>
                                    {
                                        storehouseList[0] && storehouseList.map(item => {
                                            return <Option key={item.StorehouseCode} value={item.StorehouseCode}>{item.StorehouseName}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <div style={{ minWidth: 98, display: 'inline-block', textAlign: 'right' }}> 状态 ：</div>
                                <Select placeholder="状态" style={{ width: 150 }} allowClear value={sparepartManageParameters.IsUsed && sparepartManageParameters.IsUsed.toString() ? sparepartManageParameters.IsUsed.toString() : undefined} onChange={this.IsUsedChange}>
                                    <Option value="1">启用</Option>
                                    <Option value="0">停用</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item>
                                <Button onClick={this.changes} type="primary" >查询 </Button>
                            </Form.Item>

                            <Form.Item>
                                <Button onClick={this.resertChanges}
                                >重置
                            </Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div style={{ marginBottom: 16, marginTop: 16 }}>
                        <Button
                            style={{ marginRight: 8 }}
                            icon={<PlusOutlined />}
                            type="primary"
                            onClick={this.updateModel}
                        >添加
                  </Button>
                        <Dropdown overlay={<Menu onClick={this.menuClick}>
                            <Menu.Item>
                                {/* <Button onClick={() => this.Template()}></Button> */}
                                <ExportOutlined />模板下载
                            </Menu.Item>
                            <Menu.Item>
                                {
                                    this.upload()
                                }
                                <Spin
                                    delay={500}
                                    spinning={this.state.uploadLoading}
                                    style={{
                                        marginLeft: 10,
                                        height: '100%',
                                        width: '30px',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                />
                            </Menu.Item>
                        </Menu>}>
                            <Button>
                                更多操作 <DownOutlined />
                            </Button>
                        </Dropdown>
                    </div>
                    <SdlTable
                        rowKey={record => record.ID}
                        loading={this.props.loading}
                        columns={columns}
                        dataSource={sparepartManageDatalist}
                        // scroll={{ y: 'calc(100vh - 450px)' }}
                        pagination={{
                            showSizeChanger: true,
                            showQuickJumper: true,
                            'total': this.props.total,
                            'pageSize': sparepartManageParameters.pageSize,
                            'current': sparepartManageParameters.pageIndex,
                            onChange: this.onChange,
                            onShowSizeChange: this.onShowSizeChange,
                            pageSizeOptions: pageCount
                        }}
                    />
                    <Modal
                        destroyOnClose="true"
                        visible={this.state.visible}
                        title={this.state.title}
                        width={this.state.width}
                        onCancel={this.onCancel}
                        onOk={this.handleSubmit}
                        confirmLoading={this.props.confirmLoading}
                    >
                        {
                            <UpdateSparepartManage
                                item={this.state.data}
                                form={this.props.form}
                            />
                        }
                    </Modal>
                </Card>
            </BreadcrumbWrapper>
        );
    }
}