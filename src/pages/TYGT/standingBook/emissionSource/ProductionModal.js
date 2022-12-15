/*
 * @Author: JiaQi 
 * @Date: 2022-11-21 10:16:02 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2022-11-23 09:57:14
 * @Description: 生产设施关联页面
 */
import React, { PureComponent } from 'react'
import { Modal, Transfer, Radio } from 'antd'
import { connect } from 'dva';
import { formatDataSource } from './_utils'

@connect(({ standingBook, loading }) => ({
  installationData: standingBook.installationData,
  productionModalVisible: standingBook.productionModalVisible,
  // loading: loading.effects['standingBook/getDayReportTableData'],
}))
class ProductionModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      entCode: props.entCode,
      dataSource: [],
      targetKeys: [],
    };

    this._CONST = {
    }
  }

  componentDidMount() {
    this.getPageData();
  }

  // 获取页面数据
  getPageData = () => {
    const { targetRowData } = this.props;
    this.props.dispatch({
      type: 'standingBook/GetInstallationByEmission',
      payload: {
        "emissionID": targetRowData['dbo.T_Cod_UnEmissionAndEnt.EmissionID'],
        "installationType": 4,
        "entCode": targetRowData['dbo.T_Bas_Enterprise.EntCode'],
      }
    }).then(() => {
      let { installationData } = this.props;
      let targetKeys = [], bindKeysArr = [];
      installationData.Production.BindData.map(item => {
        targetKeys.push(item.Key);
      })
      this.setState({
        targetKeys,
        dataSource: formatDataSource(installationData.Production.AllData, '')
      })
    })
  }

  // 穿梭框Change
  handleChange = (newTargetKeys) => {
    console.log('newTargetKeys', newTargetKeys)
    this.setState({
      targetKeys: newTargetKeys
    })
  };


  // 提交保存
  onSubmitSave = () => {
    const { targetRowData } = this.props;
    const { targetKeys } = this.state;
    // return;
    this.props.dispatch({
      type: 'standingBook/SetInstallation',
      payload: {
        "relationIDs": {
          4: targetKeys.toString(),
        },
        "installationType": 4,
        "emissionID": targetRowData['dbo.T_Cod_UnEmissionAndEnt.EmissionID']
      }
    })
  }

  // 关闭弹窗
  onCancel = () => {
    this.props.dispatch({
      type: 'standingBook/updateState',
      payload: {
        productionModalVisible: false
      }
    })
  }

  render() {
    const { productionModalVisible } = this.props;
    const { dataSource, targetKeys } = this.state;
    return <Modal
      title="生产设施关系配置"
      visible={productionModalVisible}
      width={800}
      onOk={this.onSubmitSave}
      onCancel={this.onCancel}
    >
      <Transfer
        dataSource={dataSource}
        showSearch
        listStyle={{ width: '50%', height: 300 }}
        titles={['未关联', '已关联']}
        filterOption={(inputValue, option) => option.title.indexOf(inputValue) > -1}
        targetKeys={targetKeys}
        onChange={this.handleChange}
        render={(item) => `${item.title}`}
      />
    </Modal>
  }
}

export default ProductionModal;