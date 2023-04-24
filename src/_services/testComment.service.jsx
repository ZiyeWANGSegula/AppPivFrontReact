import Axios from './caller.service'
import FileSaver from 'file-saver';

/**
 * Récupératoin de la liste des testComments
 * @returns {Promise}
 */
let getAllTestComments = () => {
    return Axios.get('/api/testsComments/')
}

/**
 * Récupération d'un testComments
 * @param {number} uid 
 * @returns {Promise}
 */
let getTestComment = (params) => {
    return Axios.get('/api/testsComments/', { params: params })
}

/**
 * Ajout d'un testComments
 * @param {number} report
 * @returns {Promise}
 */
let addTestComment = (testComment) => {
    return Axios.post('/api/testsComments', testComment)
}

/**
 * Mise à jour d'un testComments
 * @param {number} report 
 * @returns {Promise}
 */
let updateTestComment = (testComment) => {
    console.log('updateTestComment', testComment)
    return Axios.put('/api/testsComments/'+testComment.id, testComment)
}

/**
 * Suppression d'un testComments
 * @param {number} uid 
 * @returns {Promise}
 */
let deleteTestComment = (uid) => {
    return Axios.delete('/api/testsComments/'+uid)
}


// Décaraltion des services pour import
export const testCommentService = {
    getAllTestComments, getTestComment, addTestComment, updateTestComment, deleteTestComment,
    
}