import pathToRegexp from 'path-to-regexp';
import { message as Message, Modal } from 'antd';

const PATH_SUBSCRIBER_KEY = '_pathSubscriberKey';

const getDefaultModel = () => ({
    // 为了兼容旧版本，初始值依旧为false.如果应用中需要多个控制状态，则在model中覆盖初始属性
    state: {
        visible: false,
        spinning: false,
        loading: false,
        confirmLoading: false,
        /**AutoForm 基本属性 */
        conditionBase: {},//AutoForm默认搜索条件区域表单
        dataTablesBase: []
        /**AutoForm 基本属性 */
    },
    subscriptions: {},
    effects: {
        * baseAdd({ payload }, { call, put, select }) {
            console.log("baseAdd");
        },
        * baseDelete({ payload }, { call, update }) {
            console.log("baseDelete");
        },
        * baseUpdate({ payload }, { call, update }) {
            console.log("baseUpdate");
        },
        * baseGetData({ payload }, { call, update }) {
            console.log("baseGetData");
        }

    },
    reducers: {
        updateState(state, { payload }) {//这里的state是当前总的state，这里的payload包含了上面传递的参数和type
            return {
                ...state,
                ...payload
            };
        }
    }
});


/**
 * 扩展subscription函数的参数,支持listen方法，方便监听path改变
 *
 * listen函数参数如下:
 * pathReg 需要监听的pathname
 * action 匹配path后的回调函数，action即可以是redux的action,也可以是回调函数
 * listen函数同时也支持对多个path的监听，参数为{ pathReg: action, ...} 格式的对象
 *
 * 示例:
 * subscription({ dispath, history, listen }) {
 *  listen('/user/list', { type: 'fetchUsers'});
 *  listen('/user/query', ({ query, params }) => {
 *    dispatch({
 *      type: 'fetchUsers',
 *      payload: params
 *    })
 *  });
 *  listen({
 *    '/user/list': ({ query, params }) => {},
 *    '/user/query': ({ query, params }) => {},
 *  });
 * }
 */
const enhanceSubscriptions = (subscriptions = {}) => {
    return Object
        .keys(subscriptions)
        .reduce((wrappedSubscriptions, key) => {
            wrappedSubscriptions[key] = createWrappedSubscriber(subscriptions[key]);
            return wrappedSubscriptions;
        }, {});

    function createWrappedSubscriber(subscriber) {
        return (props) => {
            const { dispatch, history } = props;

            const listen = (pathReg, action) => {
                let listeners = {};
                if (typeof pathReg === 'object') {
                    listeners = pathReg;
                } else {
                    listeners[pathReg] = action;
                }

                history.listen((location) => {
                    const { pathname } = location;
                    Object.keys(listeners).forEach((key) => {
                        const _pathReg = key;
                        const _action = listeners[key];
                        const match = pathToRegexp(_pathReg).exec(pathname);

                        if (match) {
                            if (typeof _action === 'object') {
                                dispatch(_action);
                            } else if (typeof _action === 'function') {
                                _action({ ...location, params: match.slice(1) });
                            }
                        }
                    });
                });
            };

            subscriber({ ...props, listen });
        };
    }
};

/**
 * 扩展effect函数中的sagaEffects参数
 * 支持:
 *  put 扩展put方法，支持双参数模式: put(type, payload)
 *  update 扩展自put方法，方便直接更新state数据，update({ item: item});
 *  callWithLoading,
 *  callWithConfirmLoading,
 *  callWithSpinning,
 *  callWithMessage,
 *  callWithExtra
 *  以上函数都支持第三个参数,message = { successMsg, errorMsg }
 */
const enhanceEffects = (effects = {}) => {
    const wrappedEffects = {};
    Object
        .keys(effects)
        .forEach((key) => {
            wrappedEffects[key] = function* (action, sagaEffects) {
                const extraSagaEffects = {
                    ...sagaEffects,
                    put: createPutEffect(sagaEffects),
                    update: createUpdateEffect(sagaEffects),
                    callWithLoading: createExtraCall(sagaEffects, { loading: true }),
                    callWithConfirmLoading: createExtraCall(sagaEffects, { confirmLoading: true }),
                    callWithSpinning: createExtraCall(sagaEffects, { spinning: true }),
                    callWithMessage: createExtraCall(sagaEffects),
                    callWithExtra: (serviceFn, args, config) => {
                        createExtraCall(sagaEffects, config)(serviceFn, args, config);
                    }
                };

                yield effects[key](action, extraSagaEffects);
            };
        });

    return wrappedEffects;

    function createPutEffect(sagaEffects) {
        const { put } = sagaEffects;
        return function* putEffect(type, payload) {
            let action = {
                type,
                payload
            };
            if (arguments.length === 1 && typeof type === 'object') {
                action = arguments[0];
            }
            yield put(action);
        };
    }

    function createUpdateEffect(sagaEffects) {
        const { put } = sagaEffects;
        return function* updateEffect(payload) {
            yield put({ type: 'updateState', payload });
        };
    }


    function createExtraCall(sagaEffects, config = {}) {
        const { put, call } = sagaEffects;
        return function* extraCallEffect(serviceFn, args, payloadupdate, message = {}) {
            let result;
            const { loading, confirmLoading, spinning } = config;
            const { successMsg, errorMsg, key } = message;


            try {
                result = yield call(serviceFn, args);
                successMsg && Message.success(successMsg);
            } catch (e) {
                errorMsg && Modal.error({ title: errorMsg });
                throw e;
            } finally { }

            return result;
        };
    }
};
/**
 * 模型继承方法
 *
 * 如果参数只有一个，则继承默认model
 * @param defaults
 * @param properties
 */
function extend(defaults, properties) {
    if (!properties) {
        properties = defaults;
        defaults = null;
    }

    const model = defaults || getDefaultModel();

    const modelAssignKeys = ['state', 'subscriptions', 'effects', 'reducers'];
    const { namespace } = properties;

    modelAssignKeys.forEach((key) => {
        if (key === 'subscriptions') {
            properties[key] = enhanceSubscriptions(properties[key]);
        }
        if (key === 'effects') {
            properties[key] = enhanceEffects(properties[key]);
        }
        Object.assign(model[key], properties[key]);
    });

    const initialState = {
        ...model.state,
    };

    Object.assign(model.reducers, {
        resetState() {
            return {
                ...initialState,
            };
        },
    });

    return Object.assign(model, { namespace });
}

export default {
    extend,
};
