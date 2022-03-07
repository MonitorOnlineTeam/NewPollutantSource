/*
 * @Author: lzp
 * @Date: 2022-02-22 09:42:48
 * @LastEditors: lzp
 * @LastEditTime: 2022-02-22 10:56:03
 * @Description: 外链页面
 */
import React, { Component, Fragment } from 'react';
import { DeleteOutlined, EditOutlined, ProfileOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
    Button,
    Input,
    Card,
    Row,
    Col,
    Table,
    Spin,
    Select,
    Modal,
    Tag,
    Divider,
    Dropdown,
    Menu,
    Popconfirm,
    message,
    DatePicker,
    InputNumber,
    Tooltip,
} from 'antd';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { sdlMessage } from '@/utils/utils';
const { confirm } = Modal;

@connect(({ loading, autoForm }) => ({

}))
export default class UserInfoIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
        };
    }

    componentDidMount() {
        var urlReal=this.props.match.params.url.replace(/&/g,"/").replace(/-/g,"#")
        this.setState({
            url:urlReal
        })
        console.log('url='+urlReal)
    }
    

    render() {
        return (
            <BreadcrumbWrapper>
                {/* <div className={styles.cardTitle}> */}
                <Card>
                    <iframe frameborder="no" allowtransparency="yes" style={{ height: 'calc(100vh - 200px)', width: '100%' }} src={this.state.url}></iframe>
                </Card>
                {/* </div> */}
            </BreadcrumbWrapper>
        );
    }
}
