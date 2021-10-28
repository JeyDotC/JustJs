import { expect, jest } from "@jest/globals";
import { state, sideEffect } from "../../src/state";

test("state: Should return the get, set and subscribe methods", function(){
    const [getValue, setValue, subscribeToValue] = state();

    expect(getValue).toBeInstanceOf(Function);
    expect(setValue).toBeInstanceOf(Function);
    expect(subscribeToValue).toBeInstanceOf(Function);
});

test("state: 'get' should return the current state unit value", function(){
    const [getValue] = state(10);

    expect(getValue()).toBe(10);
});

test("state: 'set' should update the state unit value", function(){
    // Arrange
    const [getValue, setValue] = state(10);

    const initialValue = getValue();

    // Act
    setValue(20);

    // Assert
    expect(initialValue).toBe(10);
    expect(getValue()).toBe(20);
});

test("state: 'subscribe' should add callbacks to state unit changes", function(){
    // Arrange
    const valueChanged = jest.fn();
    const [, setValue, subscribeToValue] = state(10);

    // Act
    subscribeToValue(valueChanged);
    setValue(20);

    // Assert
    expect(valueChanged).toHaveBeenCalled();
    expect(valueChanged).toBeCalledWith(20);
});

test("sideEffect: Should allow to subscribe to multiple state units", function(){
    // Arrange
    const valuesReducer = jest.fn((value1, value2) => { 
        return value1 + value2;
    });

    const valuesSubscriber = jest.fn();

    const [, setValue1, subscribeToValue1] = state(10);
    const [, setValue2, subscribeToValue2] = state(20);

    // Act
    const subscribeToValues1And2 = sideEffect(valuesReducer, 
        subscribeToValue1, 
        subscribeToValue2
    );

    subscribeToValues1And2(valuesSubscriber);

    setValue1(20);
    setValue2(30);

    // Assert
    expect(valuesReducer).toHaveBeenNthCalledWith(1, 10, 20);
    expect(valuesReducer).toHaveBeenNthCalledWith(2, 20, 20);
    expect(valuesReducer).toHaveBeenNthCalledWith(3, 20, 30);

    expect(valuesSubscriber).toHaveBeenNthCalledWith(1, 40);
    expect(valuesSubscriber).toHaveBeenNthCalledWith(2, 50);

});