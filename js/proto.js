var roomids = [];

var ops = {
  welcome: function (pkt, ex) {
    $.updateStatus(1, 'connected to ' + ex.server);
    
    $.ui.log('debug', 'Received server welcome from ' + ex.server + ': ' + ex.software);
    $.ui.log('debug', ex.server + ' is willing to use ' + ex.auth.join(', ') + ' for auth');
    
    if (ex.auth.indexOf('password') >= 0) {
      var user = prompt('username', window.localStorage['10bit.username']);
      var pass = prompt('password');
      
      if (user) window.localStorage['10bit.username'] = user;
      
      $.send({op: 'auth', ex: {method: 'password', username: user, password: pass}});
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
    if (!pkt.rm) return;
    
    $.ui.updateMeta(pkt.rm, pkt.ex);
  },
  
  join: function (pkt, ex) {
    if (!pkt.rm) return;
    if (pkt.ex && pkt.ex.isack) roomids.push(pkt.rm);
    
    $.ui.addNick(pkt.rm, pkt.sr);
    $.ui.log(pkt.rm, pkt.sr + ' joined');
  },
  
  leave: function (pkt, ex) {
    if (!pkt.rm) return;
    if (pkt.ex && pkt.ex.isack) roomids.splice(roomids.indexOf(pkt.rm), 1);
    
    $.ui.log(pkt.rm, pkt.sr + ' left');
    $.ui.removeNick(pkt.rm, pkt.sr);
  },
  
  disconnect: function (pkt, ex) {
    for (var idx in roomids) {
      var id = roomids[idx];
      
      if ($.ui.getPage(id).meta.users.indexOf(pkt.sr) >= 0) {
        $.ui.log(id, pkt.sr + ' disconnected');
        $.ui.removeNick(id, pkt.sr);
      };
    };
  },
  
  act: function (pkt, ex) {
    if (!pkt.rm || !pkt.sr || !ex.message) return;
    
    if (ex.orig && pkt.sr == 'relay') {
      ex.isaction = ex.wasact;
      ex.message = ex.orig;
      pkt.sr = '%' + ex.nick;
    }
    
    if (ex.isaction)
      $.ui.log(pkt.rm, '* ' + pkt.sr + ' ' + ex.message);
    else
      $.ui.log(pkt.rm, '<' + pkt.sr + '> ' + ex.message);
  }
};

$.gotPkt = function (pkt) {
  $.ui.log('raw', '<<< ' + JSON.stringify(pkt));
  
  if (ops[pkt.op])
    ops[pkt.op](pkt, pkt.ex);
  else
    $.ui.log('debug', 'unhandled op', pkt.op, 'in', pkt);
};

$.send = function (pkt) {
  $.ui.log('raw', '>>> ' + JSON.stringify(pkt));
  
  $.socket.send(JSON.stringify(pkt));
};

