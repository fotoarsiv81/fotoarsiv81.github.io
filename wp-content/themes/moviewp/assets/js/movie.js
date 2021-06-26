$(document).ready(function() {
function makeSlug(str) {
  /** @type {Array.<string>} */
  var codeSegments = "\u0430 \u0431 \u0432 \u0433 \u0434 \u0435 \u0451 \u0436 \u0437 \u0438 \u0439 \u043a \u043b \u043c \u043d \u043e \u043f \u0440 \u0441 \u0442 \u0443 \u0444 \u0445 \u0446 \u0447 \u0448 \u0449 \u044a \u044b \u044c \u044d \u044e \u044f \u0101 \u0105 \u00e4 \u00e1 \u00e0 \u00e2 \u00e5 \u010d \u0107 \u0113 \u0119 \u011b \u00e9 \u00e8 \u00ea \u00e6 \u0123 \u011f \u00f6 \u00f3 \u00f8 \u01ff \u00f4 \u0151 \u1e3f \u0149 \u0144 \u1e55 \u0155 \u015f \u00fc \u00df \u0159 \u0142 \u0111 \u00fe \u0125 \u1e27 \u012b \u00ef \u00ed \u00ee \u0135 \u0137 \u0142 \u0146 \u0144 \u0148 \u00f1 \u0159 \u0161 \u015b \u0165 \u016f \u00fa \u00fb \u1ee9 \u00f9 \u00fc \u0171 \u016b \u00fd \u00ff \u017e \u017a \u017c \u00e7 \u0454 \u0491 \u00e3".split(" ");
  /** @type {Array.<string>} */
  var paths = "a b v g d e e zh z i y k l m n o p r s t u f h ts ch sh shch # y # e yu ya a a ae a a a a c c e e e e e e e g g oe o o o o o m n n n p r s ue ss r l d th h h i i i i j k l n n n r s s t u u u u u u u u y y z z z c ye g a".split(" ");
  str = str.toLowerCase();
  str = str.replace(/(<[a-z0-9\-]{1,15}[\s]*>)/gi, "");
  str = str.replace(/(<\/[a-z0-9\-]{1,15}[\s]*>)/gi, "");
  str = str.replace(/(<[a-z0-9\-]{1,15}[\s]*\/>)/gi, "");
  str = str.replace(/^\s+|\s+$/gm, "");
  /** @type {number} */
  i = 0;
  for (;i < codeSegments.length;++i) {
    str = str.split(codeSegments[i]).join(paths[i]);
  }
  /** @type {Array} */
  var m = [/(&nbsp;|&#160;|&#32;)/gi, /(&mdash;|&ndash;|&#8209;)/gi, /[(_|=|\\|\,|\.|!)]+/gi, /\s/gi];
  /** @type {number} */
  i = 0;
  for (;i < codeSegments.length;++i) {
    str = str.replace(m[i], "-");
  }
  str = str.replace(/-{2,}/g, "-");
  str = str.replace(/&[a-z]{2,7};/gi, "");
  str = str.replace(/&#[0-9]{1,6};/gi, "");
  str = str.replace(/&#x[0-9a-f]{1,6};/gi, "");
  str = str.replace(/[^a-z0-9\-]+/gmi, "");
  str = str.replace(/^\-+|\-+$/gm, "");
  return str;
};
    var apiUrl = "https://api.themoviedb.org/3/movie/";
    var apiKey = tmdbapi;
    var imgBg = apiUrl + movie +"/images?api_key="+ apiKey;
    var response = "credits";
    var tmdb = apiUrl + movie + "?api_key=" + apiKey + "&append_to_response=" + response + "&language=" + language.slice(0, 2) + "";
    var path = apiUrl + movie + "/credits?&api_key=" + apiKey;
    $.getJSON(tmdb, function(options) {
		var tagline = options.tagline;
		var original = options.original_title;
		if (tagline === "") {
            tagline = original;
        }
		if (tagline === null) {
            tagline = original;
        }
		$( ".tagline" ).append(tagline);
        var cast = options.credits.cast;
        var actors = [];
        $.each(cast.slice(0, 3), function(dataAndEvents, el) {
            var str = makeSlug(el.name);
            var s = "https://image.tmdb.org/t/p/w92/" + el.profile_path;
            if ("https://image.tmdb.org/t/p/w92/null" === s) {
                s = noImg;
            }
            actors.push('<div class="person"><div class="img"><a aria-label="' + el.name + '" href="' + site + "/actors/" + str + '/"><img src="' + s + '" alt=""></a></div><div class="data"><div class="name"><a href="' + site + "/actors/" + str + '/">' + el.name + '</a></div><div class="caracter">' + el.character + "</div></div></div>");
        });
        $(actors.join("")).appendTo(".persons");
    });
    $.getJSON(path, function(options) {
        var crew = options.crew;
        var directors = []
        $.each(crew, function(dataAndEvents, properties) {
            if ("Director" == properties.job) {
                var str = makeSlug(properties.name);
                var i = "https://image.tmdb.org/t/p/w92/" + properties.profile_path;
                if ("https://image.tmdb.org/t/p/w92/null" === i) {
                    i = noImg;
                }
                directors.push('<div class="person"><div class="img"><a aria-label="' + properties.name + '" href="' + site + "/director/" + str + '/"><img src="' + i + '" alt=""></a></div><div class="data"><div class="name"><a href="' + site + "/director/" + str + '/">' + properties.name + '</a></div><div class="caracter">' + regista + '</div></div></div>');
            }
        });
        $(directors.join("")).slice(0, 1).prependTo(".persons");
    });
$.getJSON(imgBg, function(data) {
    var BackdropsArray = [];
    $.each(data.backdrops, function(i, item) {
        $("#slideshow");
        var Backdrop = item.file_path;
        BackdropsArray.push("<div class='movie-background' style='background-image: url(https://image.tmdb.org/t/p/w1280" + Backdrop + ");'></div>");
    });
    $(BackdropsArray.join('')).appendTo('#slideshow');
    $("#slideshow > div:gt(0)").hide();
    setInterval(function() {
        $("#slideshow > div:first").fadeOut(3000).next().fadeIn(3000).end().appendTo("#slideshow")
    }, 6000);
});
$("#monetize > div").click(function() {
window.location.href = watch;
});
$("#content > div > div.movie-info > span > div > span.progress-value").click(function() {
  window.open('https://www.themoviedb.org/movie/'+movie+'', '_blank');
});
function PlaySound(){document.getElementById("audio").play()}
$("#quality-button .switch input").click(function(){PlaySound()});
});