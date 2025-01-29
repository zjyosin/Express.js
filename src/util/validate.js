const validateEditProfileData = (req) => {
    const allowedField = [ 
        'firstName',
        'lastName',
        'age',
        'gender',
        'emailID'
    ];

    const fields = req.body;
    const isEditAllowed = Object.keys(fields).every(field => allowedField.includes(field))
    return isEditAllowed;
}
 const validateUpdatePasswordData = (req,res) => {
    const allowedFields = ["emailId", "password"];
    const isEditAllowed =  Object.keys(req.body).every(field => allowedFields.includes(field))
    return isEditAllowed;
 }
module.exports = {
    validateEditProfileData,
    validateUpdatePasswordData
}