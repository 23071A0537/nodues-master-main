const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Due = require("../models/Due");
const Department = require("../models/Department");

router.get("/student-dues/:rollNumber", async (req, res) => {
  try {
    const student = await Student.findOne({ rollNumber: req.params.rollNumber });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get all departments
    const departments = await Department.find();
    
    // Get all dues for this student (exclude permission-cleared dues from student view)
    const dues = await Due.find({ 
      personId: req.params.rollNumber,
      status: "pending" // Only show pending dues, not "cleared" or "cleared-by-permission"
    });

    // 🎓 certificate eligibility: block if any scholarship due without cert clearance
    const scholarshipDues = dues.filter(d => d.dueType === "scholarship");
    const certificateEligible = scholarshipDues.every(d => d.scholarshipCertificateCleared);

    // Organize dues by department
    const departmentDues = departments.map(dept => ({
      department: dept.name,
      dues: dues.filter(due => due.department === dept.name)
    }));

    res.json({
      name: student.name,
      departmentDues,
      certificateEligible,
      scholarshipDueSummary: {
        total: scholarshipDues.length,
        uncleared: scholarshipDues.filter(d => !d.scholarshipCertificateCleared).length,
        withPermission: scholarshipDues.filter(d => d.scholarshipSpecialPermission).length
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 🎓 Dedicated eligibility check for certificates
router.get("/certificate-eligibility/:rollNumber", async (req, res) => {
  try {
    const student = await Student.findOne({ rollNumber: req.params.rollNumber });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const dues = await Due.find({ personId: req.params.rollNumber, status: "pending" });
    const scholarshipDues = dues.filter(d => d.dueType === "scholarship");
    const blockedScholarship = scholarshipDues.filter(d => !d.scholarshipCertificateCleared);

    const certificateEligible = blockedScholarship.length === 0 && dues.filter(d => d.status === "pending").length === 0;

    res.json({
      studentName: student.name,
      certificateEligible,
      blockReason: certificateEligible ? null : "Uncleared scholarship due(s) found",
      scholarship: {
        total: scholarshipDues.length,
        uncleared: blockedScholarship.length,
        details: blockedScholarship.map(d => ({
          id: d._id,
          description: d.description,
          amount: d.amount,
          specialPermission: d.scholarshipSpecialPermission,
          documentationUrl: d.scholarshipDocumentationUrl || null
        }))
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
