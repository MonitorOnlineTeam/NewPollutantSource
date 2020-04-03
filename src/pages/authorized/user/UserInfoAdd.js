/*
 * @Author: lzp
 * @Date: 2019-07-16 09:42:48
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 10:56:26
 * @Description: 用户添加
 */
import React, { Component } from 'react';
import {
    Tabs,
    Layout,
    Menu,
    Card,
    Button,
    Divider,
    Tree,
    Input,
    Form,
    message,
    Spin,
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SdlForm from '@/pages/AutoFormManager/SdlForm'

const { Search } = Input;


const FormItem = Form.Item;
const {
    Content, Sider,
} = Layout;

const {
    Item,
} = Menu;
const { TreeNode } = Tree;


@connect(({ userinfo, loading }) => ({
    treeDataLoading: loading.effects['userinfo/getdepartmenttree'],
    RolesTreeDataLoading: loading.effects['userinfo/getrolestree'],
    treeData: userinfo.DepartTree,
    RolesTreeData: userinfo.RolesTree,
    btnisloading: loading.effects['userinfo/add'],
}))
@Form.create()
export default class UserInfoAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectKey: 'base',
            baseState: 'block',
            rolesState: 'none',
            departState: 'none',
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            checkedKey: [],
            checkedKeysSel: [],
            checkedKeySel: [],
            selectedKeys: [],
            selectedKey: [],
            FormDatas: [],
            leafTreeDatas: [],
        };

        this.postFormDatas = this.postFormDatas.bind(this)
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'userinfo/getdepartmenttree',
            payload: {},
        })
        this.props.dispatch({
            type: 'userinfo/getrolestree',
            payload: {},
        })
    }

    onExpand = expandedKeys => {
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    onCheck = checkedKey => {
        this.setState({ checkedKey });
        const leafTree = [];
        checkedKey.map(item => {
            if (this.state.leafTreeDatas.indexOf(item) != -1) {
                leafTree.push(item);
            }
        });
        this.setState({ checkedKeySel: leafTree });
    };

    onSelect = (selectedKey, info) => {
        this.setState({ selectedKey });
    };

    onChecks = checkedKeys => {
        this.setState({ checkedKeys });
        const leafTree = [];
        checkedKeys.map(item => {
            if (this.state.leafTreeDatas.indexOf(item) != -1) {
                leafTree.push(item);
            }
        });
        this.setState({ checkedKeysSel: leafTree });
    };

    onSelects = (selectedKeys, info) => {
        this.setState({ selectedKeys });
    };

    renderTreeNodes = data =>
        data.map(item => {
            if (item.children.length == 0) {
                if (this.state.leafTreeDatas.indexOf(item.key) == -1) {
                    this.state.leafTreeDatas.push(item.key);
                }
            }
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });

    onSubmitForm(formData) {
        // const { dispatch, form } = this.props;

        // this.setState({
        //     FormDatas: formData
        // })
        // console.log('FormData=', formData);
        // // return;
    }

    postFormDatas() {
        this.onSubmitForm();
        const { dispatch, form, RolesTreeData } = this.props;
        const { FormDatas, leafTreeDatas, checkedKeySel, checkedKeysSel } = this.state;
        if (checkedKeySel.length == 0) {
            message.error('角色不能为空');
            return;
        }
        if (checkedKeysSel.length == 0) {
            message.error('部门不能为空');
            return;
        }
        form.validateFields((err, values) => {
            if (!err) {
                const FormData = {};
                for (const key in values) {
                    if (values[key] && values[key].fileList) {
                        FormData[key] = uid;
                    } else {
                        FormData[key] = values[key] && values[key].toString()
                    }
                }
                // this.setState({
                //     FormDatas: FormData
                // })
                // console.log('FormData=', FormData);
                // return;
                dispatch({
                    type: 'userinfo/add',
                    payload: {
                        configId: 'UserInfoAdd',
                        roleID: checkedKeySel,
                        departID: checkedKeysSel,
                        FormData: {
                            ...FormData,
                            // uid: uid
                        },
                    },
                })
            }
        });
    }

    render() {
        const { match, routerData, children, btnisloading } = this.props;
        const tablist = [{
            key: 'base',
            tab: '基本信息',
        },
        {
            key: 'roles',
            tab: '角色设置',
        },
        {
            key: 'departs',
            tab: '部门设置',
        },
        ];

        const submitFormLayout = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 10, offset: 7 },
            },
        };
        const title = this.state.selectKey === 'base' ? '基本信息' : (this.state.selectKey === 'roles' ? '角色设置' : '部门设置');
        return (
            <BreadcrumbWrapper title={`添加 - ${  title}`}>
                <div className="contentContainer" style={{ width: '100%', background: '#fff' }}>
                    {
                        <Layout style={{ padding: '14px 0', background: '#fff' }}>
                            <Sider width={270} style={{ background: '#fff' }}>
                                <Menu
                                    mode="inline"
                                    selectedKeys={this.state.activeKey || 'base'}
                                    onClick={({ key }) => {
                                        this.setState({
                                            activeKey: key,
                                        });
                                        switch (key) {
                                            case 'base': this.setState({ baseState: 'block', rolesState: 'none', departState: 'none' }); break;
                                            case 'roles': this.setState({ baseState: 'none', rolesState: 'block', departState: 'none' }); break;
                                            case 'departs': this.setState({ baseState: 'none', rolesState: 'none', departState: 'block' }); break;
                                            default: return null;
                                        }
                                        this.setState({
                                            selectKey: key,
                                        });
                                    }}
                                >
                                    {
                                        tablist.map(item => <Item key={item.key}>{item.tab}</Item>)
                                    }
                                </Menu>

                            </Sider>
                            <Content style={{ padding: '0 10px', position: 'relative' }}>
                                <Button
                                    style={{ position: 'absolute', right: 20, zIndex: 1, top: 11 }}
                                    onClick={() => {
                                        history.go(-1);
                                    }}
                                >返回
                                </Button>
                                <Card bordered={false} title="基本信息" style={{ display: this.state.baseState }}>
                                    <SdlForm
                                        configId="UserInfoAdd"
                                        onSubmitForm={this.onSubmitForm.bind(this)}
                                        form={this.props.form}
                                        hideBtns
                                    >
                                        {/* <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                onClick={() => {
                                                    const { dispatch, form } = this.props;
                                                    form.validateFields((err, values) => {
                                                        if (!err) {
                                                            this.setState({
                                                                activeKey: "roles",
                                                                baseState: 'none',
                                                                rolesState: 'block',
                                                                departState: 'none'
                                                            })
                                                        }
                                                    })
                                                }}
                                            >下一步
                                        </Button>
                                        </FormItem> */}


                                        <Divider orientation="right" style={{ border: '1px dashed #FFFFFF' }}>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                onClick={() => {
                                                    const { dispatch, form } = this.props;
                                                    form.validateFields((err, values) => {
                                                        if (!err) {
                                                            this.setState({
                                                                activeKey: 'roles',
                                                                baseState: 'none',
                                                                rolesState: 'block',
                                                                departState: 'none',
                                                                selectKey: 'roles',
                                                            })
                                                        }
                                                    })
                                                }}
                                            >下一步
                                        </Button>
                                        </Divider>
                                    </SdlForm>

                                </Card>
                                <Card bordered={false} title="角色设置" style={{ display: this.state.rolesState }}>
                                    {
                                        this.props.RolesTreeDataLoading ? <Spin
                                            style={{
                                                width: '100%',
                                                height: 'calc(100vh/2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            size="large"
                                        /> :

                                            <Tree
                                                checkable
                                                // checkStrictly={false}
                                                onExpand={this.onExpand}
                                                // expandedKeys={this.state.expandedKeys}
                                                autoExpandParent={this.state.autoExpandParent}
                                                onCheck={this.onCheck}
                                                checkedKeys={this.state.checkedKey}
                                                onSelect={this.onSelect}
                                                selectedKeys={this.state.selectedKey}
                                                // autoExpandParent={true}
                                                defaultExpandAll
                                            >
                                                {this.renderTreeNodes(this.props.RolesTreeData)}
                                            </Tree>
                                    }

                                    <Divider orientation="right" style={{ border: '1px dashed #FFFFFF' }}>
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                this.setState({
                                                    activeKey: 'departs',
                                                    baseState: 'none',
                                                    rolesState: 'none',
                                                    departState: 'block',
                                                    selectKey: 'departs',
                                                })
                                            }}
                                        >下一步
                                        </Button>
                                    </Divider>
                                </Card>
                                <Card bordered={false} title="部门设置" style={{ display: this.state.departState }}>
                                    {
                                        this.props.treeDataLoading ? <Spin
                                            style={{
                                                width: '100%',
                                                height: 'calc(100vh/2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            size="large"
                                        /> :

                                            <Tree
                                                checkable
                                                onExpand={this.onExpand}
                                                // expandedKeys={this.state.expandedKeys}
                                                autoExpandParent={this.state.autoExpandParent}
                                                onCheck={this.onChecks}
                                                checkedKeys={this.state.checkedKeys}
                                                onSelect={this.onSelects}
                                                selectedKeys={this.state.selectedKeys}
                                                autoExpandParent
                                                defaultExpandAll
                                            >
                                                {this.renderTreeNodes(this.props.treeData)}
                                            </Tree>
                                    }
                                    <Divider orientation="right" style={{ border: '1px dashed #FFFFFF' }}>
                                        <Button
                                            type="primary"
                                            onClick={this.postFormDatas}
                                            loading={btnisloading}
                                        >保存
                                        </Button>
                                    </Divider>
                                </Card>
                            </Content>
                        </Layout>
                    }

                </div>
            </BreadcrumbWrapper>
        );
    }
}
