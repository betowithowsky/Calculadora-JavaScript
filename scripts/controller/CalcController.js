class CalcController {

    constructor() {

        this._lastOperator = '';
        this._lastNumber = '';
        this._audioOnOff = false;
        this._audio = new Audio('click.mp3');

        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._operation = [];
        this._currentDate;
        this.initialize();
        this.initButtonsEventos();
        this.initKeyBoard();

    }

    pasteFromClipboard(){

        document.addEventListener('paste', e =>{
            
            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);

        });
    }

    copyToClipboard() {

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();
    }

    initialize() {

        this.setDisplayeDateTime();

        let interval = setInterval(() => {

            this.setDisplayeDateTime();
        }, 1000);

        //setTimeout(() => {
        //    clearInterval(interval);
        //    clearTimeout(interval);
        // }, 10000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn =>{
            btn.addEventListener('dblclick', e =>{
                this.toggleAudio();
            });
        });

    }

    toggleAudio(){
        this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    initKeyBoard() {
        document.addEventListener('keyup', e => {

            this.playAudio();

            switch (e.key) {
                case 'Escape':
                    //AC = All Clear
                    this.clearAll();
                    break;

                case 'Backspace':
                    //CE - Cancel Entry
                    this.clearEntry();
                    break;

                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key);
                    break;

                case '=':
                case 'Enter':
                    this.calc();
                    break;

                case '.':
                case ',':
                    this.addDot();
                    break;

                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    //console.log(value);
                    this.addOperation(parseInt(e.key));
                    break;

                case 'c':
                    if (e.ctrlKey)
                        this.copyToClipboard();
                    break;
            }
        });
    }

    clearAll() {
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();
    }

    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value) {
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    pushOperation(value) {
        this._operation.push(value);

        if (this._operation.length > 3) {

            this.calc();

            //console.log(this._operation);
        }
    }

    getResult() {
        try{
            return eval(this._operation.join(""));            
        }catch(e){
            setTimeout(() => {
                this.setError();
            }, 1);            
        }
        
    }

    calc() {

        let last = "";

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3) {

            last = this._operation.pop();
            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);

        }

        console.log("last number: " + this._lastNumber);
        console.log("last operation: " + this._lastOperator);

        let result = this.getResult();

        if (last == '%') {

            result /= 100;

            this._operation = [result];

        } else {

            this._operation = [result];

            if (last) this._operation.push(last);

        }

        this.setLastNumberToDisplay();

    }

    getLastItem(isOperator = true) {

        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }

        if (!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
        return lastItem;
    }

    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    //Adiciona a operação
    addOperation(value) {

        console.log('Test', value, isNaN(this.getLastOperation()));

        if (isNaN(this.getLastOperation())) {
            //not a number = NaN
            if (this.isOperator(value)) {

                //trocar operador
                this.setLastOperation(value);

            } else {

                this.pushOperation(value);
                this.setLastNumberToDisplay();

            }

        } else {

            if (this.isOperator(value)) {

                this.pushOperation(value);

            } else {

                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();

            }

        }

        console.log(this._operation);
    }

    setError() {
        this.displayCalc = "Error";
    }

    execBtn(value) {
        this.playAudio();

        switch (value) {
            case 'ac':
                //AC = All Clear
                this.clearAll();
                break;

            case 'ce':
                //CE - Cancel Entry
                this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addDot();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                //console.log(value);
                this.addOperation(parseInt(value));
                break;


            default:
                this.setError();
                break;

        }
    }

    addDot() {

        let lastOperaton = this.getLastOperation();

        if (typeof lastOperaton === 'string' && lastOperaton.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperaton) || !lastOperaton) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperaton.toString + ' .');
        }

        this.setLastNumberToDisplay();
    }

    addEventListenerAll(element, events, fn) {

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);
        });

    }

    initButtonsEventos() {

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index) => {

            this.addEventListenerAll(btn, 'click drag', e => {
                console.log(btn.className.baseVal.replace("btn-", ""));
                let textBtn = btn.className.baseVal.replace("btn-", "");
                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn, 'mouseup mousedown mouseover', e => {
                btn.style.cursor = "pointer";
            });

        })
    }

    setDisplayeDateTime() {

        this.displayDate = this.currenteDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        this.displayTime = this.currenteDate.toLocaleTimeString(this._locale);

    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(valor) {

        if(valor.toString().length > 10){
            this.setError();
            return;
        }
        this._displayCalcEl.innerHTML = valor;
    }

    get displayDate() {
        return this._dateEl.innerHTML = new Date().toLocaleDateString('pt-BR');
    }

    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }

    get displayTime() {
        return this._timeEl.innerHTML = new Date().toLocaleTimeString('pt-BR');
    }

    set displayTime(value) {
        this._timeEl.innerHTML = value;
    }

    get currenteDate() {
        return new Date();
    }

    set currenteDate(value) {
        this._currentDate = value;
    }

}