import FileSaver from 'file-saver'
import Axios from './caller.service'

/**
 * Récupératoin de la liste des utilisateurs
 * @returns {Promise}
 */
let getAllResources = () => {
    return Axios.get('/api/resources')
}

/**
 * Récupération d'un utilisateur
 * @param {number} uid 
 * @returns {Promise}
 */
let getResource = (uid) => {
    return Axios.get('/api/resources/'+uid)
}

/**
 * Ajout d'un utilisateur
 * @param {number} resource 
 * @returns {Promise}
 */
let addResource = (resource) => {
    return Axios.post('/api/resources', resource)
}

/**
 * Mise à jour d'un utilisateur
 * @param {number} resource 
 * @returns {Promise}
 */
let updateResource = (resource) => {
    console.log('updateResource', resource)
    return Axios.put('/api/resources/'+resource.id, resource)
}

/**
 * Suppression d'un utilsateur
 * @param {number} uid 
 * @returns {Promise}
 */
let deleteResource = (uid) => {
    return Axios.delete('/api/resources/'+uid)
}

/**
 * Downloading a resource
 * @param {string} docUrl 
 * @param {string} docOriginalname 
 * @returns {Promise}
 */
let downloadResource = (docUrl, docOriginalname) => {
    return  Axios.get(docUrl, { responseType: 'blob' }).then((res) => {
        FileSaver.saveAs(res.data, docOriginalname);
      }).catch((err) => {console.error('can not download file', err)})
}

/**
 * Récupératoin des informations pour les KPI
 * @returns {Promise}
 */
let getResourcesKPI = () => {
    return Axios.get('api/resourcesKpi')
}

// Décaraltion des esrvices pour import
export const resourceService = {
    getAllResources, getResource, addResource, updateResource, deleteResource, downloadResource, getResourcesKPI
    
}