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
    var story = $('#story').val();
    if(!story)
    {
        $('#preview').addClass('hidden');
        $('#copyButton').parent().addClass('hidden');
    }
    else
    {
        getStoryRank(story);
        storyLink  = createLink('story', 'view', "storyID=" + story);
        var concat = config.requestType != 'GET' ? '?'  : '&';
        storyLink  = storyLink + concat + 'onlybody=yes';
        $('#preview').removeClass('hidden');
        $('#preview a').attr('href', storyLink);
        $('#copyButton').parent().removeClass('hidden');
    }

    setAfter();
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

/* Set preview and module of story. */
function setStoryRelated()
{
    setPreview();
    getStoryRank();
    if($('#module').val() == 0) setStoryModule();
}



$(document).ready(function() {
    $("#days,#estimate,#score").keydown(function (e) {
        var code = parseInt(e.keyCode);
        if (code >= 96 && code <= 105 || code >= 48 && code <= 57 || code == 8) {
            return true;
        } else {
            return false;
        }
    })
    $("#estimate").keyup(function () {
        estTaskScore(this.value);
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
    $('#techRank').tooltip({
        animation: true,
        placement: "top",
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="text-align: left;min-width: 500px"></div></div>',   //tip插入代码
        trigger: "hover focus",
        title: "<h3>技术难度：</h3><p>任务的技术难度分为1到10级， 1—4级为简单任务，5—7级为中等难度任务，8—10级为复杂任务，具体等级由产品开发经理制定，参考标准为：</p><ul><li>简单任务：基础技术体系内的任务，不涉及新技术的，简单数据库调整的任务。</li><li>中等难度：基础技术体系内，涉及核心代码修改的，或者涉及框架代码和底层业务代码调整的，或者涉及数据库重大变更的任务。</li><li>复杂难度：现有技术满足不了，需要使用新技术实现的，或者变更框架体系的任务。</li></ul>",
        delay: 0,
        html: true,
        container: false,
        viewport: {
            selector: 'body',
            padding: 0
        }
    })
});
