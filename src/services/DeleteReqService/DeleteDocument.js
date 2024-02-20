import { compositeGraphApi } from '../CompositeRequests/graphRequest';
import { net } from 'react-native-force';

export default async function DeleteAttachment(graphId, docId) {
  try {
    let deleteCompositeRequest = [
      {
        url: `/services/data/${net.getApiVersion()}/sobjects/ContentVersion/${docId}?fields=ContentDocumentId`,
        method: 'GET',
        referenceId: 'reference_id_content_version_get_1',
      },
      {
        url: `/services/data/${net.getApiVersion()}/sobjects/ContentDocument/@{reference_id_content_version_get_1.ContentDocumentId}`,
        method: 'DELETE',
        referenceId: 'reference_id_content_document_delete_1',
      },
    ];
    console.log("deleteCompositeRequest",deleteCompositeRequest);
    let graphRes = await compositeGraphApi([
      {
        graphId: graphId,
        compositeRequest: deleteCompositeRequest,
      },
    ]);
    return graphRes;
  } catch (error) {
    console.log('Error DeleteAttachment', error);
  }
}
