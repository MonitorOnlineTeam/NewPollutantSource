import Model from '@/utils/model';
import { message } from 'antd';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';
export default Model.extend({
  namespace: 'timelinessQualityReport',
  state: {
    timelyRateList: {
      columnList: [],
      tableList: [],
      largeRegionAnalysis: [],
    },
  },
  effects: {
   
  },
});
