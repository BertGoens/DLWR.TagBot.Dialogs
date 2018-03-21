var documents = ["1.docs", "2.pdf", "3.jpeg", "4.pptx", "5.docx"];

export interface IDocument {
  name: string;
  location: string;
}

export const findDocuments = (author: string) => {
  // Filling the hotels results manually just for demo purposes
  var untaggedDocuments: IDocument[] = [];
  for (var i = 1; i <= 3; i++) {
    const docNr = Math.ceil(Math.random() * documents.length);

    const takeDocument = documents[docNr];

    const doc: IDocument = {
      name: takeDocument,
      location: "http://txti.es/"
    };

    untaggedDocuments.push(doc);
  }

  return untaggedDocuments;
};
