//-----------------------------------------------------------------------------
// Game_Message
//
// The game object class for the state of the message window that displays text
// or selections, etc.

class Game_Message {
    protected _texts: string[];
    protected _choices: string[];
    protected _faceName: string;
    protected _faceIndex: number;
    protected _background: number;
    protected _positionType: number;
    protected _choiceDefaultType: number;
    protected _choiceCancelType: number;
    protected _choiceBackground: number;
    protected _choicePositionType: number;
    protected _numInputVariableId: number;
    protected _numInputMaxDigits: number;
    protected _itemChoiceVariableId: number;
    protected _itemChoiceItypeId: number;
    protected _scrollMode: boolean;
    protected _scrollSpeed: number;
    protected _scrollNoFast: boolean;
    protected _choiceCallback: Function;

    constructor() {
        this.clear();
    };
    
    clear() {
        this._texts = [];
        this._choices = [];
        this._faceName = '';
        this._faceIndex = 0;
        this._background = 0;
        this._positionType = 2;
        this._choiceDefaultType = 0;
        this._choiceCancelType = 0;
        this._choiceBackground = 0;
        this._choicePositionType = 2;
        this._numInputVariableId = 0;
        this._numInputMaxDigits = 0;
        this._itemChoiceVariableId = 0;
        this._itemChoiceItypeId = 0;
        this._scrollMode = false;
        this._scrollSpeed = 2;
        this._scrollNoFast = false;
        this._choiceCallback = null;
    };
    
    choices() {
        return this._choices;
    };
    
    faceName() {
        return this._faceName;
    };
    
    faceIndex() {
        return this._faceIndex;
    };
    
    background() {
        return this._background;
    };
    
    positionType() {
        return this._positionType;
    };
    
    choiceDefaultType() {
        return this._choiceDefaultType;
    };
    
    choiceCancelType() {
        return this._choiceCancelType;
    };
    
    choiceBackground() {
        return this._choiceBackground;
    };
    
    choicePositionType() {
        return this._choicePositionType;
    };
    
    numInputVariableId() {
        return this._numInputVariableId;
    };
    
    numInputMaxDigits() {
        return this._numInputMaxDigits;
    };
    
    itemChoiceVariableId() {
        return this._itemChoiceVariableId;
    };
    
    itemChoiceItypeId() {
        return this._itemChoiceItypeId;
    };
    
    scrollMode() {
        return this._scrollMode;
    };
    
    scrollSpeed() {
        return this._scrollSpeed;
    };
    
    scrollNoFast() {
        return this._scrollNoFast;
    };
    
    add(text: string) {
        this._texts.push(text);
    };
    
    setFaceImage(faceName: string, faceIndex: number) {
        this._faceName = faceName;
        this._faceIndex = faceIndex;
    };
    
    setBackground(background: number) {
        this._background = background;
    };
    
    setPositionType(positionType: number) {
        this._positionType = positionType;
    };
    
    setChoices(choices: string[], defaultType: number, cancelType: number) {
        this._choices = choices;
        this._choiceDefaultType = defaultType;
        this._choiceCancelType = cancelType;
    };
    
    setChoiceBackground(background: number) {
        this._choiceBackground = background;
    };
    
    setChoicePositionType(positionType: number) {
        this._choicePositionType = positionType;
    };
    
    setNumberInput(variableId: number, maxDigits: number) {
        this._numInputVariableId = variableId;
        this._numInputMaxDigits = maxDigits;
    };
    
    setItemChoice(variableId: number, itemType: number) {
        this._itemChoiceVariableId = variableId;
        this._itemChoiceItypeId = itemType;
    };
    
    setScroll(speed: number, noFast: boolean) {
        this._scrollMode = true;
        this._scrollSpeed = speed;
        this._scrollNoFast = noFast;
    };
    
    setChoiceCallback(callback: Function) {
        this._choiceCallback = callback;
    };
    
    onChoice(n: number) {
        if (this._choiceCallback) {
            this._choiceCallback(n);
            this._choiceCallback = null;
        }
    };
    
    hasText() {
        return this._texts.length > 0;
    };
    
    isChoice() {
        return this._choices.length > 0;
    };
    
    isNumberInput() {
        return this._numInputVariableId > 0;
    };
    
    isItemChoice() {
        return this._itemChoiceVariableId > 0;
    };
    
    isBusy() {
        return (this.hasText() || this.isChoice() ||
                this.isNumberInput() || this.isItemChoice());
    };
    
    newPage() {
        if (this._texts.length > 0) {
            this._texts[this._texts.length - 1] += '\f';
        }
    };
    
    allText() {
        return this._texts.join('\n');
    };
    
}

