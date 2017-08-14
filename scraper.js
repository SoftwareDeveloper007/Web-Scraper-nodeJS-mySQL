var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var mysql = require('mysql');
var con = require('./database_management');
var async = require('async');

url = 'http://www.courts.sa.gov.au/CaseLists/Pages/Criminal-Cases.aspx';
var item = {location: "", participant: "", charge: ""};
var db_cnt = 0;
var interval = 100;

request(url, function (error, response, html) {
    if (!error) {
        var $ = cheerio.load(html);

        $('#datatable').filter(function () {
            var data = $(this);
            var links = data.find('a');
            //console.log(links[0].attribs.href);
            var cnt = links.length;

            async.forEachOf(links, function (link, callback) {
                var href = 'http://www.courts.sa.gov.au/CaseLists/Pages/' +
                    link.attribs.href;
                parse_html(href);
            }, function (err) {

            })

        })
    }

})

function parse_html(href) {
    var link = href;
    request(href, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var data = $('p');
            var location = data[3].children[1].data;
            var participant = data[7].children[1].data;

            var split_str = "";
            var last_name = "";
            var first_name = "";

            console.log(link);

            /*
             if(participant=="" || participant=="-"){
             last_name = "-";
             first_name = "-";
             }
             else {
             split_str = participant.split(",");

             last_name = split_str[0];
             first_name = "";
             if(split_str[1].split(" ")[0] == "")
             first_name = split_str[1].split(" ")[1];
             else
             first_name = split_str[1].split(" ")[0];
             }
             */

            try {
                split_str = participant.split(",");

                last_name = split_str[0];
                first_name = "";
                if (split_str[1].split(" ")[0] == "")
                    first_name = split_str[1].split(" ")[1];
                else
                    first_name = split_str[1].split(" ")[0];
            }
            catch (err) {
                last_name = "-";
                first_name = "-";
            }

            var charge = "";

            try {
                charge = data[9].children[1].data;
            }
            catch (err) {
                charge = "-";
            }

            make_dict(first_name, last_name, location, charge, link);
        }
    })
}

function make_dict(first_name, last_name, location, charge, link) {

    var sql = mysql.format("INSERT INTO test (first_name, last_name, location, charge, link) VALUES (?, ?, ?, ?, ?)", [first_name, last_name, location, charge, link]);
    try {
        con.query(sql, function (err, result) {
            //if (err) throw err;
            //console.log("1 record inserted");
            //db_cnt++;
            //console.log(db_cnt);
        });
    }
    catch (err) {
        console.log(err);
    }


}