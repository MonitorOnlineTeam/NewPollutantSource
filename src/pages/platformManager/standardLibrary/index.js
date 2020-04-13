import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { Card } from 'antd';
import { connect } from 'dva'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import { router } from 'umi'
import { getRowCuid } from '@/utils/utils'

@connect()
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._SELF_ = {
      configId: "StandardLibrary"
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId: this._SELF_.configId,
      }
    });
  }

  onDelete = (record, key) => {
    this.props.dispatch({
      type: "standardLibraryManager/delLibrary",
      payload: {
        ID: key
      }
    })
  }

  render() {
    return (
      <BreadcrumbWrapper>
        <Card>
          <SearchWrapper
            configId={this._SELF_.configId}
          />
          <AutoFormTable
            configId={this._SELF_.configId}
            onDelete={(record, key) => {
              this.onDelete(record, key);
            }}
            onAdd={() => {
              router.push({
                pathname: "/platformconfig/StandardLibrary/addLibrary",
                query: {
                  tabName: '标准库管理 - 添加',
                }
              })
            }}
            onEdit={(record, key) => {
              const cuid = getRowCuid(record, "dbo.T_Base_StandardLibrary.AttachmentID")
              router.push({
                pathname: `/platformconfig/StandardLibrary/editLibrary/${key}/${cuid}`,
                query: {
                  tabName: '标准库管理 - 编辑',
                }
              })
            }}
            onView={(record, key) => {
              router.push({
                pathname: `/platformconfig/StandardLibrary/viewLibrary/${key}`,
                query: {
                  tabName: '标准库管理 - 详情',
                }
              })
            }}
          />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;