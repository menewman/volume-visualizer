This is an exercise in using the WebRTC `getUserMedia` API along with WebAudio.

You can see it live here:
[https://menewman.github.io/volume-visualizer/](https://menewman.github.io/volume-visualizer/)

To get started, just serve the files locally. For example, you can run a simple web server using Python 2:

`python -m SimpleHTTPServer`

If you're using Python 3, you can accomplish the same thing with a slightly different command:

`python -m http.server`

Then, navigate to https://localhost:8000. Allow the browser to use your computer's webcam and/or microphone if it asks for permission.

When using the `getUserMedia` API, you should note that the feature will be disabled if you're not using a secure connection (https or localhost), or if you try to access a `file:///` link. So, simply opening the index.html file in your browser of choice won't work.
