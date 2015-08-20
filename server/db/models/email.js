'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	googleObj: {
		type: Object
	},
	draft: {
		type: String
	},
});

//something like this...
schema.methods.getThread = function() {
	return this.googleObj.threadId;
}

schema.methods.getDate = function() {
	return this.googleObj.payload.headers.filter(function(obj) {
		return obj['name'] === 'Date';
	})[0].value
}

mongoose.model('Email', schema);

// var result = jsObjects.filter(function(obj) {
// 	return obj.b == 6;
// });

// "googleObj": {
// 	"sizeEstimate": 3195,
// 	"payload": {
// 		"headers": [{
// 			"value": "teammailfsa@gmail.com",
// 			"name": "Delivered-To"
// 		}, {
// 			"value": "by 10.25.21.158 with SMTP id 30csp536825lfv;        Wed, 19 Aug 2015 10:30:24 -0700 (PDT)",
// 			"name": "Received"
// 		}, {
// 			"value": "by 10.13.255.2 with SMTP id p2mr7975572ywf.115.1440005424200;        Wed, 19 Aug 2015 10:30:24 -0700 (PDT)",
// 			"name": "X-Received"
// 		}, {
// 			"value": "<gregmeyer888@gmail.com>",
// 			"name": "Return-Path"
// 		}, {
// 			"value": "from mail-yk0-x22b.google.com (mail-yk0-x22b.google.com. [2607:f8b0:4002:c07::22b])        by mx.google.com with ESMTPS id 77si837542yks.38.2015.08.19.10.30.23        for <teammailfsa@gmail.com>        (version=TLSv1.2 cipher=ECDHE-RSA-AES128-GCM-SHA256 bits=128/128);        Wed, 19 Aug 2015 10:30:24 -0700 (PDT)",
// 			"name": "Received"
// 		}, {
// 			"value": "pass (google.com: domain of gregmeyer888@gmail.com designates 2607:f8b0:4002:c07::22b as permitted sender) client-ip=2607:f8b0:4002:c07::22b;",
// 			"name": "Received-SPF"
// 		}, {
// 			"value": "mx.google.com;       spf=pass (google.com: domain of gregmeyer888@gmail.com designates 2607:f8b0:4002:c07::22b as permitted sender) smtp.mailfrom=gregmeyer888@gmail.com;       dkim=pass header.i=@gmail.com;       dmarc=pass (p=NONE dis=NONE) header.from=gmail.com",
// 			"name": "Authentication-Results"
// 		}, {
// 			"value": "by mail-yk0-x22b.google.com with SMTP id t205so11983503ykd.1        for <teammailfsa@gmail.com>; Wed, 19 Aug 2015 10:30:23 -0700 (PDT)",
// 			"name": "Received"
// 		}, {
// 			"value": "v=1; a=rsa-sha256; c=relaxed/relaxed;        d=gmail.com; s=20120113;        h=mime-version:from:date:message-id:subject:to:content-type;        bh=jdZtMsF6w3dBuRXOZQNkCtkcTkTDpV0lXa0b854OgHg=;        b=WMtM3+O2Bozq2hOgXIolV1Y8Gw0VPqYuyrKZ6S7UIYwqmeLBYOKPIy/NUyTdIh3aPx         bnT9v80kY4ljwYmI0x5dAA72i/axFoblrEyfBqkzyQzfjQjmm6J/y3XjMW/HSNE+UN1n         Uu/S8RgRuCWDSIK6l277AUbq43wYipGdfyL5SI2SPHKTqYwHWPsHviTeg3o0bSC8Y0LD         FXxRDRuwWHECiFc95hkJZvqEy81rQvES6b4AVuCEOrujrxp21L3Yj3xYYsVZS0w+nOQg         0ioqRjT9w9S+c2j3iOdpAvb/yZX0OhLHh6u/fGYtN9RyxeOg6Ar88kS/x+MVV0LyCaH9         RoBA==",
// 			"name": "DKIM-Signature"
// 		}, {
// 			"value": "by 10.13.205.196 with SMTP id p187mr14857493ywd.119.1440005423369; Wed, 19 Aug 2015 10:30:23 -0700 (PDT)",
// 			"name": "X-Received"
// 		}, {
// 			"value": "1.0",
// 			"name": "MIME-Version"
// 		}, {
// 			"value": "by 10.37.203.17 with HTTP; Wed, 19 Aug 2015 10:30:04 -0700 (PDT)",
// 			"name": "Received"
// 		}, {
// 			"value": "Greg Meyer <gregmeyer888@gmail.com>",
// 			"name": "From"
// 		}, {
// 			"value": "Wed, 19 Aug 2015 13:30:04 -0400",
// 			"name": "Date"
// 		}, {
// 			"value": "<CACmPB_TMAW=aTxAkCdaQhw1nDQy0OSnwQSkmLNyzXVqYTAAPqw@mail.gmail.com>",
// 			"name": "Message-ID"
// 		}, {
// 			"value": "Excellent Subject Yo!",
// 			"name": "Subject"
// 		}, {
// 			"value": "teammailfsa@gmail.com",
// 			"name": "To"
// 		}, {
// 			"value": "multipart/alternative; boundary=001a114e61e8bc149e051dad6399",
// 			"name": "Content-Type"
// 		}],
// 		"filename": "",
// 		"mimeType": "multipart/alternative"
// 	}