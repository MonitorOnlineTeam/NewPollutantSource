/*
 * @desc: form 组件
 * @Author: JianWei
 * @Date: 2019-5-23 10:34:29
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-06-14 15:35:22
 */
import React, { PureComponent, Fragment } from 'react';
import PropTypes, { object } from 'prop-types';

import {
  Form,
  Input,
  Button,
  Card,
  Spin,
  Icon,
  Upload,
  Row,
  Col,
  Divider,
  DatePicker,
  message,
} from 'antd';
import moment from 'moment';
import cuid from 'cuid';
import { handleFormData } from '@/utils/utils'
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import Cookie from 'js-cookie';
import { checkRules } from '@/utils/validator';
import config from '../../../config/config'
// import config from "@/config"
import MonitorContent from '../../components/MonitorContent/index';
import SearchSelect from './SearchSelect';
import SdlCascader from './SdlCascader';
import SdlRadio from './SdlRadio';
import SdlCheckbox from './SdlCheckbox';
import SdlUpload from './SdlUpload'
import MapModal from './MapModal';
import SdlMap from './SdlMap'

const { RangePicker, MonthPicker } = DatePicker;
const FormItem = Form.Item;

@connect(({ loading, autoForm }) => ({
  loadingConfig: loading.effects['autoForm/getPageConfig'],
  loadingAdd: loading.effects['autoForm/add'],
  addFormItems: autoForm.addFormItems,
  editFormData: autoForm.editFormData,
  formItemLayout: autoForm.formLayout,
  fileList: autoForm.fileList,
  fileLoading: loading.effects['autoForm/getFormData'],
}))

class SdlForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      MapVisible: false,
      EditMarker: false,
      EditPolygon: false,
      longitude: 0,
      latitude: 0,
      polygon: [],
      defaultFileList: [],
    };
    this._SELF_ = {
      formLayout: props.formLayout || {
        // labelCol: {
        //   xs: { span: 24 },
        //   sm: { span: 7 },
        // },
        // wrapperCol: {
        //   xs: { span: 24 },
        //   sm: { span: 12 },
        //   md: { span: 10 },
        // },
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 14,
        },
      },
      inputPlaceholder: '请输入',
      selectPlaceholder: '请选择',
      // uid: props.isEdit ? (props.uid || (props.match && props.match.params.uid) || null) : cuid(),
      uid: props.uid || (props.match && props.match.params.uid) || cuid(),
      keysParams: props.keysParams || {},
      configId: props.configId,
      isEdit: props.isEdit,
    };
    console.log('uid=', this._SELF_.uid)
    this.renderFormItem = this.renderFormItem.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  componentDidMount() {
    const { addFormItems, dispatch, noLoad } = this.props;
    const { configId, isEdit, keysParams, uid } = this._SELF_;
    // if (!addFormItems || addFormItems.length === 0) {
    !noLoad && dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId,
      },
    });
    // }

    // 编辑时获取数据
    if (isEdit) {
      // 获取上传组件文件列表
      if (uid) {
        this.props.form.setFieldsValue({ cuid: uid })
        dispatch({
          type: 'autoForm/getAttachmentList',
          payload: {
            FileUuid: uid,
          },
        })
      }
      // 获取编辑页面数据
      // !noLoad && dispatch({
      dispatch({
        type: 'autoForm/getFormData',
        payload: {
          configId,
          ...keysParams,
        },
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.fileList !== nextProps.fileList) {
      this.setState({
        defaultFileList: nextProps.fileList,
      })
    }
  }


  // 处理时间控件
  _rtnDateEl = item => {
    const { dateFormat } = item;
    const format = dateFormat.toUpperCase();
    if (format === 'YYYY-MM' || format === 'MM') {
      // 年月 、 月
      return <MonthPicker style={{ width: '100%' }} format={format} />
    } if (format === 'YYYY') {
      // 年
      return <DatePicker format={format} style={{ width: '100%' }} />
      // return <DatePicker
      //   mode="year"
      //   onPanelChange={(value, mode) => {
      //     this.props.form.setFieldsValue({ [item.fieldName]: value })
      //   }}
      //   format={format} />
    }
    // 年-月-日 时:分:秒
    return <DatePicker showTime format={format} style={{ width: '100%' }} />
  }

  // 渲染FormItem
  renderFormItem() {
    const { addFormItems, form: { getFieldDecorator, setFieldsValue, getFieldValue }, editFormData, fileList, fileLoading } = this.props;
    const { formLayout, inputPlaceholder, selectPlaceholder, uid, configId, isEdit } = this._SELF_;
    const _fileList = isEdit ? fileList : [];
    const formItems = addFormItems[configId] || [];
    const formData = isEdit ? (editFormData[configId] || {}) : {};
    // return addFormItems[configId].map((item) =>{
    return formItems.map((item, index) => {
      let validate = [];
      let element = '';
      let { placeholder, validator } = item;
      const { fieldName, labelText, required, fullFieldName, configDataItemValue } = item;
      // let initialValue = formData && Object.keys(formData).length && formData[fieldName];
      let initialValue = formData[fieldName] && `${formData[fieldName]}`;
      // 判断类型
      switch (item.type) {
        case '文本框':
          validator = `${inputPlaceholder}`;
          placeholder = placeholder || inputPlaceholder;

          element = <Input placeholder={placeholder} allowClear />;
          break;
        case '下拉列表框':
        case '多选下拉列表':
          validator = `${selectPlaceholder}`;
          // initialValue = formData[fieldName] && (formData[fieldName] + "").split(",");
          initialValue = formData[configDataItemValue || fieldName] && (`${formData[configDataItemValue || fieldName]}`).split(',');
          placeholder = placeholder || selectPlaceholder;
          const mode = item.type === '多选下拉列表' ? 'multiple' : '';
          element = (
            <SearchSelect
              configId={item.configId}
              itemName={item.configDataItemName}
              itemValue={item.configDataItemValue}
              data={item.value}
              mode={mode}
            />
          );
          break;
        case '多选下拉搜索树':
          placeholder = placeholder || selectPlaceholder;
          initialValue = formData[item.fullFieldName] && formData[item.fullFieldName].split(',');
          element = (
            <SdlCascader
              itemName={item.configDataItemName}
              itemValue={item.configDataItemValue}
              data={item.value}
              placeholder={placeholder}
            />
          )
          break;
        case '日期框':
          initialValue = moment(initialValue);
          element = this._rtnDateEl(item);
          break;
        case '单选':
          element = (
            <SdlRadio
              data={item.value}
              configId={item.configId}
            />
          )
          break;
        case '多选':
          element = (
            <SdlCheckbox
              data={item.value}
              configId={item.configId}
            />
          )
          break;
        case '经度':
          validator = `${inputPlaceholder}`;
          placeholder = placeholder || inputPlaceholder;

          // element = <Input
          //   suffix={<Icon
          //     onClick={() => {
          //       this.openMapModal({ EditMarker: true })
          //         ;
          //     }}
          //     type="global"
          //     style={{ color: '#2db7f5', cursor: 'pointer' }}
          //   />}
          //   placeholder={placeholder}
          //   allowClear={true}
          // />;
          element = <SdlMap
            onOk={map => {
              console.log('map=', map)
              setFieldsValue({ Longitude: map.longitude, Latitude: map.latitude });
            }}
            longitude={getFieldValue('Longitude') || formData.Longitude}
            latitude={getFieldValue('Latitude') || formData.Latitude}
            handleMarker
          />
          break;
        case '纬度':
          validator = `${inputPlaceholder}`;
          placeholder = placeholder || inputPlaceholder;

          element = <SdlMap
            onOk={map => {
              console.log('map=', map)
              setFieldsValue({ Longitude: map.longitude, Latitude: map.latitude });
            }}
            longitude={getFieldValue('Longitude') || formData.Longitude}
            latitude={getFieldValue('Latitude') || formData.Latitude}
            handleMarker
          />;
          break;
        case '坐标集合':
          validator = `${inputPlaceholder}`;
          placeholder = placeholder || inputPlaceholder;
          element = <SdlMap
            onOk={map => {
              setFieldsValue({ [fieldName]: JSON.stringify(map.polygon) });
            }}
            longitude={getFieldValue('Longitude')}
            latitude={getFieldValue('Latitude')}
            path={getFieldValue(`${fieldName}`) || formData[fieldName]}
            // handleMarker={true}
            handlePolygon
          />;
          break;
        // case "上传":
        //   const props = {
        //     action: 'http://172.16.9.52:8095/rest/PollutantSourceApi/UploadApi/PostFiles',
        //     // onChange: this.handleChange(fieldName),
        //     multiple: true,
        //     data: {
        //       FileUuid: uid,
        //       FileActualType: "1"
        //     }
        //   };
        //   element = <Upload {...props}>
        //     <Button>
        //       <Icon type="upload" /> Upload
        //     </Button>
        //   </Upload>
        //   break;
        default:
          if (item.type === '上传') {
            // if (!isEdit) {
            const ssoToken = Cookie.get('ssoToken');
            const props = {
              action: `${config.proxy['/upload'].target}/rest/PollutantSourceApi/UploadApi/PostFiles`,
              // headers: {
              //   Authorization: (ssoToken != "null" && ssoToken != "") && `Bearer ${ssoToken}`,
              //   // 'Content-Type': 'application/json',
              // },
              // action: config.fileUploadUrl,
              // onChange: this.handleChange(fieldName),
              onChange(info) {
                if (info.file.status === 'done') {
                  console.log('info=', info)
                  setFieldsValue({ cuid: uid })
                  // message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                  message.error('上传文件失败！')
                }
              },
              multiple: true,
              data: {
                FileUuid: uid,
                FileActualType: '1',
              },
            };
            if (isEdit) {
              // if (fileList.length) {
              if (this.props.fileList && !fileLoading) {
                // if(this.props.)
                element = <Upload {...props} defaultFileList={this.props.fileList}>
                  <Button>
                    <Icon type="upload" /> 文件上传
                  </Button>
                </Upload>
              }
            } else {
              element = <Upload {...props}>
                <Button>
                  <Icon type="upload" /> 文件上传
                </Button>
              </Upload>
            }

            // } else {
            //   console.log('edit')
            //   element = <SdlUpload
            //     // defaultFileList={[fileList]}
            //     uid={isEdit ? uid : undefined}
            //   />
            // }
          }
          break;
      }
      // 设置默认值
      if (item.defaultValue) {
        // AT-UserID, AT-UserName,AT-GetDate
        const currentUser = JSON.parse(Cookie.get('currentUser'));
        switch (item.defaultValue) {
          case 'AT-UserID':
            console.log('AT-UserID=', currentUser.UserId)
            initialValue = currentUser.UserId
            break;
          case 'AT-UserName':
            console.log('AT-UserName=', currentUser.UserName)
            initialValue = currentUser.UserName
            break;
          case 'AT-GetDate':
            console.log('AT-GetDate=', moment().format(item.dateFormat || 'YYYY-MM-DD HH:mm:ss'))
            initialValue = moment().format(item.dateFormat || 'YYYY-MM-DD HH:mm:ss')
            break;
          default:
            break;
        }
      }
      // 匹配校验规则
      validate = item.validate.map(vid => {
        // 最大长度
        if (vid.indexOf('maxLength') > -1) {
          const max = vid.replace(/[^\d]/g, '') * 1
          return {
            max: max / 1,
            message: `最多输入${max}位`,
          }
        } if (vid.indexOf('minLength') > -1) { // 最小长度
          const min = vid.replace(/[^\d]/g, '') * 1
          return {
            min: min / 1,
            message: `最少输入${min}位`,
          }
        } if (vid.indexOf('rangeLength') > -1) { // 最小最大长度限制
          const range = vid.match(/\d+(,\d+)?/g);
          const max = range[1];
          const min = range[0];
          return {
            max: max / 1,
            min: min / 1,
            message: `最少输入${min}位, 最多输入${max}位。`,
          }
        } if (vid.indexOf('reg') > -1) { // 自定义正则
          const reg = vid.replace('reg', '');
          return {
            pattern: `/${reg}/`,
            message: '格式错误。',
          }
        } if (checkRules[vid.replace(/\'/g, '')]) {
          return checkRules[vid.replace(/\'/g, '')]
        }
          return {}
      })
      if (element) {
        // 布局方式
        let colSpan = 12;
        let layout = formLayout;
        if (this.props.formItemLayout[configId]) {
          colSpan = this.props.formItemLayout[configId]
        } else if (item.colSpan === 1 || item.colSpan === null) {
          colSpan = 12
        } else {
          colSpan = 24;
          layout = {
            labelCol: {
              span: 4,
            },
            wrapperCol: {
              span: 19,
            },
          }
        }
        return (
          <Col span={colSpan} style={{ display: item.isHide == 1 ? 'none' : '' }}>
            <FormItem key={fieldName} {...layout} label={labelText}>
              {getFieldDecorator(`${fieldName}`, {
                initialValue,
                rules: [
                  {
                    required,
                    message: validator + labelText,
                  },
                  ...validate,
                ],
              })(element)}
            </FormItem>
          </Col>
        );
      }
    });
  }

  _onSubmitForm() {
    const { form, onSubmitForm } = this.props;
    const { uid, configId, isEdit, keysParams } = this._SELF_;
    console.log('submitFormData=', this.props.form.getFieldsValue())
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // let formData = {};
        // for (let key in values) {
        //   if (values[key] && values[key]["fileList"]) {
        //     // 处理附件列表
        //     formData[key] = uid;
        //   } else if (values[key] && moment.isMoment(values[key])) {
        //     // 格式化moment对象
        //     formData[key] = moment(values[key]).format("YYYY-MM-DD HH:mm:ss")
        //   } else {
        //     formData[key] = values[key] && values[key].toString()
        //   }
        // }
        // let cuid = isEdit ? uid : cuid();
        // values.uid = uid;
        console.log('values====', values)
        let formData = handleFormData(values, uid)
        console.log('!errAddSubmitFormData=', formData);
        // return;
        // 编辑时处理主键
        if (isEdit) {
          const keys = keysParams;
          const primaryKey = {};
          for (const key in keys) {
            primaryKey[key.split('.').pop().toString()] = keys[key];
          }
          formData = {
            ...formData,
            ...primaryKey,
          }
          console.log('!errEditSubmitFormData=', formData);
        }

        this.props.onSubmitForm && this.props.onSubmitForm(formData);
      }
    });
  }

  renderContent() {
    const { onSubmitForm, form, form: { getFieldDecorator, setFieldsValue, getFieldValue } } = this.props;
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return <Card bordered={false}>
      <Form onSubmit={e => {
        e.preventDefault();
        this._onSubmitForm();
        // onSubmitForm()
      }} hideRequiredMark={false} style={{ marginTop: 8 }}>
        <Row>
          {
            this.renderFormItem()
          }
          <Col style={{ display: 'none' }}>
            <FormItem key="cuid">
              {getFieldDecorator('cuid', {
              })(
                <Input />,
              )}
            </FormItem>
          </Col>
        </Row>
        {
          this.props.children && this.props.children
        }
        {
          !this.props.hideBtns && <Divider orientation="right">
            <Button type="primary" htmlType="submit">保存</Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                history.go(-1);
              }}
            >返回</Button>
          </Divider>
        }
        {/* {(!this.props.hideBtns || this.props.children) ?
          this.props.children :
          <Divider orientation="right">
            <Button type="primary" htmlType="submit">保存</Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                history.go(-1);
              }}
            >返回</Button>
          </Divider>
        } */}
      </Form>
    </Card>
  }


  render() {
    const { loadingAdd, loadingConfig, dispatch, breadcrumb } = this.props;
    const { uid, configId } = this._SELF_;
    // if (loadingAdd || loadingConfig) {
    //   return (<Spin
    //     style={{
    //       width: '100%',
    //       height: 'calc(100vh/2)',
    //       display: 'flex',
    //       alignItems: 'center',
    //       justifyContent: 'center'
    //     }}
    //     size="large"
    //   />);
    // }
    return (
      <Fragment>
        {this.renderContent()}
      </Fragment>
    );
  }

  F
}


SdlForm.propTypes = {
  // configId
  configId: PropTypes.string.isRequired,
  // onSubmitForm
  onSubmitForm: PropTypes.func,
  // form
  form: PropTypes.object.isRequired,
  // isEdit
  isEdit: PropTypes.bool,
  // 是否隐藏操作按钮
  hideBtns: PropTypes.bool,
  // keysParams
  keysParams(props, propName, componentName) {
    if (props.isEdit && !props.keysParams) {
      return new Error(
        'keysParams cannot be empty in edit mode！',
      );
    }
  },
};

SdlForm.defaultProps = {
  isEdit: false,
  hideBtns: false,
}

export default SdlForm;
