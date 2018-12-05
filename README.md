#Download BBB

    curl -O http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4

#Generate fragmented copy

    ffmpeg -i BigBuckBunny.mp4 -movflags frag_keyframe+empty_moov+default_base_moof fragmented.mp4


# Initialization Segment

   ftyp & moov : 0 - 1231

# First Media Segment

    video:
        base media decode time = 0
        250 samples @ 512 duration each / timescale 12288 = 10.41 seconds

    audio:
        base media decode time = 0
        446 samples @ 1024 duration + 1 sample @ 3675 / timescale 44100 = 10.43

    moof & mdat: 1231 - 2265772


# 5th Media Segment

    video:
        base media decode time = 283648 / timescale 12288 = 23.08
        250 samples @ 512 duration each / timescale 12288 = 10.41 seconds

    audio:
        base media decode time = 1018459 / timescale 44100 = 23.09
        449 samples @ 1024 duration / timescale 44100 = 10.42

    moof & mdat: 4719375 - 8588653

# Run the demo

    python -m SimpleHTTPServer 8080


navigate to `localhost:8080` in your browser.
