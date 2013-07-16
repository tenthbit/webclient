var ops = {
  welcome: function (pkt, ex) {
    $.updateStatus(1, 'connected to ' + ex.server);
    
    $.ui.log('debug', 'Received server welcome from ' + ex.server + ': ' + ex.software);
    $.ts = pkt.ts;
    $.ui.log('debug', ex.server + ' is willing to use ' + ex.auth.join(', ') + ' for auth');
    
    if (ex.auth.indexOf('password') >= 0) {
      var user = prompt('username', window.localStorage['10bit.username']);
      var pass = prompt('password');
      
      if (user) window.localStorage['10bit.username'] = user;
      
      $.sendPkt({op: 'auth', ex: {method: 'password', username: user, password: pass}});
    } else {
      $.ui.log('status', 'Unable to authenticate. I don\'t know any methods that the server will accept :(');
    };
  },
  
  auth: function (pkt, ex) {
    if (ex.isack) {
      $.ui.log('debug', 'Authentication as ' + ex.username + ' successful.');
      $.updateStatus(2, 'logged in as ' + ex.username);
      $.user = ex.username;
    }
  },
  
  meta: function (pkt, ex) {
    if (pkt.rm) {
      $.room = pkt.rm;
      $.rooms.push(pkt.ex);
      $.ui.log(pkt.rm, 'Current room: ' + ex.name);
      $.ui.log(pkt.rm, ex.description);
      $.ui.log(pkt.rm, 'Users: ' + ex.users.join(', '));
    };
  },
  
  act: function (pkt, ex) {
    if (!pkt.rm || !pkt.sr || !ex.message) return;
    
    $.ui.log(pkt.rm, '<' + pkt.sr + '> ' + ex.message);
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

