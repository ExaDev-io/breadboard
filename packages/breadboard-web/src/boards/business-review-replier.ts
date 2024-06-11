/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { agents } from "@google-labs/agent-kit";
import {
  AbstractNode,
  InputValues,
  InputsMaybeAsValues,
  NewInputValuesWithNodeFactory,
  Schema,
  V,
  base,
  code,
} from "@google-labs/breadboard";
import { core } from "@google-labs/core-kit";
import { Context, LlmContentRole } from "../../../agent-kit/dist/src/context";
import { NodeProxy } from "../../../breadboard/dist/src/new/grammar/types";

const task = [
  `You are tasked with assisting businesses by generating thoughtful, engaging, and professional responses to customer reviews. Your purpose is to process business reviews from various sources and generate replies that maintain the brand's voice. Here are the detailed instructions for generating replies:`,
  ``,
  `1. **Input Analysis:**`,
  `	- Extract key points from the customer review, identifying positive feedback, concerns, and suggestions.`,
  `	- Recognise the customer's sentiment and tailor your response accordingly.`,
  ``,
  `2. **Structure:**`,
  `	- Start with a greeting and address the reviewer by name if available.`,
  `	- Thank the customer for their feedback.`,
  `	- Address the key points raised in the review.`,
  `	- Conclude with an invitation for further engagement or a thank you note.`,
  ``,
  `3. **Brand Voice:**`,
  `	- Maintain a consistent brand voice that aligns with the business’s values and identity.`,
  `	- Avoid jargon or overly technical language unless the business typically communicates in such a manner.`,
].join("\n");

const tone = [
  `## General Tone Guidelines`,
  `-	The tone should be friendly, appreciative, and professional.`,
  `-	Avoid mentioning or implying that the response was generated by a system or software. Maintain a natural and human-like tone throughout the replies.`,
].join("\n");

const voice = [
  `## Business-Specific Tone:`,
  `### Tone desction:`,
  ``,
  `XYZ Restaurant aims for a warm, welcoming, and slightly informal tone. They value personal connections and strive to make every customer feel like a valued guest.`,
  ``,
  `### Positive Review:`,
  ``,
  `-	Express gratitude and highlight the specific compliments mentioned.`,
  `-	Example:`,
  `	-	Customer Review: “I had a fantastic experience at XYZ Restaurant. The food was delicious, and the service was top-notch!”`,
  `	-	Reply: “Hi [Customer Name], thank you so much for your kind words! We are thrilled to hear that you enjoyed our food and service. Your feedback means a lot to us, and we look forward to welcoming you back to XYZ Restaurant soon!”`,
  ``,
  `### Negative Review:`,
  ``,
  `-	Show empathy, apologise for any shortcomings, and offer solutions or steps taken to address the issue.`,
  `-	Example:`,
  `	-	Customer Review: “The waiting time was too long, and my order was incorrect.”`,
  `	-	Reply: “Hi [Customer Name], we are very sorry to hear about your experience. We strive to provide prompt and accurate service, and it seems we fell short this time. Please reach out to us directly at [contact information] so we can make it right. Thank you for bringing this to our attention.”`,
  ``,
  `### Neutral Review:`,
  ``,
  `-	Acknowledge the feedback, thank the customer, and mention any improvements or features that might interest them.`,
  `-	Example:`,
  `	-	Customer Review: “The coffee was good, but the seating area could be improved.”`,
  `	-	Reply: “Hi [Customer Name], thank you for your feedback. We’re glad you enjoyed the coffee and appreciate your suggestions regarding the seating area. We’re always looking for ways to enhance our customers’ experience and will take your comments into consideration. We hope to see you again soon!”`,
].join("\n");

const defaultReview = [
  `Rating: ★★★★★`,
  ``,
  `I recently visited Brewed Bliss Coffee Shop and was thoroughly impressed with my experience. From the moment I walked in, I was greeted with a warm, welcoming atmosphere that instantly made me feel at home. The cosy decor, complete with comfortable seating and tasteful artwork, added to the overall charm of the place.`,
  `The staff were exceptionally friendly and attentive, making sure that every customer felt valued. I was particularly impressed by their knowledge of the menu and their willingness to offer recommendations. Their passion for coffee was evident, and it was clear that they took great pride in their work.`,
  `Now, onto the coffee – it was nothing short of spectacular. I ordered a flat white, and it was perfectly balanced with a rich, creamy texture and a smooth, velvety finish. The barista’s skill in crafting the drink was apparent, and it was one of the best coffees I’ve had in a long time. They also offer a variety of specialty drinks, teas, and pastries, all of which looked delicious.`,
  `One aspect that really stood out was their commitment to sustainability. Brewed Bliss uses ethically sourced beans and environmentally friendly packaging, which is a big plus for me. It’s great to see a local business taking steps to reduce its environmental impact.`,
  `Overall, Brewed Bliss Coffee Shop exceeded my expectations in every way. The delightful ambience, excellent coffee, and outstanding service make it a standout in the local coffee scene. I highly recommend paying them a visit – you won’t be disappointed!`,
].join("\n");

const examples = [
  // defaultReview,
  // Positive reviews
  `I had an amazing time at ABC Cafe. The coffee was absolutely perfect and the staff were so friendly and attentive. I’ll definitely be coming back!"`,
  `XYZ Boutique has such a fantastic collection! I found exactly what I was looking for and the customer service was excellent. Highly recommend!"`,
  `What a wonderful experience at LMN Spa! The massage was incredibly relaxing and the ambience was just right. Can't wait for my next visit."`,
  // Negative reviews
  `The service at DEF Restaurant was really slow. We had to wait almost an hour for our food, and when it arrived, it was cold and undercooked."`,
  `I was very disappointed with my stay at GHI Hotel. The room was not clean, and the staff seemed uninterested in addressing our concerns."`,
  `The product I bought from JKL Electronics stopped working after just a week. When I tried to contact customer service, I got no response."`,
  // Neutral reviews
  `The new exhibit at MNO Museum was interesting, but it felt a bit disorganised. Some of the information was hard to follow, but overall, it was a decent visit."`,
  `I had a mixed experience at PQR Salon. The haircut was fine, but the stylist seemed rushed and didn't really listen to what I wanted."`,
  `Shopping at STU Supermarket is convenient, but the aisles are often cluttered and it’s hard to find certain items. Prices are reasonable though."`,
];

function randomFromArray<T>(
  args:
    | V<unknown>
    | AbstractNode<NewInputValuesWithNodeFactory, { array: T[] }>
    | InputsMaybeAsValues<{ array: T[] }, NewInputValuesWithNodeFactory>
    | undefined
): NodeProxy<{ array: T[] }, Required<{ item: T }>> {
  return code<
    {
      array: T[];
    },
    {
      item: T;
    }
  >((inputs) => {
    console.log({ inputs });
    const randomIndex = Math.floor(Math.random() * inputs.array.length);
    return { item: inputs.array[randomIndex] };
  })(args);
}

function coalesce<T>(
  args:
    | V<unknown>
    | AbstractNode<NewInputValuesWithNodeFactory, InputValues>
    | InputsMaybeAsValues<InputValues, NewInputValuesWithNodeFactory>
    | undefined
): NodeProxy<{ a: T; b: T }, Required<{ item: T }>> {
  return code<InputValues, { item: T }>((inputs) => {
    if ("a" in inputs) {
      return { item: inputs.a as T };
    }
    if ("b" in inputs) {
      return { item: inputs.b as T };
    }
    throw new Error("No value");
  })(args);
}

const input = base.input({
  $metadata: {
    title: "Input",
  },
  schema: {
    type: "object",
    properties: {
      task: {
        type: "string",
        title: "Task",
        format: "multiline",
        default: task,
        description: "Task description and instructions",
      },
      tone: {
        type: "string",
        title: "Tone",
        description: "General tone guidelines",
        default: tone,
        format: "multiline",
      },
      voice: {
        type: "string",
        title: "Voice",
        description: "Business-specific tone guidelines",
        default: voice,
        format: "multiline",
      },
      review: {
        type: "string",
        title: "Review",
        default: "",
        // default: defaultReview,
        format: "multiline",
        // examples: examples,
      },
    },
    required: ["task", "tone", "voice"],
  },
});

const task_passthrough = core.passthrough({
  $metadata: {
    title: "Task Passthrough",
  },
  task: input.task,
});

const tone_passthrough = core.passthrough({
  $metadata: {
    title: "Tone Passthrough",
  },
  tone: input.tone,
});

const voice_passthrough = core.passthrough({
  $metadata: {
    title: "Voice Passthrough",
  },
  voice: input.voice,
});

const pickRandomExample = randomFromArray({
  $metadata: {
    title: "Pick random example",
  },
  array: examples,
});
const coalesceReview = coalesce({
  $metadata: {
    title: "Coalesce",
  },
});

const relabelReviewParam = core.passthrough({
  $metadata: {
    title: "Relabel Review",
  },
});

pickRandomExample.item.as("b").to(coalesceReview);
input.as({}).to(relabelReviewParam);
input.review.as("a").as({}).to(relabelReviewParam);

relabelReviewParam.to(coalesceReview);

const review_content = core.passthrough({
  $metadata: {
    title: "Review Passthrough",
  },
  review: coalesceReview.item,
});

const contextPartMaker = code<
  {
    role?: LlmContentRole;
    text: string;
  },
  { context: Context }
>((inputs) => {
  const parts = [{ text: inputs.text }];
  return {
    context: inputs.role ? { role: inputs.role, parts } : { parts },
  };
});

const joinString = code<
  {
    a: string;
    b: string;
    delimiter?: string;
  },
  {
    result: string;
  }
>(({ a, b, delimiter = " " }): { result: string } => {
  return { result: a + delimiter + b };
});

const persona = joinString({
  $metadata: {
    title: "Persona",
  },
  a: tone_passthrough.tone as unknown as string,
  b: voice_passthrough.voice as unknown as string,
  delimiter: "\n\n",
});

const makePersonaContext = contextPartMaker({
  $metadata: {
    title: "Make persona context",
  },
  text: persona.result,
});

const makeReviewContext = contextPartMaker({
  $metadata: {
    title: "Make review context",
  },
  text: review_content.review as unknown as string,
  role: "user",
});

const bot = agents.specialist({
  $metadata: { title: "Chat Bot" },
  in: makeReviewContext.context,
  persona: makePersonaContext.context,
  task: task_passthrough.task,
});

const output = base.output({
  $metadata: {
    title: "Output",
  },
  schema: {
    type: "object",
    properties: {
      review: {
        type: "string",
        title: "Review",
      },
      reply: {
        type: "string",
        title: "Reply",
      },
    },
  } satisfies Schema,
});

bot.out.as("reply").to(output);
review_content.review.as("review").to(output);

export default await input.serialize({
  title: "Bussiness Review Reply Generator",
  description: "A board that generates a reply to a business review.",
});
