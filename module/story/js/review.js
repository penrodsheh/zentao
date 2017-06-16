function switchShow(result)
{
    if(result == 'reject')
    {
        $('#rejectedReasonBox').show();
        $('#preVersionBox').hide();
        $('#assignedTo').val('closed');
        $('#assignedTo').trigger("chosen:updated");
    }
    else if(result == 'revert')
    {
        $('#preVersionBox').show();
        $('#rejectedReasonBox').hide();
        $('#duplicateStoryBox').hide();
        $('#childStoriesBox').hide();
        $('#assignedTo').val(assignedTo);
        $('#assignedTo').trigger("chosen:updated");
    }
    else
    {
        $('#preVersionBox').hide();
        $('#rejectedReasonBox').hide();
        $('#duplicateStoryBox').hide();
        $('#childStoriesBox').hide();
        $('#rejectedReasonBox').hide();
        $('#assignedTo').val(assignedTo);
        $('#assignedTo').trigger("chosen:updated");
    }
}

function setStory(reason)
{
    if(reason == 'duplicate')
    {
        $('#duplicateStoryBox').show();
        $('#childStoriesBox').hide();
    }
    else if(reason == 'subdivided')
    {
        $('#duplicateStoryBox').hide();
        $('#childStoriesBox').show();
    }
    else
    {
        $('#duplicateStoryBox').hide();
        $('#childStoriesBox').hide();
    }
}
$(function () {
    $('[data-toggle="tooltip"]').tooltip({
        animation: true,
        placement: "right",
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="text-align: left;min-width: 500px"></div></div>',   //tip插入代码
        trigger: "hover focus",
        title: "<h3>业务难度：</h3><p>需求的业务复杂难度分为1到10级， 1—4级为简单任务，5—7级为中等难度任务，8—10级为复杂任务，具体等级由产品经理制定，参考标准为：</p><ul><li>简单任务：只涉及单系统开发，并且是系统内部简单业务调整的。</li><li>中等难度：涉及单系统开发，并且涉及单系统内核心业务调整的，或涉及至少两个系统调整的业务。</li><li>复杂难度：涉及至少两个系统以上的业务流程变更的，或涉及系统底层业务变更的。</li></ul>",
        delay: 0,
        html: true,
        container: false,
        viewport: {
            selector: 'body',
            padding: 0
        }
    })
})