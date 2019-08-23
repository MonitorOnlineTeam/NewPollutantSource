import React, { Component, Fragment } from 'react'
import { connect } from 'dva';
import {
    Form,
    Input,
    Button,
    Icon,
    Card,
    Spin,
    Row,
    Col,
    Table,
    Modal,
    Checkbox,
    TreeSelect,
    message,
    Divider,
    Popconfirm,
    Tooltip,
    Transfer, Switch, Tag, Select
} from 'antd';
import { routerRedux } from 'dva/router';
import MonitorContent from '@/components/MonitorContent';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TextArea from 'antd/lib/input/TextArea';
import difference from 'lodash/difference';


const TreeNode = TreeSelect.TreeNode;
// Customize Table Transfer
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

// const mockTags = ['cat', 'dog', 'bird'];

// const mockData = [];
// for (let i = 0; i < 20; i++) {
//     mockData.push({
//         key: i.toString(),
//         title: `content${i + 1}`,
//         description: `description of content${i + 1}`,
//         disabled: i % 4 === 0,
//         tag: mockTags[i % 3],
//     });
// }

// const originTargetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);

const leftTableColumns = [
    {
        dataIndex: 'User_Account',
        title: '账号',
    },
    {
        dataIndex: 'User_Name',
        title: '名称',
    },
    {
        dataIndex: 'Phone',
        title: '手机',
    },
];
const rightTableColumns = [

    {
        dataIndex: 'User_Account',
        title: '账号',
    },
    {
        dataIndex: 'User_Name',
        title: '名称',
    },
    {
        dataIndex: 'Phone',
        title: '手机',
    },
];

@connect(({ roleinfo, loading }) => ({
    RoleInfoTreeLoading: loading.effects['roleinfo/getroleinfobytree'],
    AllUserLoading: loading.effects['roleinfo/getalluser'],
    UserByRoleIDLoading: loading.effects['roleinfo/getuserbyroleid'],
    RoleInfoOneLoading: loading.effects['roleinfo/getroleinfobyid'],
    RoleInfoTree: roleinfo.RoleInfoTree,
    RoleInfoOne: roleinfo.RoleInfoOne,
    RolesTreeData: roleinfo.RolesTree,
    AllUser: roleinfo.AllUser,
    UserByRoleID: roleinfo.UserByRoleID,
    MenuTree: roleinfo.MenuTree,
    MenuTreeLoading: loading.effects['roleinfo/getrolemenutree'],
    SelectMenu: roleinfo.SelectMenu,
    CheckMenu: roleinfo.CheckMenu,
    CheckMenuLoading: loading.effects['roleinfo/getmenubyroleid'],
}))
@Form.create()

class RoleIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            visibleUser: false,
            value: undefined,
            IsEdit: false,
            FormDatas: [],
            Tittle: "添加角色",
            selectedRowKeys: [],
            targetKeys: [],
            allKeys: [],
            disabled: false,
            showSearch: true,
            selectvalue: "0",
            visibleMenu: false,
            selectButton: [],
            buttonState: [],
            selectedRowKeysMenu: [],
            expandRows: false,
            menucolumns: [
                {
                    title: '菜单名称',
                    dataIndex: 'Menu_Name',
                    key: 'Menu_Name',
                    width: "auto"
                },
                {
                    title: '图标',
                    dataIndex: 'Menu_Img',
                    key: 'Menu_Img',
                    width: 'auto',
                },
                {
                    title: '页面按钮',
                    dataIndex: 'Menu_Button1',
                    width: 'auto',
                    key: 'Menu_Button1',
                    render: (text, record) => {
                        if (record.Menu_Button.length !== 0) {
                            return <span>
                                { //item.State=="1"?"#2db7f5":"#DEDEDE"  
                                    record.Menu_Button.map(item => {
                                        if (this.state.buttonState.find(cc => cc.ID == item.ID) == undefined) {
                                            this.state.buttonState.push({ ID: item.ID, State: item.State });
                                        }
                                        return <Tag color={this.state.buttonState.find(cc => cc.ID == item.ID).State == "1" ? "#2db7f5" : "#DEDEDE"} key={item.ID} onClick={(e) => {
                                            //    console.log("but=",this.state.selectButton)
                                            if (this.state.selectButton.length == 0) {
                                                this.state.selectButton.push(item.ID)
                                                this.state.buttonState.find(cc => cc.ID == item.ID).State = "1"
                                            } else {
                                                if (this.state.selectButton.indexOf(item.ID) == -1) {
                                                    this.state.selectButton.push(item.ID)
                                                    this.state.buttonState.find(cc => cc.ID == item.ID).State = "1"
                                                } else {
                                                    var index = this.state.selectButton.indexOf(item.ID)
                                                    this.state.selectButton.splice(index, 1)
                                                    this.state.buttonState.find(cc => cc.ID == item.ID).State = "0"
                                                }
                                            }
                                            this.setState({
                                                buttonState: this.state.buttonState
                                            })
                                            console.log(this.state.buttonState)
                                        }}><a>{item.Name}</a></Tag>
                                    }

                                    )
                                }
                            </span>
                        }
                    }
                },
            ],
            columns: [
                {
                    title: '角色名称',
                    dataIndex: 'Roles_Name',
                    key: 'Roles_Name',
                    width: "auto"
                },
                {
                    title: '角色描述',
                    dataIndex: 'Roles_Remark',
                    key: 'Roles_Remark',
                    width: 'auto',
                },
                {
                    title: '创建人',
                    dataIndex: 'CreateUserName',
                    width: 'auto',
                    key: 'CreateUserName',
                },
                {
                    title: '创建时间',
                    dataIndex: 'CreateDate',
                    width: 'auto',
                    key: 'CreateDate',
                },
                {
                    title: '操作',
                    dataIndex: '',
                    key: 'x',
                    align: 'center',
                    width: 180,
                    render: (text, record) =>
                        <span>
                            <Tooltip title="编辑">
                            <a href="javascript:;" onClick={() => {
                                console.log(record.Roles_ID)
                                this.props.dispatch({
                                    type: 'roleinfo/getroleinfobyid',
                                    payload: {
                                        Roles_ID: record.Roles_ID
                                    }
                                })
                                this.showModalEdit()
                            }}><Icon type="edit" style={{ fontSize: 16 }} /></a>
                            </Tooltip>
                            <Divider type="vertical" />
                            <Tooltip title="删除">
                            <Popconfirm
                                title="确认要删除吗?"
                                onConfirm={() => {
                                    this.props.dispatch({
                                        type: 'roleinfo/delroleinfo',
                                        payload: {
                                            Roles_ID: record.Roles_ID,
                                            callback: (res) => {
                                                if (res.IsSuccess) {
                                                    message.success("删除成功");
                                                    this.props.dispatch({
                                                        type: "roleinfo/getroleinfobytree",
                                                        payload: {
                                                        }
                                                    })
                                                }
                                            }
                                        }
                                    })
                                }}
                                onCancel={this.cancel}
                                okText="是"
                                cancelText="否"
                            >
                                <a href="#"><Icon type="delete" style={{ fontSize: 16 }} /></a>
                            </Popconfirm>
                            </Tooltip>
                            <Divider type="vertical" />
                            <Tooltip title="分配用户">
                            <a href="javascript:;" onClick={() => {
                                console.log(record.Roles_ID)
                                this.setState({
                                    selectedRowKeys: record
                                }, () => {
                                    this.showUserModal()
                                })

                            }}><Icon type="user-add" /></a>
                            </Tooltip>
                            <Divider type="vertical" />
                            <Tooltip title="菜单权限">
                            <a href="javascript:;" onClick={() => {
                                console.log(record.Roles_ID)
                                this.setState({
                                    selectedRowKeys: record
                                }, () => {
                                    this.showMenuModal()
                                })

                            }}><Icon type="menu-unfold" /></a>
                            </Tooltip>
                        </span>
                },
            ]
        };


    }
    onChanges = nextTargetKeys => {

        // if (nextTargetKeys.length == 0) {
        //     message.error("请至少保留一个角色")
        //     return
        // }
        this.props.dispatch({
            type: 'roleinfo/insertrolebyuser',
            payload: {
                User_ID: nextTargetKeys,
                Roles_ID: this.state.selectedRowKeys.key,
            }
        })
        this.setState({ targetKeys: nextTargetKeys });
    };
    onMenuChange = (value) => {
        this.setState({
            selectvalue: value
        })
        this.props.dispatch({
            type: 'roleinfo/getrolemenutree',
            payload: {
                Type: value,
                AuthorID: this.state.selectedRowKeys.key
            }
        })
        console.log(`selected ${value}`);
    }
    onSelect = (record, selected, selectedRows) => {
        console.log("record=", record.key);
    }
    // rowSelection =()=> {

    //     onSelect: (record, selected, selectedRows) => {

    //     },
    //     onSelectAll: (selected, selectedRows, changeRows) => {
    //         console.log(selected, selectedRows, changeRows);
    //     },
    // };
    componentDidMount() {
        this.props.dispatch({
            type: 'roleinfo/getroleinfobytree',
            payload: {
            }
        })

        // this.props.dispatch({
        //     type: 'roleinfo/getrolestreeandobj',
        //     payload: {}
        // })

        // this.props.dispatch({
        //     type: 'roleinfo/getdepbyuserid',
        //     payload: {
        //         User_ID: this.props.match.params.userid,
        //     }
        // })
    }

    showModal = () => {

        this.props.dispatch({
            type: 'roleinfo/getrolestreeandobj',
            payload: {
                Type:'1'
            }
        })
        this.setState({
            visible: true,
            IsEdit: false,
            Tittle: "添加角色"
        });
    };
    showUserModal = () => {
        // if (this.state.selectedRowKeys.length == 0) {
        //     message.error("请选中一行")
        //     return
        // }
        console.log(this.state.selectedRowKeys)
        var keys = this.state.selectedRowKeys.key
        this.props.dispatch({
            type: 'roleinfo/getalluser',
            payload: {}
        })
        this.props.dispatch({
            type: 'roleinfo/getuserbyroleid',
            payload: {
                Roles_ID: keys.toString()
            }
        })
        // console.log("selectID=",this.props.UserByRoleID)
        // console.log("filterArr=",this.props.AllUser)
        const selectId = this.props.UserByRoleID.map(item => item.key)
        console.log("selectId=", selectId)
        const filterArr = this.props.AllUser.filter(item => selectId.indexOf(item.key))
        console.log("filterArr=", filterArr)
        this.setState({
            visibleUser: true,
            targetKeys: selectId,
            allKeys: filterArr
        })
    }

    showMenuModal = () => {
        // if (this.state.selectedRowKeys.length == 0) {
        //     message.error("请选中一行")
        //     return
        // }
        var keys = this.state.selectedRowKeys.key
        this.setState({
            visibleMenu: true,
        })
        this.props.dispatch({
            type: 'roleinfo/getparenttree',
            payload: {
            }
        })
        this.props.dispatch({
            type: 'roleinfo/getrolemenutree',
            payload: {
                Type: this.state.selectvalue,
                AuthorID: keys
            }
        })
        this.props.dispatch({
            type: 'roleinfo/getmenubyroleid',
            payload: {
                Roles_ID: keys
            }
        })

        // console.log("selectID=",this.props.UserByRoleID)
        // console.log("filterArr=",this.props.AllUser)
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.UserByRoleID !== nextProps.UserByRoleID) {
            const selectId = nextProps.UserByRoleID.map(item => item.key)
            console.log("selectId=", selectId)
            const filterArr = nextProps.AllUser.filter(item => selectId.indexOf(item.key))
            console.log("filterArr=", filterArr)
            this.setState({
                visibleUser: true,
                targetKeys: selectId,
                // allKeys: filterArr
            })
        }
        if (this.props.CheckMenu !== nextProps.CheckMenu) {
            this.setState({
                selectButton: nextProps.CheckMenu,
            })
        }
    }
    showModalEdit = () => {
        this.props.dispatch({
            type: 'roleinfo/getrolestreeandobj',
            payload: {}
        })
        this.setState({
            visible: true,
            IsEdit: true,
            Tittle: "编辑角色"
        });
    }

    handleOk = e => {
        this.setState({
            visible: false,
        });
    };
    onChange = value => {
        this.setState({ value });
    };
    handleCancel = e => {
        this.setState({
            visible: false,
            IsEdit: false,
            visibleUser: false,
            visibleMenu: false,
        });
    };
    handleCancelMenu = e => {
        // this.state.selectButton.map(item=>{
        //     this.state.buttonState.find(cc=>cc.ID==item.ID).State="0"
        // })
        this.setState({
            visibleMenu: false,
            selectButton: [],
            buttonState: [],
        });
    };
    addRight = () => {
        var keys = this.state.selectedRowKeys.key
        console.log(this.state.selectButton);
        this.props.dispatch({
            type: 'roleinfo/insertmenubyroleid',
            payload: {
                Roles_ID: keys,
                MenuID: this.state.selectButton,
                callback: (res) => {
                    if (res.IsSuccess) {
                        message.success("修改成功");
                        this.handleCancelMenu()
                    }
                }
            }
        })
    };
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let FormData = {};
                for (let key in values) {
                    if (values[key] && values[key]["fileList"]) {
                        FormData[key] = uid;
                    } else {
                        FormData[key] = values[key] && values[key].toString()
                    }
                }
                const type = this.state.IsEdit == true ? 'roleinfo/updroleinfo' : 'roleinfo/insertroleinfo'
                const msg = this.state.IsEdit == true ? '修改成功' : '添加成功'

                this.props.dispatch({
                    type: type,
                    payload: {
                        ...FormData,
                        callback: (res) => {
                            if (res.IsSuccess) {
                                message.success(msg);
                                this.handleCancel()
                                this.props.dispatch({
                                    type: 'roleinfo/getroleinfobytree',
                                    payload: {
                                    }
                                })
                            }
                        }
                    }

                })
                console.log('FormData=', FormData);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { targetKeys, disabled, showSearch } = this.state;
        const { CheckMenu } = this.props;
        const formItemLayout = {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 16
            },
        };
        const rowRadioSelection = {
            type: null,
            // columnTitle: "选择",
            selectedRowKeys: this.state.rowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys: selectedRows[0],
                    rowKeys: selectedRowKeys
                })
            },
        }
        const rowMenuSelection = {
            selectedRowKeys: this.state.selectButton,
            onChange: (se, selectedRows) => {
                this.setState({
                    selectButton: se,
                })
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
       
        return (
            <Fragment>
                {
                    // <MonitorContent breadCrumbList={
                    //     [
                    //         { Name: '首页', Url: '/' },
                    //         { Name: '权限管理', Url: '' },
                    //         { Name: '角色管理', Url: '' },
                    //     ]
                    // }
                    // >
                    <PageHeaderWrapper>
                        <Card bordered={false}  >
                            <Button type="primary"
                                onClick={this.showModal}
                            >新增</Button>
                            {/* <Button
                                onClick={this.showUserModal}
                                style={{ marginLeft: "10px" }}
                            >分配用户</Button>
                            <Button
                                onClick={this.showMenuModal}
                                style={{ marginLeft: "10px" }}
                            >分配权限</Button> */}
                            {
                                this.props.RoleInfoTreeLoading ? <Spin
                                    style={{
                                        width: '100%',
                                        height: 'calc(100vh/2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    size="large"
                                /> :
                                    <Table
                                        onRow={record => {
                                            return {
                                                onClick: event => {
                                                    console.log("onClick=", record)
                                                    this.setState({
                                                        selectedRowKeys: record,
                                                        rowKeys: [record.key]
                                                    })
                                                },
                                            };
                                        }}
                                        size="small"
                                        style={{ marginTop: "20px" }}
                                        //rowSelection={rowRadioSelection}
                                        defaultExpandAllRows={true} columns={this.state.columns}  dataSource={this.props.RoleInfoTree} />
                            }
                        </Card>
                        <div>
                            <Modal
                                title={this.state.Tittle}
                                visible={this.state.visible}
                                onOk={this.handleSubmit}
                                destroyOnClose="true"
                                onCancel={this.handleCancel}
                            >
                                {
                                    this.props.RoleInfoOneLoading ? <Spin
                                        style={{
                                            width: '100%',
                                            height: 'calc(100vh/2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        size="large"
                                    /> :
                                        <Form onSubmit={this.handleSubmit} className="login-form">
                                            <Form.Item label="父节点" {...formItemLayout} >
                                                {getFieldDecorator('ParentId', {
                                                    rules: [{ required: true, message: '请选择父节点' }],
                                                    initialValue: this.state.IsEdit == true ? this.props.RoleInfoOne.ParentId : ""
                                                })(
                                                    <TreeSelect
                                                        type="ParentId"
                                                        // showSearch
                                                        style={{ width: 300 }}
                                                        //value={this.state.IsEdit==true?this.props.RoleInfoOne.ParentId:null}
                                                        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                                        placeholder="请选择父节点"
                                                        allowClear
                                                        treeDefaultExpandAll
                                                        onChange={this.onChange}
                                                        treeData={this.props.RolesTreeData}
                                                        style={{ width: "100%" }}
                                                    >
                                                    </TreeSelect>
                                                )}
                                            </Form.Item>
                                            <Form.Item label="角色名称"  {...formItemLayout}>
                                                {getFieldDecorator('Roles_Name', {
                                                    rules: [{ required: true, message: '请输入角色名称' }],
                                                    initialValue: this.state.IsEdit == true ? this.props.RoleInfoOne.Roles_Name : ""
                                                })(
                                                    <Input
                                                        type="Roles_Name"
                                                        placeholder="请输入角色名称"
                                                    />,
                                                )}
                                            </Form.Item>
                                            <Form.Item label="角色描述"  {...formItemLayout}>
                                                {getFieldDecorator('Roles_Remark', {
                                                    initialValue: this.state.IsEdit == true ? this.props.RoleInfoOne.Roles_Remark : ""
                                                })(
                                                    <TextArea
                                                        type="Roles_Remark"
                                                        placeholder="请输入角色描述"
                                                    />,
                                                )}
                                            </Form.Item>
                                            <Form.Item>
                                                {getFieldDecorator('Roles_ID', {
                                                    initialValue: this.state.IsEdit == true ? this.props.RoleInfoOne.Roles_ID : ""
                                                })(
                                                    <Input
                                                        type="Roles_ID"
                                                        hidden
                                                    />,
                                                )}
                                            </Form.Item>
                                        </Form>
                                }

                            </Modal>
                            <Modal
                                title={"分配用户-" + this.state.selectedRowKeys.Roles_Name}
                                visible={this.state.visibleUser}
                                onOk={this.handleCancel}
                                destroyOnClose="true"
                                onCancel={this.handleCancel}
                                width={900}
                            >
                                {
                                    this.props.UserByRoleIDLoading ? <Spin
                                        style={{
                                            width: '100%',
                                            height: 'calc(100vh/2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        size="large"
                                    /> :
                                        <TableTransfer
                                            rowKey={record => record.User_ID}
                                            titles={['待分配用户', '已分配用户']}
                                            dataSource={this.props.AllUser}
                                            targetKeys={targetKeys}
                                            disabled={disabled}
                                            showSearch={showSearch}
                                            onChange={this.onChanges}
                                            filterOption={(inputValue, item) =>
                                                (item.User_Name && item.User_Name.indexOf(inputValue) !== -1) || (item.User_Account && item.User_Account.indexOf(inputValue) !== -1) || (item.Phone && item.Phone.indexOf(inputValue) !== -1)
                                            }
                                            leftColumns={leftTableColumns}
                                            rightColumns={rightTableColumns}
                                            style={{ width: "100%", height: "600px" }}
                                        />
                                }
                            </Modal>
                            <Modal
                                title={"菜单权限-" + this.state.selectedRowKeys.Roles_Name}
                                visible={this.state.visibleMenu}
                                onOk={this.addRight}
                                destroyOnClose="true"
                                onCancel={this.handleCancelMenu}
                                width={1200}>
                                <div style={{ width: '100%', maxHeight: "600px", overflow: "auto" }}>
                                    {
                                        <div style={{ marginBottom: 10 }}>
                                            <Select
                                                showSearch
                                                style={{ width: 200 }}
                                                placeholder="请选择系统"
                                                optionFilterProp="children"
                                                onChange={this.onMenuChange}
                                                onFocus={this.onFocus}
                                                onBlur={this.onBlur}
                                                onSearch={this.onSearch}
                                                value={this.state.selectvalue}
                                                filterOption={(input, option) =>
                                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {this.props.SelectMenu.map((item, key) => (<Option key={item.ID} >{item.Name}</Option>))
                                                }
                                            </Select>
                                            {/* <Switch checkedChildren="全部展开" unCheckedChildren="全部关闭"  checked={this.state.expandRows}  onChange={(e)=>{
                                                this.setState({
                                                    expandRows:e
                                                })
                                            }}
                                            /> */}
                                        </div>
                                    }
                                    {
                                        this.props.MenuTreeLoading ? <Spin
                                            style={{
                                                width: '100%',
                                                height: 'calc(100vh/2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            size="large"
                                        /> :
                                            <Table
                                                onRow={record => {
                                                    return {
                                                        onClick: event => {
                                                            console.log("onClick=", this.props.CheckMenu)
                                                        },
                                                    };
                                                }}
                                                size="small"
                                                defaultExpandAllRows={true} rowSelection={rowMenuSelection} columns={this.state.menucolumns} dataSource={this.props.MenuTree} />
                                    }

                                </div>
                            </Modal>
                        </div>
                    {/* </MonitorContent> */}
                    </PageHeaderWrapper>
                }
            </Fragment>
        );
    }
}

export default RoleIndex;
