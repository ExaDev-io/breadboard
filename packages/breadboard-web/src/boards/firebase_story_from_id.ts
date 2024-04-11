import { board, base, code} from "@google-labs/breadboard";

import { core } from "@google-labs/core-kit";
import { templates } from "@google-labs/template-kit";

const storyInputSchema = {
    type: "number",
    title: "Story ID",
    default: "39788322",
    description: "HackerNews Story ID to extract",
};

const spread = code<{ object: object }>((inputs) => {
    const object = inputs.object;
    if (typeof object !== "object") {
        throw new Error(`object is of type ${typeof object} not object`);
    }
    return { ...object };
});

const boardSchema = "https://raw.githubusercontent.com/breadboard-ai/breadboard/main/packages/schema/breadboard.schema.json";

export const firebaseBoardStoryFromId = await board(() => {
    const input = base.input({
        $id: "storyid",
        schema: {
            title: "Hacker News Story id",
            properties: {
                storyid: storyInputSchema
            },
            type: "number"
        }
    })

    const urlTemplate = templates.urlTemplate({
        $id: "urlTemplate",
        template: "https://hacker-news.firebaseio.com/v0/item/{storyid}.json",
    });

    input.to(urlTemplate);

    const fetchUrl = core.fetch({ $id: "fetch", method: "GET", url: urlTemplate.url});

    const output = base.output({ $id: "main" });

    const response = spread({ $id: "spreadResponse", object: fetchUrl.response });

    response.to(output)

    console.log(urlTemplate.url)

    return {output}

}).serialize({
    title: "Hacker News Firebase API Story by ID",
    description: "Board which returns story json",
    version: "0.0.1",})

firebaseBoardStoryFromId.$schema = boardSchema



export default firebaseBoardStoryFromId