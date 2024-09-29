import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { TreeSelect } from 'antd';
import { transformData } from '@/pages/AbnormalIdentifyModel/CONST.js';

const dvaPropsData = ({ loading, autoform }) => ({
  modelListLoading: loading.effects['AbnormalIdentifyModel/GetModelList'],
});

const ModelTree = props => {
  const [modelList, setModelList] = useState([]);
  const [levelList, setLevelList] = useState([]);
  const [typeList, setTypeList] = useState([]);

  const { dispatch, type } = props;

  useEffect(() => {
    type === 'action' ? GetModelList() : GetMoldTypeLevelList();
  }, [type]);

  // 获取数据模型列表
  const GetModelList = () => {
    dispatch({
      type: 'AbnormalIdentifyModel/GetModelList',
      payload: {
        type: 1, // 过滤掉打标记和数据现象
      },
      callback: (res, unfoldModelList) => {
        let modelList = transformData(res);
        setModelList(modelList);
      },
    });
  };

  // 获取级别和分类
  const GetMoldTypeLevelList = () => {
    dispatch({
      type: 'AbnormalIdentifyModel/GetMoldTypeLevelList',
      payload: {
        type: 1, // 过滤掉打标记和数据现象
      },
      callback: res => {
        let levelList = res.level.map(item => {
          return {
            ...item,
            ModelGuid: item.ModelTypeCode,
            ModelName: item.ModelTypeName,
          };
        });
        setLevelList(levelList);

        let typeList = res.type.map(item => {
          return {
            ...item,
            ModelGuid: item.ModelTypeCode,
            ModelName: item.ModelTypeName,
          };
        });
        setTypeList(typeList);
      },
    });
  };

  const getTreePorps = data => {
    const tProps = {
      treeData: data,
      treeCheckable: true,
      // showCheckedStrategy: SHOW_PARENT,
      maxTagCount: 3,
      maxTagTextLength: 5,
      maxTagPlaceholder: '...',
      placeholder: '请选择场景类别',
      style: {
        width: '420px',
      },
      treeDefaultExpandAll: true,
      ...props
    };

    return tProps;
  };

  let actionTreeProps = getTreePorps([
    {
      label: '全部',
      value: '0-0',
      children: modelList,
    },
  ]);
  let levelTreeProps = getTreePorps([
    {
      ModelName: '全部',
      ModelGuid: '0-0',
      ModelList: levelList,
    },
  ]);
  let typeTreeProps = getTreePorps([
    {
      ModelName: '全部',
      ModelGuid: '0-0',
      ModelList: typeList,
    },
  ]);

  // 根据类型渲染不同的
  const renderTreeByType = () => {
    if (type === 'action') {
      return <TreeSelect {...actionTreeProps} allowClear showSearch treeNodeFilterProp="label" />;
    }

    if (type === 'level') {
      return (
        <TreeSelect
          {...levelTreeProps}
          fieldNames={{ label: 'ModelName', value: 'ModelGuid', children: 'ModelList' }}
          allowClear
          showSearch
          treeNodeFilterProp="label"
        />
      );
    }

    if (type === 'type') {
      return (
        <TreeSelect
          {...typeTreeProps}
          fieldNames={{ label: 'ModelName', value: 'ModelGuid', children: 'ModelList' }}
          allowClear
          showSearch
          treeNodeFilterProp="label"
        />
      );
    }
  };

  return <>{renderTreeByType()}</>;
};

export default connect(dvaPropsData)(ModelTree);
