var fhir_server_base_list =[]
fhir_server_base_list.push({'root':'http://fhirtest.uhn.ca/baseDstu2/', 'username':'', 'password':''})
fhir_server_base_list.push({'root':'http://52.72.172.54:8080/fhir/baseDstu2/', 'username':'', 'password':''})
fhir_server_base_list.push({'root':'http://spark.furore.com/fhir', 'username':'', 'password':''})
function pushFHIRDataToFHIRByElmentID(resourceType, element_id, target_element_id){
    var rJSON = $('#' + element_id).val()
    pushToFHIR(resourceType, rJSON, target_element_id)
    
}

function pushToFHIR(resourceType, rJSON, target_element_id){
    var fhir_root_url = 'http://52.72.172.54:8080/fhir/baseDstu2/'
    var url = fhir_root_url  + resourceType
    $.ajax({ 
                type: 'POST', 
                contentType: 'application/json',
                url: url, 
                data: rJSON,
                username: '',
                password: '',
                success: function(response){
                    var textDIV = response['text']['div']
                    var myRegexp = new RegExp(resourceType +"/(\\d+)")
                    var match = myRegexp.exec(textDIV);
                    var resource_id = match[0]
                    $('#' + target_element_id).val(resource_id)
                },
                
                error: function(data){
                    console.log('failed to post to FHIR server')
                }
                })

}

RiskAssessment_Template = function (data) {
    return {
      "resourceType" : "RiskAssessment",
      // from Resource: id, meta, implicitRules, and language
      // from DomainResource: text, contained, extension, and modifierExtension
      "subject" : data.subject, // Who/what does assessment apply to?
      "date": data.date, // When was assessment made?
      "prediction" : data.prediction
 
    }
}
Questionnaire_Template = function (data) {
    return {
      "resourceType" : "Questionnaire",
      // from Resource: id, meta, implicitRules, and language
      // from DomainResource: text, contained, extension, and modifierExtension
      "text": {
        "status": "generated",
        "div": data.text
      },
      "status": "draft",
      "subjectType": ["Patient"],
      "group":{
        "linkId":"root",
        "title":data.title,
        "required":true,
        "question":data.questions
       }
    }
}
QuestionnaireResponse_Template = function (data) {
    return {
      "resourceType" : "QuestionnaireResponse",
      // from Resource: id, meta, implicitRules, and language
      // from DomainResource: text, contained, extension, and modifierExtension
      "status":"completed",
      "subject" : data.subject, // Who/what does assessment apply to?
      "questionnaire":{
            "reference": data.questionnaireId
      },
      "group":{
        "linkId":"root",
        "question":data.questionAnswers
       }
    }
}


function insertOptions4resource(resource_name){
    fhir_resouces = {'Patient':['birthDate', 'gender']}
    fhir_resouces['Observation'] = ['valueQuantity.value', 'valueCodeableConcept', 'valueRatio']
    fhir_resouces['Condition'] = ['code.coding']
    fhir_resouces['MedicationAdministration'] = ['dosage.quantity']
    $('#fhir_resource_attrs').html('')
    var options = '';
    console.log(fhir_resouces[resource_name])
    for (var i =0; i< fhir_resouces[resource_name].length; i++){
        var attr = fhir_resouces[resource_name][i]
        options += '<option value="' + attr + '">' + attr + '</option>'
    }
    $('#fhir_resource_attrs').html(options)
}