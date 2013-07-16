$(function () {
  $.updateStatus(1, 'disconnected');
  $.rooms = [];
  
  if (!window.localStorage['10bit.server'])
    window.localStorage['10bit.server'] = '10bit.danopia.net';


  $.socket = new WebSocket('wss://' + window.localStorage['10bit.server'] + ':10818/');
  $.socket.onopen = function (event) {
    $.updateStatus(1, 'socket opened');
  };

  $.socket.onmessage = function (event) {
    var pkt = JSON.parse(event.data);
    $.gotPkt(pkt);
  };

  $.sendPkt = function (pkt) {
    $.socket.send(JSON.stringify(pkt));
  };
});

