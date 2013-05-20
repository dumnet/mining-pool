var rpc = require('./jsonrpc');

var job = new (require('./jobs'))();

var server = new rpc.Server();

var async = require('async');

var shares = 0;
var jobs = 0;
var blocks = [];
var stales = [];
var start = +new Date();

job.update_block();

function getwork(args, opt, callback) {
  var authHeader = opt.req.headers['authorization'] || '';
  var authToken = authHeader.split(/\s+/).pop() || '';
  var auth = new Buffer(authToken, 'base64').toString();
  var parts = auth.split(/:/);
  var username = parts[0];
  var password = parts[1];

  if(args.length==0) {
    jobs++;
    callback(null,job.getwork());
  } else {
    shares++;
    var res = job.submit(args[0].slice(0,160));
    console.log(res);
    if(res.found) {
      var block = {};
      block.hash = res.hash;
      block.timestamp = (new Date()).toLocaleString();
      if(blocks.length>0) {
	var last_block = blocks[blocks.length-1];
	block.shares = shares - last_block.shares;
      } else {
	block.shares = shares;
      }
      if(res.staled) {
	stales.push(block);
      } else {
	blocks.push(block);
      };
    }
    callback(null,"trueDannyIsAFuckingAssHoleDannyIsAFuckingAssHoleDannyIsAFuckingAssHoleDannyIsAFuckingAssHole");
  }
};

function update(args,opt,callback) {
  job.update_block();
  console.log("Updated At:%s",new Date());
  callback(null,true);
};

function stats(args,opt,callback) {
  var response = {};
  response.shares = shares;
  response.jobs = jobs;
  response.blocks = blocks;
  response.stales = stales;
  response.start = start;
  callback(null,JSON.stringify(response));
};

server.expose('getwork', getwork);
server.expose('update',update);
server.expose('stats',stats);

server.listen(8334, '0.0.0.0');

