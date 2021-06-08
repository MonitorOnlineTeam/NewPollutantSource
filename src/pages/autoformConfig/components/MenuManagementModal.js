/**
 * 功  能：菜单管理弹框
 * 创建人：张哲
 * 创建时间：2019.9.19
 */
import React, { Component } from 'react';
import { Input, Select, Button, Modal, Row, Col, Checkbox, InputNumber, TreeSelect } from 'antd';
import { connect } from 'dva';
import { MenuTarget } from '@/utils/CONST';
import styles from './index.less';
import Cookie from 'js-cookie';
import { Form } from '@ant-design/compatible';

const { Option } = Select;
const { TreeNode } = TreeSelect;
const Item = Form.Item;
const pageUrl = {
    UpdateMenuManagement: 'menumanagementpage/UpdateMenuManagement',//修改
    AddMenuManagement: 'menumanagementpage/AddMenuManagement',//添加
};
let TopMenudata = [];

@connect(({ loading, menumanagementpage }) => ({
    TableData: menumanagementpage.TableData,
}))
class MenuManagementModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isdisabled: false,

        };
    }
    componentWillMount() {
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    //设置
    handleOk = e => {
        const { form, type, record, records, reloadData, DGIMNs } = this.props;
        e.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                form.resetFields();
                this.setState({
                    visible: false,
                });
                // console.log(values)
                if (type === 0) {//0是添加
                    let valueNew = { ...values, ParentId: records.Menu_Id }
                    this.props.dispatch({
                        type: pageUrl.AddMenuManagement,
                        payload: valueNew
                    }).then(() => {
                        reloadData()
                        this.props.form.resetFields();
                    }).catch(() => {
                        reloadData()
                        this.props.form.resetFields();
                    })
                } else {//1是修改
                    let valueNew = { ...values, Menu_Id: record.Menu_Id, ParentId: record.ParentId }
                    this.props.dispatch({
                        type: pageUrl.UpdateMenuManagement,
                        payload: valueNew
                    }).then(() => {
                        reloadData()
                        this.props.form.resetFields();
                    }).catch(() => {
                        reloadData()
                        this.props.form.resetFields();
                    })
                }
            }
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
        this.props.form.resetFields();
    };
    // //获取断面的信息
    // getoption=()=>{
    //     const {pointDatas}=this.props;
    //     let res=[];
    //     if(pointDatas.length>0){
    //         pointDatas.map((item, key) => {
    //             res.push(<Option
    //                 key={key}
    //                 value={item.DGIMN}
    //             >{item.PointName}</Option>);
    //         })
    //     return res; 
    //     }
    // }
    //获取参数编码
    getTarget = () => {
        let res = [];
        if (MenuTarget.length > 0) {
            MenuTarget.map((item, key) => {
                res.push(<Option
                    key={key}
                    value={item.TypeValue}
                >{item.TypeName}</Option>);
            })
            return res;
        }
    }
    //排序
    handleSortCode = () => {
        const { record, records } = this.props
        if (record && record.SortCode) {
            return record.SortCode
        } else if (records) {
            if (records.children) {
                if (records.children.length > 0) {
                    return (records.children[records.children.length - 1].SortCode) + 1
                } else {
                    return 1
                }
            } else {
                return 1
            }
        }
    }
    TopMenu = (data) => {
        return data.map((item, key) => {
            const { children, Menu_Name, Menu_Id } = item;
            return (
                <TreeNode value={Menu_Id} title={Menu_Name} key={Menu_Id}>
                    {children && this.TopMenu(children)}
                </TreeNode>
            );
        });
    }

    //加载设置首页 
    //type 0添加 1修改
    loadSetHome = (record, type) => {
        const { getFieldDecorator } = this.props.form;
        // const response = Cookie.get('token');
        // const user = JSON.parse(response);
        let checked = false;
        let isdisable = true;

        if (type === 1) {//修改，当前节点还有子节点时不显示，设置首页
            if (!record || record.hasOwnProperty('children')) {
                return;
            }
            checked = record.AllowEdit !== 1 ? false : true
        }

        if (this.props.form.getFieldValue('DeleteMark') && !this.state.isdisabled) {
            isdisable = false;
        } else {
            isdisable = true;
        }

        return (
            <>
                {getFieldDecorator('AllowEdit', {
                    valuePropName: 'checked',
                    initialValue: checked,
                })(<Checkbox disabled={isdisable}>是否首页</Checkbox>)}
            </>
        )
    };

    onChange = e => {
        if (!e.target.checked) {
            this.props.form.setFieldsValue({
                AllowEdit: false
            })
        }
        this.setState({ isdisabled: !e.target.checked })
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { record, type, hasSelected, title, records, TableData } = this.props;
        return (
            <>
                {/* 0是添加1是修改 */}
                {type === 0 ? <Button type="primary" disabled={hasSelected} onClick={this.showModal}>
                    {title}
            </Button> : <a onClick={this.showModal}>编辑</a>}
                <Modal
                    title={title}
                    centered={true}
                    className={type === 0 ? 'menuTitle' : 'UpdateMenuTitle'}
                    classTitle={type === 0 ? 'menuTitle' : 'UpdateMenuTitle'}
                    width={900}
                    isCardHeight={true}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form onSubmit={this.handleSubmit} className="ant-advanced-search-form" layout='inline'>
                        <Row gutter={24} >
                            <Col span={10} offset={1} className={styles.MenuLeft} >
                                <Form.Item label={"菜单名称"}>
                                    {getFieldDecorator('Menu_Name', {
                                        rules: [{ required: true, message: '请输入菜单名称!' }],
                                        initialValue: record && record.Menu_Name
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10} className={styles.MenuLeft}>
                                <Form.Item label={"菜单提示"}>
                                    {getFieldDecorator('Menu_Title', {
                                        rules: [{ required: true, message: '请输入菜单提示!' }],
                                        initialValue: record && record.Menu_Title
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={10} offset={1} className={styles.MenuTypeLeft}>
                                <Form.Item label={"类型"}>
                                    {getFieldDecorator('Target', {
                                        rules: [{ required: true, message: '请输入类型!' }],
                                        initialValue: record && record.Target
                                    })(
                                        <Select style={{ width: '174px' }} >
                                            {this.getTarget()}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10} offset={1} className={styles.MenuIconLeft}>
                                <Form.Item label={"图标"}>
                                    {getFieldDecorator('Menu_Img', {
                                        rules: [{ required: true, message: '请输入图标!' }],
                                        initialValue: record && record.Menu_Img
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={10} offset={1} className={styles.MenuAddressLeft} >
                                <Form.Item label={`链接地址`}>
                                    {getFieldDecorator('NavigateUrl', {
                                        rules: [{ required: true, message: '请输入链接地址!' }],
                                        initialValue: record && record.NavigateUrl
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10} className={styles.MenuSortCodeLeft}>
                                <Form.Item label={"排序"}>
                                    {getFieldDecorator('SortCode', {
                                        rules: [{ required: true, message: '请输入排序!' }],
                                        initialValue: this.handleSortCode()
                                    })(
                                        <InputNumber />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        {type === 0 ?
                            <Row gutter={24}>
                                <Col span={9} className={styles.MenuDeleteType}>
                                    <Form.Item >
                                        {getFieldDecorator('DeleteMark', {
                                            valuePropName: 'checked',
                                            initialValue: record && record.DeleteMark === 2 ? false : true,
                                        })(<Checkbox onChange={this.onChange}>启用</Checkbox>)}
                                    </Form.Item>
                                </Col>
                                <Col span={9} className={styles.MenuDeleteType}>
                                    <Form.Item >
                                        {this.loadSetHome(record, type)}
                                    </Form.Item>
                                </Col>
                            </Row> :
                            <>
                                <Row gutter={24}>
                                    <Col span={10} offset={1} className={styles.MenuAddressLeft}>
                                        <Form.Item label={"上级菜单"}>
                                            {getFieldDecorator('TopMenu', {
                                                rules: [{ required: true, message: '请选择上级菜单!' }],
                                                initialValue: record && record.ParentId
                                            })(
                                                <TreeSelect
                                                    showSearch
                                                    style={{ width: 174 }}
                                                    // dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                    placeholder="请选择上级菜单"
                                                    allowClear
                                                    treeNodeFilterProp="title"
                                                    treeDefaultExpandAll
                                                    disabled={type === 0 ? true : false}
                                                >
                                                    {this.TopMenu(this.props.TableData)}
                                                </TreeSelect>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={9} className={styles.MenuDeleteMarkLeft}>
                                        <Form.Item >
                                            {getFieldDecorator('DeleteMark', {
                                                valuePropName: 'checked',
                                                initialValue: record && record.DeleteMark === 2 ? false : true,
                                            })(<Checkbox onChange={this.onChange}>启用</Checkbox>)}
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={24}>
                                    <Col span={10} offset={1} className={styles.MenuDeleteMarkLeft} >
                                        <Form.Item>
                                            {this.loadSetHome(record, type)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={10} className={styles.MenuSortCodeLeft}>

                                    </Col>
                                </Row>
                            </>
                        }
                    </Form>
                </Modal>
            </>
        )
    }
}


export default Form.create()(MenuManagementModal);