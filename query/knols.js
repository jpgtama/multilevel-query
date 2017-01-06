var states2 = [
	'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
	'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
	'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
	'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
	'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
	'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
	'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
	'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
	'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];


function getResourceHTML(){
    var r_options = []
    r_options.push('<option value="DiagnosticReport_codedDiagnosis">Patient</option>')
    r_options.push('<option value="DiagnosticReport_codedDiagnosis">Pathology Report</option>')
    r_options.push('<option value="DiagnosticReport_codedDiagnosis">Laboratory Examination</option>')
    return '<select>' +  r_options.join('') + '</select>'
}
function getFieldSelectHtml(){
    var field_options = []
    field_options.push('<option value="DiagnosticReport_codedDiagnosis">Diagnosis list</option>')
    field_options.push('<option value="code_coding">code.coding</option>')
    return '<select>' +  field_options.join('') + '</select>'
}

function getActionSelectHtml(){
    var action_options = []
          
    action_options.push('<option value="has_a">has_a </option>')
    action_options.push('<option value="eq">=</option> ')
    action_options.push('<option value="gt">&gt;</option>')
    action_options.push('<option value="ge">&ge;</option>')
    action_options.push('<option value="lt">&lt;</option>')
    action_options.push('<option value="le">&le;</option>')
    action_options.push('<option value="ie">IE</option>')
    return '<select>' +  action_options.join('') + '</select>'
}

function getDataTypeHTML(){
    var dt_options = []
    dt_options.push('<option value="valueBoolean">valueBoolean</option>')
    dt_options.push('<option value="valueDecimal">valueDecimal</option>')
    dt_options.push('<option value="valueInteger">valueInteger</option>')
    dt_options.push('<option value="valueDate">valueDate</option>')
    dt_options.push('<option value="valueDateTime">valueDateTime</option>')
    dt_options.push('<option value="valueInstant">valueInstant</option>')
    dt_options.push('<option value="valueTime">valueTime</option>')
    dt_options.push('<option value="valueString">valueString</option>')
    dt_options.push('<option value="valueUri">valueUri</option>')
    dt_options.push('<option value="valueAttachment">valueAttachment</option>')
    dt_options.push('<option value="valueCoding">valueCoding</option>')
    dt_options.push('<option value="valueQuantity">valueQuantity</option>')
    dt_options.push('<option value="valueReference">valueReference</option>')
    return '<select>' +  dt_options.join('') + '</select>'
} 

function getRuleTemplatesHTML(){
    var tpl_options = []
    tpl_options.push('<option value="">Select a template</option>')
    tpl_options.push('<option value="ageGT18">ageGT18</option>')
    tpl_options.push('<option value="ageLT70">ageLT70</option>')
    tpl_options.push('<option value="rule_PQ">rule_PQ</option>')
    return '<select>' +  tpl_options.join('') + '</select>'
}

function loatRuleTemplate(templateName){
    console.log('.template#' + templateName)
    return $('.template#' + templateName).val()  
}
