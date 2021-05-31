/**
 * 功  能：AutoForm数据源配置-其他配置
 * 创建人：李静
 * 创建时间：2020.11.12
 */

import React, { Component } from 'react';
import {Card,Row,Col, Button,Tooltip,Icon,Checkbox,Select,Divider,Input,message} from 'antd';
import {connect} from 'dva';
import styles from './otherConfig.less';
import { Form } from '@ant-design/compatible';

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const plainOptions = [
    {label:'增加' ,value :'add'},
    {label:'修改' ,value :'edit'},
    {label:'查看' ,value :'view'},
    {label:'删除' ,value :'del'},
    {label:'批量删除' ,value :'alldel'},
    {label:'导出' ,value :'exp'},
    {label:'导入' ,value :'imp'},
    {label:'日志' ,value :'log'},
    {label:'打印' ,value :'print'},
]

const pageUrl = {
    updateState: 'getButtonData/updateState',
    GetButtonsByConfigID: 'getButtonData/GetButtonsByConfigID',
    GetTableExtend: 'getButtonData/GetTableExtend',
    GetTableStyle: 'getButtonData/GetTableStyle'
};

@connect(({ loading, getButtonData }) => ({
    loading: loading.effects[pageUrl.GetButtonsByConfigID],
    buttonDatas: getButtonData.buttonDatas,
    formDatas: getButtonData.formDatas,
    styleDatas: getButtonData.styleDatas
}))
@Form.create()
class otherConfig extends Component{
    constructor(props) {
        super(props)
        this.state = {
            checkedList: [],
            checkAll: false,
            selectPage: 'list',
            textareaValueCSS: '',
            textareaValueJS: ''
        }
    }

    componentWillMount() {
        const { tableConfigList } = this.props;
        this.updateState(
            {
                ConfigID: tableConfigList.length !== 0 ? tableConfigList[0].DT_CONFIG_ID : '',
                PageFlag: 'list'
            }
        );
    }

    // 第一次渲染后调用
    componentDidMount() {
        const { changeList, pageConfig, styleConfig } = this.props;
        this.setState({
            checkedList: changeList
        });
        if (pageConfig && pageConfig.length != 0) {
            
            this.setState({
                selectPage: pageConfig.DT_PAGEFLAG,
                textareaValueCSS: pageConfig.DT_CUSTOMCSS,
                textareaValueJS: pageConfig.DT_CUSTOMJS
            })
        }
        if (styleConfig && styleConfig.length != 0) {
            this.props.form.setFieldsValue({
                widthstyle: styleConfig.DT_CUSTOMJS,
                heightstyle: styleConfig.DT_CUSTOMCSS,
            })
        }
    }

    // 加载列表按钮配置数据
    reloadBtnData = () => {
        const { tableConfigList } = this.props;
        this.props.dispatch({
            type: pageUrl.GetButtonsByConfigID,
            payload: {
                ConfigID: tableConfigList.length !== 0 ? tableConfigList[0].DT_CONFIG_ID : '',
                // ConfigID:'SpareParts',
            }
        }).then(() => {
            let { buttonDatas } = this.props;
            let isCheckBtn = [];
            buttonDatas.map(item => {
                isCheckBtn.push(item.DISPLAYBUTTON)
            })
            this.setState({
                checkedList: isCheckBtn
            })
        });
    }

    //在组件接收到一个新的 prop (更新后)时被调用。
    componentWillReceiveProps(newProps) {
        if (this.props.changeList != newProps.changeList) {
            this.setState({
                checkedList: newProps.changeList
            })
        }
        if (this.props.pageConfig != newProps.formDatas) {
            if(newProps.formDatas.DT_PAGEFLAG != undefined)
            {
                this.props.form.setFieldsValue({
                    selectPage: newProps.formDatas.DT_PAGEFLAG,
                })
            }
            this.setState({
                //selectPage:newProps.formDatas.DT_PAGEFLAG,
                textareaValueCSS: newProps.formDatas.DT_CUSTOMCSS,
                textareaValueJS: newProps.formDatas.DT_CUSTOMJS
            })
        }
        if (this.props.styleConfig != newProps.styleDatas) {
            this.props.form.setFieldsValue({
                widthstyle: newProps.styleDatas.DT_CUSTOMJS,
                heightstyle: newProps.styleDatas.DT_CUSTOMCSS,
            })
        }
    }

    //在组件完成更新后立即调用。
    componentDidUpdate(prevProps){

    }

    // 加载样式和脚本配置
    reloadData = () => {
        this.props.dispatch({
            type: pageUrl.GetTableExtend,
            payload: {
            }
        }).then(() => {
            let { formDatas } = this.props;
            this.setState({
                //selectPage: formDatas.DT_PAGEFLAG,
                textareaValueCSS: formDatas.DT_CUSTOMCSS,
                textareaValueJS: formDatas.DT_CUSTOMJS
            })
        });
    }

    // 更新列表按钮配置查询条件
    updateState = (payload) => {
        this.props.dispatch({
            type: pageUrl.updateState,
            payload: payload
        });
    }

    // 加载页面宽高配置
    reloadStyleData = () => {
        const { tableConfigList } = this.props;
        this.props.dispatch({
            type: pageUrl.GetTableStyle,
            payload: {
                ConfigID: tableConfigList.length !== 0 ? tableConfigList[0].DT_CONFIG_ID : '',
                PageFlag: 'window'
                // // ConfigID:'SpareParts',
            }
        }).then(() => {
            let { styleDatas } = this.props;
            this.props.form.setFieldsValue({
                widthstyle: styleDatas.DT_CUSTOMJS,
                heightstyle: styleDatas.DT_CUSTOMCSS,
            })
        });
    }

    // 全选更改事件
    onCheckAllChange = (e) => {
        let isCheckBtn = [];
        plainOptions.map(item => {
            isCheckBtn.push(item.value)
        })
        this.setState({
            checkedList: e.target.checked ? isCheckBtn : [],
            checkAll: e.target.checked,
        })
    }

    // 选择框更改事件
    onChange = (checkedList) => {
        this.setState({
            checkedList,
            checkAll: checkedList.length === plainOptions.length,
        });
    }

    // 列表按钮配置保存
    SaveCfgButtons = (e) => {
        const { tableConfigList } = this.props;
        const { checkedList } = this.state;
        if (tableConfigList.length !== 0) {
            if (checkedList.length > 0) {
                this.props.dispatch({
                    type: 'getButtonData/SaveCfgButtons',
                    payload: {
                        "ConfigId": tableConfigList[0].DT_CONFIG_ID,
                        "ButtonList": checkedList
                    }
                }).then(() => {
                    this.reloadBtnData();
                }).catch(() => {
                    this.reloadBtnData();
                })
            }
        } else {
            message.warning('选择树节点');
        }
    }

    // 选择页面下拉框内容
    SelectOnChangeHandle = (e) => {
        this.setState({
            selectPage: e
        });
        const { tableConfigList } = this.props;
        this.updateState(
            {
                ConfigID: tableConfigList.length !== 0 ? tableConfigList[0].DT_CONFIG_ID : '',
                PageFlag: e
            }
        );
        this.reloadData();
    }

    //设置textareaValue
    handleTextareaCSSChange = (e) => {
        this.setState({
            textareaValueCSS: e.target.value
        })
    }

    handleTextareaJSChange = (e) => {
        this.setState({
            textareaValueJS: e.target.value
        })
    }
    
    // 页面样式和脚本配置保存
    SaveTableExtend1 = e => {
        e.preventDefault();
        this.props.form.validateFields(['addJS', 'addCSS', 'selectPage'], (err, values) => {
            const { tableConfigList } = this.props;
            const { selectPage } = this.state;
            if (!err) {
                if (tableConfigList.length !== 0 && selectPage) {
                    this.props.dispatch({
                        type: 'getButtonData/SaveTableExtend',
                        payload: {
                            "GUID": tableConfigList[0].GUID,
                            "DT_CONFIG_ID": tableConfigList[0].DT_CONFIG_ID,
                            "DT_CUSTOMJS": values.addJS,
                            "DT_CUSTOMCSS": values.addCSS,
                            "DT_PAGEFLAG": values.selectPage
                        }
                    }).then(() => {
                        this.reloadData();
                    }).catch(() => {
                        this.reloadData();
                    })
                } else {
                    if (tableConfigList.length == 0) {
                        message.warning('选择树节点');
                    }
                    if (!selectPage) {
                        message.warning('选择页面！');
                    }
                }
            }
        })
    }

    // 维护页面宽高配置保存
    SaveTableExtend2 = e => {
        e.preventDefault();
        this.props.form.validateFields(['widthstyle', 'heightstyle'], (err, values) => {
            const { tableConfigList } = this.props;
            if (!err) {
                if (tableConfigList.length !== 0) {
                    this.props.dispatch({
                        type: 'getButtonData/SaveTableExtend',
                        payload: {
                            "GUID": tableConfigList[0].GUID,
                            "DT_CONFIG_ID": tableConfigList[0].DT_CONFIG_ID,
                            "DT_CUSTOMJS": values.widthstyle,
                            "DT_CUSTOMCSS": values.heightstyle,
                            "DT_PAGEFLAG": 'window'
                        }
                    })
                } else {
                    message.warning('选择树节点');
                }
            }
        })
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                span: 10
            },
            wrapperCol: {
                span: 14
            },
        };
        const { formDatas } = this.props;
        // let cssVal = '';
        // let jsVal = '';
        // if(formDatas){
        //     cssVal = formDatas.DT_CUSTOMCSS;
        //     jsVal = formDatas.DT_CUSTOMJS;
        // }
        return (
            <Row >
                <Col>
                    <Card
                        title="列表按钮配置"
                        // bordered={false}
                        headStyle={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', fontWeight: 'bold' }}
                        bodyStyle={{ padding: 0 }}
                        className={`${styles.headTitles} ${styles.cardPadding}`}
                    >
                        <div style={{ height: '50px' }}>
                            <div className={styles.saveBTN}>
                                {this.props.tableConfigList.length == 0 ?
                                    <Button disabled icon="save" type="primary" onClick={this.SaveCfgButtons}>保存</Button> :
                                    <Button icon="save" type="primary" onClick={this.SaveCfgButtons}>保存</Button>
                                }
                                <Tooltip placement="top" title='配置在列表页面显示的按钮，如需增加自定义的按钮，可通过权限系统增加相应的按钮，并注入脚本绑定相应事件。'>
                                    <Icon type="question-circle" style={{ color: "#808080" }} />
                                </Tooltip>
                            </div>
                            <div className={styles.mainStyle}>
                                <Checkbox
                                    onChange={this.onCheckAllChange}
                                    checked={this.state.checkAll}
                                >全选</Checkbox>
                                <CheckboxGroup
                                    options={plainOptions}
                                    value={this.state.checkedList}
                                    onChange={this.onChange}
                                ></CheckboxGroup>
                            </div>
                        </div>
                        <Card
                            title="页面样式和脚本配置"
                            headStyle={{ fontWeight: 'bold' }}
                            bodyStyle={{ borderBottom: '1px dashed #C0C0C0' }}
                        >
                            <div>
                                <div >
                                    <Form {...formItemLayout} onSubmit={this.SaveTableExtend1} >
                                        {this.props.tableConfigList.length == 0 ?
                                            <Button disabled icon="save" type="primary" style={{ float: 'left' }} htmlType='submit'>保存</Button> :
                                            <Button icon="save" type="primary" style={{ float: 'left' }} htmlType='submit'>保存</Button>
                                        }
                                        <Row gutter={24} className={styles.formstyle} style={{ marginLeft: '45px' }}>
                                            <Col >
                                                <FormItem
                                                    label={<span>选择页面 <Tooltip placement="top" title='选择注入页面的类型'>
                                                        <Icon type="question-circle" style={{ color: "#808080" }} />
                                                    </Tooltip></span>}
                                                >
                                                    {getFieldDecorator('selectPage', {
                                                        rules: [{
                                                            // required: true,
                                                            message: '请选择页面!'
                                                        }],
                                                        initialValue: this.state.selectPage
                                                    })(
                                                        <Select
                                                            allowClear     //支持清除
                                                            placeholder='请选择'
                                                            onChange={this.SelectOnChangeHandle}
                                                            showSearch
                                                            size='default'
                                                             //value={this.state.selectPage}
                                                            // defaultValue = 'list'
                                                            style={{ height: '32px', width: '200px' }}
                                                        >
                                                            <Option value="list">列表页面</Option>
                                                            <Option value="add">增加页面</Option>
                                                            <Option value="edit">编辑页面</Option>
                                                            <Option value="view">查看页面</Option>
                                                        </Select>
                                                    )
                                                    }
                                                </FormItem>
                                            </Col>
                                        </Row>
                                        <Divider dashed={true}></Divider>
                                        <Row gutter={24} className={styles.formstyle}>
                                            <Col >
                                                <FormItem
                                                    label={<span>附加CSS样式 <Tooltip placement="top" title=' 附加到相应页面Css代码，可直接写Css代码，也可填写@/Content/custome.css来注入自定义的CSS文件'>
                                                        <Icon type="question-circle" style={{ color: "#808080" }} />
                                                    </Tooltip></span>}
                                                >
                                                    {getFieldDecorator('addCSS', {
                                                        // initialValue:formDatas&&formDatas.DT_CUSTOMCSS                        
                                                    })(
                                                        <div>
                                                            <TextArea value={this.state.textareaValueCSS} onChange={this.handleTextareaCSSChange} rows={4} style={{ width: '500px' }} />
                                                        </div>
                                                    )}
                                                </FormItem>
                                            </Col>
                                        </Row>
                                        <Divider dashed={true}></Divider>
                                        <Row gutter={24} className={styles.formstyle}>
                                            <Col >
                                                <FormItem
                                                    label={<span>附加JavaScript <Tooltip placement="top" title='附加到相应页面JavaScript代码，可直接写JavaScript代码，也可填写@/Content/customeJS.js来注入自定义的JavaScript文件'>
                                                        <Icon type="question-circle" style={{ color: "#808080" }} />
                                                    </Tooltip></span>}
                                                >
                                                    {getFieldDecorator('addJS', {
                                                        // initialValue:formDatas&&formDatas.DT_CUSTOMJS                    
                                                    })(
                                                        <div>
                                                            <TextArea value={this.state.textareaValueJS} onChange={this.handleTextareaJSChange} rows={4} style={{ width: '500px' }} />
                                                        </div>
                                                    )}
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            </div>
                        </Card>
                        <Card
                            title="维护页面宽高（自定义设置增加、编辑、查看页面宽高）"
                            headStyle={{ fontWeight: 'bold' }}
                            bodyStyle={{ borderBottom: '1px dashed #C0C0C0' }}
                        >
                            <div>
                                <div >
                                    <Form {...formItemLayout} onSubmit={this.SaveTableExtend2} >
                                        <div style={{ float: 'left' }}>
                                            {this.props.tableConfigList.length == 0 ?
                                                <Button disabled icon="save" type="primary" htmlType='submit'>保存</Button> :
                                                <Button icon="save" type="primary" htmlType='submit'>保存</Button>
                                            }

                                            <Tooltip placement="top" title='设置维护页面弹窗的大小。'>
                                                <Icon type="question-circle" style={{ color: "#808080" }} />
                                            </Tooltip>
                                        </div>
                                        <Row gutter={24} style={{ marginLeft: '100px' }}>
                                            <Col span={8}>
                                                <FormItem label="宽度(px)" style={{ width: '300px' }}>
                                                    {getFieldDecorator('widthstyle', {

                                                    })(
                                                        <Input placeholder="默认宽度740px" style={{ width: '300px' }} />

                                                    )}

                                                </FormItem>
                                            </Col>
                                            <Col span={8}>
                                                <FormItem label="高度(px)" style={{ width: '300px' }}>
                                                    {getFieldDecorator('heightstyle', {

                                                    })(
                                                        <Input placeholder="默认高度480px" style={{ width: '300px' }} />
                                                    )}

                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            </div>
                        </Card>
                    </Card>
                </Col>
            </Row>
        )
    }
}
export default otherConfig;