/**
 * Created by 310199253 on 2016/10/31.
 */

var dm = new DialogManager();


function openDialog(){

    var content = document.createElement('div');
    var btn = document.createElement('button');
    btn.innerHTML = "Hello";

    content.appendChild(btn);


    dm.openDialog(content);
}


function closeDialog(){
    dm.closeDialog();
}









function DialogManager(){

    // init cover
    this.cover = initCover();
    function initCover(){
        var cover = document.createElement('div');
        cover.id = "dialog-cover";
        cover.style.display = 'none';

        document.body.appendChild(cover);
        return cover;
    }


    this.zIndexArray = [this.cover]; // contains cover and all dialogs, cover be the first and the dialog acts like a stack


    this.openDialog = function(contentObj){
        // use event to open a new dilaog from internal; use this method to open a new dialog from external.
        var dialog = toDom('<div class="dialog"></div>');

        if(contentObj.getDomNode){
            dialog.appendChild(contentObj.getDomNode());
        }else{
            dialog.appendChild(contentHTML);
        }

        // add cancel & ok button
        var buttonBar = toDom('<div class="buttonBar"><button class="cancel">Cancel</button> <button class="ok">OK</button></div>');
        dialog.appendChild(buttonBar);

        // add event to cancel/ok button
        buttonBar.querySelector('.cancel').addEventListener('click', e =>{
            this.closeDialog();
            if(contentObj.cancel){
                contentObj.cancel();
            }
        });
        buttonBar.querySelector('.ok').addEventListener('click', e =>{
            this.closeDialog();
            if(contentObj.ok){
                contentObj.ok();
            }
        });


        // add to zindex array
        addToZIndexArray(this.zIndexArray, dialog);

        // re z-index
        this.reZIndex(this.zIndexArray);

        document.body.appendChild(dialog);
    };

    function addToZIndexArray(zIndexArray, dialog){
        swapLastTwo(zIndexArray);

        zIndexArray.push(dialog);
    }

    function swapLastTwo(array){
        var len = array.length;
        if(len > 1){
            // swap the last two element
            var tmp = array[len-1];
            array[len-1] = array[len -2];
            array[len-2] = tmp;
        }
    }

    this.reZIndex = function (zIndexArray){
        for(var i=0;i<zIndexArray.length;i++){
            var dom = zIndexArray[i];
            dom.style.zIndex = i+1;
        }

        if(zIndexArray.length> 1){
            this.cover.style.display = 'block';
        }else{
            this.cover.style.display = 'none';
        }

    };

    this.closeDialog = function(){

        if(this.zIndexArray.length == 1){
            this.reZIndex(this.zIndexArray);
            return;
        }

        // use event to close a dialog from internal; use this method to close a dialog from external.
        var lastDialog = this.zIndexArray.pop();

        document.body.removeChild(lastDialog);

        swapLastTwo(this.zIndexArray);

        this.reZIndex(this.zIndexArray);
    };


    // listen on body
    document.body.addEventListener('dialog/open', function(dom){
        // TODO
        this.openDialog(dom);
    });

    document.body.addEventListener('dialog/close', function(){
        this.closeDialog();
    });


}