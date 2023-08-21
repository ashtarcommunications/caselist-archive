// Make sure the XWiki.index.trash.attachments 'namespace' exists.
if (typeof XWiki == "undefined") {
  XWiki = new Object();
}
if (typeof XWiki.index == "undefined") {
  XWiki.index = new Object();
}
if (typeof XWiki.index.trash == "undefined") {
  XWiki.index.trash = new Object();
}
if (typeof XWiki.index.trash.attachments == "undefined") {
  XWiki.index.trash.attachments = new Object();
}

/**
 * Callback function used by the DeletedAttachments livetable for generating the HTML code needed to display an entry.
 * 
 * @param row the JSON data corresponding to the entry to be displayed
 * @param i the index of the row in the list of entries
 * @param table the LiveTable javascript object
 */
XWiki.index.trash.attachments.displayEntry = function (row, i, table) {
  var tr = new Element('tr'); // The resulting table row
  var file = new Element('a', {'href' : row.url}).update(row.filename);
  tr.appendChild(new Element('td').update(file));
  var doc = new Element('a', {'href' : row.documentUrl}).update(row.title);
  doc.appendChild(document.createTextNode(' (' + row.docName + ')'));
  tr.appendChild(new Element('td').update(doc));
  tr.appendChild(new Element('td').update(row.date));
  var deleter = new Element('a', {'href' : row.deleterurl}).update(row.deletername);
  tr.appendChild(new Element('td').update(deleter));
  var actions = new Element('td', {'class' : 'itemActions'});
  if(row.canDelete) {
    var delete_ = new Element('a', {
        'href' : row.deleteUrl,
        'class' : "tool delete",
        'title' : "Permanently delete attachment"
      }).update("[delete]");
    actions.appendChild(delete_);
    delete_.observe('click', XWiki.index.trash.attachments.confirmDelete.bindAsEventListener(delete_, table, i));
  }
  tr.appendChild(actions);
  return tr;
}

/**
 * Event listener, called when clicking a delete version link. It displays a confirmation box, speeding up the two-step
 * deletion process.
 * 
 * @param event the link activation event
 * @param table the LiveTable javascript object
 * @param rowIdx the index of the row corresponding to the entry to be deleted
 */
XWiki.index.trash.attachments.confirmDelete = function(event, table, rowIdx) {
  event.stop();
  if (this.disabled) {
    // Do nothing if the button was already clicked and it's waiting for a response from the server.
    return;
  } else {
    new XWiki.widgets.ConfirmedAjaxRequest(
      /* Ajax request URL */
      this.href + '&confirm=1' + (Prototype.Browser.Opera ? "" : "&ajax=1"),
      /* Ajax request parameters */
      {
        onCreate : function() {
          // Disable the button, to avoid a cascade of clicks from impatient users
          this.disabled = true;
        }.bind(this),
        onSuccess : function(table, rowIdx) {
          // Remove the corresponding HTML element from the UI and update the livetable
          table.deleteRow(rowIdx);
        }.bind(this, table, rowIdx),
        // This is an expected 404, returned when the document has been successfully deleted and is no longer found
        on404 : function(response, table, rowIdx) {
          response.request.options.onSuccess(table, rowIdx);
        }.bindAsEventListener(this, table, rowIdx),
        onComplete : function() {
          // In the end: re-enable the button
          this.disabled = false;
        }.bind(this)
      },
      /* Interaction parameters */
      {
         confirmationText: "This action is not reversible. Are you sure you wish to continue?",
         progressMessageText : "Permanently deleting attachment...",
         successMessageText : "Attachment permanently deleted",
         failureMessageText : "Failed to delete: "
      }
      );
  }
}
/*
 * The livetable is hidden when javascript is disabled, so that an alternative <noscript> table is displayed.
 * Re-display it when the document loads and Javascript is available.
 */
document.observe('xwiki:dom:loaded', function() {
  if ($('attachmentTrash')) {
    $('attachmentTrash').up('.hidden').removeClassName('hidden');
  }
});
