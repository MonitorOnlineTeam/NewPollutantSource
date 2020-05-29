import React, { Component, Fragment } from 'react';
import { Button, Table, Select, Card, Form, Row, Col, Icon, Upload, message, Modal, Divider, Tabs, Input, Tag, Tooltip, Spin } from 'antd';
import { connect } from 'dva';
import styles from './Index.less';
import { downloadFile } from '@/utils/utils';
import SdlTable from '@/components/SdlTable'
import config from '@/config'
import cuid from 'cuid';
import Cookie from 'js-cookie';
import UpdateSparepartManage from './UpdateSparepartManage';
import { EditIcon, DelIcon } from '@/utils/icon';
const confirm = Modal.confirm;
const Option = Select.Option;
const { Search } = Input;
@connect(({ SparepartManage, loading }) => ({
    loading: loading.effects['SparepartManage/GetSparepartManageList'],
    sparepartManageDatalist: SparepartManage.sparepartManageDatalist,
    total: SparepartManage.total,
    sparepartManageParameters: SparepartManage.sparepartManageParameters,
    pageCount:SparepartManage.pageCount,
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
    }
    //创建并获取模板
    Template = () => {
        debugger
        //获取模板地址
        const { dispatch, sparepartManageParameters } = this.props;
        dispatch({
            type: 'SparepartManage/getUploadTemplate',
            payload: {
                SearchName: sparepartManageParameters.SearchName,
                callback: (data) => {
                    downloadFile(data);
                }
            }
        });
    }

    //分页等改变事件
    onChange = (PageIndex, PageSize) => {
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
    //分页等改变事件
    onShowSizeChange = (PageIndex, PageSize) => {
        debugger
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
            <Upload {...props} style={{ marginLeft: 5 }} >
                <Button >
                    <Icon type="upload" />
                    文件导入
                </Button>
            </Upload>
        )
    }
    //导入之前确认框
    uploadConfirm = () => {
        this.setState({
            visible: true,
        })
    }

    //搜索
    nameSearch = (value) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'SparepartManage/updateState',
            payload: {
                sparepartManageParameters: {
                    ...this.props.sparepartManageParameters,
                    ...{
                        SearchName: value,
                        pageIndex: 1,
                        pageSize: 20,
                    }
                }
            }
        });
        this.GetSparepartManageList();
    }
    //搜索
    nameSearchEnter = (value) => {
        debugger
        const { dispatch } = this.props;
        dispatch({
            type: 'SparepartManage/updateState',
            payload: {
                sparepartManageParameters: {
                    ...this.props.sparepartManageParameters,
                    ...{
                        SearchName: value.currentTarget.defaultValue,
                        pageIndex: 1,
                        pageSize: 20,
                    }
                }
            }
        });
        this.GetSparepartManageList();
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
        }
        else {
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
        debugger
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
    render() {
        const { sparepartManageDatalist, sparepartManageParameters, pageCount } = this.props;
        const { visible } = this.state;
        const columns = [
            {
                title: '备件名称',
                dataIndex: 'PartName',
                key: 'PartName',
                width: 100,
                align: 'center',
            },
            {
                title: '备件型号',
                dataIndex: 'Code',
                key: 'Code',
                width: 100,
                align: 'center',
            },
            {
                title: '编码',
                dataIndex: 'PartCode',
                key: 'PartCode',
                width: 100,
                align: 'center',
            },
            {
                title: '单位',
                dataIndex: 'Unit',
                key: 'Unit',
                width: 100,
                align: 'center',
            },
            {
                title: '设备类型',
                dataIndex: 'EquipmentType',
                key: 'EquipmentType',
                width: 100,
                align: 'center',
                render: (text, row, index) => {
                    switch (text) {
                        case '1':
                            text = "废水";
                            break;
                        case '2':
                            text = "废气";
                            break;
                        case '5':
                            text = "环境质量";
                            break;
                        case '10':
                            text = "VOC";
                            break;
                        case '12':
                            text = "扬尘";
                            break;
                    }
                    return text;
                },
            },
            {
                title: '状态',
                dataIndex: 'IsUsed',
                key: 'IsUsed',
                width: 100,
                align: 'center',
                render: (text, row, index) => {
                    switch (text) {
                        case 0:
                            text = "禁用";
                            break;
                        case 1:
                            text = "启用";
                            break;
                    }
                    return text;
                },
            },
            {
                title: '数量',
                dataIndex: 'Quantity',
                key: 'Quantity',
                width: 100,
                align: 'center',
            },
            {
                title: '服务站名称',
                dataIndex: 'SparePartsStationName',
                key: 'SparePartsStationName',
                width: 100,
                align: 'center',
                sorter: {
                    compare: (a, b) => a.SparePartsStationName - b.SparePartsStationName,
                },
            },
            {
                title: '操作',
                key: 'action',
                width: 100,
                align: 'center',
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
            <Card
                style={{ height: 'calc(100vh - 100px)' }}
                // extra={
                //     <Button onClick={() => this.Template()}>
                //         <Icon type="download" />模板下载
                //     </Button>
                // }
                title={
                    <Form layout="inline">
                        <Form.Item>
                            <Search
                                placeholder="备件名称"
                                enterButton="查询"
                                size="middle"
                                defaultValue={sparepartManageParameters.SearchName}
                                onSearch={value => this.nameSearch(value)}
                                onPressEnter={this.nameSearchEnter}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={() => this.Template()}>
                                <Icon type="download" />模板下载
                    </Button>
                        </Form.Item>
                        <Form.Item>
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
                        </Form.Item>
                        <Form.Item>
                            <Button style={{ marginRight: 5 }}
                                onClick={() => this.updateModel()}
                            >
                                添加
                            </Button>
                        </Form.Item>
                    </Form>
                }
                bordered={false}>
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
                >
                    {
                        <UpdateSparepartManage
                            item={this.state.data}
                            form={this.props.form}
                        />
                    }
                </Modal>
            </Card>
        );
    }
}