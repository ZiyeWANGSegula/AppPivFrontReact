import Axios from './caller.service'
import FileSaver from 'file-saver';

/**
 * Downloading a document
 * @param {string} docUrl 
 * @param {string} docOriginalname 
 * @returns {Promise}
 */
let downloadDocument = async (docUrl, docOriginalname) => {
    try {
        const res = await Axios.get(docUrl, { responseType: 'blob' });
        FileSaver.saveAs(res.data, docOriginalname);
    } catch (err) {
        console.error('can not download file', err);
    }
}

// Décaraltion des services pour import
export const documentService = {
    downloadDocument
    
}