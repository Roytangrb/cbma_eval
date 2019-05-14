function Wall(_name="", _pos="", _width=10, _height=10, _scale) {
    this.name = _name;
    this.position = _pos;
    this.w = _width;
    this.h = _height;
    this.scale = _scale;
    this.material = "";
    this.area = this.w * this.h;
    this.materialOptions = [{
        name: '材料1（1分/平方米）',
        weight: 1
    }, {
        name: '材料2（2分/平方米）',
        weight: 2
    }, {
        name: '材料3（3分/平方米）',
        weight: 3
    }]
    this.materialIndex = -1;
    this.score = 0

    this.dom = createDomForWall(this.name, this.position, this.w, this.h, this.scale);

    this.updateScore = function(scoreDom){
        if (this.materialIndex < 0 || this.materialIndex > this.materialOptions.length-1) {
            scoreDom.innerHTML = '<td>得分：0</td>'
            return 0
        }
        this.score = this.materialOptions[this.materialIndex].weight * this.area
        this.score = this.score > 0 ? this.score : 0
        scoreDom.innerHTML = '<td>得分：' + this.score + '</td>'
        return this.score
    }
    this.updateScore.bind(this)
    
    this.clickHandler = function(event){
        if(window.myApp){
            window.myApp.changeCurrentWall(this);
        }
        // window.document.getElementById("materialSelectPopup").style.display = "block";   
        // // create event listener for the current wall, the listener need to be remove when the popup window is closed.
        // // problem here, not able to remove the EventListener on images.
        // window.document.getElementById("materialOptionsImage").addEventListener("click", this.popup_option_change_handler.bind(this))
        // $('#popupClose').addEventListener('click', function(){ window.document.getElementById("materialOptionsImage").removeEventListener('click', this.popup_option_change_handler); window.document.getElementById("materialSelectPopup").style.display = "none"; })
        // window.onclick = function(event) {
        //     if (event.target.id == "materialSelectPopup") {
        //         window.document.getElementById("materialOptionsImage").removeEventListener('click', this.popup_option_change_handler)
        //         window.document.getElementById("materialSelectPopup").style.display = "none";
        //     }
        // }
    }
    // add a popup window so the user choose material whenever the wall is long pressed.
    var pressTimer;
    this.longPresshandler = function(event) {
        if(event.type === "mouseup" ) {
            clearTimeout(pressTimer);
            return false;
        }else if (event.type === "mousedown") {
            var longPressed_wall_obj = this;
            pressTimer = window.setTimeout(function() {
                //codes below will be excuted when user long press the wall. 
                window.document.getElementById("materialSelectPopup").style.display = "block";   
                // create event listener for the current wall, the listener need to be remove when the popup window is closed.
                // problem here, not able to remove the EventListener on images.
                window.document.getElementById("materialOptionsImage").addEventListener("click", longPressed_wall_obj.popup_option_change_handler.bind(longPressed_wall_obj))
                window.myApp.changeCurrentWall(longPressed_wall_obj)
            }, 300);
            // trying to remove old event handler when the user close popup.
            $('#popupClose').addEventListener('click', function(){ window.document.getElementById("materialOptionsImage").removeEventListener('click', this.popup_option_change_handler); window.document.getElementById("materialSelectPopup").style.display = "none"; })
            window.onclick = function(event) {
                if (event.target.id == "materialSelectPopup") {
                    window.document.getElementById("materialOptionsImage").removeEventListener('click', this.popup_option_change_handler)
                    window.document.getElementById("materialSelectPopup").style.display = "none";
                }
            }
            return false;
        }
    }

    this.popup_option_change_handler = function (event) {
        // the if condition here is to make sure event coming in is the same as cuurent wall, because there are multiple onlick event listeners on option images.
        if (this.name === window.myApp.currentWall.name) {
            var chosen_option = event.target.id;
            console.log(chosen_option);
            switch(chosen_option) {
                case "material_option1":
                    this.materialIndex = 0;
                    window.document.getElementById("materialOptionsImage").removeEventListener('click', this.popup_option_change_handler)
                    window.document.getElementById("materialSelectPopup").style.display = "none";
                    break;
                case "material_option2":
                    this.materialIndex = 1;
                    window.document.getElementById("materialOptionsImage").removeEventListener('click', this.popup_option_change_handler)
                    window.document.getElementById("materialSelectPopup").style.display = "none";
                    break;
                case "material_option3":
                    this.materialIndex = 2;
                    window.document.getElementById("materialOptionsImage").removeEventListener('click', this.popup_option_change_handler)
                    window.document.getElementById("materialSelectPopup").style.display = "none";
                    break;
                default:
                alert("you didn't choose anything")
            }
            window.myApp.changeCurrentWall(this);
            console.log(this)
        }
    }

    this.dom.addEventListener('click', this.clickHandler.bind(this));

    // creating custom long press event listener.
    
    this.dom.addEventListener('mouseup', this.longPresshandler.bind(this))
    this.dom.addEventListener('mousedown', this.longPresshandler.bind(this))
}

function createDomForWall(_name, _pos, _width, _height, _scale){
    var dom = document.createElement('div');
    dom.classList.add('myWall');
    var realSize = computeRealSizeScaleToPixel(_width, _height, _scale)
    dom.style.width = realSize.w;
    dom.style.height = realSize.h;

    switch(_pos){
        case 'front': case 'back': 
            dom.style.display = 'block';
            dom.style.marginLeft = realSize.h+'px'
            break;
        default:
            dom.style.display = 'inline-block';
            break;
    }

    var divContent = document.createTextNode(_name);
    dom.appendChild(divContent)

    return dom
}

function computeRealSizeScaleToPixel(_w, _h, _scale){
    var w_px = Math.round(_w * _scale)
    var h_px = Math.round(_h * _scale)

    var realSize = {
        w: w_px,
        h: h_px
    }

    return realSize
}