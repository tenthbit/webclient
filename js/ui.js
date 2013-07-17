$.ui = {};

$(function () {
  /*
   * Switcher and book management
   **************************************/
  var $switcher = $('#switcher');
  var $tabs = $('#switcher ul');
  var $book = $('#book');
  var pages = {};
  $.roommeta = {};
  var current;
  
  $.ui.log = function (id, msg) {
    var page = $.ui.getPage(id);
    page.$backlog.append($('<p>', {text: msg}));
  };
  
  $.ui.getPage = function (id) {
    if (id in pages) return pages[id];
    var page = {id: id, meta: $.roommeta[id]};
    
    page.$tab = $('<li>').data('id', id);
    page.$a = $('<a>', {text: page.meta ? page.meta.name : id, href: '#'+id}).appendTo(page.$tab).data('id', id);
    $tabs.append(page.$tab);
    
    page.$page = $('<section>').data('id', id);
    page.$backlog = $('<div>', {'class': 'backlog'}).appendTo(page.$page);
    page.$right = $('<div>', {'class': 'userlist'}).appendTo(page.$page);
    page.$userul = $('<ul>', {'class': 'users'}).appendTo(page.$right);
    $book.append(page.$page);
    
    if (page.meta) {
      for (var idx in page.meta.users) {
        page.$userul.append($('<li>', {text: page.meta.users[idx]}).data('user', page.meta.users[idx]));
      };
    }
    
    pages[id] = page;
    
    if (!current)
      $.ui.showTab(id);
    
    return page;
  };
  
  $.ui.showTab = function (id) {
    if (current) {
      current.$tab.removeClass('active');
      current.$page.removeClass('active');
    }
    
    current = $.ui.getPage(id);
    current.$tab.addClass('active');
    current.$page.addClass('active');
    $txt.focus();
  }
  
  $.ui.updateMeta = function (id, meta) {
    $.roommeta[id] = meta;
    
    if (id in pages) {
      var page = $.ui.getPage(id);
      page.meta = meta;
      page.$a.text(meta.name);
      
      page.$userul.empty();
      for (var idx in meta.users) {
        page.$userul.append($('<li>', {text: meta.users[idx]}).data('user', meta.users[idx]));
      };
    };
  };
  
  $.ui.removeNick = function (id, nick) {
    var page = $.ui.getPage(id);
    page.meta.users.splice(page.meta.users.indexOf(nick), 1);
    
    page.$userul.empty();
    for (var idx in page.meta.users) {
      page.$userul.append($('<li>', {text: page.meta.users[idx]}).data('user', page.meta.users[idx]));
    };
  };
  
  $.ui.addNick = function (id, nick) {
    var page = $.ui.getPage(id);
    page.meta.users.push(nick);
    
    page.$userul.empty();
    for (var idx in page.meta.users) {
      page.$userul.append($('<li>', {text: page.meta.users[idx]}).data('user', page.meta.users[idx]));
    };
  };
  
  $tabs.on('click', 'a', function (e) {
    e.preventDefault();
    
    var id = $(e.target).data('id');
    $.ui.showTab(id);
  });
  
  /*
   * Statusbox Control
   **************************************/
  var $statbox = $('#statusbox');
  $.updateStatus = function (line, text) {
    $statbox.find('[data-line='+line+']').text(text);
  };
  
  /*
   * Inputbox
   **************************************/
  var $form = $('#input form');
  var $txt = $('#input [type=text]');
  $form.submit(function (e) {
    e.preventDefault();
    
    var text = $txt.val();
    $txt.focus();
    $txt.val('');
    
    $.send({op: 'act', rm: current.id, ex: {message: text}});
  });
  $txt.focus();
  
  /*
   * Dialog box management
   **************************************/
  
});

