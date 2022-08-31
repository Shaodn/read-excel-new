var readexcel = require('./readexcel.js');
var data = readexcel.read('be-products_2022-08-22-url.xlsx')
var cheerio = require('cheerio');
var superagent = require('superagent');
var async = require('async');
var fs=require('fs')
var urls = data.urls;

var fetchP = function (product) {
    return new Promise(function (resolve, reject) {
        superagent.get(product.url).redirects(0).end(function(err, res) {
            if(err){
                product.excelContent.push('Error'+err.status)
            }else{
                if(res.text){
                    var $ = cheerio.load(res.text)
                    if($('#ec-aggregator-api-id').length > 0){
                        product.aggregator = $('#ec-aggregator-api-id').text()
                        product.excelContent.push(product.aggregator)
                    }else{
                        var aggregator = []
                        $('.ec-aggregator-api-id').each((idx,ele)=>{
                            aggregator.push($(ele).text())
                        })
                        product.excelContent.push(aggregator)
                    }
                    console.log(product.excelContent)
                }else{
                    product.excelContent.push('Error')
                }
            }
            
            
            resolve()
        })
    })
}

var index = -1
async.mapLimit(urls, 1, function (url, callback) {
    var product = {
        url:'',
        aggregator: '',
        excelContent:[]
    }
    index ++;
    console.log(index)
    product.excelContent = data.excelContent[index]
    product.url = url;
    console.log(product.url)
    Promise.all([fetchP(product)]).then((result) => {
        callback(null, product)
    })

}, function (err, result) {
    var Excel = require('exceljs');
    var workbook = new Excel.Workbook();
    var ws1 = workbook.addWorksheet('result');
    ws1.addRow(data.excelHead)
    for(var i = 0;i <result.length;i++){
        if(typeof result[i].excelContent[result[i].excelContent.length - 1] == 'string'){
            ws1.addRow(result[i].excelContent)
        }else{
            for(var j = 0;j < result[i].excelContent[result[i].excelContent.length - 1].length;j++){
                if(j == 0){
                    var arr = []
                    for(var k = 0;k < result[i].excelContent.length;k++){
                        if(k < result[i].excelContent.length - 1){
                            arr.push(result[i].excelContent[k])
                        }else{
                            arr.push(result[i].excelContent[k][0])
                        }
                    }
                    ws1.addRow(arr)
                }else{
                    var arr = []
                    for(var k = 0;k < result[i].excelContent.length;k++){
                        if(k < result[i].excelContent.length - 1){
                            arr.push('')
                        }else{
                            arr.push(result[i].excelContent[k][j])
                        }
                    }
                    ws1.addRow(arr)
                }
            }
        }
    }
    workbook.xlsx.writeFile('./result/frproducts_2022-08-22.xlsx')
    .then(function(){
        console.log('生成 xlsx');
    });
})