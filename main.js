var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var e = React.createElement;

var nums = { "zero": 0, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9 };
var operations = { "multiply": "*", "divide": "/", "add": "+", "subtract": "-" };

// Regular expression matching a floating point number
var DIGITS_RE = /^\d+\.?\d*$/;
// Regular expression matching an operation
var OPERATION_RE = /^[\*/+-]-?$/;

function Number(props) {
    return React.createElement(
        "div",
        { id: props.num, onClick: props.handleDigit,
            value: props.value, className: "button number" },
        props.value
    );
}

function Operation(props) {
    // Replace the text value with * for multiplication
    text = props.value == "*" ? "x" : props.value;
    return React.createElement(
        "div",
        { id: props.operation, onClick: props.handleOperation,
            value: props.value, className: "button operator" },
        text
    );
}

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            display: "",
            subDisplay: "0"
        };
        _this.handleDigit = _this.handleDigit.bind(_this);
        _this.handleOperation = _this.handleOperation.bind(_this);
        _this.handleResults = _this.handleResults.bind(_this);
        _this.handleDecimal = _this.handleDecimal.bind(_this);
        _this.handleClear = _this.handleClear.bind(_this);
        _this.maxDigitWarning = _this.maxDigitWarning.bind(_this);

        return _this;
    }

    _createClass(App, [{
        key: "handleDigit",
        value: function handleDigit(e) {
            // Get the current digit based on which digit div was clicked
            var val = nums[e.target.id];

            if (this.state.subDisplay.length > 27) {
                this.maxDigitWarning();
                return true;
            }

            var newState = {
                display: this.state.display,
                subDisplay: this.state.subDisplay

                // If we just evaluated the results remove the display
            };if (this.state.display.match("=")) {
                newState.subDisplay = val.toString();
                newState.display = "";
                this.setState(newState);
                return true;
            }

            // If the sub display is 0 replace the 0 with the new digit
            if (this.state.subDisplay == "0") {
                newState.subDisplay = val.toString();
            }
            // If sub display is digits and not 0
            else if (this.state.subDisplay.match(DIGITS_RE) && this.state.subDisplay != "0") {
                    newState.subDisplay += val;
                }
                // If sub display is an operation
                else if (this.state.subDisplay.match(OPERATION_RE)) {
                        newState.display += this.state.subDisplay;
                        newState.subDisplay = val.toString();
                    }

            this.setState(newState);
        }
    }, {
        key: "handleOperation",
        value: function handleOperation(e) {
            var operation = operations[e.target.id];

            var newState = {
                display: this.state.display,
                subDisplay: this.state.subDisplay

                // If we just evaluated the results set the display to the subdisplay
            };if (this.state.display.match("=")) {
                newState.display = this.state.subDisplay;
                newState.subDisplay = operation;
                this.setState(newState);
                return true;
            }

            // If empty or last character is a digit 
            // Add sub display to display and replace with operation
            if (this.state.subDisplay == "") {
                newState.display += this.state.subDisplay;
                newState.subDisplay = operation;
            }
            // If we have digits not ending in a decimal
            else if (this.state.subDisplay.match(/^\d+(\.\d+)?$/)) {
                    newState.display += this.state.subDisplay;
                    newState.subDisplay = operation;
                }
                // If we have digits ending in a decimal add a 0
                else if (this.state.subDisplay.match(/^\d+\.$/)) {
                        newState.display += this.state.subDisplay + "0";
                        newState.subDisplay = operation;
                    }
                    // If we have just one operation
                    else if (this.state.subDisplay.match(/^[\*/+-]$/)) {
                            // If our new operation is a minus sign add it on
                            if (operation == "-") {
                                newState.subDisplay += operation;
                            }
                            // Otherwise replace the operation
                            else {
                                    newState.subDisplay = operation;
                                }
                        }
                        // If we have an operation with a negative sign replace the operation
                        else if (this.state.subDisplay.match(/^[\*/+-]-$/)) {
                                newState.subDisplay = operation;
                            }
            this.setState(newState);
        }
    }, {
        key: "handleDecimal",
        value: function handleDecimal() {

            if (this.state.subDisplay.length > 27) {
                this.maxDigitWarning();
                return true;
            }

            var newState = {
                subDisplay: this.state.subDisplay,
                display: this.state.display

                // If we just evaluated the results set the display to the subdisplay
            };if (this.state.display.match("=")) {
                newState.display = "";
                newState.subDisplay = "0.";
                this.setState(newState);
                return true;
            }

            // If there is a decimal do nothing
            if (this.state.subDisplay.match(/\./g)) {
                return true;
            }
            // If sub display is digits add a decimal
            else if (this.state.subDisplay.match(/^\d+$/)) {
                    newState.subDisplay += ".";
                }
                // If it as an operation add a decimal and a 0
                else if (this.state.subDisplay.match(OPERATION_RE)) {
                        newState.display += this.state.subDisplay;
                        newState.subDisplay = "0.";
                    }

            this.setState(newState);
        }
    }, {
        key: "handleClear",
        value: function handleClear() {
            this.setState({
                display: "",
                subDisplay: "0"
            });
        }
    }, {
        key: "maxDigitWarning",
        value: function maxDigitWarning() {
            var _this2 = this;

            var currentSubDisplay = this.state.subDisplay;
            var currentDisplay = this.state.display;

            // Set sub display to show digit limit met
            this.setState({
                display: this.state.display + this.state.subDisplay,
                subDisplay: "DIGIT LIMIT MET"
            });

            // Reset state after a timeout
            setTimeout(function () {
                return _this2.setState({ display: currentDisplay, subDisplay: currentSubDisplay });
            }, 1000);
        }
    }, {
        key: "handleResults",
        value: function handleResults(e) {
            var expression = this.state.display;

            // If we have digits not ending in a decimal
            if (this.state.subDisplay.match(/^\d+(\.\d+)?$/)) {
                expression += this.state.subDisplay;
            }
            // If we have digits ending in a decimal add a 0
            else if (this.state.subDisplay.match(/^\d+\.$/)) {
                    expression += this.state.subDisplay + "0";
                }
                // If sub display is an operation don't add it
                else if (this.state.subDisplay.match(OPERATION_RE)) {
                        null;
                    }

            var expressionParsed = expression;
            // Replace -- with +
            expressionParsed = expressionParsed.replace(/--/g, "+");

            var result = eval(expressionParsed);
            result = (Math.round(1000000000000 * result) / 1000000000000).toString();

            expression += "=";

            this.setState({
                display: expression,
                subDisplay: result
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            console.log(this.state);

            var display = this.state.display;

            // Only add on the sub display if it isn't 0 unless the display is empty
            // And unless the digit limit met warning message is being display
            if (display == '' | this.state.subDisplay != "0" && this.state.subDisplay != "DIGIT LIMIT MET") {
                display += this.state.subDisplay;
            }

            return React.createElement(
                "div",
                { id: "calculator" },
                React.createElement(
                    "div",
                    { id: "equals", onClick: this.handleResults, className: "button" },
                    "="
                ),
                React.createElement(
                    "div",
                    { id: "clear", onClick: this.handleClear, className: "button" },
                    "AC"
                ),
                Object.keys(nums).map(function (n, i) {
                    return React.createElement(Number, { num: n, key: i, value: nums[n], handleDigit: _this3.handleDigit });
                }),
                Object.keys(operations).map(function (n, i) {
                    return React.createElement(Operation, { operation: n, key: i, value: operations[n], handleOperation: _this3.handleOperation });
                }),
                React.createElement(
                    "div",
                    { id: "decimal", onClick: this.handleDecimal, className: "button" },
                    "."
                ),
                React.createElement(
                    "div",
                    { id: "display" },
                    display
                ),
                React.createElement(
                    "div",
                    { id: "sub-display" },
                    this.state.subDisplay
                )
            );
        }
    }]);

    return App;
}(React.Component);

var domContainer = document.querySelector('#root');
var calculator = ReactDOM.render(React.createElement(App, null), domContainer);