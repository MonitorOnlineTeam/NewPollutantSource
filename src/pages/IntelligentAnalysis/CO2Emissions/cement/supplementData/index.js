import React, { PureComponent } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Modal, Form, Row, Col, InputNumber, Select, } from 'antd'
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import { getRowCuid } from '@/utils/utils';
import _ from 'lodash';
import { router } from 'umi';

const { Option } = Select;
const CONFIG_ID = 'CementSupplementaryData';
const SELECT_LIST = [{ "key": 1, "value": "外购电力" }]
const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

@connect(({ loading, autoForm, global }) => ({
  loading: loading.effects['autoForm/getAutoFormData'],
  getConfigLoading: loading.effects['autoForm/getPageConfig'],
  fileList: autoForm.fileList,
  tableInfo: autoForm.tableInfo,
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      editData: {},
      KEY: undefined,
      FileUuid: undefined,
    };
  }

  // 点击编辑获取数据
  getFormData = (FileUuid) => {
    this.props.dispatch({
      type: 'autoForm/getFormData',
      payload: {
        configId: CONFIG_ID,
        'dbo.T_Bas_CO2PowerDischarge.PowerDischargeCode': this.state.KEY,
      },
      callback: (res) => {
        this.setState({
          editData: res,
          isModalVisible: true,
        })
      }
    })
  }

  render() {
    const { isModalVisible, editData, FileUuid } = this.state;
    const { tableInfo } = this.props;
    return (
      <BreadcrumbWrapper>
        <Card>
          <SearchWrapper configId={CONFIG_ID} />
          <AutoFormTable
            getPageConfig
            configId={CONFIG_ID}
            onAdd={() => {
              router.push('/Intelligentanalysis/cement/supplementData/addOrEditPage?industry=2')
            }}
            onEdit={(record, key) => {
              router.push('/Intelligentanalysis/cement/supplementData/addOrEditPage?industry=2&key=' + key)
            }}
          />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;