# makina.js

[![npm](https://img.shields.io/npm/v/makina.svg)](https://www.npmjs.com/package/makina)
[![npm](https://img.shields.io/npm/l/makina.svg)](https://www.npmjs.com/package/makina)
[![Build Status](https://img.shields.io/travis/atabel/makina.svg?branch=new-api)](https://travis-ci.org/atabel/makina)
[![Coverage Status](https://coveralls.io/repos/atabel/makina/badge.svg?branch=new-api&service=github)](https://coveralls.io/github/atabel/makina?branch=new-api)

Simple finite state machine. With guard conditions and callbacks

## Install
```
$ npm install --save makina
```
## How to use

### Basic example:
```javascript
import createStateMachine from 'makina';

// Some guard conditions
const always = () => true;
const never = () => false;

// Create a simple SM
const myStateMachine = createStateMachine({
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

myStateMachine.start().continue().goBack().continue().getState();
// STATE 2
```
The `createStateMachine` method receives a state machine config object with only 2 keys:
* `initState`: the initial state of the state machine.
* `transitions`: a list with the transition definitions. A transition definition has the format:
```javascript
['from state', 'transitionName', guardCondition, 'to state']
```

### Guard conditions

When a state machine (`sm`) is in the estate `'from state'` and the `sm.transitionName(data)` method is called, it
will return the state `'to state'` if `guardCondition(data) == true`.

If the guard condition is not satisfied but there is another transition definition with the same name
and a different guard condition, it will be executed.

```javascript
const isEven = (n) => n % 2 === 0;
const isOdd = (n) => !isEven(n);

const myStateMachine = createStateMachine({
    initState: 'INIT',
    transitions: [
        ['INIT', 'start', isEven, 'STATE1'],
        ['INIT', 'start', isOdd,  'STATE2']
    ]
});

myStateMachine.start(2).getState(); // STATE1
myStateMachine.start(1).getState(); // STATE2
```

### Callbacks

You can register a callback to be called after a transition is executed:

```javascript
const myStateMachine = createStateMachine({
    initState: 'INIT',
    transitions: [
        ['INIT', 'start', always, 'STATE1', (msg) => console.log(msg)]
    ]
});

myStateMachine.start('hello callback'); // hello callback
```

## Run tests
```
$ npm install
$ npm test
```