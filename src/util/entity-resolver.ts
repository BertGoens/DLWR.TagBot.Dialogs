import * as builder from "botbuilder";

export const resolveDocumentFileType = (fileEntities: builder.IEntity[]) => {
  const transform = {
    word: ["doc", "docx"],
    powerpoint: ["ppt", "pptx"],
    excel: ["xslx"],
    text: ["txt"]
  };
  let result = [];

  fileEntities.forEach(docType => {
    // transform word to doc and docx
    if (transform[docType.entity.toLocaleLowerCase()]) {
      transform[docType.entity].forEach(synonym => {
        result.push(synonym);
      });
    } else {
      result.push(docType.entity);
    }
  });
  return result;
};

export const resolveDocumentTitle = (titleEntities: builder.IEntity[]) => {
  let result = [];
  titleEntities.forEach(element => {
    result.push(element.entity);
  });
  return result;
};

export const resolveDocumentAuthor = (authorEntities: builder.IEntity[]) => {
  let result = [];
  authorEntities.forEach(element => {
    result.push(element.entity);
  });
  return result;
};
