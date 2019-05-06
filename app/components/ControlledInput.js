function ControlledInput(_name, _type='text', _placeholder='') {
    this.name = _name;
    this.myValue = '';
    this.type = _type;
    this.placeholder = _placeholder;
    this.pattern = /^\d*$/

    this.typeHandler = function (event){
        if(this.pattern.test(this.dom.value)){ //if contains only numbers
            //update my Value
            this.myValue = this.dom.value
        } else {
            this.dom.value = this.myValue
        }
    }

    this.dom = document.createElement('INPUT');
    this.dom.setAttribute('name', this.name);
    this.dom.setAttribute('type', this.type);
    this.dom.setAttribute('placeholder', this.placeholder);

    this.dom.addEventListener('keyup', this.typeHandler.bind(this));
}