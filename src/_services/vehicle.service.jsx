import FileSaver from 'file-saver'
import Axios from './caller.service'

/**
 * Récupératoin de la liste des utilisateurs
 * @returns {Promise}
 */
let getAllVehicles = () => {
    return Axios.get('/api/vehicles')
}

/**
 * Récupération d'un utilisateur
 * @param {number} uid 
 * @returns {Promise}
 */
let getVehicle = (uid) => {
    return Axios.get('/api/vehicles/'+uid)
}

/**
 * Ajout d'un utilisateur
 * @param {number} vehicle 
 * @returns {Promise}
 */
let addVehicle = (vehicle) => {
    return Axios.post('/api/vehicles', vehicle)
}

/**
 * Mise à jour d'un utilisateur
 * @param {number} vehicle 
 * @returns {Promise}
 */
let updateVehicle = (vehicle) => {
    console.log('updateVehicle', vehicle)
    return Axios.put('/api/vehicles/'+vehicle.id, vehicle)
}

/**
 * Suppression d'un utilsateur
 * @param {number} uid 
 * @returns {Promise}
 */
let deleteVehicle = (uid) => {
    return Axios.delete('/api/vehicles/'+uid)
}

/**
 * Downloading a vehicle
 * @param {string} docUrl 
 * @param {string} docOriginalname 
 * @returns {Promise}
 */
let downloadVehicle = (docUrl, docOriginalname) => {
    return  Axios.get(docUrl, { responseType: 'blob' }).then((res) => {
        FileSaver.saveAs(res.data, docOriginalname);
      }).catch((err) => {console.error('can not download file', err)})
}

/**
 * Récupératoin des informations pour les KPI
 * @returns {Promise}
 */
let getVehiclesKPI = () => {
    return Axios.get('api/vehiclesKpi')
}

let getVehiclesEngines = () => {
    return Axios.get('api/vehiclesEngines')
}

// Décaraltion des esrvices pour import
export const vehicleService = {
    getAllVehicles, getVehicle, addVehicle, updateVehicle, deleteVehicle, downloadVehicle, getVehiclesKPI, getVehiclesEngines
    
}