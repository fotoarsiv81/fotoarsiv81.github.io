$(document).ready(function() {
    function makeSlug(str) {
        /** @type {Array.<string>} */
        var codeSegments = "\u0430 \u0431 \u0432 \u0433 \u0434 \u0435 \u0451 \u0436 \u0437 \u0438 \u0439 \u043a \u043b \u043c \u043d \u043e \u043f \u0440 \u0441 \u0442 \u0443 \u0444 \u0445 \u0446 \u0447 \u0448 \u0449 \u044a \u044b \u044c \u044d \u044e \u044f \u0101 \u0105 \u00e4 \u00e1 \u00e0 \u00e2 \u00e5 \u010d \u0107 \u0113 \u0119 \u011b \u00e9 \u00e8 \u00ea \u00e6 \u0123 \u011f \u00f6 \u00f3 \u00f8 \u01ff \u00f4 \u0151 \u1e3f \u0149 \u0144 \u1e55 \u0155 \u015f \u00fc \u00df \u0159 \u0142 \u0111 \u00fe \u0125 \u1e27 \u012b \u00ef \u00ed \u00ee \u0135 \u0137 \u0142 \u0146 \u0144 \u0148 \u00f1 \u0159 \u0161 \u015b \u0165 \u016f \u00fa \u00fb \u1ee9 \u00f9 \u00fc \u0171 \u016b \u00fd \u00ff \u017e \u017a \u017c \u00e7 \u0454 \u0491 \u00e3 \u014d".split(
            " "
        );
        /** @type {Array.<string>} */
        var paths = "a b v g d e e zh z i y k l m n o p r s t u f h ts ch sh shch # y # e yu ya a a ae a a a a c c e e e e e e e g g oe o o o o o m n n n p r s ue ss r l d th h h i i i i j k l n n n r s s t u u u u u u u u y y z z z c ye g a o".split(
            " "
        );
        str = str.toLowerCase();
        str = str.replace(/(<[a-z0-9\-]{1,15}[\s]*>)/gi, "");
        str = str.replace(/(<\/[a-z0-9\-]{1,15}[\s]*>)/gi, "");
        str = str.replace(/(<[a-z0-9\-]{1,15}[\s]*\/>)/gi, "");
        str = str.replace(/^\s+|\s+$/gm, "");
        /** @type {number} */
        i = 0;
        for (; i < codeSegments.length; ++i) {
            str = str.split(codeSegments[i]).join(paths[i]);
        }
        /** @type {Array} */
        var m = [
            /(&nbsp;|&#160;|&#32;)/gi,
            /(&mdash;|&ndash;|&#8209;)/gi,
            /[(_|=|\\|\,|\.|!)]+/gi,
            /\s/gi
        ];
        /** @type {number} */
        i = 0;
        for (; i < codeSegments.length; ++i) {
            str = str.replace(m[i], "-");
        }
        str = str.replace(/-{2,}/g, "-");
        str = str.replace(/&[a-z]{2,7};/gi, "");
        str = str.replace(/&#[0-9]{1,6};/gi, "");
        str = str.replace(/&#x[0-9a-f]{1,6};/gi, "");
        str = str.replace(/[^a-z0-9\-]+/gim, "");
        str = str.replace(/^\-+|\-+$/gm, "");
        return str;
    }
    var baseUrl = "https://api.themoviedb.org/3/tv/";
    var apikey =
        "" +
        tvapikey +
        "&append_to_response=credits&language=" +
        language +
        "&include_image_language=" +
        language.slice(0, 2) +
        ",null";
    var id = tvid;
    var imgBg = baseUrl + id + "/images?api_key=" + apikey;
    var dataUrl = baseUrl + id + "?api_key=" + apikey + "";
    $.getJSON(dataUrl, function(data) {
        var plot = data.overview;
        var seasons = data.seasons.length;
		var epnumbers = data.number_of_episodes;
		var tvstat = data.status;
		var tagline = data.tagline;
		var original = data.original_name;
		if (tagline === "") {
            tagline = original;
        }
		if (tagline === null) {
            tagline = original;
        }
		$( ".tagline" ).append(tagline);
		//$( "#stat" ).append('<span class="item-status">'+tvstat+'</span>');
		$( ".epinum i" ).append(epnumbers);
        $(".synopsis.fadein").append(plot);
        $(".tv-details-seasons ol").empty();
        for (var i = 0; i < data.seasons.length; i++) {
            $(".tv-details-seasons ol").append(
                "<li onclick='infoSerieTV(" +
                id +
                "," +
                data.seasons[i].season_number +
                ")' data-tab='season" +
                data.seasons[i].season_number +
                "'>" +
                tvseason +
                " " +
                data.seasons[i].season_number +
                "</li>"
            );
        }
        $(".tv-details-seasons ol li").click(function(e) {
            e.preventDefault();
            $(".tv-details-seasons ol li").removeClass("active");
            $(this).addClass("active");
        });
        $('.tv-details-seasons ol li[data-tab="season1"]').addClass("active");
        var cast = data.credits.cast;
        var actors = [];
        $.each(cast.slice(0, 3), function(dataAndEvents, el) {
            var str = makeSlug(el.name);
            var s = "https://image.tmdb.org/t/p/w92/" + el.profile_path;
            if ("https://image.tmdb.org/t/p/w92/null" === s) {
                s = noImg;
            }
            actors.push(
                '<div class="person"><div class="img"><a aria-label="' +
                el.name +
                '" href="' +
                site +
                "/actors/" +
                str +
                '/"><img src="' +
                s +
                '" alt=""></a></div><div class="data"><div class="name"><a href="' +
                site +
                "/actors/" +
                str +
                '/">' +
                el.name +
                '</a></div><div class="caracter">' +
                el.character +
                "</div></div></div>"
            );
        });
        $(actors.join("")).appendTo(".persons");
        var crew = data.created_by;
        var creator = [];
        $.each(crew, function(dataAndEvents, properties) {
            var str = makeSlug(properties.name);
            var i = "https://image.tmdb.org/t/p/w92/" + properties.profile_path;
            if ("https://image.tmdb.org/t/p/w92/null" === i) {
                i = noImg;
            }
            creator.push(
                '<div class="person"><div class="img"><a aria-label="' +
                properties.name +
                '" href="' +
                site +
                "/creator/" +
                str +
                '/"><img src="' +
                i +
                '" alt=""></a></div><div class="data"><div class="name"><a href="' +
                site +
                "/creator/" +
                str +
                '/">' +
                properties.name +
                '</a></div><div class="caracter">' +tvcreator+ '</div></div></div>'
            );
        });
        $(creator.join("")).slice(0, 1).prependTo(".persons");
    });
    $.getJSON(imgBg, function(data) {
        var BackdropsArray = [];
        $.each(data.backdrops, function(i, item) {
            $("#slideshow");
            var Backdrop = item.file_path;
            BackdropsArray.push(
                "<div class='movie-background' style='background-image: url(https://image.tmdb.org/t/p/w1280" +
                Backdrop +
                ");'></div>"
            );
        });
        $(BackdropsArray.join("")).slice(0, 5).appendTo("#slideshow");
        $("#slideshow > div:gt(0)").hide();
        setInterval(function() {
            $("#slideshow > div:first")
                .fadeOut(3000)
                .next()
                .fadeIn(3000)
                .end()
                .appendTo("#slideshow");
        }, 6000);
    });
});

function infoSerieTV(id, num) {
    var stagioneURL =
        "https://api.themoviedb.org/3/tv/" +
        id +
        "/season/" +
        num +
        "?&api_key=" +
        tvapikey +
        "&language=" +
        language +
        "&include_image_language=" +
        language.slice(0, 2) +
        ",null";
    $.getJSON(stagioneURL, function(data) {
        $(".tv-details-episodes ol").empty();
        for (var i = 0; i < data.episodes.length; i++) {
            var buttonPoster =
                "<span class='blue' id='buttonposter'><p><i class='fa fa-play-circle'></i>Play</p></span>";
            var seasonname = data.name;
            var seasonoverview = data.overview;
            var season = data.season_number;
            var poster = data.poster_path;
            var episode = data.episodes[i].name;
            var number = data.episodes[i].episode_number;
            if (episode == null) {
                episode = ""+tvepisode+" "+number+"";
            }
            var overview = data.episodes[i].overview;
            var airdate = data.episodes[i].air_date;
            $(".detail #content .tv-poster").empty();
            var locandina =
                "<img data-season='season" +
                season +
                "' src='https://image.tmdb.org/t/p/w500" +
                data.poster_path +
                "' alt='" +
                tvtitle +
                "'>";
            if (
                locandina ===
                "<img data-season='season1' src='https://image.tmdb.org/t/p/w500" +
                data.poster_path +
                "' alt='" +
                tvtitle +
                "'>"
            ) {
                locandina =
                    "<img data-season='season1' src='" +
                    tvposter +
                    "' alt='" +
                    tvtitle +
                    "'>";
            } else if (
                locandina ==
                "<img data-season='season" +
                season +
                "' src='https://image.tmdb.org/t/p/w500null' alt='" +
                tvtitle +
                "'>"
            ) {
                locandina =
                    "<img data-season='season" +
                    season +
                    "' src='https://via.placeholder.com/342x513?text=No+Poster&000.jpg' alt='" +
                    tvtitle +
                    "'>";
            }
            $(".detail #content .tv-poster").append(locandina);
            if (episode === "") {
                episode = "" + tvepisode + "&nbsp;" + number + "";
            }
            $(".tv-details-episodes ol").append(
                "<li data-episode_id='" +
                number +
                "' onclick='infoEpisodio(" +
                id +
                "," +
                season +
                "," +
                data.episodes[i].episode_number +
                ")'>" +
                episode +
                "</li>"
            );
            $(".tv-details-episodes ol li").click(function(e) {
                e.preventDefault();
                $(".tv-details-episodes ol li").removeClass("active");
                $(this).addClass("active");
            });
            $('.tv-details-episodes ol li[data-episode_id="1"]').addClass("active");
        }
    });
}
(function($){$(window).on('load', function(){$('.tv-details-episodes ol, .tv-details-seasons ol').perfectScrollbar({suppressScrollX:true});});})(jQuery);
$("#videoplayer, #monetize").click(function() {
  window.location.href = watch;
});
$("#content > div > div.movie-info > span > div > span.progress-value").click(function() {
  window.open('https://www.themoviedb.org/tv/'+tvid+'', '_blank');
});
a2a_config = {
    onclick: 1
};