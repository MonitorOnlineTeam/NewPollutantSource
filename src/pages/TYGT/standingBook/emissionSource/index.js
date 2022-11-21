/*
 * @Author: JiaQi 
 * @Date: 2022-11-16 15:16:34 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2022-11-21 17:23:53
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
import ProductionModal from './ProductionModal';
import PointModal from './PointModal';
import VideoModal from './VideoModal';


const CONFIGID = 'UnEmissionAndEnt';
const CONFIGID_2 = 'EmissionList';

@connect(({ standingBook, loading }) => ({
  governanceModalVisible: standingBook.governanceModalVisible,
  productionModalVisible: standingBook.productionModalVisible,
  pointModalVisible: standingBook.pointModalVisible,
  videoModalVisible: standingBook.videoModalVisible,
  handleModalVisible: standingBook.handleModalVisible,
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

  // 删除排放源
  onDeleteEmission = (id) => {
    this.props.dispatch({
      type: 'standingBook/DeleteEmission',
      payload: {
        emissionID: id
      }
    }).then(() => {
      this.loadDataSource();
    })
  }

  // 加载表格数据
  loadDataSource() {
    const searchParams = [{
      Key: "dbo__T_Cod_UnEmissionAndEnt__EntCode",
      Value: this.state.entCode,
      Where: '$=',
    }]
    this.props.dispatch({
      type: 'autoForm/getAutoFormData',
      payload: {
        configId: CONFIGID,
        searchParams: searchParams,
      },
    });
  }

  render() {
    const { entCode, visible, row } = this.state;
    const { handleModalVisible, governanceModalVisible, productionModalVisible, pointModalVisible, videoModalVisible } = this.props;


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
                    this.onShowModal('productionModalVisible', row)
                  }}
                  >
                    <PaperClipOutlined style={{ fontSize: 16 }} />
                  </a>
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip title="关联环保点位">
                  <a onClick={() => {
                    this.onShowModal('pointModalVisible', row)
                  }}
                  >
                    <EnvironmentOutlined style={{ fontSize: 16 }} />
                  </a>
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip title="关联摄像头">
                  <a onClick={() => {
                    this.onShowModal('videoModalVisible', row)
                  }}
                  >
                    <VideoCameraAddOutlined style={{ fontSize: 16 }} />
                  </a>
                </Tooltip>
              </>
            );
          }}
          onAdd={() => {
            this.onShowModal('handleModalVisible', {})
          }}
          onEdit={(row, key) => {
            this.onShowModal('handleModalVisible', row)
          }}
          onDelete={(row, key) => {
            this.onDeleteEmission(row['dbo.T_Cod_UnEmissionAndEnt.EmissionID'])
          }}
        />
      </Card>
      {
        // 添加编辑排放源弹窗
        handleModalVisible && <AddAndEditModal entCode={entCode} id={row['dbo.T_Cod_UnEmissionAndEnt.EmissionID']} />
      }
      {
        // 关联治理设施
        governanceModalVisible && <GovernanceModal targetRowData={row} />
      }
      {
        // 关联生产设施
        productionModalVisible && <ProductionModal targetRowData={row} />
      }
      {
        // 关联点位
        pointModalVisible && <PointModal targetRowData={row} />
      }
      {
        // 关联摄像头
        videoModalVisible && <VideoModal targetRowData={row} />
      }
    </BreadcrumbWrapper >
  }
}

export default index;