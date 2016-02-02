$(function() {

    var audioSelect = document.querySelector('select#audioSource');

    var gotSources = function(sourceInfos) {
        for (var i = 0; i !== sourceInfos.length; ++i) {
            var sourceInfo = sourceInfos[i];
            if (sourceInfo.kind === 'audio') {
                var option = document.createElement('option');
                option.value = sourceInfo.id;
                option.text = sourceInfo.label || 'microphone ' +
                    (audioSelect.length + 1);
                audioSelect.appendChild(option);
            }
        }
    };

    var renderAudio = function(data) {
        var canvas = document.getElementById("canvas"),
            width = canvas.width,
            height = canvas.height,
            context = canvas.getContext('2d');

        context.clearRect(0, 0, width, height);
        var step = Math.ceil(data.length / width);
        var amp = height / 2;
        for (var i = 0; i < width; i++) {
            var min = 1.0;
            var max = -1.0;
            for (var j = 0; j < step; j++) {
                var datum = data[(i * step) + j];
                if (datum < min)
                    min = datum;
                if (datum > max)
                    max = datum;
            }
            context.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
        }
    }

    var streamId = 1;
    var bc = new Broadcaster(streamId, gotSources, renderAudio);

    $("#start-rec-btn").click(function() {
        var audioSource = audioSelect.value;
        //need to set audio source before calling start
        bc.audioSource = audioSource;
        bc.start();
    });

    $("#stop-rec-btn").click(function() {
        bc.stop();
    });
});
