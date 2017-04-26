/* Copy story title as task title. */
function copyStoryTitle()
{
    var storyTitle = $('#story option:selected').text();
    startPosition = storyTitle.indexOf(':') + 1;
    endPosition   = storyTitle.lastIndexOf('(');
    storyTitle = storyTitle.substr(startPosition, endPosition - startPosition);
    $('#name').attr('value', storyTitle);
}

/* Set the assignedTos field. */
function setOwners(result)
{
    if(result == 'affair')
    {
        $('#assignedTo').attr('multiple', 'multiple');
        $('#assignedTo').chosen('destroy');
        $('#assignedTo').chosen(defaultChosenOptions);
        $('#selectAllUser').removeClass('hidden');
    }
    else if($('#assignedTo').attr('multiple') == 'multiple')
    {
        $('#assignedTo').removeAttr('multiple');
        $('#assignedTo').chosen('destroy');
        $('#assignedTo').chosen(defaultChosenOptions);
        $('#selectAllUser').addClass('hidden');
    }
}

/* Set the score field. */
function setScore(result)
{
    $('#score').val(result);
}


/* Set preview and module of story. */
function setStoryRelated()
{
    setPreview();
    if($('#module').val() == 0) setStoryModule();
}

/* Set the story module. */
function setStoryModule()
{
    var storyID = $('#story').val();
    if(storyID)
    {
        var link = createLink('story', 'ajaxGetModule', 'storyID=' + storyID);
        $.get(link, function(moduleID)
        {
            $('#module').val(moduleID);
            $("#module").trigger("chosen:updated");
        });
    }
}

/* Set the story priview link. */
function setPreview()
{
    if(!$('#story').val())
    {
        $('#preview').addClass('hidden');
        $('#copyButton').parent().addClass('hidden');
    }
    else
    {
        storyLink  = createLink('story', 'view', "storyID=" + $('#story').val());
        var concat = config.requestType != 'GET' ? '?'  : '&';
        storyLink  = storyLink + concat + 'onlybody=yes';
        $('#preview').removeClass('hidden');
        $('#preview a').attr('href', storyLink);
        $('#copyButton').parent().removeClass('hidden');
    }

    setAfter();
}
/**
 * Compute work days.
 *
 * @access public
 * @return void
 */
function computeWorkDays(currentID)
{
    isBactchEdit = false;
    if(currentID)
    {
        index = currentID.replace('estStarted[', '');
        index = index.replace('deadline[', '');
        index = index.replace(']', '');
        if(!isNaN(index)) isBactchEdit = true;
    }

    if(isBactchEdit)
    {
        beginDate = $('#estStarted\\[' + index + '\\]').val();
        endDate   = $('#deadline\\[' + index + '\\]').val();
    }
    else
    {
        beginDate = $('#estStarted').val();
        endDate   = $('#deadline').val();
    }

    if(beginDate && endDate)
    {
        if(isBactchEdit)  $('#dayses\\[' + index + '\\]').val(computeDaysDelta(beginDate, endDate));
        if(!isBactchEdit) $('#days').val(computeDaysDelta(beginDate, endDate));
    }
    else if($('input[checked="true"]').val())
    {
        computeEndDate();
    }
    estTaskScore(computeDaysDelta(beginDate, endDate));
}
/**
 * Compute the end date for project.
 *
 * @param  int    $delta
 * @access public
 * @return void
 */
function computeEndDate(delta)
{
    beginDate = $('#estStarted').val();
    if(!beginDate) return;

    delta     = parseInt(delta);
    beginDate = convertStringToDate(beginDate);
    if((delta == 7 || delta == 14) && (beginDate.getDay() == 1))
    {
        delta = (weekend == 2) ? (delta - 2) : (delta - 1);
    }

    endDate = beginDate.addDays(delta - 1).toString('yyyy-MM-dd');
    $('#deadline').val(endDate).datetimepicker('update');
    computeWorkDays();
}
/**
 * Convert a date string like 2011-11-11 to date object in js.
 *
 * @param  string $date
 * @access public
 * @return date
 */
function convertStringToDate(dateString)
{
    dateString = dateString.split('-');
    return new Date(dateString[0], dateString[1] - 1, dateString[2]);
}

/**
 * Compute delta of two days.
 *
 * @param  string $date1
 * @param  string $date1
 * @access public
 * @return int
 */
function computeDaysDelta(date1, date2)
{
    date1 = convertStringToDate(date1);
    date2 = convertStringToDate(date2);
    delta = (date2 - date1) / (1000 * 60 * 60 * 24) + 1;

    weekEnds = 0;
    for(i = 0; i < delta; i++)
    {
        if((weekend == 2 && date1.getDay() == 6) || date1.getDay() == 0) weekEnds ++;
        date1 = date1.valueOf();
        date1 += 1000 * 60 * 60 * 24;
        date1 = new Date(date1);
    }
    return delta - weekEnds;
}
/**
 * Set after locate. 
 * 
 * @access public
 * @return void
 */
function setAfter()
{
    if($("#story").length == 0 || $("#story").select().val() == '') 
    {
        if($('input[value="continueAdding"]').attr('checked') == 'checked') 
        {
            $('input[value="toTaskList"]').attr('checked', 'checked');
        }
        $('input[value="continueAdding"]').attr('disabled', 'disabled');
    }
    else
    {
        $('input[value="continueAdding"]').attr('checked', 'checked');
        $('input[value="continueAdding"]').attr('disabled', false);
    }
}

/**
 * Load stories.
 * 
 * @param  int    $projectID 
 * @access public
 * @return void
 */
function loadStories(projectID)
{
    moduleID  = $('#module').val();
    setStories(moduleID, projectID);
}

/**
 * load stories of module.
 * 
 * @access public
 * @return void
 */
function loadModuleRelated()
{
    moduleID  = $('#module').val();
    projectID = $('#project').val();
    setStories(moduleID, projectID);
}

/* Get select of stories.*/
function setStories(moduleID, projectID)
{
    link = createLink('story', 'ajaxGetProjectStories', 'projectID=' + projectID + '&productID=0&branch=0&moduleID=' + moduleID);
    $.get(link, function(stories)
    {
        var storyID = $('#story').val();
        if(!stories) stories = '<select id="story" name="story" class="form-control"></select>';
        $('#story').replaceWith(stories);
        $('#story').val(storyID);
        setPreview();
        $('#story_chosen').remove();
        $("#story").chosen(defaultChosenOptions);
    });
}
/**
 * set estimate task score.
 * @param days
 */
function estTaskScore(days) {
    var level = parseInt($('#level option:selected').text());
    var days = days || parseInt($('#days').val());
    var score = days>0 ? Math.round(level / 22 * days / 6) : 0;
    $('#score').val(score);
}

$(document).ready(function() {
    $("#days").keydown(function (e) {
        var code = parseInt(e.keyCode);
        if (code >= 96 && code <= 105 || code >= 48 && code <= 57 || code == 8) {
            return true;
        } else {
            return false;
        }
    }).keyup(function () {
        estTaskScore(this.value);
    })

    $('#score').keydown(function (e) {
        var code = parseInt(e.keyCode);
        if (code >= 96 && code <= 105 || code >= 48 && code <= 57 || code == 8) {
            return true;
        } else {
            return false;
        }
    })

    setPreview();

    $('#selectAllUser').on('click', function()
    {
        var $assignedTo = $('#assignedTo');
        if($assignedTo.attr('multiple')) 
        {
            $assignedTo.children('option').attr('selected', 'selected');
            $assignedTo.trigger('chosen:updated');
        }
    });

    $('[data-toggle=tooltip]').tooltip();

    // adjust form controls layout
    var ajustFormControls = function()
    {
        // adjust style for file box
        applyCssStyle('.fileBox > tbody > tr > td:first-child {transition: none; width: ' + ($('#dataPlanGroup').width() - 1) + 'px}', 'filebox');

        // adjust #priRowCol and #estRowCol size
        var $priRowCol = $('#priRowCol'),
            $estRowCol = $('#estRowCol');
        $priRowCol.css('width', 54 + $priRowCol.find('.input-group-addon').outerWidth());
        $estRowCol.css('width', 55 + $estRowCol.find('.input-group-addon').outerWidth());
    };
    ajustFormControls();
    $(window).resize(ajustFormControls);

    /* First unbind ajaxForm for form.*/
    $("form[data-type='ajax']").unbind('submit');
    setForm();

    /* Bind ajaxForm for form again. */
    $.ajaxForm("form[data-type='ajax']", function(response)
    {
        if(response.message) alert(response.message);
        if(response.locate)
        {
            if(response.locate == 'reload' && response.target == 'parent')
            {
                parent.$.cookie('selfClose', 1);
                parent.$.closeModal(null, 'this');
            }
            else
            {
                location.href = response.locate;
            }
        }
        return false;
    });
});
