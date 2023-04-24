import FileSaver from 'file-saver';
import Axios from './caller.service'

/**
 * Récupératoin de la liste des references
 * @returns {Promise}
 */
let getAllReferences = (withUsers, withResources, withReports, withAll) => {
    let strLink = "/api/references";
    let strLinkAddedValues = "";
    if(withUsers || withResources || withReports || withAll) {
        strLinkAddedValues = "?"
        if(withAll) {
            strLinkAddedValues += "withAll="+withAll;
        } else {
            if(withUsers) {
                strLinkAddedValues += "withUsers="+withUsers;
            }
            if(withResources) {
                if(strLinkAddedValues != "?") {
                    strLinkAddedValues += "&";
                }
                strLinkAddedValues += "withResources="+withResources;
            }
            if(withReports) {
                if(strLinkAddedValues != "?") {
                    strLinkAddedValues += "&";
                }
                strLinkAddedValues += "withReports="+withReports;
            }
        }
    }
    return Axios.get(strLink+strLinkAddedValues);
}

/**
 * Récupération d'une reference
 * @param {number} uid 
 * @returns {Promise}
 */
let getReference = (uid) => {
    return Axios.get('/api/references/'+uid)
}

/**
 * Ajout d'une Reference
 * @param {number} reference
 * @returns {Promise}
 */
let addReference = (reference) => {
    return Axios.post('/api/references', reference)
}

/**
 * Mise à jour d'une reference
 * @param {number} reference 
 * @returns {Promise}
 */
let updateReference = (reference) => {
    console.log('updateReference', reference)
    return Axios.put('/api/references/'+reference.id, reference)
}

/**
 * Suppression d'une reference
 * @param {number} uid 
 * @returns {Promise}
 */
let deleteReference = (uid) => {
    return Axios.delete('/api/references/'+uid)
}

/**
 * Downloading a reference
 * @param {string} docUrl 
 * @param {string} docOriginalname 
 * @returns {Promise}
 */
let downloadReference = (docUrl, docOriginalname) => {
    return  Axios.get(docUrl, { responseType: 'blob' }).then((res) => {
        FileSaver.saveAs(res.data, docOriginalname);
      }).catch((err) => {console.error('can not download file', err)})
}

/**
 * Récupératoin des informations pour les KPI
 * @returns {Promise}
 */
let getReferencesKPI = () => {
    return Axios.get('api/referencesKpi')
}

// Décaraltion des services pour import
export const referenceService = {
    getAllReferences, getReference, addReference, updateReference, deleteReference, downloadReference, getReferencesKPI
}