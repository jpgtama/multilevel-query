    //for aggregate
    function ShowDialog(modal)
        {
            $("#overlay").show();
            $("#dialog").fadeIn(100);

            if (modal)
            {
                $("#overlay").unbind("click");
            }
            else
            {
                $("#overlay").click(function (e)
                {
                    HideDialog();
                });
            }
        }

    function HideDialog()
        {
            $("#overlay").hide();
            $("#dialog").fadeOut(300);
        } 
function getSelectedData(pars){
    var td_elm = $(pars.parentNode)
    var row_id = td_elm.attr('id')
    var tr_id = 'tr_' + row_id
    var selected_data = $('#' + tr_id + ' td input').val()
    var selected_data_type_inst = $('#type_' + row_id)
    $('#rule_input_data').val(selected_data)
    
    var selected_data_type = selected_data_type_inst.text()
    console.log(selected_data_type)
    //$('#rule_input_data_type').find('option[value="none"]').attr("selected",true);
    //reference: http://jsfiddle.net/jS3ws/
    $("#rule_input_data_type option").prop('selected', false)
    $('#rule_input_data_type   option[value="' + selected_data_type + '"]').prop("selected",true);
    
    if(['concept', 'none', 'noneConcept'].indexOf(selected_data_type) >=0){
        $('#loadRuleForTheVariableBTN').attr("disabled",true) 
    }
    
    if (['none'].indexOf(selected_data_type) >=0){
        $('#executeRulsBTN').attr("disabled",true) 
    }
    
   
}
function  fhir_next(next_fhir_url){
    
    var url = next_fhir_url;
    $.ajax({ 
                type: 'GET', 
                url: url, 
                dataType: 'json',
                username: '',
                password: '',
                success: function(response){
                    $('#brands').html('')
                    var attr_name_c = 'code.coding'
                    generateResultsTable(response, attr_name_c)
                },
                
                error: function(data){
                    console.log('failed to get PMML xml list')
                }
                })
    
    
    
}

function generateResultsTable(response, attr_name){
var rlts = response
                    console.log(rlts)
                    console.log(attr_name)
                    console.log(rlts[attr_name])
                    var dataType = undefined;
                    var data_list =[]
                    if (['birthDate'].indexOf(attr_name)>=0){
                        var temp_data =  {'type':'date', 'timestamp':'20160213090000-000', 'displayName':attr_name, 'value':rlts[attr_name], 'unit':'mmol/l'}
                        data_list.push(temp_data)
                    }else{
                        //if (rlts['entry'].length>0){
                        if (rlts['entry'] != undefined){
                            for (var i = 0; i< rlts['entry'].length; i++){
                                var displayName = rlts['entry'][0]['resource']['code']['coding'][0]['display']
                                var selectedFieldName = $('#selectedFieldName').val()
                                //if(displayName == 'Congestive heart failure'){
                                var temp_data =  {'type':'concept', 'timestamp':'20160213090000-000', 'displayName':attr_name, 'value':displayName, 'unit':'mmol/l'}
                                //
                                if ($('#popup_mode').val() == 'data'){
                                    //If data filteration needed, the following code is used
                                    //to filter out the data.
                                    if(displayName != selectedFieldName){
                                        continue;
                                    }
                                }
                                data_list.push(temp_data)
                            }
                        }else{
                        
                            var temp_data =  {'type':'none', 'timestamp':'20160213090000-000', 'displayName':'None', 'value': 'None', 'unit':'mmol/l'}
                            data_list.push(temp_data)
                            
                            
                            
                            
                        }
                    }
                    
                    //in case you get the resource list, however no match.
                    if (data_list.length == 0){
                        var resourceType = $('#fhir_resource').val()
                            if (resourceType == 'Condition'){
                                var temp_data =  {'type':'noneConcept', 'timestamp':'20160213090000-000', 'displayName':'None', 'value': 'None', 'unit':'mmol/l'}
                                data_list.push(temp_data)
                            }else{
                            
                                var temp_data =  {'type':'none', 'timestamp':'20160213090000-000', 'displayName':'None', 'value': 'None', 'unit':'mmol/l'}
                                data_list.push(temp_data)
                            }
                    }
                    
                    
                    
                    
                    console.log(temp_data)
                    //data_list.push({'timestamp':'20160213090000-000', 'displayName':'Na', 'value':'0', 'unit':'mmol/l'})
                    //data_list.push({'timestamp':'20160213090000-000', 'displayName':'Na', 'value':'1.3', 'unit':'mmol/l'})
                    //data_list.push({'timestamp':'20160213090000-000', 'displayName':'Na', 'value':'2.1', 'unit':'mmol/l'})
                    //data_list.push({'timestamp':'20160213090000-000', 'displayName':'Na', 'value':'5.1', 'unit':'mmol/l'})
                    var data_table = ''
                    
                    var previouseBTNHtml = '';
                    var nextBTNHtml = '';
                    for (var i =0; i < rlts['link'].length; i++){
                        var link_relation = rlts['link'][i]['relation'];
                        var link_url = rlts['link'][i]['url']
                        if (link_relation == 'previous'){
                            previouseBTNHtml = '<input type="button" onClick="fhir_next(\''+ link_url + '\')" value="Previouse"/>'
                        } 
                        if (link_relation == 'next'){
                            nextBTNHtml = '<input type="button" onClick="fhir_next(\''+ link_url + '\')" value="Next"/>'
                        }
                    }
                    data_table += previouseBTNHtml
                    data_table += nextBTNHtml
                    
                    
                    
                    data_table += '<table border="1"><tr><td>Value</td><td>Type</td><td>Timestamp</td><td></td><td></td></tr>'
                    for(var i = 0; i< data_list.length; i++){
                        var value = data_list[i]['value']
                        var type = data_list[i]['type']
                        
                        data_table += '<tr id="tr_'+ i + '">'
                        
                        data_table += '<td '+ 'id="' + i + '"><input id="brand3" name="brand" type="radio" onClick="getSelectedData(this)" value="'+ value + '"> '+ value +' </br></td>'
                        data_table += '<td id="type_' + i +'">' + type + '</td>'
                        data_table += '<td>' + type + '</td>'
                        data_table += '</tr>'
                    }
                    data_table += '</table>';
                    
                    
                    
                    $('#brands').html(data_table)



}
function reset_popup_page(mode){
    $('#codeSystem').val('')
    $('#rule_input_data').val('')
    $('#rule_input_data_type').val('')
    $('#ruleCodeEnditor').val('')
    $('#drools_results').val('')
    $('#loadRuleForTheVariableBTN').removeAttr("disabled")  
    $('#executeRulsBTN').removeAttr("disabled")
    $('#popup_mode').val(mode)

}
function popup_page(field_name, mode){
    reset_popup_page(mode)
    
        $('#brands').html('');
        var context = $('#context').text()
        
        

        //var id = $.md5(field_name)
        var id = $.md5(field_name, context)
        var xmlDocument = $.parseXML($('#PMMLEnditor').val());
        //http://stackoverflow.com/questions/7228141/how-to-parse-xml-using-jquery
        var xmlTag = $(xmlDocument).find('DataField[name="' + field_name +'"]')[0]
        console.log(xmlTag);
        console.log(id);
        var tag = $(xmlTag)
        
        $('#selectedFieldName').val(field_name)
        $('#variableName').val(id);
        $('#code').val(tag.attr('code'));
        $('#codeSystem').val(tag.attr('codeSystem'));
        $('#displayName').val(tag.attr('displayName'));
        
        //reset
        $('#final_value_for_the_field').html('')
        var optype = tag.attr('optype')
        
        if (optype == 'categorical'){
            var cat_html = ''
            var values = tag.find('Value')
            console.log(values.length)
            for (var j= 0; j< values.length; j++){
                
                var value = $(values[j]).attr('value')
                cat_html += '<input id="final_value_' + value +'" name="final_value" type="radio" value="' + value + '">' + value + '</br>'
            }
            $('#final_value_for_the_field').html(cat_html)
        }
        
        retrieve_previous_settings()

}





function call_fhir(resource_name, attr_name){
    var fhir_root_url = 'http://52.72.172.54:8080/fhir/baseDstu2/'
    //url =  fhir_root_url + resource_name + '/Patient-10020?_format=json'
    url =  fhir_root_url + resource_name
    var ptid = $('#patient_id').text();
    if (resource_name == 'Patient'){
    
        url =  url + '/' + ptid + '?_format=json'
    }else{
        url =  url + '?_format=json'
        if ($('#popup_mode').val() == 'data'){
            url = url + '&patient=Patient/' + ptid
        }
    }
    $.ajax({ 
                type: 'GET', 
                url: url, 
                dataType: 'json',
                username: '',
                password: '',
                success: function(response){
                    console.log(url)
                    console.log(attr_name)
                    console.log(response)
                    generateResultsTable(response, attr_name)
                },
                
                error: function(data){
                    console.log('failed to get PMML xml list')
                }
                })

    

}
function retrieve_previous_settings(){
    var variable_MD5_id = $('#variableName').val()
    var url =  sci_params['iCMC_SCI_ROOT'] + 'aggregate/' +  variable_MD5_id
    $.ajax({ 
                type: 'GET', 
                url: url, 
                dataType: 'json',
                username: '',
                password: '',
                success: function(response){
                    if (response['status'] == 'success'){
                        console.log(response)
                        var mock_data = response;
                        //var mock_data = {}
                        //mock_data['fhir'] = {}
                        //mock_data['fhir']['fhir_resource'] = 'Patient'
                        //mock_data['fhir']['fhir_resource_attrs'] = 'birthDate'
                        //mock_data['codeSystem'] = 'FHIR'
                        
                        $('#fhir_resource').val(mock_data['fhir']['fhir_resource'])
                        insertOptions4resource(mock_data['fhir']['fhir_resource'])
                        $('#fhir_resource_attrs').val(mock_data['fhir']['fhir_resource_attrs'])
                        console.log(mock_data['codeSystem'])
                        $('#codeSystem').val(mock_data['codeSystem'])
                        
                    
                    }
                    
                    
                },
                
                error: function(data){
                    console.log('failed to reach iCMC sci')
                }
                })


}
function retrieve_data(){
    


    console.log($('#codeSystem').val())
    $('#retrieve_data_message').html('');
    if ($('#codeSystem').val().length > 0){
        call_fhir($('#fhir_resource').val(), $('#fhir_resource_attrs').val())
        
    }else{
        $('#brands').html('')
        var msg = 'Please set the coding information for the field'
        $('#retrieve_data_message').html(msg)
        console.log(msg)
    }
}


