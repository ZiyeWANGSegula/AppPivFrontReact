import Axios from './caller.service'

/**
 * Récupératoin de la liste des utilisateurs
 * @returns {Promise}
 */
let getAllUsers = () => {
    return Axios.get('/api/users')
}

/**
 * Récupératoin de la liste des utilisateurs par la catégorie
 * @returns {Promise}
 */
let getAllUsersByCat = (cat) => {
    return Axios.get('/api/users?cat='+cat)
}

/**
 * Récupératoin de la liste des utilisateurs n'ayant pas la catégorie mentionnée
 * @returns {Promise}
 */
let getAllUsersByNotCat = (notCat) => {
    return Axios.get('/api/users?notCat='+notCat)
}

/**
 * Récupération d'un utilisateur
 * @param {number} uid 
 * @returns {Promise}
 */
let getUser = (uid) => {
    return Axios.get('/api/users/'+uid)
}

/**
 * Ajout d'un utilisateur
 * @param {number} user 
 * @returns {Promise}
 */
let addUser = (user) => {
    return Axios.post('/api/users', user)
}

/**
 * Mise à jour d'un utilisateur
 * @param {number} user 
 * @returns {Promise}
 */
let updateUser = (user) => {
    console.log('updateUser', user)
    return Axios.put('/api/users/'+user.id, user)
}

/**
 * Mise à jour d'un mot de passe utilisateur
 * @param {number} user 
 * @returns {Promise}
 */
let updateUserPassword = (user) => {
    console.log('updatePassword', user)
    return Axios.put('/api/updatePassword/'+user.id, user)
}

/**
 * Suppression d'un utilsateur
 * @param {number} uid 
 * @returns {Promise}
 */
let deleteUser = (uid) => {
    return Axios.delete('/api/users/'+uid)
}

/**
 * Récupératoin des informations pour les KPI
 * @returns {Promise}
 */
let getUsersKPI = () => {
    return Axios.get('api/usersKpi')
}

// Décaraltion des esrvices pour import
export const userService = {
    getAllUsers, getAllUsersByCat, getAllUsersByNotCat, getUser, addUser, updateUser, updateUserPassword, deleteUser, getUsersKPI
}