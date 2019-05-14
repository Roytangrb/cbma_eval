var $ = function(selector){
    return document.querySelector(selector)
}

function App() {
    this.roomNum = 0;
    this.rooms = [];
    this.sizeInputs = {};
    this.currentRoom= null;
    this.currentWall= null;
    this.editor = null;
    this.report = null;

    this.addRoomHandler = function() {
        if (!this.currentRoom){
            //validate size inputs
            var validResult = this.validateSize(this.sizeInputs.w_input.myValue, this.sizeInputs.d_input.myValue, this.sizeInputs.h_input.myValue)
            if(validResult){
                //create new room
                this.rooms.push(new Room("Room"+this.roomNum, validResult.w, validResult.d, validResult.h))
                this.roomNum ++;
                this.currentRoom = this.rooms[this.rooms.length-1]
                //render lastest room to container
                $('#roomContainer').appendChild(this.currentRoom.dom)
                var user_hint_div = document.createElement('div')
                var user_hint = "<h2>房间平面图</h2><p>长按任意平面更改涂料</p>"
                user_hint_div.innerHTML = user_hint
                $('#roomContainer').prepend(user_hint_div)
                //render editor with current room, front wall
                this.currentWall = this.currentRoom.walls.front
                this.report = new Report(this.currentRoom)
                this.editor = new Editor(this.currentWall, this.report)
                //hide button
                $('#addRoomPage').style.display = 'none'
                //hide the room history
                $('#history').style.display = 'none'
            } else {
                //size input not valid
                $('#input-error').innerHTML= '<span style="color:red;font-size: 12px;">尺寸输入错误<span>'
                var errorFade = setTimeout(function(){
                    $('#input-error').innerHTML= ''
                    clearTimeout(errorFade)
                }, 1500)
            }
        }
    }
    $('#addRoomButton').addEventListener('click', this.addRoomHandler.bind(this))

    //to be called back by wall click listener
    this.changeCurrentWall = function(wall) {
        this.currentWall.dom.style.backgroundColor = 'grey' //restore bgColor
        wall.dom.style.backgroundColor = 'lightgrey'
        this.currentWall = wall
        this.editor.updateEditorDom(this.currentWall)
        this.report.updateReport()
    }

    this.createSizeInputs()
    this.inputExpanded = false
    $('#sizeForm').style.display = 'none' //init hiding form
    this.expandInputsHandler = function(event){

        // see which button is clicked, add or cancel
        if (event.target.id === "expandSizeInput") {
            this.inputExpanded = true;
            $('#sizeForm').style.display = 'inline-block'
            $('#expandSizeInput').style.display = 'none'
            // auto focus on text input for user.
            $('#size-inputs').firstChild.focus();
        }
        else {
        // the cancel button is clicked.
            $('#sizeForm').style.display = 'none'
            $('#expandSizeInput').style.display = 'inline-block'
            this.inputExpanded = false;
        }

    }

    $('#CancelAddRoomButton').addEventListener('click', this.expandInputsHandler.bind(this))
    $('#expandSizeInput').addEventListener('click', this.expandInputsHandler.bind(this))

}

App.prototype.createSizeInputs = function() {
    var w_input = new ControlledInput('w_input', 'text', '长：(m)')
    var d_input = new ControlledInput('d_input', 'text', '宽：(m)')
    var h_input = new ControlledInput('h_input', 'text', '高：(m)')
    this.sizeInputs.w_input = w_input
    this.sizeInputs.d_input = d_input
    this.sizeInputs.h_input = h_input

    $('#size-inputs').appendChild(w_input.dom)
    $('#size-inputs').appendChild(d_input.dom)
    $('#size-inputs').appendChild(h_input.dom)
}
        
App.prototype.validateSize = function(w, d, h) {
    //coerced to number
    w = +w;
    d = +d;
    h = +h;
    if (w>0 && d>0 && h>0){
        return {w:w, d:d, h:h}
    } 
    return false
}

var myApp = new App();