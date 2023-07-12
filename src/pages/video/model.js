/**
 * 功  能：传输有效率
 * 创建人：吴建伟
 * 创建时间：2018.12.07
 */

import Model from '@/utils/model';
import { getMonthsTransmissionEfficiency, getEntMonthsTransmissionEfficiency, ExportData, RecalculateTransmissionEfficiency } from '@/services/TransmissionEfficiencyApi';
import moment from 'moment';

export default Model.extend({
    namespace: 'videoNew',
    state: {
        DGIMN : 'scs-900s-900s-r6-0094',
        videoList : [
            {
            AppKey:'35ca29dba6714724be8fd7331548cc37',
            AppSecret:'699b15a37df6ba5f6115c4e5b23bde55',
            ChannelNo:'1',
            VedioCamera_ID: "ef038429-0a18-4cbd-95ad-4b611e6e0c75",
            VedioCamera_No: "AB2482688",
            VedioCamera_Name:"摄像头1",
          },
          {
            AppKey:'35ca29dba6714724be8fd7331548cc37',
            AppSecret:'699b15a37df6ba5f6115c4e5b23bde55',
            ChannelNo:'1',
            VedioCamera_ID: "ef038429-j118-4cbd-95ad-4b611e6e0c75",
            VedioCamera_No: "AB2482693",
            VedioCamera_Name:"摄像头2",
          },
          {
            AppKey:'35ca29dba6714724be8fd7331548cc37',
            AppSecret:'699b15a37df6ba5f6115c4e5b23bde55',
            ChannelNo:'1',
            VedioCamera_ID: "ef038429-0a18-4cgf-95ad-4b611e6e0c75",
            VedioCamera_No: "F74532241",
            VedioCamera_Name:"摄像头3",
          },
          {
            AppKey:'35ca29dba6714724be8fd7331548cc37',
            AppSecret:'699b15a37df6ba5f6115c4e5b23bde55',
            ChannelNo:'1',
            VedioCamera_ID: "ef038429-0a89-4cgf-95ad-4b611e6e0c75",
            VedioCamera_No: "L24281268",
            VedioCamera_Name:"摄像头4",
          },
        ]
    },
    subscriptions: {
    },
    effects: {}

});
