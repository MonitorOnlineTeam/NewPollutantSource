import Model from '@/utils/model';
import {
} from './services';
import { formatPollutantPopover } from '@/utils/utils';

export default Model.extend({
    namespace: 'exceptionrecord',
    state: {
        exlist: [],
        excount: 0,
        exmodellist: []
    },
    effects: {
       
    },
});
