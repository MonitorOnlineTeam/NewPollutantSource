import Model from '@/utils/model';
import {
  querypollutantlist,
} from './services';

export default Model.extend({
    namespace: 'dataquery',
    state: {
        pollutantlist: [],
    },
    effects: {
        * querypollutantlist({ payload,
        }, { call, update }) {
            const body = {
                DGIMNs: payload.dgimn,
            }
            const result = yield call(querypollutantlist, body);
            if (result && result[0]) {
                yield update({ pollutantlist: result });
            } else {
                yield update({ pollutantlist: [], datalist: null, chartdata: null, columns: null, datatable: null, total: 0 });
            }
        },

    },
});
