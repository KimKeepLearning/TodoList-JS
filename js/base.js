;(function () {
    'use strict';

    var $form_add_task = $('.add-task');
    var new_task = {};

    console.log("1");
    $form_add_task.on("submit", function (e) {
        new_task.content = $(this).find('input[name=content]').val();
        console.log("2");
        console.log(new_task.content);
        e.preventDefault();
    });

})();