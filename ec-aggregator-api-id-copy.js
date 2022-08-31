var readexcel = require('./readexcel.js');
var data = readexcel.read('be-products_2022-08-22-url.xlsx')
var cheerio = require('cheerio');
var superagent = require('superagent');
var async = require('async');
var fs=require('fs')
var urls = data.urls;
var Excel = require('exceljs');
var workbook = new Excel.Workbook();
var ws1 = workbook.addWorksheet('result');
ws1.addRow(data.excelHead)
var fetchP = function (product) {
    return new Promise(function (resolve, reject) {
        superagent.get(product.url).redirects(0).end(async function(err, res) {
            if(err){
                product.excelContent.push('Error'+err.status)
            }else{
                if(res.text){
                    var $ = cheerio.load(res.text)
                    if($('#ec-aggregator-api-id').length > 0){
                        product.aggregator = $('#ec-aggregator-api-id').text()
                        product.excelContent.push(product.aggregator)
                        ws1.addRow(product.excelContent)
                        await workbook.xlsx.writeFile('./result/frproducts_2022-08-22.xlsx')
                        .then(function(){
                            console.log('生成 xlsx');
                        });
                    }else{
                        var aggregator = []
                        $('.ec-aggregator-api-id').each((idx,ele)=>{
                            aggregator.push($(ele).text())
                        })
                        product.excelContent.push(aggregator)

                        for(var j = 0;j < product.excelContent[product.excelContent.length - 1].length;j++){
                            if(j == 0){
                                var arr = []
                                for(var k = 0;k < product.excelContent.length;k++){
                                    if(k < product.excelContent.length - 1){
                                        arr.push(product.excelContent[k])
                                    }else{
                                        arr.push(product.excelContent[k][0])
                                    }
                                }
                                ws1.addRow(arr)
                                await workbook.xlsx.writeFile('./result/frproducts_2022-08-22.xlsx')
                                .then(function(){
                                    console.log('生成 xlsx');
                                });
                            }else{
                                var arr = []
                                for(var k = 0;k < product.excelContent.length;k++){
                                    if(k < product.excelContent.length - 1){
                                        arr.push('')
                                    }else{
                                        arr.push(product.excelContent[k][j])
                                    }
                                }
                                await workbook.xlsx.writeFile('./result/frproducts_2022-08-22.xlsx')
                                .then(function(){
                                    console.log('生成 xlsx');
                                });
                                ws1.addRow(arr)
                            }
                        }
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
async.mapLimit(data.excelContent, 2, function (url, callback) {
    var product = {
        url:'',
        aggregator: '',
        excelContent:[]
    }
    index ++;
    console.log(index)
    product.excelContent = data.excelContent[index]
    product.url = url[10];
    console.log(product.url)
    Promise.all([fetchP(product)]).then((result) => {
        callback(null, product)
    })

}, function (err, result) {
    workbook.xlsx.writeFile('./result/frproducts_2022-08-22.xlsx')
    .then(function(){
        console.log('生成 xlsx');
    });
})