var readexcel = require('./readexcel.js');
var data = readexcel.read('url.xlsx')
var cheerio = require('cheerio');
var superagent = require('superagent');
var async = require('async');
var fs=require('fs')
var cookies = 'login-token=6c7954db-b968-4350-b995-641e489d529d%3a1b03b132-2f1e-4ccd-b706-260d1a014eca_13e02ade548c827fadc01195302778c4%3acrx.default';
var urls = data.urls
var browserMsg = {
    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
};

var fetchP = function (product) {
    return new Promise(function (resolve, reject) {
        console.log(product.url)
        superagent.get(product.url).set({ Cookie: cookies }).set(browserMsg).redirects(0).end(function(err, res) {
            var $ = cheerio.load(res.text)
            if($('.globalfeatureslider.section').find('a').attr('href').indexOf('pim-panels') != -1){
                product.haspim = 'yes'
            }
            console.log(product.haspim)
            resolve()
        })
    })
}
async.mapLimit(urls, 1, function (url, callback) {
    var product = {
        url:'',
        haspim: 'no',
    }
    product.url = url.replace('/cf#/','/');
    Promise.all([fetchP(product)]).then((result) => {
        callback(null, product)
    })

}, function (err, result) {
    var Excel = require('exceljs');
    var workbook = new Excel.Workbook();
    var ws1 = workbook.addWorksheet('result');
    ws1.addRow(['globalCategory'])
    for(var i = 0;i <result.length;i++){
        ws1.addRow([result[i].haspim])
    }
    workbook.xlsx.writeFile('./result/result.xlsx')
    .then(function(){
        console.log('生成 xlsx');
    });
})