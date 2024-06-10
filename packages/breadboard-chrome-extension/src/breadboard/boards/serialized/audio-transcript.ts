import { base, board, code } from "@google-labs/breadboard";
import fs from "fs";
import path from "path";

const filePathSchema = {
  type: "string",
  title: "inputs",
  default: "audio-sample.mp3",
  description: "The audio file to transcribe",
};

const keySchema = {
  type: "string",
  title: "apiKey",
  default: "myKey",
  description: "The hugging face api key",
};

const transcribeFile = code<{ data: string; apiKey: string }>(async (input) => {
  const { data, apiKey } = input;

  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/wav2vec2-base-960h",
    {
      headers: { Authorization: `Bearer ${apiKey}` },
      method: "POST",
      body: data,
    }
  );
  const result = await response.json();
  return { result };
});

export const huggingFaceAudioTranscript = await board(() => {
  const inputs = base.input({
    $id: "query",
    schema: {
      title: "Hugging Face Schema For Audio Transcript",
      properties: {
        data: filePathSchema,
        apiKey: keySchema,
      },
    },
    type: "string",
  });

  const output = base.output({ $id: "main" });

  const { result } = transcribeFile({
    file_name: inputs.file_name as unknown as string,
    apiKey: inputs.apiKey as unknown as string,
  });

  result.to(output);
  return { output };
}).serialize({
  title: "AudioTranscriptBoard",
  description: "Breadboard for generating transcript from audio file",
});

fs.writeFileSync(
  path.join(".", "/src/breadboard/graphs/AudioTranscriptBoard.json"),
  JSON.stringify(huggingFaceAudioTranscript, null, "\t")
);
