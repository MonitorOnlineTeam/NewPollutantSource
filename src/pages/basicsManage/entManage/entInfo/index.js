import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import { Card, Modal, Button, Tooltip, Popconfirm, Divider } from 'antd'

const CONFIG_ID = "AEnterpriseTest";

class index extends PureComponent {
  state = {}
  render() {
    return (
      <BreadcrumbWrapper>
        <Card>
          <SearchWrapper configId={CONFIG_ID} />
          <AutoFormTable
            getPageConfig
            configId={CONFIG_ID}
            parentcode={"/basicsManage/entManage/index"}
            // appendHandleRows={(row) => {
            //   return (
            //     <>
            //       <Divider type="vertical" />
            //       <Tooltip title="查看">
            //         <a href="#"><SearchOutlined style={{ fontSize: 16 }} /></a>
            //       </Tooltip>
            //       <Divider type="vertical" />
            //       <Tooltip title="下载">
            //         <a href="#"><DownloadOutlined style={{ fontSize: 16 }} /></a>
            //       </Tooltip>
            //     </>
            //   )
            // }}
          />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;