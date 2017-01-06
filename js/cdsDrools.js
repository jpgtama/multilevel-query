function loadRuleForVariable(){
    var model_var_id = $('#vaiableName').val();
    console.log(model_var_id)
    var url = 'http://localhost:8080/BaseX844/rest/SCI.PMMLs/sci.drl'
        $.ajax({ 
                type: 'GET', 
                url: url, 
                dataType: 'text',
                username: '',
                password: '',
                success: function(response){
                    $('#ruleCodeEnditor').val(response)
                },
                
                error: function(data){
                    console.log('failed to get drl file')
                }
                })
    
    
}
function checkAge(){
    //checkFieldEx('com.philips.icmc.Patient', "age", 25, 'use_case_3_message')
    //checkFieldEx('com.philips.icmc.Patient', "name", "2011-09-07", 'use_case_3_message')
    checkFieldEx('com.philips.icmc.Patient', "birthDate", "2011-09-07", 'use_case_3_message')
    
}

function executeRuls(){
    var msgElemId = 'drools_results'
    
    var dataType = $('#rule_input_data_type').val()
    if( dataType == 'concept'){
        $('#' + msgElemId).val("{'value':1}")
    }else if (dataType == 'noneConcept'){
        $('#' + msgElemId).val("{'value':0}")
    }else{
        var mapDict = {}
        mapDict['Patient'] = 'com.philips.icmc.Patient'
        
        var rType = $('#fhir_resource').val()
        var attrName = $('#fhir_resource_attrs').val()
        var attrValue = $('#rule_input_data').val()
        
        console.log(rType)
        console.log(attrName)
        console.log(attrValue)
        checkFieldEx(mapDict[rType], attrName, attrValue, msgElemId)
    }
}
function assign_value(){
    var msgElemId = 'drools_results';
    var data = JSON.parse($('#' + msgElemId).val().replace(/'/g, '"'))
    console.log(data)
    //http://www.haorooms.com/post/checkandselect
    var selected_value = $('input[type="radio"][name="final_value"]:checked').val()
    //$("input[type='radio'][name='final_value'][value='" + selected_value +"']").prop("checked", false);
    $("input[type='radio'][name='final_value'][value='" + data['value'] +"']").attr("checked", "checked")
}
function checkFieldEx(classNameStr, instanceFeatureStr, instanceValue, msg_element_id){
            console.log(classNameStr, instanceFeatureStr, instanceValue)
            //var myData = JSON.parse('{"commands" : [{ "insert" : { "object" : {"com.philips.icmc.Employee":{"clockedAt":19}} } },{ "fire-all-rules" : { } }]}')
            
            //var myData = {"commands" : [{ "insert" : { "object" : {"com.philips.icmc.Patient":{"clockedAt":value}}, "out-identifier":"patient"} },{"fire-all-rules": { } }]}
            
            ///////var myData = {"commands" : [{ "insert" : { "object" : {"com.philips.icmc.Patient":{"clockedAt":instanceValue}}, "out-identifier":"patient"} },{"fire-all-rules": { } }]}
            var myData = {"commands" : [{ "insert" : { "object" : {}, "out-identifier":"patient"} },{"fire-all-rules": { } }]}
            
            /////Example 1
            myData.commands[0].insert.object[classNameStr] = {}
            myData.commands[0].insert.object[classNameStr][instanceFeatureStr] = instanceValue;
            /////Example 2
                       
            //var pmml_str = $('#PMMLEnditor').val().replace('\n', ' ').replace(/"/g, '\\"')
            //classNameStr = 'com.philips.icmc.Patient'
            //instanceFeatureStr = 'pmml'
            //instanceValue = "PMML"
            //myData.commands[0].insert.object[classNameStr] = {} 
            //myData.commands[0].insert.object[classNameStr][instanceFeatureStr] = instanceValue;
            ///////
            console.log(myData)
            var url = 'http://localhost:8080/kie-server-6.3.0.Final-webc/services/rest/server/containers/instances/myContainer1'
            $.ajax({ 
                type: 'post', 
                url: url, 
                dataType: 'json', 
                data: JSON.stringify(myData),
               
                'contentType': 'application/json; charset=utf-8',
                success: function(response){
                        console.log(response);
                        var results = JSON.parse(response['result'])['results']//response['result'] is string.
                        for(i=0; i<results.length; i++){
                            if (results[i].key == 'patient'){
                                var responseMsg = results[i].value["com.philips.icmc.Patient"]
                                $('#' + msg_element_id).val(responseMsg['message']);
                            }
                        }
                }, 
                 error: function(data) {
                 if (data.status == 500){
                    console.log('could not access service')
                    console.log('May caused by the deletion of the older version of the iRules from the maven repository')
                    console.log('Restart the tomcat and check which version is loading. Reinstall that version will solve this problem')
                    console.log(data)
                 }else{
                    
                    $.messager.alert('info','error'); 
                }
                } 
                 }); 

        }