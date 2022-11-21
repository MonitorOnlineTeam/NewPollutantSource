/*
 * @Author: JiaQi 
 * @Date: 2022-11-16 15:16:34 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2022-11-18 17:08:14
 * @Description: 排放源清单台账页面
 */
import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from 'dva';
import { Card, Divider, Tooltip } from 'antd';
import { BlockOutlined, PaperClipOutlined, EnvironmentOutlined, VideoCameraAddOutlined } from '@ant-design/icons'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import AddAndEditModal from './AddAndEditModal';
import GovernanceModal from './GovernanceModal';

const CONFIGID = 'UnEmissionAndEnt';

@connect(({ standingBook, loading }) => ({
  governanceModalVisible: standingBook.governanceModalVisible,
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      row: {},
      entCode: props.match.params.entCode,
    };
  }

  // 显示弹窗
  onShowModal = (visibleName, row) => {
    this.props.dispatch({
      type: 'standingBook/updateState',
      payload: {
        [visibleName]: true
      }
    })
    this.setState({ row })
  }

  render() {
    const { entCode, visible, row } = this.state;
    const { governanceModalVisible } = this.props;
    console.log("autoForm=", this.props.autoForm)
    const searchParams = [{
      Key: "dbo__T_Cod_UnEmissionAndEnt__EntCode",
      Value: entCode,
      Where: '$=',
    }]
    return <BreadcrumbWrapper>
      <Card>
        <SearchWrapper
          configId={CONFIGID}
          // reloadFlag={DGIMN}
          searchParams={searchParams}
        ></SearchWrapper>
        <AutoFormTable
          getPageConfig
          noload
          handleMode="modal"
          style={{ marginTop: 10 }}
          configId={CONFIGID}
          searchParams={searchParams}
          appendHandleRows={row => {
            return (
              <>
                <Divider type="vertical" />
                <Tooltip title="关联治理设施">
                  <a onClick={() => {
                    this.onShowModal('governanceModalVisible', row)
                  }}
                  >
                    <BlockOutlined style={{ fontSize: 16 }} />
                  </a>
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip title="关联生产设施">
                  <a onClick={() => {
                    this.setState({ isModalVisible: true, row: row })
                  }}
                  >
                    <PaperClipOutlined style={{ fontSize: 16 }} />
                  </a>
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip title="关联环保点位">
                  <a onClick={() => {
                    this.setState({ isModalVisible: true, row: row })
                  }}
                  >
                    <EnvironmentOutlined style={{ fontSize: 16 }} />
                  </a>
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip title="关联摄像头">
                  <a onClick={() => {
                    this.setState({ isModalVisible: true, row: row })
                  }}
                  >
                    <VideoCameraAddOutlined style={{ fontSize: 16 }} />
                  </a>
                </Tooltip>
              </>
            );
          }}
          onAdd={() => this.setState({
            visible: true
          })}
        />
      </Card>
      {/* 添加编辑排放源弹窗 */}
      <AddAndEditModal visible={visible} entCode={entCode} onCancel={() => {
        this.setState({ visible: false })
      }} />
      {/* 添加编辑排放源弹窗 */}
      {
        governanceModalVisible && <GovernanceModal targetRowData={row} />
      }
    </BreadcrumbWrapper >
  }
}

export default index;