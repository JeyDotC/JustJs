class StateUnit {
    constructor(initial) {
        this.value = initial;
        this.subscribers = [];
    }
    get() {
        return this.value;
    }
    set(newValue) {
        this.value = newValue;
        this.subscribers.forEach(subscriber => subscriber(this.value));
    }
    subscribe(subscriber) {
        this.subscribers = [...this.subscribers, subscriber];
        return this.value;
    }
}

function state(initial) {
    const stateUnit = new StateUnit(initial);
    return [stateUnit.get.bind(stateUnit), stateUnit.set.bind(stateUnit), stateUnit.subscribe.bind(stateUnit)];
}

function sideEffect(subscribedValuesReducer, ...subscribes){
    let values = [];
    let subscriber = undefined;
    
    for(let index in subscribes){
        const subscribe = subscribes[index];
        values[index] = subscribe((newValue) => { 
            values[index] = newValue; 
            const value = subscribedValuesReducer(...values); 
            subscriber && subscriber(value);
            return value;
        });
    }

    return function (newSubscriber) {
        subscriber = newSubscriber;
        const value = subscribedValuesReducer(...values);
        return value;
    };
}

export { state, sideEffect }