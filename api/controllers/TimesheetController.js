module.exports = {
    find: function(req, res) {
        console.log(req.allParams());
        var timesheetDate = req.param('date');
        var user = req.param('user');
        var token = req.header('Authorization').split(' ')[1];
        var queryObj={};
        // jwToken.verify(token, function(err, decoded){
        //     queryObj.user = decoded.sub;
        // });
        queryObj.user = user;

        if(timesheetDate)//timesheetDate !== null)
        {
          var today = new Date(timesheetDate);
          console.log("today1" + today);
          today.setHours(0,0,0,0);
          console.log("today2" + today);
          var tomorrow = new Date(timesheetDate);
          tomorrow.setHours(0,0,0,0);
          tomorrow.setDate(tomorrow.getDate() + 1);

          today = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
          console.log("today3" + today);
          tomorrow = tomorrow.getFullYear() + '-' + (tomorrow.getMonth()+1) + '-' + tomorrow.getDate();
          
          queryObj.startTime = {'>=': today.toString(), '<': tomorrow.toString()};
        }
        console.log('queryObj---start');
        console.log(queryObj);
        console.log('queryObj---end');

        TimesheetService.getTimesheets(queryObj, function(timesheets) {
            res.json(timesheets);
        });
    },
    addTimesheet: function(req, res) {
        console.log(req);
        var todoVal = (req.body.value) ? req.body.value : undefined
        // TimesheetService.addTimesheet(todoVal, function(success) {
        //     res.json(success);
        // });
    },
    removeTimesheet: function(req, res) {
       var todoVal = (req.body.value) ? req.body.value : undefined
        TimesheetService.removeTimesheet(todoVal, function(success) {
            res.json(success);
        });
    }
};
