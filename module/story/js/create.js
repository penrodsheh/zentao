$(function()
{
    if($('#needNotReview').prop('checked'))
    {
        $('#assignedTo').attr('disabled', 'disabled');
    }
    else
    {
        $('#assignedTo').removeAttr('disabled');
    }
    $('#assignedTo').trigger("chosen:updated");

    $('#needNotReview').change(function()
    {
        if($('#needNotReview').prop('checked'))
        {
            $('#assignedTo').attr('disabled', 'disabled');
        }
        else
        {
            $('#assignedTo').removeAttr('disabled');
        }
        $('#assignedTo').trigger("chosen:updated");
    });

    $('[data-toggle=tooltip]').tooltip();

    // ajust style for file box
    var ajustFilebox = function()
    {
        applyCssStyle('.fileBox > tbody > tr > td:first-child {transition: none; width: ' + ($('#mailtoGroup').width() - 2) + 'px}', 'filebox')
    };
    ajustFilebox();
    $(window).resize(ajustFilebox);

    $('#btnPri').tooltip({
        animation: true,
        placement: "top",
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="text-align: left;min-width: 350px"></div></div>',   //tip插入代码
        trigger: "hover focus",
        title: "优先级在于描述任务紧急程度，1为紧急程度最高，依次递减。<br>由实施人员确定任务紧急等级，该等级将参与绩效分数核算。",
        delay: 0,
        html: true,
        container: false,
        viewport: {
            selector: 'body',
            padding: 0
        }
    })
});