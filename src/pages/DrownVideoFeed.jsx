import React, { useState, useEffect, useRef } from "react";

const DroneVideoFeed = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [flightTime, setFlightTime] = useState(0);
  const [batteryLevel] = useState(85);
  const [signalStrength] = useState(90);
  const [webcamStream, setWebcamStream] = useState(null);
  const videoRef = useRef(null);


  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setWebcamStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
      alert("Could not access webcam. Please check permissions.");
    }
  };

  const stopWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach((track) => track.stop());
      setWebcamStream(null);
    }
  };

  // Flight time timer
  useEffect(() => {
    const timer = setInterval(() => {
      setFlightTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Start webcam on component mount
  useEffect(() => {
    startWebcam();

    return () => {
      stopWebcam();
    };
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusColor = (value) => {
    if (value > 70) return "bg-green-500";
    if (value > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 p-3 rounded-xl">
              <span className="text-2xl font-bold text-white">DC</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Drone Command Center
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-green-500 text-sm">Live Connection</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-3">
              <div className="text-sm text-gray-400">Flight Time</div>
              <div className="text-white font-mono">
                {formatTime(flightTime)}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-gray-800 rounded-lg p-3 relative">
                <div className="text-sm text-gray-400 mb-1">Battery</div>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-700 h-2 rounded-full">
                    <div
                      className={`h-2 rounded-full ${getStatusColor(
                        batteryLevel
                      )}`}
                      style={{ width: `${batteryLevel}%` }}
                    ></div>
                  </div>
                  <span className="text-white text-sm">{batteryLevel}%</span>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-sm text-gray-400 mb-1">Signal</div>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-700 h-2 rounded-full">
                    <div
                      className={`h-2 rounded-full ${getStatusColor(
                        signalStrength
                      )}`}
                      style={{ width: `${signalStrength}%` }}
                    ></div>
                  </div>
                  <span className="text-white text-sm">{signalStrength}%</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Video Feed */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                >
                  Your browser does not support video.
                </video>

                {/* Top Overlay */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
                  <div className="flex gap-3">
                    {isRecording && (
                      <div className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                        REC 00:12:44
                      </div>
                    )}
                    <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                      4K Ultra HD • 60fps
                    </div>
                  </div>
                  <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                    13:45:22 UTC
                  </div>
                </div>

                {/* Bottom Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-gray-400 text-sm">Altitude</div>
                      <div className="text-xl font-semibold">120m</div>
                    </div>
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-gray-400 text-sm">Speed</div>
                      <div className="text-xl font-semibold">15 mph</div>
                    </div>
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-gray-400 text-sm">Wind</div>
                      <div className="text-xl font-semibold">12 mph NW</div>
                    </div>
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-gray-400 text-sm">Heading</div>
                      <div className="text-xl font-semibold">245°</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Control Panel */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`relative group overflow-hidden rounded-xl p-4 transition-all duration-300 ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                <div className="relative z-10">
                  <div className="text-white font-medium">
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </div>
                  <div className="text-white/70 text-sm mt-1">
                    {isRecording ? "Recording..." : "Ready"}
                  </div>
                </div>
              </button>

              {/* Webcam toggle button */}
              <button
                onClick={webcamStream ? stopWebcam : startWebcam}
                className={`relative group overflow-hidden rounded-xl p-4 transition-all duration-300 ${
                  webcamStream
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                <div className="relative z-10">
                  <div className="text-white font-medium">
                    {webcamStream ? "Stop Webcam" : "Start Webcam"}
                  </div>
                  <div className="text-white/70 text-sm mt-1">
                    {webcamStream ? "Connected" : "Disconnected"}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Flight Stats */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                Flight Statistics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="text-gray-400 text-sm">Distance</div>
                  <div className="text-white text-xl font-semibold mt-1">
                    1.2 km
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="text-gray-400 text-sm">Max Alt</div>
                  <div className="text-white text-xl font-semibold mt-1">
                    150 m
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="text-gray-400 text-sm">Max Speed</div>
                  <div className="text-white text-xl font-semibold mt-1">
                    25 mph
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="text-gray-400 text-sm">Storage</div>
                  <div className="text-white text-xl font-semibold mt-1">
                    64.2 GB
                  </div> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DroneVideoFeed;
