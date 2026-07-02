/* ======================================================
   Modern Calculator
   File: script.js
   ====================================================== */

// Get display elements
const display = document.getElementById("display");
const history = document.getElementById("history");

// Get all calculator buttons
const buttons = document.querySelectorAll("button");

// Store the current calculation
let currentInput = "";

/* ======================================================
   Function: Update Display
   Updates calculator screen in real time
====================================================== */
function updateDisplay() {
    display.value = currentInput === "" ? "0" : currentInput;
}

/* ======================================================
   Function: Calculate Result
   Evaluates the mathematical expression
====================================================== */
function calculateResult() {
    try {

        if (currentInput.trim() === "") return;

        history.textContent = currentInput + " =";

        // Evaluate expression
        let result = eval(currentInput);

        // Check invalid result
        if (!isFinite(result)) {
            throw new Error("Math Error");
        }

        currentInput = result.toString();
        updateDisplay();

    } catch (error) {

        display.value = "Error";
        currentInput = "";

        // Clear error after 1.5 seconds
        setTimeout(() => {
            updateDisplay();
        }, 1500);
    }
}

/* ======================================================
   Function: Delete Last Character
====================================================== */
function deleteLastCharacter() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

/* ======================================================
   Function: Clear Calculator
====================================================== */
function clearCalculator() {
    currentInput = "";
    history.textContent = "";
    updateDisplay();
}

/* ======================================================
   Function: Check if Operator
====================================================== */
function isOperator(value) {
    return ["+", "-", "*", "/", "%"].includes(value);
}

/* ======================================================
   Function: Handle Button Click
====================================================== */
function handleInput(value) {

    // Clear
    if (value === "AC") {
        clearCalculator();
        return;
    }

    // Delete
    if (value === "DEL") {
        deleteLastCharacter();
        return;
    }

    // Equal
    if (value === "=") {
        calculateResult();
        return;
    }

    // Prevent multiple operators
    const lastCharacter = currentInput.slice(-1);

    if (
        isOperator(value) &&
        isOperator(lastCharacter)
    ) {

        currentInput =
            currentInput.slice(0, -1) + value;

        updateDisplay();
        return;
    }

    // Prevent multiple decimal points in one number
    if (value === ".") {

        let lastNumber = currentInput.split(/[+\-*/%]/).pop();

        if (lastNumber.includes(".")) {
            return;
        }

        // Add leading zero
        if (
            currentInput === "" ||
            isOperator(lastCharacter)
        ) {
            currentInput += "0";
        }
    }

    // Prevent expression starting with operator
    if (
        currentInput === "" &&
        ["*", "/", "%"].includes(value)
    ) {
        return;
    }

    currentInput += value;
    updateDisplay();
}

/* ======================================================
   Button Events
====================================================== */

buttons.forEach(button => {

    button.addEventListener("click", () => {

        const value = button.dataset.value;
        handleInput(value);

    });

});

/* ======================================================
   Keyboard Support
====================================================== */

document.addEventListener("keydown", (event) => {

    const key = event.key;

    // Numbers
    if (!isNaN(key)) {
        handleInput(key);
        return;
    }

    // Operators
    if (["+", "-", "*", "/", "%", "."].includes(key)) {
        handleInput(key);
        return;
    }

    // Enter
    if (key === "Enter") {
        event.preventDefault();
        handleInput("=");
        return;
    }

    // Backspace
    if (key === "Backspace") {
        event.preventDefault();
        handleInput("DEL");
        return;
    }

    // Escape
    if (key === "Escape") {
        event.preventDefault();
        handleInput("AC");
        return;
    }

});

/* ======================================================
   Initialize Calculator
====================================================== */

updateDisplay();