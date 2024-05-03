// import { soupConfig } from '../../../../common/constants/soupConstants';
// import { QuerySoupById } from '../../../../services/QueryRequests/QuerySoupById';

import { query } from "../../../common/constants/Queries";
import { QueryObject } from "../../../services/QueryObject";

export const FetchPDDocuments = async (id, isOnline) => {
  try {
    if (isOnline) {
      const getDocuments = await QueryObject(query.getContentVersion(id));
      if (getDocuments?.done) {
        let docDetails = getDocuments?.records.map((record) => {
          let data = {};
          data.fileExtension =
            record.FileType === "PDF"
              ? "application/pdf"
              : record.FileType === "PNG"
              ? "images/png"
              : record.FileType === "JPEG" || record.FileType === "JPG"
              ? "images/jpeg"
              : "";
          data.fileName = record.Title;
          data.fileSize = Number(record.ContentSize / 1000000).toFixed(2);
          data.fileUri = "";
          data.isBase64 = true;
          data.res = { id: record.Id, success: true };
          return data;
        });
        return docDetails;
      } else {
        return [];
      }
    }
  } catch (error) {
    console.log("Error FetchDocuments", error);
    return [];
  }
};

export const processImageDataWithFlags = async (records, isOnline) => {
  try {
    if (isOnline) {
      if (records) {
        let docDetails = records?.map((record) => {
          if (record?.res) {
            let data = {};
            data.fileExtension = record.fileName.includes("pdf")
              ? "application/pdf"
              : record.fileName.includes("png")
              ? "images/png"
              : record.fileName.includes("mp4")
              ? "mp4"
              : record.fileName.includes("jpeg") ||
                record.fileName.includes("jpg")
              ? "images/jpeg"
              : "";
            data.fileName = record?.fileName;
            data.fileSize = Number(record?.fileSize / 1000000).toFixed(2);
            data.fileUri = "";
            data.isBase64 = true;
            data.res = { id: record?.res?.id, success: true };
            return data;
          } else {
            return record;
          }
        });
        return docDetails;
      } else {
        return [];
      }
    }
  } catch (error) {
    console.log("Error FetchDocuments", error);
    return [];
  }
};

export const FetchPDPDFDocuments = async (id, isOnline) => {
  try {
    if (isOnline) {
      const getDocuments = await QueryObject(query.getContentDocumentId(id));
      //console.log('FetchDocuments------', getDocuments);

      if (getDocuments?.done) {
        const docDetails = await Promise.all(
          getDocuments?.records.map(async (record) => {
            // console.log("record", record);
            const getContentVersionDocuments = await QueryObject(
              query.getContentVersionId(record.ContentDocumentId)
            );
            // console.log('getContentVersionDocuments------', getContentVersionDocuments);

            if (getContentVersionDocuments?.done) {
              return getContentVersionDocuments?.records.map((innerRecord) => {
                let data = {};
                data.fileExtension =
                  innerRecord.FileType === "PDF"
                    ? "application/pdf"
                    : innerRecord.FileType === "PNG"
                    ? "images/png"
                    : innerRecord.FileType === "JPEG" ||
                      innerRecord.FileType === "JPG"
                    ? "images/jpeg"
                    : "";
                data.fileName = innerRecord.Title;
                data.fileSize = Number(
                  innerRecord.ContentSize / 1000000
                ).toFixed(2);
                data.fileUri = "";
                data.isBase64 = true;
                data.res = { id: innerRecord.Id, success: true };
                //console.log("data-------->", data);
                return data;
              });
            }
          })
        );

        // Flatten the nested arrays
        return docDetails.flat();
      } else {
        return [];
      }
    }
  } catch (error) {
    console.log("Error FetchDocuments", error);
    return [];
  }
};

export const FetchPDVideo = async (id, isOnline) => {
  try {
    if (isOnline) {
      const getDocuments = await QueryObject(query.getContentVersion(id));
      //console.log('FetchDocuments------', getDocuments);
      if (getDocuments?.done) {
        let docDetails = getDocuments?.records.map((record) => {
          let data = {};
          data.fileExtension = ".mp4";

          data.fileName = record.Title;
          data.fileSize = Number(record.ContentSize / 1000000).toFixed(2);
          data.fileUri = "";
          data.isBase64 = true;
          data.res = { id: record.Id, success: true };
          // console.log("data---< fetching",data);
          return data;
        });
        return docDetails;
      } else {
        return [];
      }
    }
  } catch (error) {
    console.log("Error FetchDocuments", error);
    return [];
  }
};
