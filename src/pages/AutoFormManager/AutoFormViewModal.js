/*
 * @desc: 详情页面
 * @Author: Jiaqi
 * @Date: 2019-05-30 13:59:37
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-06-14 16:18:18
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { LeftOutlined, RollbackOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Card, Spin, Row, Col ,Modal} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import AutoFormViewItems from './AutoFormViewItems'

@connect()
class AutoFormView extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.renderContent = this.renderContent.bind(this);
    }

    renderContent(configId,keysParams) {
        return <AutoFormViewItems
            configId={configId}
            keysParams={keysParams}
        />
    }

    render() {
        const { history, breadcrumb,configId,keysParams,match } = this.props;
        const configIdData =  configId || match?.params?.configId;
        const keysParamsData = keysParams || match?.params?.keysParams && JSON.parse(match.params.keysParams)
        return (

            <Modal
                title="详情"
                destroyOnClose
                footer={null}
                {...this.props}
            >
                {this.renderContent(configIdData,keysParamsData)}
            </Modal>

        );
    }
}

AutoFormView.propTypes = {
    // 是否显示面包屑
    breadcrumb: PropTypes.bool,
    // configId
    configId: PropTypes.string.isRequired,
    // 主键对象
    keysParams: PropTypes.object.isRequired,
};

AutoFormView.defaultProps = {
    breadcrumb: true
}


export default AutoFormView;
