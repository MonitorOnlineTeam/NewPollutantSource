/*
 * @desc: 详情页面
 * @Author: Jiaqi
 * @Date: 2019-05-30 13:59:37
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-06-14 16:18:18
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { LeftOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Card, Spin, Row, Col } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
// import MonitorContent from '../../components/MonitorContent/index';
import AutoFormViewItems from './AutoFormViewItems';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';

@connect()
// @Form.create()
class AutoFormView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._SELF_ = {
      configId: props.configId || props.match.params.configId,
      keysParams: props.keysParams || JSON.parse(props.match.params.keysParams),
    };
    this.renderContent = this.renderContent.bind(this);
  }

  renderContent() {
    const { configId, keysParams } = this._SELF_;
    return (
      <AutoFormViewItems
        configId={configId}
        keysParams={keysParams}
        // appendDataSource={[
        //   { label: "追加", value: "text" },
        //   { label: "追加2", value: "text2" }
        // ]}
      />
    );
  }

  render() {
    const { history, breadcrumb } = this.props;
    const { configId, keysParams } = this._SELF_;
    return (
      <Fragment>
        {breadcrumb ? (
          <BreadcrumbWrapper title="详情">
            <Card
              bordered={false}
              title="详情"
              extra={
                <Button
                  style={{ float: 'right', marginRight: 10 }}
                  onClick={() => {
                    history.goBack(-1);
                  }}
                >
                  <LeftOutlined />
                  返回
                </Button>
              }
            >
              {this.renderContent()}
            </Card>
          </BreadcrumbWrapper>
        ) : (
          <Fragment>
            <Card>{this.renderContent()}</Card>
          </Fragment>
        )}
      </Fragment>
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
  breadcrumb: true,
};

export default AutoFormView;
