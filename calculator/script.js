const display = document.querySelector('.display');
const buttons = document.querySelectorAll('.btn');

let firstValue = null;
let operator = null;
let waitingForSecondValue = false;

updateDisplay('0');

function updateDisplay(value) {
    if (typeof value === 'number') {
        // Round to a reasonable number of decimal places to prevent overflow
        value = parseFloat(value.toFixed(8));
    }
    display.innerText = value;
}

function handleNumber(number) {
    if (display.innerText === 'Error!') {
        updateDisplay(number);
        waitingForSecondValue = false;
        return;
    }
    if (waitingForSecondValue) {
        updateDisplay(number);
        waitingForSecondValue = false;
    } else {
        const displayValue = display.innerText;
        updateDisplay(displayValue === '0' ? number : displayValue + number);
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(display.innerText);

    if (operator && waitingForSecondValue) {
        // If an operator is pressed consecutively, just update the operator
        operator = nextOperator;
        return;
    }

    if (firstValue === null) {
        firstValue = inputValue;
    } else if (operator) {
        // Chaining operations: evaluate the previous operation
        const result = operate(operator, firstValue, inputValue);
        if (result === 'Error') {
            updateDisplay('Error!');
            firstValue = null;
            operator = null;
            waitingForSecondValue = false;
            return;
        }
        updateDisplay(result);
        firstValue = result;
    }

    waitingForSecondValue = true;
    operator = nextOperator;
}

function handleEquals() {
    const inputValue = parseFloat(display.innerText);
    if (operator && !waitingForSecondValue) {
        const result = operate(operator, firstValue, inputValue);
        if (result === 'Error') {
            updateDisplay('Error!');
            firstValue = null;
            operator = null;
            waitingForSecondValue = false;
            return;
        }
        updateDisplay(result);
        firstValue = null; // Reset for new calculation
        operator = null; // Reset for new calculation
        waitingForSecondValue = true; // After displaying result, next number should clear
    }
}

function handleDecimal() {
    if (waitingForSecondValue) {
        updateDisplay('0.');
        waitingForSecondValue = false;
        return;
    }
    if (!display.innerText.includes('.')) {
        updateDisplay(display.innerText + '.');
    }
}

function handleClear() {
    updateDisplay('0');
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
}

function handleBackspace() {
    let currentDisplay = display.innerText;
    if (currentDisplay === 'Error!') {
        updateDisplay('0');
        return;
    }
    if (currentDisplay.length === 1 || (currentDisplay.length === 2 && currentDisplay.startsWith('-'))) {
        updateDisplay('0');
    } else {
        updateDisplay(currentDisplay.slice(0, -1));
    }
}

function handlePlusMinus() {
    let currentDisplay = parseFloat(display.innerText);
    if (currentDisplay === 0) return;
    updateDisplay(currentDisplay * -1);
}

function handlePercentage() {
    let currentDisplay = parseFloat(display.innerText);
    updateDisplay(currentDisplay / 100);
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    // Division by zero is handled in operate function
    return a / b;
}

function operate(op, a, b) {
    a = Number(a);
    b = Number(b);
    if (op === '÷' && b === 0) {
        return 'Error'; // Return string 'Error' for division by zero
    }
    switch (op) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '×':
            return multiply(a, b);
        case '÷':
            return divide(a, b);
        default:
            return null;
    }
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const { innerText } = button;
        const { classList } = button;

        if (classList.contains('operator') && innerText !== '=') {
            if (classList.contains('plus-minus')) {
                handlePlusMinus();
            } else if (classList.contains('percentage')) {
                handlePercentage();
            } else {
                handleOperator(innerText);
            }
        } else if (classList.contains('decimal')) {
            handleDecimal();
        } else if (classList.contains('clear')) {
            handleClear();
        } else if (classList.contains('backspace')) {
            handleBackspace();
        } else if (innerText === '=') {
            handleEquals();
        } else {
            handleNumber(innerText);
        }
    });
});