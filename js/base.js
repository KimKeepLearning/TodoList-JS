;(function () {
    'use strict';

    var $form_add_task = $('.add-task'), $add_button = $('.add-task .submit');
    // var new_task = {};
    var task_list =[];
    

    init();
    $add_button.on("click", function (e) {
        var new_task = {};
        var $input = $form_add_task.find('input[name=content]');
        e.preventDefault();
        new_task.content = $input.val();
        if (!new_task.content) return;
        
        if (addTask(new_task)) {
            render_task_list();
            $input.val('');
        }


    });

    function addTask(new_task) {
        task_list.push(new_task);
        store.set('task_list', task_list);
        // store.clearAll();
        return true;
    }

    function init() {
        // store.clearAll();
        task_list = store.get('task_list') || [];
        if (task_list.length) {
            render_task_list();
        }
    }
    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');
        for (let i = 0; i < task_list.length; i++){
            var $task = render_task_tpl(task_list[i]);
            $task_list.append($task);
        }
    }
    function render_task_tpl(data) {
        var list_item_tpl =
            '<div class="task-item">' +
            '<span><input type="checkbox"></span>' +
            '<span class="task-content">' + data.content + '</span>' +
            '<span class="fr">' +
                '<span class="action"> 删除</span>' +
                '<span class="action"> 详情</span>' +
            '</span>' +
            '</div>';
        
        return list_item_tpl;
    }

})();