import Axios from './caller.service'

/**
 * Récupératoin de la liste des utilisateurs
 * @returns {Promise}
 */
let getAllTests = (withUsers) => {
    let strLink = "/api/tests";
    let strLinkAddedValues = "";
    if(withUsers && withUsers == 1) {
        strLinkAddedValues = "?withUsers="+withUsers;
    }
    return Axios.get(strLink+strLinkAddedValues);
}

/**
 * Récupération d'un utilisateur
 * @param {number} uid 
 * @returns {Promise}
 */
let getTest = (uid) => {
    return Axios.get('/api/tests/'+uid)
}

/**
 * Ajout d'un utilisateur
 * @param {number} test 
 * @returns {Promise}
 */
let addTest = (test) => {
    return Axios.post('/api/tests', test)
}

/**
 * Mise à jour d'un utilisateur
 * @param {number} test 
 * @returns {Promise}
 */
let updateTest = (test) => {
    console.log('updateTest', test)
    return Axios.put('/api/tests/'+test.id, test)
}

/**
 * Suppression d'un utilsateur
 * @param {number} uid 
 * @returns {Promise}
 */
let deleteTest = (uid) => {
    return Axios.delete('/api/tests/'+uid)
}

/**
 * Récupératoin des informations pour les KPI
 * @returns {Promise}
 */
let getTestsKPI = () => {
    return Axios.get('api/testsKpi')
}

// Décaraltion des esrvices pour import
export const testService = {
    getAllTests, getTest, addTest, updateTest, deleteTest, getTestsKPI
    
}