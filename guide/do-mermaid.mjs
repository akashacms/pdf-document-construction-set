import { run } from "@mermaid-js/mermaid-cli"

console.log("./documents/guide/img/mahabhuta-workflow.mmd");
await run(
   "./documents/guide/img/mahabhuta-workflow.mmd",
   "./documents/guide/img/mahabhuta-workflow.svg",
);

console.log("./documents/guide/img/pdf-document-workflow.mmd");
await run(
    "./documents/guide/img/pdf-document-workflow.mmd",
    "./documents/guide/img/pdf-document-workflow.svg",
);

console.log("./documents/guide/img/simple-sample-1.mmd");
await run(
    "./documents/guide/img/simple-sample-1.mmd",
    "./documents/guide/img/simple-sample-1.svg",
);

console.log("./documents/guide/img/simple-sample-2.mmd");
await run(
    "./documents/guide/img/simple-sample-2.mmd",
    "./documents/guide/img/simple-sample-2.svg",
);
