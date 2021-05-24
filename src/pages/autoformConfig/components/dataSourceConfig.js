/**
 * 功  能：数据源基础信息
 * 创建人：胡孟弟
 * 创建时间：2020.11.11
 */
import React, { Component } from 'react';
import {
    Col,
    Row,
    Input,
    Radio,
    Switch,
    InputNumber,
    message,
    Select,
    Button,
    Card,
    TreeSelect,
    Divider, Spin,
    Tooltip,
} from 'antd';
import {
    connect
} from 'dva';
import {
    routerRedux
} from 'dva/router';
import { Form } from '@ant-design/compatible';
import { QuestionCircleOutlined } from '@ant-design/icons'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;

const { TextArea } = Input;

const pageUrl = {
    TableConfigAdd: 'dataSourceConfigModel/TableConfigAdd',
    TableConfigUpdate: 'dataSourceConfigModel/TableConfigUpdate',
    GetPkByTableName: 'dataSourceConfigModel/GetPkByTableName',
    getDBSourceTree: 'dbTree/GetDBSourceTree',//树形菜单
    ConfigIDisExisti: 'dataSourceConfigModel/ConfigIDisExisti',
}

@connect(({
    loading, dataSourceConfigModel
}) => ({
    messageStatus: dataSourceConfigModel.messageStatus,
    dataCodeExists: dataSourceConfigModel.dataCodeExists,
}))
@Form.create()
class DataSourceConfig extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataPermission: '',
            textArea: '',
            staticQuery: '',
            mulType: '0'
        }
    }

    componentWillMount() {

    }

    componentDidUpdate(prevProps) {
        const { tableConfigList, PkByTable, dbKey, selectedKeys } = this.props
        const { getFieldDecorator, setFieldsValue } = this.props.form;
        if (prevProps.tableConfigList != this.props.tableConfigList) {

            const {
                DT_CONFIG_ID: dataSourceCode, //数据源编号
                DT_CONN: dataCon,//数据连接
                DT_NAME: dataTable,//数据表
                DT_NAME_CN: dataSourceName,//数据源名称
                DT_ORDER: orderfield,//排序字段
                DT_PRIMARYKEY: primarykey,//主键
                DT_REMARK: remark,//备注
                EnableDataPermission: permission,//权限
                StaticQuery: staticQuery,//过滤条件
                Tree_ParentCode: parentCode,//父节点
                GUID: guid,
                MulType: mulType
            } = tableConfigList.length > 0 ? tableConfigList[0] : {}

            setFieldsValue({ DT_CONFIG_ID: dataSourceCode })
            setFieldsValue({ DT_CONN: dataCon })
            setFieldsValue({ DT_NAME: dataTable })
            setFieldsValue({ DT_NAME_CN: dataSourceName })
            setFieldsValue({ DT_ORDER: orderfield })
            setFieldsValue({ DT_PRIMARYKEY: primarykey })
            setFieldsValue({ DT_REMARK: remark })
            setFieldsValue({ EnableDataPermission: permission == true ? 1 : permission == null ? null : 0 })
            setFieldsValue({ MulType: mulType })
            setFieldsValue({ StaticQuery: staticQuery })
            setFieldsValue({ Tree_ParentCode: parentCode })
            this.setState({
                dataPermission: permission == true ? 1 : permission == null ? null : 0,
                textArea: remark,
                staticQuery: staticQuery,
                mulType: mulType
            })

        }
        if (prevProps.tableList != this.props.tableList) {
            if (this.props.tableList.length > 0) {
                setFieldsValue({ DT_CONN: dbKey })
            }

        }
        if (prevProps.PkByTable != this.props.PkByTable) {
            const {
                DF_NAME: orderField,
                DF_NAME: primaryKey
            } = PkByTable.length > 0 ? PkByTable[0] : {}

            setFieldsValue({ DT_ORDER: orderField })
            setFieldsValue({ DT_PRIMARYKEY: primaryKey })
        }
    }


    tablelistHandle = () => {
        const { tableList } = this.props;
        const selectList = [];
        if (tableList.length > 0) {
            tableList.map(item => {
                selectList.push(
                    <Option key={item.tablevalue} value={item.tablevalue} title={item.tablename}>
                        {item.tablename}
                    </Option>,
                );
            });
            return selectList;
        }
    }

    handleSubmit = (e) => {
        const { tableConfigList, GUID } = this.props
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (tableConfigList.length > 0 && GUID != '') {
                    this.props.dispatch({
                        type: pageUrl.TableConfigUpdate,
                        payload: {
                            GUID: GUID,
                            DT_NAME: values.DT_NAME,
                            DT_CONFIG_ID: values.DT_CONFIG_ID,
                            DT_NAME_CN: values.DT_NAME_CN,
                            DT_ORDER: values.DT_ORDER,
                            DT_CONN: values.DT_CONN,
                            DT_PRIMARYKEY: values.DT_PRIMARYKEY,
                            Tree_ParentCode: values.Tree_ParentCode,
                            StaticQuery: values.StaticQuery,
                            DT_REMARK: values.DT_REMARK,
                            EnableDataPermission: Number(values.EnableDataPermission),
                            MulType: values.MulType
                        }
                    })
                        .then(() => {
                            if (this.props.messageStatus) {
                                message.success('修改成功');
                                this.props.dispatch({
                                    type: pageUrl.getDBSourceTree,
                                    payload: {
                                        callback: () => {

                                        }
                                    }
                                })
                            }
                            else {
                                message.error('修改失败')
                            }
                        })
                }
                else {
                    this.props.dispatch({
                        type: pageUrl.TableConfigAdd,
                        payload: {
                            DT_NAME: values.DT_NAME,
                            DT_CONFIG_ID: values.DT_CONFIG_ID,
                            DT_NAME_CN: values.DT_NAME_CN,
                            DT_ORDER: values.DT_ORDER,
                            DT_CONN: values.DT_CONN,
                            DT_PRIMARYKEY: values.DT_PRIMARYKEY,
                            Tree_ParentCode: values.Tree_ParentCode,
                            StaticQuery: values.StaticQuery,
                            DT_REMARK: values.DT_REMARK,
                            EnableDataPermission: Number(values.EnableDataPermission),
                            MulType: values.MulType
                        }
                    })
                        .then(() => {
                            if (this.props.messageStatus) {
                                message.success('添加成功');
                                this.props.dispatch({
                                    type: pageUrl.getDBSourceTree,
                                    payload: {
                                        callback: () => {

                                        }
                                    }
                                })
                            }
                            else {
                                message.error('添加失败')
                            }
                        })
                }

            }
        });
    }

    SelectOnChangeHandle = (value) => {
        this.props.dispatch({
            type: pageUrl.GetPkByTableName,
            payload: {
                dbkey: this.props.dbKey,
                tableName: value,
            }
        })
    }
    //验证数据源编号是否存在
    handleValidator = (rule, val, callback) => {

        const { tableConfigList, GUID } = this.props

        if (tableConfigList.length > 0 && GUID != '') {
            callback();
        }
        else {
            this.props.dispatch({
                type: pageUrl.ConfigIDisExisti,
                payload: {
                    configId: val,
                    Operation: 'add',
                }
            }).then(() => {
                if (this.props.dataCodeExists == 'false') {
                    callback('数据源编号已存在');
                }
                else {
                    callback();
                }
            })
        }


    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { tableConfigList, PkByTable, dbKey, selectedKeys } = this.props
        // const {
        //     DF_NAME:orderField,
        //     DF_NAME:primaryKey
        // } = PkByTable.length > 0 ? PkByTable[0] : {}
        // const dataDBCon = dbKey
        const formItemLayout = {
            labelCol: {
                span: 10
            },
            wrapperCol: {
                span: 14
            },
        };
        const formItemLayout2 = {
            labelCol: {
                span: 3
            },
            wrapperCol: {
                span: 14
            },
        };
        return (

            <div >

                {/* <DbSourceTree 
                      onSelect={this.onSelect}
                /> */}

                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Card style={{ height: 'calc(101.5vh - 180px)', overflow: 'auto' }} >
                        <Row gutter={24}>
                            <Col span={8}>
                                <FormItem
                                    label="数据表"
                                >
                                    {getFieldDecorator('DT_NAME'
                                        , {
                                            initialValue: '',
                                            rules: [{
                                                required: true,
                                                message: '请输入数据表!'
                                            },
                                            ]

                                        })(
                                            <Select
                                                allowClear
                                                placeholder='请输入数据表'
                                                onChange={this.SelectOnChangeHandle}
                                                showSearch
                                                disabled={tableConfigList.length > 0 ? true : false}
                                                size='default'
                                                maxTagCount={2}
                                                style={{ height: '32px' }}
                                                maxTagTextLength={5}
                                                maxTagPlaceholder="..."
                                                optionFilterProp="children"
                                                filterOption={(input, option) => {
                                                    if (option && option.props && option.props.title) {
                                                        return option.props.title.toLowerCase() === input.toLowerCase() || option.props.title.toLowerCase().indexOf(input.toLowerCase()) !== -1
                                                    } else {
                                                        return true
                                                    }
                                                }}
                                            >
                                                {this.tablelistHandle()}
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label="数据源编号"
                                >
                                    {getFieldDecorator('DT_CONFIG_ID'
                                        , {
                                            initialValue: '',
                                            rules: [{
                                                required: true,
                                                message: '请输入数据源编号!'
                                            },
                                            {
                                                validator: this.handleValidator
                                            }
                                            ]
                                        })
                                        (<Input disabled={tableConfigList.length > 0 ? true : false} placeholder="唯一编号,不能重复输入" />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label="数据源名称"
                                >
                                    {getFieldDecorator('DT_NAME_CN'
                                        , {
                                            initialValue: '',
                                            rules: [{
                                                required: true,
                                                message: '请输入数据源名称!'
                                            }
                                            ]
                                        })
                                        (<Input placeholder="数据源名称" />
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Divider dashed={true} />
                        <Row gutter={24}>
                            <Col span={8}>
                                <FormItem
                                    label="默认排序字段"
                                >
                                    {getFieldDecorator('DT_ORDER'
                                        , {
                                            initialValue: '',
                                            rules: [{
                                                required: true,
                                                message: '请输入默认排序字段!'
                                            },
                                            ]

                                        })(
                                            <Input placeholder="默认排序字段" />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label="数据库连接"
                                >
                                    {getFieldDecorator('DT_CONN'
                                        , {
                                            initialValue: '',
                                            rules: [{
                                                required: true,
                                                message: '请输入数据库连接!'
                                            }
                                            ]
                                        })
                                        (<Input disabled={true} placeholder="数据库连接" />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label="主键"
                                >
                                    {getFieldDecorator('DT_PRIMARYKEY'
                                        , {
                                            initialValue: '',
                                            rules: [{
                                                required: true,
                                                message: '请输入主键!'
                                            }
                                            ]
                                        })
                                        (<Input placeholder="主键" />
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Divider dashed={true} />
                        <Row gutter={24}>
                            <Col span={8}>
                                <FormItem
                                    label="树父结点"
                                >
                                    {getFieldDecorator('Tree_ParentCode'
                                        , {
                                            initialValue: '',

                                        })(
                                            <Input placeholder="树父结点" />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Divider dashed={true} />
                        <Row>
                            <Col span={24}>
                                <FormItem
                                    {...formItemLayout2}
                                    label={<span>多选 <Tooltip placement="top" title='设置单选和多选后，可以配置数据列表的单选和多选。'>
                                        <QuestionCircleOutlined style={{ color: "#808080" }} />
                                    </Tooltip></span>}
                                >
                                    {getFieldDecorator('MulType'
                                        , {
                                            initialValue: '0',
                                        })(
                                            <div>
                                                <Radio.Group onChange={
                                                    (value) => {
                                                        this.setState({
                                                            mulType: value.target.value
                                                        })
                                                    }
                                                } defaultChecked={this.state.mulType} value={this.state.mulType}>
                                                    <Radio value="0">无</Radio>
                                                    <Radio value="1">单选</Radio>
                                                    <Radio value="2">多选</Radio>
                                                </Radio.Group>
                                            </div>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Divider dashed={true} />
                        <Row>
                            <Col span={24}>

                                <FormItem
                                    {...formItemLayout2}
                                    label={<span>权限 <Tooltip placement="top" title='设置启用后，可在数据权限页面设置此数据源的不同人员和角色的访问权限。'>
                                        <QuestionCircleOutlined style={{ color: "#808080" }} />
                                    </Tooltip></span>}
                                >
                                    {getFieldDecorator('EnableDataPermission'
                                        , {
                                            initialValue: '',
                                        })(
                                            <div>
                                                <Radio.Group onChange={
                                                    (value) => {
                                                        this.setState({
                                                            dataPermission: value.target.value
                                                        })
                                                    }
                                                } defaultChecked={this.state.dataPermission} value={this.state.dataPermission}>
                                                    <Radio value={1}>启用</Radio>
                                                    <Radio value={0}>不启用</Radio>
                                                </Radio.Group>

                                            </div>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Divider dashed={true} />
                        <Row gutter={24}>
                            <Col span={24}>
                                <FormItem
                                    {...formItemLayout2}

                                    label={<span>固定过滤条件 <Tooltip placement="top" title='
                                        填写固定的json过滤条件，会从获取数据的条件中增加以下条件。填写示例：{"Rel":"$and","Group":[{"Key":"dbo.T_Code_Region.Type","Value":"Dept","Where":"$="},{"Key":"dbo.T_Code_Region.ParentNode","Value":"0","Where":"$ne"}]}'>
                                        <QuestionCircleOutlined style={{ color: "#808080" }} />
                                    </Tooltip></span>}
                                >
                                    {getFieldDecorator('StaticQuery'
                                        , {
                                            initialValue: '',

                                        })(
                                            <div>
                                                <TextArea rows={4} autosize={{ minRows: 3 }} />
                                            </div>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Divider dashed={true} />
                        <Row gutter={24}>
                            <Col span={24}>
                                <FormItem
                                    label="备注说明"
                                    {...formItemLayout2}
                                >
                                    {getFieldDecorator('DT_REMARK'
                                        , {
                                            initialValue: '',

                                        })(
                                            <TextArea rows={4} autosize={{ minRows: 3 }} />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Divider orientation="right" style={{ border: '1px dashed #FFFFFF' }}>
                            <Col span={24} style={{ textAlign: 'center' }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button"
                                >
                                    保存
                                    </Button><Divider type="vertical" />
                            </Col>
                        </Divider>
                    </Card>
                </Form>
            </div>
        );
    }
}
export default DataSourceConfig;