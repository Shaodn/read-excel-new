var readexcel = require('./readexcel.js');
var data = readexcel.read('url.xlsx')
var cheerio = require('cheerio');
var superagent = require('superagent');
var async = require('async');
var fs=require('fs')
var urls = data.urls

var fetchP = function (product) {
    return new Promise(function (resolve, reject) {
        console.log(product.url)
        superagent.get(product.url).redirects(0).end(function(err, res) {
            var $ = cheerio.load(res.text)
            if($('.supportsection .pdf').length > 0){
                product.haspdf = 'yes'
            }
            console.log(product.haspdf)
            resolve()
        })
    })
}
async.mapLimit(urls, 1, function (url, callback) {
    var product = {
        url:'',
        haspdf: 'no',
    }
    product.url = url
    Promise.all([fetchP(product)]).then((result) => {
        callback(null, product)
    })

}, function (err, result) {
    var Excel = require('exceljs');
    var workbook = new Excel.Workbook();
    var ws1 = workbook.addWorksheet('result');
    ws1.addRow(['PDF'])
    for(var i = 0;i <result.length;i++){
        ws1.addRow([result[i].haspdf])
    }
    workbook.xlsx.writeFile('./result/result.xlsx')
    .then(function(){
        console.log('生成 xlsx');
    });
})