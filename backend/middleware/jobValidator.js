export const validateJobInput = [
  body("company").notEmpty().withMessage("company is required"),
  body("position").notEmpty().withMessage("Position is required"),
  body("jobLocation").notEmpty().withMessage("Job Location is required"),
  body("jobStatus")
    .isIn(Object.values(JOB_STATUS))
    .withMessage("Invalid Job Status"),
  body("jobType")
    .isIn(Object.values(JOB_TYPE))
    .withMessage("Invalid Job Type "),
];
