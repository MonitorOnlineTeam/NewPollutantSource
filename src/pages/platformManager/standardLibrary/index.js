import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
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
      <PageHeaderWrapper>
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
              router.push("/platformconfig/StandardLibrary/addLibrary")
            }}
            onEdit={(record, key) => {
              const cuid = getRowCuid(record, "dbo.T_Base_StandardLibrary.AttachmentID")
              router.push(`/platformconfig/StandardLibrary/editLibrary/${key}/${cuid}`)
            }}
            onView={(record, key) => {
              router.push(`/platformconfig/StandardLibrary/viewLibrary/${key}`)
            }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default index;