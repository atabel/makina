import groupBy from './group-by';
import objectMap from './object-map';

const formatTransition = ([fromState, transitionName, guardCondition, toState, callback]) =>
    ({fromState, transitionName, guardCondition, toState, callback});

const createStateMachine = function ({initState, transitions}) {
    let states;
    const formattedTransitions = transitions.map(formatTransition);

    const createTransitionMethod = stateName => listConditions => transitionData => {
        const matchingTransition = listConditions.find(t => t.guardCondition(transitionData));
        if (matchingTransition && matchingTransition.callback) {
            matchingTransition.callback(transitionData);
        }
        return states[matchingTransition ? matchingTransition.toState : stateName];
    };

    const createState = (stateTransitions, stateName) =>
        Object.assign({getStateName: () => stateName}, objectMap(stateTransitions, createTransitionMethod(stateName)));

    const transitionsByState = objectMap(groupBy('fromState', formattedTransitions), groupBy('transitionName'));
    states = objectMap(transitionsByState, createState);

    formattedTransitions.forEach(({toState}) => {
        if (!states[toState]) {
            states[toState] = createState({}, toState);
        }
    });

    return {
        getState: (stateName) => states[stateName],
        getInitState: () => states[initState]
    };
};

export default createStateMachine;