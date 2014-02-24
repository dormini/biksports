// main
$(window).load(function() {
    prepare_slides();
    prepare_boxes();
});


// color slides and make them draggable
var prepare_slides = function() {
    var slide_content = $('.slide_content');
    // color slides randomly:
    var index = 1;
    slide_content.each(function () {
        $(this).css('background-color', color_for_index(index++));
    });

    // slide drag event
    slide_content.draggable({
        helper: 'clone',
        opacity: 0.9,
        scroll: false,
        cancel: '.empty',
        revert: 'invalid',
        revertDuration: 300,
        start: function (event, ui) {
            $(event.target).parent().addClass('placeholder');
        },
        stop: function (event, ui) {
            $(event.target).parent().removeClass('placeholder');
        }
    });
};


// make boxes droppable
var prepare_boxes = function() {
    $('.box').droppable({
        hoverClass: 'box-hover',
        drop: box_drop
    });
};


// called when content is dropped in box
var box_drop = function(event, ui) {
    var box = $(this);

    var content = box.find('.box_content');
    if (content.length) { // content exists
        var index = content.data('index');
        if (index != ui.draggable.data('index')) {
            snap_back_to_slide(content, index);
        }
    }

    if (ui.draggable.hasClass('slide_content')) { // slide dropped
        drop_slide_in_box(box, ui.draggable);
        puff_out(ui.helper);
    } else { // box dropped
        animate_to_box(box, ui.draggable);
    }
};


// animate content back to slide
var snap_back_to_slide = function(content, index) {
    var slide = $('.slide>[data-index=' + index + ']').parent();
    content.effect('transfer', {
        duration: 400,
        to: slide,
        complete: function () {
            slide.removeClass('empty');
        }
    });
    $('.ui-effects-transfer').css('background-color', content.css('background-color'));
    content.remove();
};


// load box content from dropped slide_content data-index, empties slide
var drop_slide_in_box = function(box, content) {
    var box_content = get_box_content(content.data('index'));
    box_content.css('opacity', '0');
    box.append(box_content);
    box_content.animate({ opacity: 1}, 150);

    // empty slide
    content.parent().addClass('empty');
};


// clone and puff animate hide element
var puff_out = function(content) {
    // puff out helper
    var clone = content.clone();
    content.parent().append(clone);
    clone.effect('puff', {
        duration: 300,
        complete: function () {
            clone.remove();
        }
    });
};


// animate a box_content after drop to new box
var animate_to_box = function(box, content) {
    var offset = box.offset(),
        parent_offset = content.parent().offset();
    offset.top -= parent_offset.top;
    offset.left -= parent_offset.left;
    content.animate({
        top: offset.top,
        left: offset.left
    }, 300, function () {
        box.append(content);
        content.css('top', '');
        content.css('left', '');
    });
};


// creates a new draggable box content
var get_box_content = function(index) {
    return $('<div class="box_content" data-index="' + index +
        '" style="background-color:' + color_for_index(index) +';">'
        + index + '</div>')
        .draggable({
            stack: '.box_content',
            opacity: 0.9,
            scroll: false,
            revert: function(drop) {
                if (!drop) {
                    snap_back_to_slide(this,this.data('index'));
                }
                return drop;
            },
            revertDuration: 300
        });
};


// pseudo random color string
var color_for_index = function(index) {
    return '#'+(0x1000000+(index*0x593512)).toString(16).substr(1,6);
};













