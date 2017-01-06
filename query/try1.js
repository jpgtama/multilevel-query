/**
 * Created by evan on 10/27/16.
 */

var container = document.querySelector('.container');


function createFieldCriteria(parent) {
    var f = new Field();

    var criteria = new Criteria(f);

    // if (parent) {
    //     criteria.placeAt(parent);
    // } else {
    //     criteria.placeAt(container);
    // }

    return criteria;
}

function createGroupCriteria(criList) {
    var g = new Group("No Name Group", 'and', criList);

    var criteria = new Criteria(g);

    // if (parent) {
    //     criteria.placeAt(parent);
    // } else {
    //     criteria.placeAt(container);
    // }

    return criteria;
}


function toDom(str) {
    var div = document.createElement('div');
    div.innerHTML = str;

    return div.children[0];
}


function Container(name, rel, criteriaList) {

    // TODO
    this.containerWrapperDom = toDom('<div class="containerWrapper"></div>');

    // name
    this.name = name || "";
    this.nameDom = toDom('<div class="name"><label>Name: </label>  <input type="text" name="name" autofocus="true"/></div>');
    this.nameInputDom = this.nameDom.querySelector('input');
    this.nameInputDom.value = this.name;

    // relation
    this.relDom = toDom('<div class="rel"> <form><label><input type="radio" name="rel" value="and"/> And </label>  <label>  <input type="radio" name="rel" value="or"/> or  </label>  </form>   </div>');
    this.relFormDom = this.relDom.querySelector('form');
    this.relAndDom = this.relDom.querySelector('input[value=and]');
    this.relOrDom = this.relDom.querySelector('input[value=or]');
    this.rel = rel || 'and'; // defualt value is and

    this.relAndDom.addEventListener('change', e =>{
        this.rel = this.relFormDom.elements['rel'].value;
    });

    this.relOrDom.addEventListener('change', e =>{
        this.rel = this.relFormDom.elements['rel'].value;
    });

    this.setRel = function (rel) {
        this.rel = rel;
        this.relFormDom.elements['rel'].value = rel;
    };

    this.setRel(this.rel);

    // group operation
    this.groupOperationDom = toDom('<div class="groupOperation"> <button class="inGroup">In Group</button> <button class="outGroup">Out Group</button> </div>');
    this.inGroupButton = this.groupOperationDom.querySelector('.inGroup');
    this.outGroupButton = this.groupOperationDom.querySelector('.outGroup');


    this.containerDom = toDom('<div class="container"></div>');

    this.toolBarDom = toDom('<div class="toolBar"> <button class="addField">Add Field</button> <button class="addGroup">Add Group</button> </div>');

    // add name change handler
    this.nameInputDom.addEventListener('change', e =>{
        this.name = this.nameInputDom.value;
    });

    // add group operation event
    this.inGroupButton.addEventListener('click', e => {
        // get selected criteria
        var selectedCri = this.selectedCriterias;

        // remove them
        selectedCri.forEach(sc =>{
            this.removeCriteria(sc);
            this.removeCriteriaDom(sc);

            // uncheck checkbox
            sc.uncheck();
        });

        // create a new group
        var g = createGroupCriteria(selectedCri);

        // add to me
        this.addCriteria(g);

        // empty selected list
        this.selectedCriterias = [];
    });

    this.outGroupButton.addEventListener('click', e => {
        if(this.selectedCriterias.length == 1){
            var selectedGroupCriteria = this.selectedCriterias[0];

            // get criteria list in group
            var clist = selectedGroupCriteria.criteriaElement.criteriaList;

            // remove this group
            this.removeCriteria(selectedGroupCriteria);
            this.removeCriteriaDom(selectedGroupCriteria);

            // add the list in the group to me
            clist.forEach(cInList =>{
                this.addCriteria(cInList);
            });

            // empty selected list
            this.selectedCriterias = [];
        }
    });

    // remove listener
    this.childRemove = function(child){
        this.removeCriteria(child);
    };

    this.removeCriteria =function(c){
        removeFromArray(this.criteriaList, c);
    };

    this.removeCriteriaDom =function(c){
        this.containerDom.removeChild(c.getDomNode());
    };

    function removeFromArray(array, e){
        var index = -1;
        for(var i=0;i<array.length;i++){
            var eInlist = array[i];
            if(e == eInlist){
                index = i;
                break;
            }
        }
        array.splice(index, 1);
    }

    this.selectedCriterias = [];

    // child select handler
    this.childSelect = function (child, selected) {
        if(selected){
            // add
            if(this.selectedCriterias.indexOf(child)== -1){
                this.selectedCriterias.push(child);
            }
        }else{
            // remove
            if(this.selectedCriterias.indexOf(child) != -1){
                // this.selectedCriterias.push(child);
                removeFromArray(this.selectedCriterias, child);
            }
        }

        this.updateGroupButtonState();
    };


    // out group button state
    this.updateGroupButtonState = function () {
        if(this.selectedCriterias.length == 0){
            this.outGroupButton.disabled = true;
            this.inGroupButton.disabled = true;
        }else if(this.selectedCriterias.length == 1){
            // only group criteria can out group
            if(this.selectedCriterias[0].criteriaElement.class == 'Group'){
                this.outGroupButton.disabled = false;
            }else{
                this.outGroupButton.disabled = true;
            }
            this.inGroupButton.disabled = false;
        }else{
            this.outGroupButton.disabled = true;
            this.inGroupButton.disabled = false;
        }

    };



    // criteria list
    this.criteriaList = criteriaList || [];

    // add criteria dom
    this.criteriaList.forEach(c => {
        this.containerDom.appendChild(c.getDomNode());
    });

    this.setContainerOnChild = function(){
        this.criteriaList.forEach(c => {
            c.setContainer(this);
        })
    };

    this.setContainerOnChild();

    // add event
    this.toolBarDom.querySelector('.addField').addEventListener('click', e => {
        var c = createFieldCriteria();
        this.addCriteria(c);
    });

    this.toolBarDom.querySelector('.addGroup').addEventListener('click', e => {
        var c = createGroupCriteria();
        this.addCriteria(c);
    });

    this.addCriteria = function (cri) {
        // add dom
        this.containerDom.appendChild(cri.getDomNode());
        // add to list
        this.criteriaList.push(cri);

        this.setContainerOnChild();
    };

    // mount dom to wrapper
    ['nameDom', 'relDom', 'groupOperationDom', 'containerDom', 'toolBarDom'].forEach(attr => {
        this.containerWrapperDom.appendChild(this[attr]);
    });


    addPlaceAt(this, 'containerWrapperDom');

    addGetDomNode(this, 'containerWrapperDom');


    // update button state
    this.updateGroupButtonState();


    this.toJson = function () {
        var obj = {};
        var conditions = [];
        this.criteriaList.forEach(c => {
            conditions.push(c.criteriaElement.toJson());
        });
        obj['$'+this.rel] = conditions;

        return obj;
    };




}


function addPlaceAt(obj, attr) {
    obj['placeAt'] = function (parent) {
        if (parent.getDomNode) {
            parent.getDomNode().appendChild(obj[attr]);
        } else {
            parent.appendChild(obj[attr]);
        }
    }
}

function addGetDomNode(obj, attr) {
    obj.getDomNode = function () {
        return obj[attr];
    }
}


function Criteria(criteriaElement) {

    this.setContainer = function(con){
        this.container = con;
    };

    this.criteriaElement = criteriaElement;


    // init dom
    this.criteriaWrapperDom = toDom('<div class="criteriaWrapper"></div>');

    this.selectorDom = toDom('<input class="selector" type="checkbox" />');

    this.criteriaDom = toDom('<div class="criteria"> </div>');

    this.deleteDom = toDom('<span class="delete">X</span>');

    // add select event
    this.selectorDom.addEventListener('change', e=>{
        this.container.childSelect(this, this.selectorDom.checked);
    });

    this.uncheck =function () {
        this.selectorDom.checked = false;
    };

    // add delete event
    this.deleteDom.addEventListener('click', e => {
        this.getDomNode().parentElement.removeChild(this.getDomNode());
        this.container.childRemove(this);
    });


    ['selectorDom', 'criteriaDom', 'deleteDom'].forEach(attr => {
        this.criteriaWrapperDom.appendChild(this[attr]);
    });

    // add
    if (this.criteriaElement) {
        this.criteriaDom.appendChild(this.criteriaElement.getDomNode());
    } else {
        throw 'no criteriaElement';
    }


    this.placeAt = function (parent) {
        if (parent.getDomNode) {
            parent.getDomNode().appendChild(this.criteriaWrapperDom);
        } else {
            parent.appendChild(this.criteriaWrapperDom);
        }
    };


    this.getDomNode = function () {
        return this.criteriaWrapperDom;
    };

    this.eventLisenters = null;

    function initEventListener(obj){
        if(!obj.eventLisenters){
            obj.eventLisenters = {};
        }
    }



}


function Field(paramArray) {
    this.class = 'Field';

    // init params
    if (paramArray && paramArray.length == 3) {
        this.field = paramArray[0];
        this.op = paramArray[1];
        this.value = paramArray[2];
    }


    this.fieldDom = toDom('<select> <option value="age">Age</option> <option value="FB">Field B</option> <option value="FC">Field C</option> <option value="FD">Field D</option> <option value="FE">Field E</option> </select>');

    this.opDom = toDom('<select> <option value="eq">=</option> <option value="gt">&gt;</option> <option value="ge">&ge;</option>  <option value="lt">&lt;</option>  <option value="le">&le;</option> </select>');

    this.valueDom = toDom('<input type="text" value=""/>');

    this.domWrapper = toDom('<div class="field"></div>');

    // add listener to change
    this.fieldDom.addEventListener('change', e =>{
        this.field = this.fieldDom.value;
    });
    this.opDom.addEventListener('change', e =>{
        this.op = this.opDom.value;
    });
    this.valueDom.addEventListener('change', e =>{
        this.value = this.valueDom.value;
    });


    ['fieldDom', 'opDom', 'valueDom'].forEach(attr => {
            this.domWrapper.appendChild(this[attr]);

        var attrV = attr.replace('Dom', '');

        if (this[attrV]) {
            this[attr].value = this[attrV];
        }else{
            this[attrV] = this[attr].value;
        }

    });


    this.placeAt = function (parent) {
        if (parent.getDomNode) {
            parent.getDomNode().appendChild(this.domWrapper);
        } else {
            parent.appendChild(this.domWrapper);
        }
    };

    this.getDomNode = function () {
        return this.domWrapper;
    }

    this.toJson = function(){
        var obj = {};
        obj['$'+this.op] = {};
        obj['$'+this.op][this.field] = this.value;
        return obj;
    }

}


function Group(name, rel, clist) {
    this.class = 'Group';

    /////////////
    // group of criteria
    //
    this.criteriaList = clist || [];

    this.name = name || 'No Name Group';

    this.rel = rel || 'and';

    this.domNode = toDom('<div class="group"></div>');

    this.domNode.innerText = this.name;

    // show property
    this.domNode.addEventListener('click', e => {
        // open a dialog
        var c = new Container(this.name, this.rel, this.criteriaList);

        var group = this;

        var contentObj = {
            getDomNode: function(){
                return c.getDomNode();
            },

            ok: function(){
                group.criteriaList = c.criteriaList;
                group.setName(c.name);
                group.rel = c.rel;
            },

            cancel: function(){

            }
        };
        dm.openDialog(contentObj);
    });

    this.setName = function (name){
       this.name = name;
       this.domNode.innerText = this.name;
    };

    this.addCriteria = function (c) {
        this.criteriaList.push(c);
    };

    this.placeAt = function (parent) {
        if (parent.getDomNode) {
            parent.getDomNode().appendChild(this.domNode);
        } else {
            parent.appendChild(this.domNode);
        }
    };

    this.getDomNode = function () {
        return this.domNode;
    };


    this.toJson = function () {
        var obj = {};
        var conditions = [];
        this.criteriaList.forEach(c => {
            conditions.push(c.criteriaElement.toJson());
        });
        obj['$'+this.rel] = conditions;

        return obj;
    };

}


