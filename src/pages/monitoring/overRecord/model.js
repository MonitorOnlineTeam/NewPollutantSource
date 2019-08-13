import Model from '@/utils/model';
import {
  querypollutantlist,
  queryhistorydatalist,
} from './services';
import { formatPollutantPopover } from '@/utils/utils';

export default Model.extend({
    namespace: 'overRecord',
    state: {
        pollutantlist: [],
        option: null,
        chartdata: null,
        selectpoint: [],
        columns: [],
        datatable: [],
        total: 0,
        tablewidth: 0,
        historyparams: {
          datatype: 'realtime',
          DGIMNs: null,
          pageIndex: null,
          pageSize: null,
          beginTime: null,
          endTime: null,
          payloadpollutantCode: null,
          payloadpollutantName: null,
          isAsc: true,
        },
    },
    effects: {
       
    },
});
