import createStateMachine from '../src';
import test from 'tape';

const always = () => true;
const never = () => false;

const mySm = createStateMachine({
    initState: 'INIT',
    transitions: [
        ['INIT',   'start',    always,  'STATE1'],
        ['STATE1', 'goBack',   always,  'INIT'],
        ['STATE1', 'continue', always,  'STATE2'],
        ['STATE2', 'goBack',   never,   'INIT'],
        ['STATE2', 'goBack',   always,  'STATE1'],
        ['STATE2', 'finish',   always,  'END']
    ]
});

test('Simple state machine', t => {

    const stateName = mySm.getInitState().start().continue().goBack().continue().getStateName();

    t.equals(stateName, 'STATE2',
        'transitions correctly');
    t.end();
});

test('Callback functions', t => {
    const transitionData = 'any transition data';
    const callback = (data) => {
        t.equals(data, transitionData,
            'is called with the transition data');
        t.end();
    };

    const stateMachine = createStateMachine({
        initState: 'INIT',
        transitions: [
            ['INIT', 'start', always, 'STATE1', callback]
        ]
    });

    stateMachine.getInitState().start(transitionData);
});

test('Guard conditions', t => {
    t.plan(2);

    const transitionData = 'any transition data';

    const guardCondition = (data) => {
        t.equals(data, transitionData,
            'is called with the transition data');
        return true;
    };

    const stateMachine = createStateMachine({
        initState: 'INIT',
        transitions: [
            ['INIT', 'start', guardCondition,  'STATE1']
        ]
    });

    const stateName = stateMachine.getInitState().start(transitionData).getStateName();

    t.equals(stateName, 'STATE1',
        'Transitions when guard condition is true');
});


test('Guard conditions', t => {
    t.plan(2);

    const transitionData = 'any transition data';

    const guardCondition = (data) => {
        t.equals(data, transitionData,
            'is called with the transition data');
        return false;
    };

    const stateMachine = createStateMachine({
        initState: 'INIT',
        transitions: [
            ['INIT', 'start', guardCondition,  'STATE1']
        ]
    });

    const stateName = stateMachine.getInitState().start(transitionData).getStateName();

    t.equals(stateName, 'INIT',
        'Does not transition when guard condition is false');
});

test('getInitState', t => {
    const stateMachine = createStateMachine({
        initState: 'INIT',
        transitions: [
            ['INIT', 'start', always,  'STATE1']
        ]
    });

    t.equals(stateMachine.getInitState(), 'INIT',
        'returns the initial state');
    t.end();
});

test('getState', t => {
    const stateMachine = createStateMachine({
        initState: 'INIT',
        transitions: [
            ['INIT', 'start', always,  'STATE1']
        ]
    });

    t.equals(stateMachine.getState('STATE1').getStateName(), 'STATE1',
        'returns the asked state');
    t.end();
});
