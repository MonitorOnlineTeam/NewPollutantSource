import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Card, Spin, Row, Col } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import SdlMap from './SdlMap'
import ReturnName from './ReturnName'
import { getAttachmentDataSource } from './utils'
import AttachmentView from '@/components/AttachmentView'
import PageLoading from '@/components/PageLoading'
import styles from '../../components/DescriptionList/index.less';
import { ConsoleSqlOutlined } from '@ant-design/icons';

const FormItem = Form.Item;

@connect(({ loading, autoForm }) => ({
  loadingConfig: loading.effects['autoForm/getDetailsConfigInfo'],
  loadingData: loading.effects['autoForm/getFormData'],
  detailConfigInfo: autoForm.detailConfigInfo,
  editFormData: autoForm.editFormData,
}))
// @Form.create()
class AutoFormViewItems extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._SELF_ = {
      formItemLayout: {
        labelCol: {
          span: 10,
        },
        wrapperCol: {
          span: 14,
        },
      },
      configId: props.configId || props.match.params.configId,
      keysParams: props.keysParams,
    }
    this._renderFormItem = this._renderFormItem.bind(this);
    this._renderAppendDataSource = this._renderAppendDataSource.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  componentDidMount() {
    debugger;
    const { dispatch, detailConfigInfo, editFormData } = this.props;
    const { configId, keysParams } = this._SELF_;
    // 获取页面配置项
    // if (detailConfigInfo || detailConfigInfo.length === 0) {
    dispatch({
      type: 'autoForm/getDetailsConfigInfo',
      payload: {
        configId,
      },
    });
    // }

    // 获取详情页面数据
    // if (!editFormData || !editFormData.length) {
    dispatch({
      type: 'autoForm/getFormData',
      payload: {
        configId,
        ...keysParams,
      },
    })

    //  
    // }

    // }
  }

  componentDidUpdate(prevProps, prevState){

    const { seeType,editFormData } = this.props;
    if (prevProps.editFormData !== editFormData) {
      seeType==='customSty'&& this.props.editFormDatas(editFormData)
    }
  }
  _renderFormItem() {
    const { detailConfigInfo, editFormData } = this.props;
    const { formItemLayout, configId, keysParams } = this._SELF_;
    const formConfig = detailConfigInfo[configId] || [];
    const formData = editFormData[configId] || []
    return formConfig.map(item => {
      let showText = '';
      // if (item.type === "下拉列表框") {
      //   showText = <ReturnName
      //     configId={item.configId}
      //     itemKey={item.configDataItemValue}
      //     itemValue={formData[item.fieldName]}
      //     itemName={item.configDataItemName}
      //   />
      // } else {
      showText = formData[item.fieldName]
      if (item.configId && item.fullFieldName) {
        // 有表连接时，取带表名的字段
        if (formData[item.fullFieldName] != undefined) {
          const fieldValue = `${formData[item.fullFieldName]}`;
          showText = fieldValue.split(',')
        }
      }
      let el = <div className={styles.detail}>{showText}</div>;
      // }
      if (item.type === '坐标集合') {
        return <Col span={24} style={{ marginBottom: 10 }} key={item.fieldName}>
          <div className={styles.term} style={{ verticalAlign: 'top' }}>{item.labelText}</div>
          <div className={styles.detail}><SdlMap
            mode="map"
            longitude={formData.Longitude}
            latitude={formData.Latitude}
            path={showText}
            // handleMarker
            handlePolygon
            style={{ height: 400 }}
            zoom={12}
          /></div>
        </Col>
      }

      if (item.type === '上传') {
        const dataSource = getAttachmentDataSource(formData[item.FullFieldName]);
        el = <div className={styles.detail}>
          <AttachmentView dataSource={dataSource} />
        </div>;
      }
      return (
        <Col span={6} style={{ marginBottom: 10, display: item.isHide ? "none" : "block" }} key={item.fieldName}>
          <div className={styles.term}>{item.labelText}</div>
          {el}
        </Col>
      )
    })
  }

  // 渲染追加数据源
  _renderAppendDataSource() {
    const { appendDataSource } = this.props;
    return appendDataSource.map((item, index) => (
      <Col span={6} style={{ marginBottom: 10 }} key={index}>
        <div className={styles.term}>{item.label}</div>
        <div className={styles.detail}>{item.value}</div>
      </Col>
    ))
  }

  renderContent() {
    return <Row className={styles.descriptionList}>
      {this._renderFormItem()}
      {this._renderAppendDataSource()}
      {this.props.children}
    </Row>
  }

  render() {
    const { loadingData, loadingConfig, dispatch, history, breadcrumb } = this.props;
    const { configId } = this._SELF_;
    if (loadingData || loadingConfig) {
      return (
        // <Spin
        //   style={{
        //     width: '100%',
        //     height: 'calc(100vh/2)',
        //     display: 'flex',
        //     alignItems: 'center',
        //     justifyContent: 'center',
        //   }}
        //   size="large"
        // />
        <PageLoading />
      );
    }
    return (
      <Fragment>
        {this.renderContent()}
      </Fragment>
    );
  }
}

AutoFormViewItems.propTypes = {
  // configId
  configId: PropTypes.string.isRequired,
  // 主键对象
  keysParams: PropTypes.object.isRequired,
  // 附加数据源
  appendDataSource: PropTypes.array,
};

AutoFormViewItems.defaultProps = {
  appendDataSource: [],
}


export default AutoFormViewItems;
