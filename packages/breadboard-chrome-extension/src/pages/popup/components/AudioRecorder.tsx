import { useEffect, useState } from "react";
import { ExtensionBoardRunner } from "@breadboard/classes/ExtensionBoardRunner";
import serializedAudioTranscriptBoard from "@breadboard/graphs/AudioTranscriptBoard.json";

const AudioRecorder = (): React.JSX.Element => {
  const [output, setOutput] = useState<React.ReactNode | undefined>(undefined);
  const [recording, setRecording] = useState<any>({});
  const [key, setKey] = useState<string>("");
  console.log(output);

  useEffect(() => {
    chrome.storage.sync.get(["HUGGING_FACE_API_KEY"], (result) => {
      setKey(result["HUGGING_FACE_API_KEY"]);
    });
  }, [key]);

  const handleRecordingStart = async (): Promise<void> => {
    //Capture audio on button press
    chrome.tabCapture.capture({ audio: true }, (stream) => {
      // Continue to play the captured audio to the user.
      const output = new AudioContext();
      if (stream) {
        const source = output.createMediaStreamSource(stream);
        source.connect(output.destination);
        console.log(source);
        const recorder = new MediaRecorder(source.mediaStream);
        recorder.start();
        setTimeout("", 5000);
        setRecording(recorder.ondataavailable);
        console.log(recorder.ondataavailable);
        console.log(recording);
      }
    });
  };

  const handleRecordingStop = async () => {
    //TODO: stop recording and wait for user to press on "transcribe audio"
  };

  const handleTranscript = async () => {
    const extensionRunner = new ExtensionBoardRunner(
      serializedAudioTranscriptBoard,
      []
    );
    const boardRun = await extensionRunner.runBoard({
      data: recording,
      apiKey: key,
    });
    if (boardRun) {
      setOutput(boardRun["completion"] as React.ReactNode);
      console.log(boardRun);
    }
  };

  return (
    <main>
      <section className="outputForm">
        <button onClick={handleRecordingStart}>Start Recording</button>
        <button onClick={handleRecordingStop}>Stop Recording</button>
        <button type="submit" onClick={handleTranscript}>
          Transcribe audio
        </button>
      </section>
      <section className="output">
        <audio controls>
          <source src={recording} type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
      </section>
    </main>
  );
};

export default AudioRecorder;
