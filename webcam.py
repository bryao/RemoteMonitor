import argparse
import asyncio
import json
import logging
import os
import platform
from typing import Optional

from aiohttp import web
from aiortc import MediaStreamTrack, RTCPeerConnection, RTCRtpSender, RTCSessionDescription
from aiortc.contrib.media import MediaPlayer, MediaRelay

ROOT = os.path.dirname(__file__)
pcs = set()
relay = None
webcam = None


# This new create_local_tracks adds subcribe
def create_local_tracks(play_from: str, decode: bool):
    print("track")
    global relay, webcam

    # Ensure only one global relay exists
    if relay is None:
        relay = MediaRelay()

    if play_from:
        player = MediaPlayer(play_from, decode=decode)
        audio = player.audio
        video = player.video

        # Use relay subscriptions so each peer gets its own copy
        return (
            relay.subscribe(audio) if audio else None,
            relay.subscribe(video) if video else None,
        )

    else:
        options = {"framerate": "15", "video_size": "1280x720"}
        if webcam is None:
            if platform.system() == "Darwin":
                webcam = MediaPlayer("default:none", format="avfoundation", options=options)
            elif platform.system() == "Windows":
                webcam = MediaPlayer("video=c922 Pro Stream Webcam", format="dshow", options=options)
            else:
                webcam = MediaPlayer("/dev/video0", format="v4l2", options=options)

        # Each peer gets a relay subscription — never reuse webcam.video directly
        return None, relay.subscribe(webcam.video)


def force_codec(pc: RTCPeerConnection, sender: RTCRtpSender, forced_codec: str):
    print("force cor")
    kind = forced_codec.split("/")[0]
    codecs = RTCRtpSender.getCapabilities(kind).codecs
    transceiver = next(t for t in pc.getTransceivers() if t.sender == sender)
    transceiver.setCodecPreferences([c for c in codecs if c.mimeType == forced_codec])

def cors_headers():
    print("cor")
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

async def index(request):
    print("index")
    content = open(os.path.join(ROOT, "index.html")).read()
    return web.Response(content_type="text/html", text=content)

async def javascript(request):
    print("java")
    content = open(os.path.join(ROOT, "client.js")).read()
    return web.Response(content_type="application/javascript", text=content)

async def offer_options(request):
    print("option")
    
    y = web.Response(headers=cors_headers())
    print("after y")
    return y

async def offer(request):
    print("offer")
    try:
        params = await request.json()
        offer = RTCSessionDescription(sdp=params["sdp"], type=params["type"])
    except Exception as e:
        return web.Response(status=400, text=str(e))

    pc = RTCPeerConnection()
    pcs.add(pc)

    @pc.on("connectionstatechange")
    async def on_connectionstatechange():
        print("Connection state:", pc.connectionState)
        if pc.connectionState == "failed":
            print("Failing on a network")
            # await pc.close()
            pcs.discard(pc)

    try:
        # Program terminates when it reaches here
        audio, video = create_local_tracks(args.play_from, decode=not args.play_without_decoding)
        print("Was able to create local track") # Was able to pass this part without any problem
        
        try: 
            print("Before audio")
            print(audio) # Prints none, does having None causes the program to terminate? 
            print("After audio")
        except Exception as e:
            print("Audio didn't work")

        print(video)

        # if audio:
        #     print("Reaches if statement for audio")
        #     sender = pc.addTrack(audio)
        #     print("After adding track") # didn't reach this part
        #     if args.audio_codec:
        #         force_codec(pc, sender, args.audio_codec)
        if video:
            print("inside video")
            sender = pc.addTrack(video)
            force_codec(pc, sender, "video/H264")


            # if args.video_codec:
            #     print("video codec")
            #     force_codec(pc, sender, args.video_codec)
        print("after video")
    except Exception as e:
        print("Track didn't work")
    # #ends here


    await pc.setRemoteDescription(offer)
    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    print("before temp")

    temp = web.Response(
        content_type="application/json",
        text=json.dumps({"sdp": pc.localDescription.sdp, "type": pc.localDescription.type}),
        headers=cors_headers()
    )

    print("after temp")

    return temp

async def on_shutdown(app):
    print("ending program")
    coros = [pc.close() for pc in pcs]
    await asyncio.gather(*coros)
    pcs.clear()
    # Only stop webcam if you are truly shutting down the app
    if webcam is not None:
        try:
            webcam.video.stop()
        except Exception as e:
            print("Webcam stop failed:", e)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="WebRTC webcam demo")
    parser.add_argument("--play-from")
    parser.add_argument("--play-without-decoding", action="store_true")
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=5001)  # <- runs on 5001 internally
    parser.add_argument("--verbose", "-v", action="count")
    parser.add_argument("--audio-codec")
    parser.add_argument("--video-codec")
    args = parser.parse_args()

    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO)

    app = web.Application()
    app.on_shutdown.append(on_shutdown)
    app.router.add_get("/", index)
    app.router.add_get("/client.js", javascript)
    app.router.add_route("OPTIONS", "/offer", offer_options)
    app.router.add_post("/offer", offer)
    web.run_app(app, host=args.host, port=args.port)
    print("byebye")
