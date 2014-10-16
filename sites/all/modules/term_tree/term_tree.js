// $Id: term_tree.js,v 1.1.2.2 2009/08/10 17:21:12 nonsie Exp $

/**
 * @files js for collapsible tree view with some helper functions for updating tree structure
 */

Drupal.behaviors.TermTreeView = function(context) {
  var settings = Drupal.settings.tree;
  var id, vid;
  if (settings['id']) {
    if (!(settings['id'] instanceof Array)) {
       id = settings['id'];
       vid = settings['vid'];
       if (!$('#'+ id + '.tm-processed').size()) {
         new Drupal.TermTreeView(id, vid);
       }
    }
    else {
      for (var i = 0; i < settings['id'].length; i++) {
        id = settings['id'][i];
        vid = settings['vid'][i];
        if (!$('#'+ id + '.tm-processed').size()) {
          new Drupal.TermTreeView(id, vid);
        }
      }
    }
  }
}


Drupal.TermTreeView = function(id, vid) {
  this.div = $("div#"+ id);
  this.ul = $(this.div).find("ul");
  this.form = $(this.ul).parents('form');
  this.form_build_id = $(this.form).find(':input[@name="form_build_id"]').val();
  this.form_id = $(this.form).find(' :input[@name="form_id"]').val();
  this.treeId = id;
  this.vocId = vid;
  //Disable disabled terms if any of the modules request it
  //Assign a class for parent element (label) if term is disabled
  $(this.div).find('.term-disabled').each(function(){
    this.parent = $(this).parent();
    $(this.parent).addClass('item-disabled');
  });
  //Assign a class for checked input element parent (label)
  //Disable input elements that should not be accessible except the selected input if it is disabled
  $(this.div).find(" :input[class*='term-disabled']:not(:checked)").each(function(){
    $(this).attr("disabled", 'disabled');
  });
  //Handler when input element is clicked
  $(this.div).find(" :input[class*='term-id']").each(function(){
     $(this).click(function() {
      //alert('clicked on '+$(this).val());
      //find all disabled unchecked elements and disable them
      $(this).parents('ul').find(" :input[class*='term-disabled']:not(:disabled)").each(function(){
        $(this).attr("disabled", 'disabled');
        //alert('marking element '+$(this).val()+' disabled');
      });
    });
  });
  $(this.div).addClass("tm-processed");
  this.attachTreeview(this.ul);
  this.attachChildForm();
};


/**
 * adds collapsible treeview to a given list
 */
Drupal.TermTreeView.prototype.attachTreeview = function(ul) {
 var tree = this;
  $(ul)
    .addClass("treeview")
    .find("li:has(ul)").prepend("<div class='hitArea'/>").end()
    .find("div.hitArea").click(function() {
      tree.toggleTree(this);
    });

  //Disable disabled terms if any of the modules request it
  $(ul).find(" :input[class*='term-disabled']:not(:checked)").attr("disabled", 'disabled').parent().addClass('item-disabled');
  //Handler when input element is clicked
  $(ul).find(" :input[class*='term-id']").each(function(){
     $(this).click(function() {
      //alert('attachtreeview: clicked on '+$(this).val());
      //find all disabled unchecked elements and disable them

      $(this).parents('ul').find(" :input[class*='term-disabled']:not(:disabled)").each(function(){
        $(this).attr("disabled", 'disabled');
        //alert('marking element '+$(this).val()+' disabled');
      });
    });
  });
  $(ul).find("li.expandable").find("ul").hide();
  $(ul).find("li.lastExpandable").find("ul").hide();
}

/**
 * toggles a collapsible/expandable tree element by swaping classes
 */
Drupal.TermTreeView.prototype.toggleTree = function(node) {
  $(node).parent().find("ul:first").toggle();
  this.swapClasses(node.parentNode, "expandable", "collapsable");
  this.swapClasses(node.parentNode, "lastExpandable", "lastCollapsable");
}

/**
 * helper function for swapping two classes
 */
Drupal.TermTreeView.prototype.swapClasses = function(node, c1, c2) {
  if ($.className.has(node, c1)) {
    $(node).removeClass(c1).addClass(c2);
  }
  else if ($.className.has(node, c2)) {
    $(node).removeClass(c2).addClass(c1);
  }
}


/**
 * add click events to expandable parents, where child terms have to be loaded
 */
Drupal.TermTreeView.prototype.attachChildForm = function(subTree) {
  var tree = this;
  var list = "li.has-children div.hitArea";
  if (subTree) {
    list = $(subTree).find(list);
  }
  $(list).click(function() {
    tree.loadChildForm($(this).parent());
  });
}

/**
 * loads child terms and appends html to list
 */
Drupal.TermTreeView.prototype.loadChildForm = function(li) {
  var tree = this;
  if ($(li).is(".has-children")) {
    var parentId = Drupal.getTermId(li);
    if (!(Drupal.settings.childForm['url'] instanceof Array)) {
      url = Drupal.settings.childForm['url'];
    }
    else {
      url = Drupal.settings.childForm['url'][0];
    }
    url += '/'+ this.treeId +'/'+ this.vocId +'/'+ parentId;
    var param = new Object();
    param['form_build_id'] = this.form_build_id;
    param['form_id'] = this.form_id;
    param['tree_id'] = this.treeId;
    $.get(url, param, function(data) {
      $(li).find("ul").remove();
      $(li).find("div.term-line").after(data);
      var ul = $(li).find("ul");
      tree.attachTreeview(ul);
      tree.attachChildForm(li);

      $(li).removeClass("has-children");
    });

  }
}

/**
 * function for reloading root tree elements
 */
Drupal.TermTreeView.prototype.loadRootForm = function() {
  if (!(Drupal.settings.childForm['url'] instanceof Array)) {
    url = Drupal.settings.childForm['url'];
  }
  else {
    url = Drupal.settings.childForm['url'][0];
  }
  var tree = this;
  url += '/'+ this.treeId +'/'+ this.vocId +'/0/true';
  $.get(url, null, function(data) {
    $('#'+ tree.treeId).html(data);
    var ul = $('#'+ tree.treeId).find("ul");
    tree.attachTreeview(ul);
    tree.attachChildForm();
  });
}


/**
 * returns terms id of a given list element
 */
Drupal.getTermId = function(li) {
  // previous method: return $(li).find("input:hidden[@class=term-id]").attr("value");
  return $(li).find("input[@class*=term-id]").attr("value");
}

/**
 * return term id of a parent of a given list element
 * if no parent exists (root level), returns 0
 */
Drupal.getParentId = function(li) {
  var parentId;
  try {
    var parentLi = $(li).parent("ul").parent("li");
    parentId = Drupal.getTermId(parentLi);
  } catch(e) {
    return 0;
  }
  return parentId;
}