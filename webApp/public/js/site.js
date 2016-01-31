/**
 * Created by noamc on 8/31/14.
 */
$(function() {
    var client,
        recorder,
        context,
        bStream,
        contextSampleRate = (new AudioContext()).sampleRate,
        resampleRate = 44100,
        worker = new Worker('js/worker/resampler-worker.js');

    worker.postMessage({
        cmd: "init",
        from: contextSampleRate,
        to: resampleRate
    });

    worker.addEventListener('message', function(e) {
        if (bStream && bStream.writable)
            bStream.write(convertFloat32ToInt16(e.data.buffer));
    }, false);

    var audioSelect = document.querySelector('select#audioSource');

    function gotSources(sourceInfos) {
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
    }

    if (typeof MediaStreamTrack === 'undefined' ||
        typeof MediaStreamTrack.getSources === 'undefined') {
        alert('This browser does not support MediaStreamTrack.\n\nTry Chrome.');
    } else {
        MediaStreamTrack.getSources(gotSources);
    }

    $("#start-rec-btn").click(function() {

        var protocol = (window.location.protocol === "https:") ? 'wss://' : 'ws://';
        var client = new BinaryClient(protocol + document.location.host + '/binary-endpoint');
        
        client.on('open', function() {
            bStream = client.createStream({
                sampleRate: resampleRate
            });
        });

        if (context) {
            recorder.connect(context.destination);
            return;
        }

        var audioSource = audioSelect.value;

        var constraints = {
            audio: {
                optional: [{
                    sourceId: audioSource
                }]
            },
            video: false
        };

        navigator.getUserMedia(constraints, function(stream) {
            context = new AudioContext();
            var audioInput = context.createMediaStreamSource(stream);
            contextSampleRate = context.sampleRate;
            var bufferSize = 0; // let implementation decide
            recorder = context.createScriptProcessor(bufferSize, 2, 2);
            recorder.onaudioprocess = onAudio;
            audioInput.connect(recorder);
            recorder.connect(context.destination);

        }, function(e) {
            console.log('error connectiing to audio source');
            throw e;
        });
    });

    function onAudio(e) {
        var left = e.inputBuffer.getChannelData(0);
        var right = e.inputBuffer.getChannelData(1);

        var stereoBuff = interleave(left, right);

        worker.postMessage({
            cmd: "resample",
            buffer: stereoBuff
        });

        drawBuffer(left);
    }

    function convertFloat32ToInt16(buffer) {
        var l = buffer.length;
        var buf = new Int16Array(l);
        while (l--) {
            buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
        }
        return buf.buffer;
    }

    function interleave(leftChannel, rightChannel) {
        var length = leftChannel.length + rightChannel.length;
        var result = new Float32Array(length);

        var inputIndex = 0;

        for (var index = 0; index < length;) {
            result[index++] = leftChannel[inputIndex];
            result[index++] = rightChannel[inputIndex];
            inputIndex++;
        }
        return result;
    }
    
    //https://github.com/cwilso/Audio-Buffer-Draw/blob/master/js/audiodisplay.js
    function drawBuffer(data) {
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

    $("#stop-rec-btn").click(function() {
        recorder.disconnect();
        client.close();
    });
});

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
