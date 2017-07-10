module.exports = {
    getAllTImesheets: function(req, res) {
        AdminService.getAllTImesheets(function(timesheets) {
            res.json(timesheets);
        });
    },
}