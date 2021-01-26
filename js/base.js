;(function () {
    'use strict';

    var $form_add_task = $('.add-task'),
        $add_button = $('.add-task .submit'),
        $delete_task;
    var task_list =[];
    

    init();
    $add_button.on("click", function (e) {
        var new_task = {};
        var $input = $form_add_task.find('input[name=content]');
        e.preventDefault();
        new_task.content = $input.val();
        if (!new_task.content) return;
        
        if (addTask(new_task)) {
            $input.val('');
        }


    });
    function listenTaskDelete() {
        $delete_task.on("click", function (e) {
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = $item.data('index');
            var deleteComfirm = confirm("确定删除？");
            deleteComfirm ? deleteTask(index) : null;
        });    
    }
    

    function addTask(new_task) {
        task_list.push(new_task);
        refreshTaskList();
        return true;
    }

    function refreshTaskList() {
        store.set("task_list", task_list);
        render_task_list();
    }

    function deleteTask(index) {
        if (index === undefined || !task_list[index]) return;
        delete task_list[index];
        refreshTaskList();

    }
    function init() {
        task_list = store.get('task_list') || [];
        if (task_list.length) {
            render_task_list();
        }
        
    }
    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');
        for (let i = 0; i < task_list.length; i++){
            var $task = render_task_tpl(task_list[i], i);
            $task_list.append($task);
        }
        $delete_task = $(".action.delete");
        listenTaskDelete();
    }
    function render_task_tpl(data, index) {
        if (!data || !index) return;
        var list_item_tpl =
            '<div class="task-item" data-index="'+ index+'">' +
            '<span><input type="checkbox"></span>' +
            '<span class="task-content">' + data.content + '</span>' +
            '<span class="fr">' +
                '<span class="action delete"> 删除</span>' +
                '<span class="action"> 详情</span>' +
            '</span>' +
            '</div>';
        
        return list_item_tpl;
    }

})();