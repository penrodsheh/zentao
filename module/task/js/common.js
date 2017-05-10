/* If left = 0, warning. */
function checkLeft()
{
    value = $("#left").val();
    if(isNaN(parseInt(value)) || value == 0) 
    {
        if(confirm(confirmFinish))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
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
        index = currentID.replace('estStarteds[', '');
        index = index.replace('deadlines[', '');
        index = index.replace(']', '');
        if(!isNaN(index)) isBactchEdit = true;
    }

    if(isBactchEdit)
    {
        beginDate = $('#estStarteds\\[' + index + '\\]').val();
        endDate   = $('#deadlines\\[' + index + '\\]').val();
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
    if(parseInt(date1) == 0 || parseInt(date2) == 0) {
        return 0;
    }
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
    var workdays = delta - weekEnds;
    return  workdays > 0 ? workdays : 0 ;
}

/**
 * get story score.
 * @param story
 */
function getStoryRank(story)
{
    story = story || $('#story').val();
    link = createLink('story', 'ajaxComputeRank', 'storyID=' + story);
    $.get(link,function (rank) {
        $('#story').data('rank', rank);
        if(typeof(oldStoryID) === "undefined") {
            setTaskScore(rank);
        }
    })
}

/**
 * set level by story.
 */
function setTaskScore(storyRank)
{
    var storyRank = storyRank || parseInt($('#story').data('rank') || 0);
    var level = parseInt(storyRank) + parseInt($('#techRank').val() || 0);
    var levelScore = level > 0 ? levels[level] : 0;
    $('#level').val(level).data('score', levelScore);
    estTaskScore();
}

/**
 * set estimate task score.
 * @param days
 * @param index
 */
function estTaskScore(hours, index)
{
    if(typeof(index) === "undefined")
    {
        var level = parseInt($('#level').data('score') || 0);
        var hours = hours || parseInt($('#estimate').val());
        var score = hours > 0 ? Math.round(level / 22 * hours / 8) : 0;
        $('#score').val(score);
    }
    else
    {
        var $techRank = $('#techRanks' + index);
        var $story = $('#stories' + index);
        var $level = $('#levels\\[' + index + '\\]');
        var $hours = $('#estimates\\[' + index + '\\]');
        var $score = $('#scores\\[' + index + '\\]');
        var level = parseInt($techRank.val()) + parseInt($story.data('rank'));
        var hours = parseInt($hours.val());
        var score = hours > 0 ? Math.round(levels[level] / 22 * hours / 8) : 0;
        $level.val(level);
        $score.val(score);
    }
}
