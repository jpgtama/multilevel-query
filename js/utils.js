String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function normalizeElementID(element_name){
    element_name.replaceAll('>', '&lgt;')
}