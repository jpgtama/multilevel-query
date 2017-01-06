function handleResponse(response){
    console.log(response)
    if ('id' in response){
        $('#model_status').attr("src", "../iRules/imgs/green_light.jpg");
        $('#model_id').attr("value", response['id']);
        $('#model_type').val(response['summary'])
    }
}
function deployPMMLModel(){
        var model_uuid = $.uuid();
        var url = 'http://localhost:8080/openscoring/model/' + model_uuid
        
        var xmlStr = $('#PMMLEnditor').val();
        var xmlDocument = $.parseXML(xmlStr);
        console.log(xmlDocument)
        
        var xmlRequest = $.ajax({
          url: url,
          type: 'PUT',
          contentType: 'text/xml',
          processData: false,
          data: xmlDocument
        });
         
        xmlRequest.done( handleResponse );
                
                
}
function getValues4ActiveFields(){
    var fieldColumnName = sci_params['PMML_FIELD_COLUMN_NAME']
    var dataTypeColumnName = sci_params['PMML_DATATYPE_COLUMN_NAME']
    
    
    var table_data = $('#activeFieldTable').tableToJSON();
    var key_value = {}
    for (var i=0; i< table_data.length; i++){
        var row = table_data[i]
        
        var keyName = row[fieldColumnName]
        var data_type = row[dataTypeColumnName]
        var context = $('#context').text()
        var value_elm_id = 'icmc_' + $.md5(keyName, context)
        var value = $('#'+ value_elm_id).val()
        if (data_type == 'double'){
            value = parseFloat(value)
        }
        key_value[keyName] = value
    }
    return key_value
}

//<Output>
//            <OutputField name="Predicted_CIN" feature="predictedValue"/>
//            <OutputField name="Probability_yes" optype="continuous" dataType="double" feature="probability"
//                         value="yes"/>
//            <OutputField name="Probability_no" optype="continuous" dataType="double" feature="probability" value="no"/>
//        </Output>
function getOutputFieldWithPredictedValue(){
    var xmlStr = $('#PMMLEnditor').val();
    var xmlDocument = $.parseXML(xmlStr);
    var outputFieldXmlDoc = $(xmlDocument).find('OutputField[feature="predictedValue"]')[0]
    
    var fieldName = $(outputFieldXmlDoc).attr('name')
    return fieldName
}

function convertPMMLActiveFields2FHIR(activeFieldNameList){
    console.log(activeFieldNameList)
    qData = {'title': 'SCI_pilot'}
    qData['text'] = $('#PMMLEnditor').val()
    qData['questions'] = []
    for(var i =0; i< activeFieldNameList.length; i++){
        var field = activeFieldNameList[i]
        var question = {}
        var index = i + 1
        question['linkId'] = index
        question["text"] = field['id']
        question["type"] = field['dataType']
        question["required"] = true
        question["repeats"] = false
        var options = []
        var values = field['values']
        console.log(values)
        for (var j=0; j< values.length; j++){
            var option = {}
            option['code'] = values[j]
            option['display'] = values[j]
            options.push(option)
        }
        question['option'] = options
        
        qData['questions'].push(question)
    }
    return JSON.stringify(Questionnaire_Template(qData), null, 4)
}

function convertPMMLRlts2FHIR(){
    var prob_yes = $('#prediction_probability').val();
    if($('#prediction_class').val() == 'no'){
        prob_yes = 1- $('#prediction_probability').val()
    }

    var patient_id = $('#patient_id').text()
    var outcome_str = $('#precition_outcome').val()
    console.log(patient_id)
    var riskAssessData = {subject: {"reference" : "Patient/" + patient_id} }
    riskAssessData['date'] = new Date();
    riskAssessData['prediction'] = [{outcome:{text: outcome_str}, probabilityDecimal: prob_yes}];
    $('#fhir_riskassessment').val(JSON.stringify(RiskAssessment_Template(riskAssessData), null, 4))
}
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function convertModelInputs2FHIR(input_data){
    console.log(input_data)
    var patient_id = $('#patient_id').text()
    var qn = JSON.parse($('#fhir_questionnaire').val())
    var questions = qn['group']['question']
    var qnResponseData = {subject: {"reference" : "Patient/" + patient_id} }
    qnResponseData['questionnaireId'] =  $('#questionnaire_resource_id').val()
    var answers = []
    for (var i=0; i< questions.length; i++){
        var question = questions[i]
        var answer = {}
        answer["linkId"]= question["linkId"]
        var itemName = question["text"]
        var value = input_data[itemName]
        console.log(value)
        var dataType = question['type']
        var inputType = 'value' + dataType.capitalize()
        if (dataType == 'integer'){
            value = parseInt(value)
        }
        
        answer['answer'] = []
        var answerValuePair = {}
        answerValuePair[inputType] = value
        answer['answer'].push(answerValuePair)
        
        answers.push(answer)
    }
    qnResponseData['questionAnswers'] = answers
    return JSON.stringify(QuestionnaireResponse_Template(qnResponseData), null, 4)
    
}
function evaluatePMMLModel(){
    
    var real_data = getValues4ActiveFields()
    console.log(real_data)
    
    //var input_data = {"id" : "record-001","arguments" : {"Sepal_Length" : 5.1,"Sepal_Width" : 3.5,"Petal_Length" : 1.4,"Petal_Width" : 0.2}};
    var input_data = {"id" : "record-001","arguments" : real_data};
    
    //var model_uuid = 'RegressionAKI'
    var model_uuid = $('#model_id').val();
    var url = 'http://localhost:8080/openscoring/model/' + model_uuid
  
    $.ajax({ 
                type: 'POST', 
                url: url, 
                contentType: 'application/json',
                data: JSON.stringify(input_data),
                username: '',
                password: '',
                processData: false,
                success: function(response){
                    console.log(url)
                    console.log(response)
                    var modelType = $('#model_type').val()
           
                    if (modelType == 'Regression'){
                        var output_predictedValue = getOutputFieldWithPredictedValue()
                        //var output_predictedValue = 'Predicted_Species'
                        var className_predicted = response['result'][output_predictedValue]
                        var prob_item_name = 'Probability_' + className_predicted
                        var classProbability_predicted = response['result'][prob_item_name]
                        $('#prediction_class').val(className_predicted)
                        $('#prediction_probability').val(classProbability_predicted)
                    }else if (modelType == 'Tree model'){
                        console.log('Tree model')
                        $('#prediction_class').val(response['result']['class'])
                    }else{
                        console.log('something not handled')
                    }
                    
                    //if the input data successfully executed, then wrap the data into FHIR QuestionnaireResponse
                    var inputs_in_fhir = convertModelInputs2FHIR(real_data)
                    $('#fhir_questionnaire_response').val(inputs_in_fhir)
                },
                error: function(data){
                    $('#prediction_class').val('')
                    $('#prediction_probability').val('')
                    $('#fhir_questionnaire_response').val('')
                    console.log(data)
                    console.log('failed to evaluate model')
                }
                })
}
function getFieldChoicHtmlCodes(modelField, item_id){
    var valueSets = {'Example YesNo':[
    {
        "code": "0",
        "display": "No"
      },
      {
        "code": "1",
        "display": "Yes"
      }
      
    ], 'PCI Contrast volume':[
      {
        "code": "0",
        "display": "0 ml"
      },
      {
        "code": "1",
        "display": "100 ml"
      },
      {
        "code": "2",
        "display": "200 ml"
      },
      {
        "code": "3",
        "display": "300 ml"
      },
      {
        "code": "4",
        "display": "400 ml"
      },
      {
        "code": "5",
        "display": "500 ml"
      }
    ]
    }

    var values = modelField['values']
    var html = '<select ' +  'id="icmc_' + item_id + '">'
    if (values.length == 2){
        var concepts = valueSets['Example YesNo'];
    }
        
    if (values.length == 6){
        var concepts = valueSets['PCI Contrast volume'];
    }
    for (var i=0; i< concepts.length; i++){
            html += '<option value="' + concepts[i]['code'] + '">' + concepts[i]['display'] + '</option>'
    }
    html += '</select>'
    return html
}



//byMapping: [true:false]
//true: generate 'Get data' button
//false: manually type in the data
function getActiveFields(byMapping){
    var model_uuid = $('#model_id').val();
    var url = 'http://localhost:8080/openscoring/model/' + model_uuid
    $.ajax({ 
                type: 'GET', 
                url: url, 
                dataType: 'json',
                username: '',
                password: '',
                success: function(response){
                    var activeFieldList = response['schema']['activeFields']
                    console.log(activeFieldList)
                    //$("#activeFieldTable").jsonTableUpdate(activeFieldList)
                    //$("#activeFieldTable").jsonTableUpdate(activeFieldList)
                    var data = [{"id" : 1, "name" : "iOS", "share" : 57.56}]
                    for (var i =0; i< activeFieldList.length; i++){
                        var field_name = activeFieldList[i]['id']
                        var context = $('#context').text()
                        var item_id = $.md5(field_name, context)
                        if(byMapping){
                        activeFieldList[i]['value'] = '<input id="icmc_' + item_id + '" value="" disabled="disabled"/>'
                        activeFieldList[i]['callback'] = '<input class="btnShowModal" type="button" value="Config" onClick="popup_page(\'' + field_name + '\', \'config\')"/> <input class="btnShowModal" type="button" value="Get Data" onClick="popup_page(\'' + field_name + '\', \'data\')"/>'
                        }else{
                            //activeFieldList[i]['value'] = '<input id="icmc_' + item_id + '" value=""/>'
                            //activeFieldList[i]['value'] = '<select ' +  'id="icmc_' + item_id + '"><option value="0">No</option><option value="1">Yes</option> </select>'
                            activeFieldList[i]['value'] = getFieldChoicHtmlCodes(activeFieldList[i], item_id)
                            activeFieldList[i]['callback'] = ''
                            
                        }
                    }
                    $("#activeFieldTable").jsonTableUpdate({'source':activeFieldList});
                    
                    $('#fhir_questionnaire').val(convertPMMLActiveFields2FHIR(activeFieldList))
                    
                    $(".btnShowModal").click(function (e)
                        {
                            ShowDialog(true);
                            
                            e.preventDefault();
                        });
                },
                error: function(data){
                    console.log('failed to get model')
                }
                })
}

function getTargetFields(){
    var model_uuid = $('#model_id').val();
    var url = 'http://localhost:8080/openscoring/model/' + model_uuid
    $.ajax({ 
            type: 'GET', 
            url: url, 
            dataType: 'json',
            username: '',
            password: '',
            success: function(response){
                var targetFieldList = response['schema']['targetFields']
                var data = [{"id" : 1, "name" : "iOS", "share" : 57.56}]
                var outcomes = []
                for (var i =0; i< targetFieldList.length; i++){
                    var field_name = targetFieldList[i]['id']
                    var context = $('#context').text()
                    var item_id = $.md5(field_name, context)
                    
                    targetFieldList[i]['value'] = '<input id="icmc_' + item_id + '" value="" disabled="disabled"/>'
                    targetFieldList[i]['callback'] = '<input class="btnShowModal" type="button" value="Config" onClick="popup_page(\'' + field_name + '\', \'config\')"/> <input class="btnShowModal" type="button" value="Get Data" onClick="popup_page(\'' + field_name + '\', \'data\')"/>'
                    outcomes.push(field_name)
                }
                $("#predictedFieldTable").jsonTableUpdate({'source':targetFieldList});
                if (outcomes.length ==0){
                    $("#precition_outcome").val('[ERROR] There is no outcome');
                }else if (outcomes.length > 1){
                    $("#precition_outcome").val('[ERROR] There is more than one outcome');
                }else{
                    $("#precition_outcome").val(outcomes[0]);
                }
                
                
                $(".btnShowModal").click(function (e)
                    {
                        ShowDialog(true);
                        
                        e.preventDefault();
                    });
            },
            error: function(data){
                console.log('failed to get model')
            }
            })
}