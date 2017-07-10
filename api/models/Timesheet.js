/**
 * Timesheet.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var Timesheet = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
	taskName   : { type: 'string', unique: false, required: true },
	startTime : { type: 'datetime',  unique: false, required: true },
	endTime : { type: 'datetime',  unique: false, required: true },
	user   : { model: 'user', required: true }
  },
  validationMessages: {
	taskName: {
	  required: 'Task Name is required.'
	},
	startTime: {
	  required: 'Start Time is required.'
	},
	endTime: {
	  required: 'End Time is required.'
	}	
  }
};

module.exports = Timesheet;

