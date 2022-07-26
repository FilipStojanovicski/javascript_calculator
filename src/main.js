const e = React.createElement;

const nums = {"zero": 0, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9};
const operations = {"multiply": "*", "divide": "/", "add": "+", "subtract": "-"};

// Regular expression matching a floating point number
const DIGITS_RE = /^\d+\.?\d*$/;
// Regular expression matching an operation
const OPERATION_RE = /^[\*/+-]-?$/;

function Number(props) {
    return (
        <div id={props.num} onClick={props.handleDigit} 
        value={props.value} className="button number">{props.value}</div>
    );
}

function Operation(props) {
        // Replace the text value with * for multiplication
        text = (props.value == "*") ? "x" : props.value
        return (
            <div id={props.operation} onClick={props.handleOperation} 
            value={props.value} className="button operator">{text}</div>
        );
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: "",
            subDisplay: "0"
        };
        this.handleDigit = this.handleDigit.bind(this);
        this.handleOperation = this.handleOperation.bind(this);
        this.handleResults = this.handleResults.bind(this);
        this.handleDecimal = this.handleDecimal.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.maxDigitWarning = this.maxDigitWarning.bind(this);

    }

    handleDigit(e){
        // Get the current digit based on which digit div was clicked
        const val = nums[e.target.id];

        if (this.state.subDisplay.length > 27){
            this.maxDigitWarning();
            return true
        }

        var newState = {
            display: this.state.display,
            subDisplay: this.state.subDisplay,
        }

        // If we just evaluated the results remove the display
        if (this.state.display.match("=")){
            newState.subDisplay = val.toString();
            newState.display = "";
            this.setState(newState);
            return true;
        }

        // If the sub display is 0 replace the 0 with the new digit
        if (this.state.subDisplay == "0"){
            newState.subDisplay = val.toString();
        }
        // If sub display is digits and not 0
        else if (this.state.subDisplay.match(DIGITS_RE) && this.state.subDisplay != "0"){
            newState.subDisplay += val;
            } 
        // If sub display is an operation
        else if (this.state.subDisplay.match(OPERATION_RE)){
            newState.display += this.state.subDisplay;
            newState.subDisplay = val.toString();
        }

        this.setState(newState);
        
    }

    handleOperation(e){
        const operation = operations[e.target.id];

        var newState = {
            display: this.state.display,
            subDisplay: this.state.subDisplay,
        }

        // If we just evaluated the results set the display to the subdisplay
        if (this.state.display.match("=")){
            newState.display = this.state.subDisplay;
            newState.subDisplay = operation;
            this.setState(newState);
            return true;
        }

        // If empty or last character is a digit 
        // Add sub display to display and replace with operation
        if (this.state.subDisplay == ""){
            newState.display += this.state.subDisplay;
            newState.subDisplay = operation;
        }
        // If we have digits not ending in a decimal
        else if (this.state.subDisplay.match(/^\d+(\.\d+)?$/)){
            newState.display += this.state.subDisplay;
            newState.subDisplay = operation;
        } 
        // If we have digits ending in a decimal add a 0
        else if (this.state.subDisplay.match(/^\d+\.$/)){
            newState.display += this.state.subDisplay + "0";
            newState.subDisplay = operation;
        } 
        // If we have just one operation
        else if (this.state.subDisplay.match(/^[\*/+-]$/)){
            // If our new operation is a minus sign add it on
            if (operation == "-"){
                newState.subDisplay += operation;
            } 
            // Otherwise replace the operation
            else {
                newState.subDisplay = operation;
            }
        }
        // If we have an operation with a negative sign replace the operation
        else if (this.state.subDisplay.match(/^[\*/+-]-$/)){
            newState.subDisplay = operation;
        }
        this.setState(newState)
    }

    handleDecimal(){

        if (this.state.subDisplay.length > 27){
            this.maxDigitWarning();
            return true
        }

        var newState = {
            subDisplay: this.state.subDisplay,
            display: this.state.display
        }


        // If we just evaluated the results set the display to the subdisplay
        if (this.state.display.match("=")){
            newState.display = ""
            newState.subDisplay = "0.";
            this.setState(newState);
            return true;
        }

        // If there is a decimal do nothing
        if (this.state.subDisplay.match(/\./g)){
            return true
        }
        // If sub display is digits add a decimal
        else if (this.state.subDisplay.match(/^\d+$/)){
            newState.subDisplay += ".";
            } 
        // If it as an operation add a decimal and a 0
        else if (this.state.subDisplay.match(OPERATION_RE)){
            newState.display += this.state.subDisplay;
            newState.subDisplay = "0.";
        }

        this.setState(newState);
    }

    handleClear(){
        this.setState(
            {
                display: "",
                subDisplay: "0"
            }
        )
    }

    maxDigitWarning(){
        
        const currentSubDisplay = this.state.subDisplay;
        const currentDisplay = this.state.display;

        // Set sub display to show digit limit met
        this.setState({
            display: this.state.display + this.state.subDisplay,
            subDisplay: "DIGIT LIMIT MET"
        })

        // Reset state after a timeout
        setTimeout(() => this.setState(
            {display: currentDisplay, subDisplay: currentSubDisplay }), 1000);

    }

    handleResults(e){
        var expression = this.state.display;

        
        // If we have digits not ending in a decimal
        if (this.state.subDisplay.match(/^\d+(\.\d+)?$/)){
            expression += this.state.subDisplay;
        } 
        // If we have digits ending in a decimal add a 0
        else if (this.state.subDisplay.match(/^\d+\.$/)){
            expression += this.state.subDisplay + "0";
        } 
        // If sub display is an operation don't add it
        else if (this.state.subDisplay.match(OPERATION_RE)){
            null
        }

        var expressionParsed = expression;
        // Replace -- with +
        expressionParsed = expressionParsed.replace(/--/g,"+");

        var result = eval(expressionParsed)
        result = (Math.round(1000000000000 * result)/ 1000000000000).toString();

        expression += "=";

        this.setState({
            display: expression,
            subDisplay: result
        })


    }


    render() {
        console.log(this.state);

        var display = this.state.display;

        // Only add on the sub display if it isn't 0 unless the display is empty
        // And unless the digit limit met warning message is being display
        if ((display == '' | this.state.subDisplay != "0") && this.state.subDisplay !=  "DIGIT LIMIT MET"){
            display += this.state.subDisplay;
        }

        return (
            <div id="calculator">
                <div id="equals" onClick = {this.handleResults} className="button">=</div>
                <div id="clear" onClick ={this.handleClear} className="button">AC</div>
                {Object.keys(nums).map((n,i) => {
                    return <Number num={n} key={i} value={nums[n]}  handleDigit = {this.handleDigit}/>
                })}
                {Object.keys(operations).map((n,i) => {
                    return <Operation operation={n} key={i} value={operations[n]}  handleOperation = {this.handleOperation}/>
                })}
                <div id="decimal" onClick ={this.handleDecimal} className="button">.</div>
                <div id="display">{display}</div>
                <div id="sub-display">{this.state.subDisplay}</div>
            </div>
        );
    }
}

let domContainer = document.querySelector('#root');
let calculator = ReactDOM.render(<App />, domContainer);