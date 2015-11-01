import groupBy from './group-by';

const createStateMachine = function ({initState, transitions}) {
    let state = initState;

    const createTransitionFunction = (transitionsList) => {
        return (data) => {
            for (let t of transitionsList) {
                if (state === t.fromState && t.wardCondition()) {
                    state = t.toState;
                    if (t.callback) {
                        t.callback(data);
                    }
                    break;
                }
                console.error(`Imposible to transition from '${t.fromState}' to '${t.toState}'`);
            }
        };
    };

    const transitionsByName = groupBy('transitionName', transitions.map(
        ([fromState, transitionName, wardCondition, toState, callback]) => ({fromState, transitionName, wardCondition, toState, callback})
    ));

    const stateMachine = {
        getState: () => state
    };

    Object.keys(transitionsByName).forEach((transitionName) => {
        stateMachine[transitionName] = createTransitionFunction(transitionsByName[transitionName]);
    });

    return stateMachine;
};

export default createStateMachine;