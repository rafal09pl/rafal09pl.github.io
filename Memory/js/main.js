/**
 * Created by rafal09pl on 29.05.17.
 */

const picturesNumber = 26;
var totalWidth;
var totalHeight;
var records;
var columns;
var banerWidth;

var firstShowed = "";
var secondShowed = "";
var guessed = [];
var guessedCount = 0;
var clickCount = 0;
var pairsNumber = 0;
var blocked = false;
var chosen = [];
var cacheImages = [];


function choosePictures(count) {
    var chosen = []
    for (var i = 0; i < count; i++) {
        var guess = Math.floor(Math.random() * picturesNumber);
        while ($.inArray(guess, chosen) != -1) {
            guess = Math.floor(Math.random() * picturesNumber);
        }
        chosen.push(guess);
    }
    return chosen;
}

function placePictures(chosen, records, columns) {
    var result = [];
    var usedFields = [];
    for (var r = 0; r < records; r++) {
        result.push(new Array(columns));
    }

    var gR = Math.floor(Math.random() * records);
    var gC = Math.floor(Math.random() * columns);
    for (var i = 0; i< chosen.length; i++) {
        gR = Math.floor(Math.random() * records);
        gC = Math.floor(Math.random() * columns);
        while ($.inArray("#"+gR+"#"+gC, usedFields) != -1) {
            gR = Math.floor(Math.random() * records);
            gC = Math.floor(Math.random() * columns);
        }
        result[gR][gC] = chosen[i];
        usedFields.push("#"+gR+"#"+gC);
        gR = Math.floor(Math.random() * records);
        gC = Math.floor(Math.random() * columns);
        while ($.inArray("#"+gR+"#"+gC, usedFields) != -1) {
            gR = Math.floor(Math.random() * records);
            gC = Math.floor(Math.random() * columns);
        }
        result[gR][gC] = chosen[i];
        usedFields.push("#"+gR+"#"+gC);
    }
    return result;

}

function boxesResize() {
    if (0.6 * $(window).width() - $(window).height() > 200) {
        totalHeight = $(window).height() - 20;
        totalWidth = 10 / 6 * totalHeight;
    } else {
        totalWidth = 0.8 * $(window).width() - 20;
        totalHeight = 0.6 * totalWidth;
    }

    banerWidth = $(window).width() - 50 - totalWidth;
    $("#baner").css("width", banerWidth);

    $("#game").css("width", totalWidth);
    $("#game").css("height", totalHeight);
    $("#logo").css("width", 5/6 * banerWidth);
    $("#logo").css("height", 5/6 * banerWidth);
    $("#title").css("font-size", banerWidth/300 * 50);
}

function resizeGame() {
    boxesResize();

    let imgWidth = totalWidth / columns - 24;
    let imgHeight = totalHeight / records - 24;

    $(".card").each(function () {
        $(this).css("width", imgWidth);
        $(this).css("height", imgHeight);

        $(this).children(".imagePlace").children().css("width", imgWidth);
        $(this).children(".imagePlace").children().css("height", imgHeight);

        $(this).css("fontSize", Math.floor(0.6 * imgHeight));
    })
}

function generateGame(picturesPlaces) {
    let imgWidth = totalWidth / columns - 24;
    let imgHeight = totalHeight / records - 24;
    for (var r = 0; r < records; r++) {
        for (var c = 0; c < columns; c++) {
            $("#grid").append(`<div class="card" id="c-${r}-${c}"></div>`);

            let elem = $("#c" + "-" + r + "-" + c);
            elem.css("width", "" + Math.floor(imgWidth));
            elem.css("height", "" + Math.floor(imgHeight));
            elem.css("float", "left");
            elem.append(`<div class = "imagePlaceHolder front">?</div>`);
            elem.append(`<div class = "imagePlace back"><img src = "images/img${picturesPlaces[r][c]}.jpg" width="${imgWidth}" height="${imgHeight}"/></div>`);
            elem.css("fontSize", Math.floor(0.6 * imgHeight));
            // elem.children(".imagePlaceHolder").css("line-height", Math.floor(imgHeight));
            elem.flip({trigger: 'manual'});
            elem.click(function () {
                cardOnClick(this, picturesPlaces);
            });
        }
        $("#grid").append(`<div style="clear: left"></div>`);
    }
}

function startGame() {
    boxesResize();

    chosen = choosePictures(columns*records/2, records, columns);

    var pict = placePictures(chosen, records, columns);

    generateGame(pict);

    $("#won").css("display", "none");
    $("#menu-container").css("display", "none");
    $("#grid").css("display", "block");
}

function endGame() {
    $("#wynik").append(clickCount);
    $("#grid").css("display", "none");
    $("#menu-container").css("display", "none");
    $("#won").css("display", "block");
}

function cardOnClick(trig, picturesPlaces) {
    var id = "#" + $(trig).attr('id');
    var spltId = id.split('-');
    var r = parseInt(spltId[1]);
    var c = parseInt(spltId[2]);

    if (blocked || $.inArray(id, guessed) != -1) {
        return;
    }
    // alert("noco");

    if (firstShowed != id) {
        clickCount++;
        $(id).flip(true);
        if (firstShowed == "") {
            //PIERWSZE KLIKNIECIE
            firstShowed = id;
        } else {
            var spltLId = firstShowed.split('-');
            var lr = parseInt(spltLId[1]);
            var lc = parseInt(spltLId[2]);
            if (picturesPlaces[r][c] == picturesPlaces[lr][lc]) {
                //UDALO SIE
                guessed.push(id);
                guessed.push(firstShowed);
                firstShowed = "";
                guessedCount++;
                if (guessedCount == records * columns / 2) {
                    blocked = true;
                    setTimeout(function () {
                        endGame();
                    }, 1000);
                }
            } else {
                //PUDLO
                blocked = true;
                setTimeout(function () {
                    $(id).flip(false);
                    $(firstShowed).flip(false);
                    firstShowed = "";
                    blocked = false;
                }, 1000);
            }
        }
    }
}

$(document).ready(function () {
    boxesResize();
    $("#won").css("display", "none");
    $("#grid").css("display", "none");
    $("#menu-container").css("display", "block");

    $('#op1').click(function () {
        records = 2;
        columns = 4;
        startGame();
    });

    $('#op2').click(function () {
        records = 3;
        columns = 6;
        startGame();
    });

    $('#op3').click(function () {
        records = 4;
        columns = 8;
        startGame();
    });

    $('#regame').click(function () {
        window.location.reload();
    });
});



