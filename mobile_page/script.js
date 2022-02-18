const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const enableWebcamButton = document.getElementById('webcamButton');

var btnCapture = document.getElementById( "btn-capture" );
var capture = document.getElementById( "capture" );
var snapshot = null;
var btnResult = document.getElementById( "btn-check" );
var result = document.getElementById( "result" );
var captureImgDiv = document.getElementById( "captureImg" );


// Check if webcam access is supported.
function getUserMediaSupported() {
  return !!(navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia);
}

// If webcam supported, add event listener to button for when user
// wants to activate it to call enableCam function which we will 
// define in the next step.
if (getUserMediaSupported()) {
  enableWebcamButton.addEventListener('click', enableCam);
  btnResult.addEventListener( "click", checkResult );   

} else {
  console.warn('getUserMedia() is not supported by your browser');
}

// Enable the live webcam view and start classification.
function enableCam(event) {
  // Only continue if the COCO-SSD has finished loading.
  if (!model) {
    return;
  }
  
  // Hide the button once clicked.
  event.target.classList.add('removed');  
  
  // getUsermedia parameters to force video but not audio.
  const constraints = {
    video: {
        facingMode: 'environment' //back camera, 'user', front camera 
    }
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    console.log(stream);
    video.srcObject = stream;
    video.addEventListener('loadeddata', predictWebcam);
    
    btnCapture.addEventListener( "click", captureSnapshot );    
    
  });
}

// Placeholder function for next step.
function predictWebcam() {
}

// Pretend model has loaded so we can try out the webcam code.
var model = true;
demosSection.classList.remove('invisible');

function captureSnapshot() {

    if( null != video.srcObject ) {

        var ctx = capture.getContext( '2d' );
        var img = new Image();

        ctx.drawImage( video, 0, 0, capture.width, capture.height );
        img.id = "snapshot";
        img.src     = capture.toDataURL( "image/png" );
        img.height   = 480;
        img.width = 640;

        //captureImgDiv.innerHTML = '';

        captureImgDiv.appendChild( img );

        snapshot = document.getElementById( "snapshot" );

    }
}

function checkResult() {
    console.log("btnResult clicked");
    var rawData = document.getElementById('layer');
    var srcData = rawData.toDataURL( "image/png" );
    Tesseract.recognize(
        //snapshot.src,
        srcData,
        'eng+por',
        { 
            logger: m => console.log(m),
            'psm': 6
        }
      ).then(({ data: { text } }) => {
        console.log(text);
        var p = document.createElement('p');
        p.innerHTML = text;
        result.appendChild(p);
      })
}