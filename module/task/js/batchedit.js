$(document).ready(removeDitto());//Remove 'ditto' in first row.

$(document).on('click', '.chosen-with-drop', function(){oldValue = $(this).prev('select').val();})//Save old value.

/* Set ditto value. */
$(document).on('change', 'select', function()
{
    if($(this).val() == 'ditto')
    {
        var index = $(this).closest('td').index();
        var row   = $(this).closest('tr').index();
        var tbody = $(this).closest('tr').parent();

        var value = '';
        for(i = row - 1; i >= 0; i--)
        {
            value = tbody.children('tr').eq(i).find('td').eq(index).find('select').val();
            if(value != 'ditto') break;
        }

        isStories     = $(this).attr('name').indexOf('stories')     != -1;
        isModules     = $(this).attr('name').indexOf('modules')     != -1;
        isAssignedTos = $(this).attr('name').indexOf('assignedTos') != -1;
        isFinishedBys = $(this).attr('name').indexOf('finishedBys') != -1;
        isClosedBys   = $(this).attr('name').indexOf('closedBys')   != -1;

        if(isStories || isModules || isAssignedTos || isFinishedBys || isClosedBys)
        {
            var valueStr = ',' + $(this).find('option').map(function(){return $(this).val();}).get().join(',') + ',';
            if(valueStr.indexOf(',' + value + ',') != -1)
            {
                $(this).val(value);
            }
            else
            {
                alert(dittoNotice);
                $(this).val(oldValue);
            }
        }
        else
        {
            $(this).val(value);
        }

        $(this).trigger("chosen:updated");
        $(this).trigger("change");
    }
})
$(document).ready(function() {
    $("input[type='text'][id^='dayses['],input[type='text'][id^='scores['],input[type='text'][id^='estimates[']").keydown(function (e) {
        var code = parseInt(e.keyCode);
        if (code >= 96 && code <= 105 || code >= 48 && code <= 57 || code == 8) {
            return true;
        } else {
            return false;
        }
    })
    $("input[type='text'][id^='estimates[']").keyup(function () {
        estTaskScore(this.value,$(this).data('index'));
    })
})