let pc = null;

function negotiate() {
    pc.addTransceiver('video', { direction: 'recvonly' });
    pc.addTransceiver('audio', { direction: 'recvonly' });

    return pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .then(() => new Promise(resolve => {
            if (pc.iceGatheringState === 'complete') resolve();
            else {
                const checkState = () => {
                    if (pc.iceGatheringState === 'complete') {
                        pc.removeEventListener('icegatheringstatechange', checkState);
                        resolve();
                    }
                };
                pc.addEventListener('icegatheringstatechange', checkState);
            }
        }))
        .then(() => fetch('https://remotewtl_webcam.ishm.net/offer', {
            method: 'POST',
            body: JSON.stringify(pc.localDescription),
            headers: { 'Content-Type': 'application/json' }
        }))
        .then(response => response.json())
        .then(answer => pc.setRemoteDescription(answer))
        .catch(e => alert('Connection failed: ' + e));
}

function start() {
    const config = {
        sdpSemantics: 'unified-plan',
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
        ]
    };

    pc = new RTCPeerConnection(config);

    pc.addEventListener('track', evt => {
        console.log("testing")
        console.log(evt.streams[0]);
        if (evt.track.kind === 'video') document.getElementById('video').srcObject = evt.streams[0];
        else document.getElementById('audio').srcObject = evt.streams[0];
    });

    document.getElementById('start').style.display = 'none';
    negotiate();
    document.getElementById('stop').style.display = 'inline-block';
}

function stop() {
    document.getElementById('stop').style.display = 'none';
    setTimeout(() => pc.close(), 500);
}

