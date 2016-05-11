function my_function(toUser) {
    var content = $("#board-text"),
        text_input = $(".ke-content"),
        oldContent = content.val(),
        prefix = toUser + "@",
        newContent = '';
    if(oldContent.length > 0){
        if (oldContent != prefix) {
            newContent =  prefix + oldContent;
        }
    } else {
        newContent = prefix;
    }
    text_input.focus();
    content.focus();
    //content.val(newContent);
    editor.insertHtml(newContent);
}