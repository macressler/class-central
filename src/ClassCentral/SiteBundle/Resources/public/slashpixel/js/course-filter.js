/**
 * Created by dhawal on 12/7/13.
 */
jQuery(function($) {

    $(".list-button").addClass("active");

    $(".tiles-button").click(function() {
        var listButton = $(this).parent().find(".list-button");
        listButton.removeClass("active");
        $(this).addClass("active");
        var list = $(this).parent().find("table");
        var tiles = $(this).parent().find(".tiles-view")
        console.log(list);
        list.hide();
        tiles.show();
    });

    $(".list-button").click(function() {
        var tilesButton = $(this).parent().find(".tiles-button");
        tilesButton.removeClass("active");
        $(this).addClass("active");
        var list = $(this).parent().find("table");
        var tiles = $(this).parent().find(".tiles-view")
        console.log(tiles);
        tiles.hide();
        list.show();
    });


    //toggle = true;

    $(".mobile-filter-btn").click(function() {

        var filterWrap = $("#filter-wrap");
        var catWrap = $("#filter-wrap .cat-filter-wrap");

        //if (toggle) {
        if (catWrap.hasClass("opened")) {
            catWrap.removeClass("opened");
        }   else   {
            catWrap.addClass("opened");
        }

        if (filterWrap.hasClass("opened")) {
            //toggle = false;
            //setTimeout(function() {
            filterWrap.removeClass("opened");
            //toggle = true;
            //}, 900);

        }   else   {
            filterWrap.addClass("opened");
        }
        //}

    });

    function toggleActive(e, current) {
        e.preventDefault();
        var parent = current.parent();
        parent.toggleClass("active");
    }

    $(".tick-wrap .tick").click(function() {
        $(this).toggleClass("ticked");
        // Deselect all children
        var parentLi = $(this).parent().parent();
        if(parentLi.find('.filter-dropdown')[0])
        {
            // It has children. Deselect them all
            console.log("children");
            parentLi.find('.filter-dropdown li').removeClass("active");
        }
        filterCourses();
    });

    $(".main-category").click(function(e) {
        toggleActive(e, $(this));
    });


    $(".sub-category").click(function(e) {
        var parentLi = $(this).parent().parent();
        // Check if it has any children
        if(!parentLi.find('.filter-dropdown')[0])
        {
            // No children
            var tickBox = parentLi.find('.tick-wrap .tick');
            tickBox.toggleClass('ticked');
        }
        toggleActive(e, $(this));
        filterCourses();
    });

    $(".sort").click(function(e) {
        // Remove the parent tick
        var parentLi = $(this).parent().parent().parent();
        var tickBox = parentLi.find('.tick-wrap .tick');
        tickBox.removeClass('ticked');
        // Toggle the activate for the current one
        toggleActive(e, $(this));
        filterCourses();
    });

    var tableTypes = ['recent','recentlyAdded','ongoing','upcoming','selfpaced','past'];

    var lists = {};
    for(var i = 0; i < tableTypes.length; i++)
    {
        var tableType = tableTypes[i];
        var listClass = 'table-body-' + tableType;
        if($('.' +listClass)[0])
        {
            var options = {
                valueNames: [ 'course-name','subjectSlug','languageSlug'],
                searchClass: ['filter-search'],
                listClass: [listClass],
                sortClass: ['sort-button']
            };

            var list = new List('filter-wrap',options);
            lists[tableType] = list;
        }

    }



    function filterCourses() {
        var filterCats = [];
        // Sub subjects
        $(".filter-subjects .active > .sort").each(function() {
            filterCats.push($.trim($(this).data("subject")));
        });

        // Parent subjects
        $(".filter-subjects .ticked + .sub-category").each(function() {
            var parentCat = $.trim($(this).data("subject"));
            filterCats.push(parentCat);
            // Get the subjects for this parent category
            $("a[data-parent='" + parentCat +"']").each(function(){
               filterCats.push( $.trim($(this).data("subject"))) ;
            });
        });

        // Languages
        var filterLang = [];
        $(".filter-languages .ticked + .sub-category").each(function() {
            filterLang.push($.trim($(this).data("lang")));
        });

        // Go through all the lists and fulter the courses which don't
        // have subjects in filterCats
        for(var i = 0; i <= tableTypes.length; i++)
        {
            var tableType = tableTypes[i];
            if(tableType in lists)
            {
                var list = lists[tableType];
                list.filter(function(item) {
                    // Match subjects
                    var subMatch = true;
                    if(filterCats.length > 0)
                    {
                        var subject = $.trim(item.values().subjectSlug);

                        if($.inArray(subject,filterCats) == -1)
                        {
                            subMatch = false;
                        }
                    }

                    // Match languages
                    var langMatch = true;
                    if(filterLang.length > 0)
                    {
                        var language = $.trim(item.values().languageSlug);
                        if($.inArray(language,filterLang) == -1)
                        {
                            langMatch = false;
                        }
                    }

                    return subMatch && langMatch;
                });
            }
        }
    }
});
