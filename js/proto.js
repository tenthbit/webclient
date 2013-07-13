var ops = {
  welcome: function (pkt, ex) {
    $.updateStatus(1, 'connected to ' + ex.server);
    
    $.ui.log('debug', 'Received server welcome from ' + ex.server + ': ' + ex.software);
    $.ts = ex.now;
    $.ui.log('debug', ex.server + ' is willing to use ' + ex.auth.join(', ') + ' for auth');
    
    if (ex.auth.indexOf('password') >= 0) {
      var user = prompt('username', window.localStorage['10bit.username']);
      var pass = prompt('password');
      window.localStorage['10bit.username'] = $.user = user;
      
      $.sendPkt({op: 'auth', ex: {method: 'password', username: user, password: pass}});
    } else {
      $.ui.log('status', 'Unable to authenticate. I don\'t know any methods that the server will accept :(');
    };
  },
  
  ack: function (pkt, ex) {
    if (ex.for == 'auth') {
      $.ui.log('debug', 'Authentication successful.');
      $.updateStatus(2, 'logged in as ' + $.user);
    } else {
      console.log('something worked');
    }
  },
  
  meta: function (pkt, ex) {
    if (pkt.tp) {
      $.topic = pkt.tp;
      $.ui.log(pkt.tp, 'Current topic: ' + ex.name);
      $.ui.log(pkt.tp, ex.description);
      $.ui.log(pkt.tp, 'Users: ' + ex.users.join(', '));
    };
  },
  
  act: function (pkt, ex) {
    if (!pkt.tp || !pkt.sr || ex.type != 'msg') return;
    
    $.ui.log(pkt.tp, '<' + pkt.sr + '> ' + ex.data);
  }
};

$.gotPkt = function (pkt) {
  if (ops[pkt.op])
    ops[pkt.op](pkt, pkt.ex);
  else
    $.ui.log('debug', 'unhandled op', pkt.op, 'in', pkt);
};

$.send = function (pkt) {
  $.socket.send(JSON.stringify(pkt));
};

