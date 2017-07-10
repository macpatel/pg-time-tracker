module.exports = {
  getAllTImesheets: function(next) {
    console.log("Called Admin getTimesheets in service");
    // console.log(queryObj);
    Timesheet.find().populate('user').exec(function(err, timesheets) {
      if(err) throw err;
      next(timesheets);
    });
  }
};