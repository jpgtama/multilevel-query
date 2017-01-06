function getDataFromMongoDB(success_func){

    var url = 'http://localhost:6543/iCMC/deepQuery/queries' 
    $.ajax({ 
                type: 'GET', 
                url: url, 
                dataType: 'json',
                username: '',
                password: '',
                success: function(response){
                    success_func(response)
                },
                error: function(data){
                    console.log('failed to get data from mongoDB')
                }
                })

}

function saveDataToMongo(data){
    var url = 'http://localhost:6543/iCMC/deepQuery/queries';
    //var data = {'msg':'hello'}
    console.log(data)
    $.ajax({ 
                type: 'POST', 
                url: url, 
                dataType: 'json',
                username: '',
                password: '',
                data: data,
                success: function(response){
                        console.log('success')
                        var rlt = jsonLogic.apply(
                        
  {'and':[{'and':[{'and':[true]},{'and':[true]}]}]})
  console.log(rlt)
                },
                error: function(data){
                    console.log('failed to get data from mongoDB')
                }
                })
}