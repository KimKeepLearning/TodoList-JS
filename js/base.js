;(function () {
    'use strict';

    var $form_add_task = $('.add-task'),
        $add_button = $('.add-task .submit'),
        $delete_task, $detail_task,
        $task_detail = $(".task-detail"),
        $task_detail_mask = $('.task-detail-mask'),
        $update_form,
        $task_detail_content,
        $task_detail_conent_input,
        $checkbox_complete,
        $msg = $('.msg'),
        $msg_content = $('.msg .msg-content'),
        $msg_confirm = $('.msg .confirmed'),
        current_index;
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
    $task_detail_mask.on("click", hideTaskDetail);

    function listenTaskDelete() {
        $delete_task.on("click", function (e) {
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = $item.data('index');
            var deleteComfirm = confirm("确定删除？");
            deleteComfirm ? deleteTask(index) : null;
        });
    }
    function listenTaskDetail() {

        $(".task-item").on("dblclick", function (e) {
            var index = $(this).data("index");
            showTaskDetail(index);
        });

        $detail_task.on("click", function (e) {
            //显示mask和detail
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = $item.data("index");
            showTaskDetail(index);
        });
    }
    function listenCheckboxComplete() {
        $checkbox_complete.on("click", function () {
            var $this = $(this);
            var index = $this.parent().parent().data("index");
            var item = get(index);
            if (item.complete) {
                updateTask(index, { complete: false });
            } else {
                updateTask(index, { complete: true });
            }
        });
    }
    function listenMsgEvent() {
        $msg_confirm.on("click", function (e) { 
            hideMsg();
        });
    }
    function get(index) {
        return store.get('task_list')[index];
    }

    function showTaskDetail(index) {
        render_task_detail(index);
        $task_detail.show();
        $task_detail_mask.show();
        current_index = index;
    }
    function hideTaskDetail() {
        $task_detail.hide();
        $task_detail_mask.hide();
    }

    function updateTask(index, data) {
        if (index === undefined || !task_list[index]) return;

        task_list[index] = $.extend({}, task_list[index], data);
        // task_list[index] = data;
        refreshTaskList();

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
        listenMsgEvent();
        if (task_list.length) {
            render_task_list();
        }
        task_remind_check();
        
    }
    function task_remind_check() {
        var current_timestamp;
        var itl = setInterval(function () {
            for (var i = 0; i < task_list.length; i++) {
                var item = get(i), task_timestamp;
                if (!item || !item.remind_data || item.informed) continue;

                current_timestamp = (new Date()).getTime();
                task_timestamp = (new Date(item.remind_data)).getTime();

                console.log(current_timestamp, task_timestamp, current_timestamp - task_timestamp >= 1)
                if (current_timestamp - task_timestamp >= 1) {
                    updateTask(i, { informed: true });
                    showMsg(item.content);
                }
            }
        }, 300);
    }

    function showMsg(msg) {
        console.log("showing...");
        console.log($msg_content);
        $msg_content.html(msg);
        $msg.show();
    }

    function hideMsg() {
        $msg.hide();
    }

    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');

        var taks_complete = [];
        for (let i = 0; i < task_list.length; i++){
            var item = task_list[i];
            if (!item) continue;
            if (item.complete) {
                taks_complete[i]=item;
            } else {
                var $task = render_task_tpl(item, i);
                $task_list.prepend($task);
            }
        }

        for (let j = 0; j < taks_complete.length; j++){
            item = taks_complete[j];
            if (!item) continue;
            $task = render_task_tpl(item, j);
            if (!$task) continue;
            $task.addClass("completed");
            $task_list.append($task);
        }


        $delete_task = $(".action.delete");
        $detail_task = $(".action.detail");
        $checkbox_complete = $('.task-list .complete');
        listenTaskDelete();
        listenTaskDetail();
        listenCheckboxComplete();
    }
    function render_task_tpl(data, index) {
        if (!data || !index) return;
        var list_item_tpl =
            '<div class="task-item" data-index="'+ index+'">' +
            '<span><input class="complete"'+(data.complete?"checked":"")+' type="checkbox"></span>' +
            '<span class="task-content">' + data.content + '</span>' +
            '<span class="fr">' +
                '<span class="action delete"> 删除</span>' +
                '<span class="action detail"> 详情</span>' +
            '</span>' +
            '</div>';
        return $(list_item_tpl);
    }
    function render_task_detail(index) {
        if (index === undefined || !task_list[index]) return;
        var item = task_list[index];
        var tpl =
            '<form>' +
            '<div class="content">' + item.content + '</div>' +
            '<div><input style="display:none;" type="text" name="content" value="'+item.content+'"></div>' +
            '<div>' +
            '<div class="desc">' +
            '<textarea name="desc" >' + (item.desc || '') + '</textarea>' +
            '</div>' +
            '</div>' +
            '<div class="remind">' +
            '<label>设置提醒时间</label>'+
            '<input class="datetime" name="remind_data" type="text" value="'+(item.remind_data||'')+'">' +
            '</div>' +
            '<div><button type="submit">更新</button></div>' +
            '</form>';
        $task_detail.html('');
        $task_detail.html(tpl);
        $(".datetime").datetimepicker();

        $update_form = $task_detail.find('form');
        $task_detail_content = $update_form.find(".content");
        $task_detail_conent_input = $update_form.find("[name=content]");

        $task_detail_content.on("dblclick", function (e) {
            $task_detail_conent_input.show();
            $task_detail_content.hide();
        });

        $update_form.on("submit", function (e) {
            e.preventDefault();
            var data = {};
            data.content = $(this).find("[name=content]").val();
            data.desc = $(this).find("[name=desc").val();
            data.remind_data = $(this).find("[name=remind_data]").val();
            updateTask(index, data);
            hideTaskDetail();
        });
    }
})();