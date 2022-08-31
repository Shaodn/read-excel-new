var readexcel = require('./readexcel.js');
var data = readexcel.read('url.xlsx')
var cheerio = require('cheerio');
var superagent = require('superagent');
var async = require('async');
var fs=require('fs')
var cookies = 'login-token=6c7954db-b968-4350-b995-641e489d529d%3ae2d7e2e5-7c42-46f4-99d7-9dce1e87bafa_1cda898c48042581ca66ef3439e4d768%3acrx.default';
var urls = data.urls
var browserMsg = {
    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
};

var fetchP = function (product) {
    return new Promise(function (resolve, reject) {
        console.log(product.url)
        superagent.get(product.url).redirects(0).end(function(err, res) {
            var $ = cheerio.load(res.text)
            let redir = res.header.location ? res.header.location:'';
            product.redir = redir
            product.hideInNav = res.body.hideInNav ? 'yes' : 'no'
            product.title = $("meta[property$='og:title']").attr('content') || ''
            product.description = $("meta[property$='og:description']").attr('content') || ''
            console.log(product.description, product.title)
            resolve()
        })
    })
}
async.mapLimit(urls, 1, function (url, callback) {
    var product = {
        url:'',
        title: '',
        description: '',
        redir:''
    }
    product.url = url;
    Promise.all([fetchP(product)]).then((result) => {
        callback(null, product)
    })

}, function (err, result) {
    var Excel = require('exceljs');
    var workbook = new Excel.Workbook();
    var ws1 = workbook.addWorksheet('result');
    ws1.addRow(['og:title', 'og:description', 'Redirect'])
    for(var i = 0;i <result.length;i++){
        ws1.addRow([result[i].title, result[i].description, result[i].redir])
    }
    workbook.xlsx.writeFile('./result/result.xlsx')
    .then(function(){
        console.log('生成 xlsx');
    });
})
// var fetchP = function (product) {
//     return new Promise(function (resolve, reject) {
//         console.log(product.url)
//         superagent.get(product.url).set({ Cookie: cookies }).set(browserMsg).redirects(0).end(function(err, res) {
//             product.hideInNav = res.body.hideInNav ? 'yes' : 'no'
//             product.redirectTarget = res.body.redirectTarget ? res.body.redirectTarget : ''
//             console.log(res.body.hideInNav,product.hideInNav,product.redirectTarget)
//             resolve()
//         })
//     })
// }
// async.mapLimit(urls, 1, function (url, callback) {
//     var product = {
//         url:'',
//         hideInNav: 'no',
//         redirectTarget: ''
//     }
//     product.url = url.replace('.html','/jcr:content.2.json');
//     Promise.all([fetchP(product)]).then((result) => {
//         callback(null, product)
//     })

// }, function (err, result) {
//     var Excel = require('exceljs');
//     var workbook = new Excel.Workbook();
//     var ws1 = workbook.addWorksheet('result');
//     ws1.addRow(['globalCategory'])
//     for(var i = 0;i <result.length;i++){
//         ws1.addRow([result[i].hideInNav, result[i].redirectTarget])
//     }
//     workbook.xlsx.writeFile('./result/result.xlsx')
//     .then(function(){
//         console.log('生成 xlsx');
//     });
// })