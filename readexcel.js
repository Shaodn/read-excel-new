var xlsx = require('node-xlsx');
var data = {
    excelHead:[],
    excelContent:[],
    urls:[]
}
module.exports={
    read:function(filename){
        var obj = xlsx.parse(filename);
        obj[0].data.forEach((url,idx) => {
            // console.log(url)
            if(idx == 0){
                
                data.excelHead = url
                data.excelHead.push('link')
                data.excelHead.push('ec-aggregator-api-id')
                data.excelHead.push('Error')
            }
            if(idx > 0){
                var arr = [];
                for(var j = 0;j < url.length;j++){
                    arr.push(url[j])
                }
                if(url[2] != url[1]){
                    var url1 = url[1] + '/' + url[2] + '/'
                }else{
                    var url1 = url[1] + '/'
                }
                let url3 = url[3] ? url[3]  + '/' : ''
                let url4 = url[4] ? url[4]  + '/' : ''
                let url5 = url[5] ? url[5]  + '/' : ''
                let url6 = url[6] ? url[6]  + '/' : ''
                var link = 'https://www.panasonic.com/' + url1 + url3 + url4 + url5 + url6 + url[7] + '.html'
                arr.push(link)
                data.excelContent.push(arr)
                data.urls.push(link)
            }
        });
        return(data)
    }
}