$.ui = {};

$(function () {
  /*
   * Switcher and book management
   **************************************/
  var $switcher = $('#switcher');
  var $tabs = $('#switcher ul');
  var $book = $('#book');
  var pages = [];
  
  $.ui.log = function (name, msg) {
    var page = pages.filter(function(p){return p.name==name})[0];
    if (!page) page = $.ui.addPage(name);
    page.$backlog.append($('<p>', {text: msg}));
  }
  
  $.ui.addPage = function (name) {
    var page = {name: name};
    
    page.$tab = $('<li>').data('name', name);
    page.$a = $('<a>', {text: name, href: '#'}).appendTo(page.$tab);
    $tabs.append(page.$tab);
    
    page.$page = $('<section>').data('name', name);
    page.$backlog = $('<div>', {'class': 'backlog'}).appendTo(page.$page);
    page.$userlist = $('<div>', {'class': 'userlist'}).appendTo(page.$page);
    $book.append(page.$page);
    
    pages.push(page);
    return page;
  };
  
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
    
    $.send({op: 'act', rm: $.room, ex: {message: text}});
  });
  $txt.focus();
  
  /*
   * Dialog box management
   **************************************/
  
});

