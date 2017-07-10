module.exports = {
  getTimesheets: function(queryObj, next) {
    console.log("Called getTimesheets in service");
    console.log(queryObj);
    Timesheet.find(queryObj).exec(function(err, timesheets) {
      if(err) throw err;
      next(timesheets);
    });
  },
  addTimesheet: function(todoVal, next) {
    console.log("Called addTimesheet in service");

    // Timesheet.create({value: todoVal}).exec(function(err, timesheet) {
    //   console.log(timesheets);
    //   if(err) throw err;
    //   next(timesheet);
    // });
  },
  removeTimesheet: function(todoVal, next) {
    Timesheet.destroy({value: todoVal}).exec(function(err, timesheet) {
      if(err) throw err;
      next(timesheet);
    });
  }
};