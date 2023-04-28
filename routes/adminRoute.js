const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const Appointment= require('../models/appointmentModel')
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/get-all-doctors", async (req, res) => {

const doctors=await Doctor.find();

// Doctor.find({},async(err,results)=>{



let isCached=false;
let q;
    try {
  
// q=results;
// res.json({auth:true,results,fromCache:isCached})




        res
            .status(200)
            // .json({auth:true,doctors,fromCache: isCached})
            .send({
                auth:true,
                message: "Doctors fetched successfully",
                success: true,
                data: doctors,
                fromCache:isCached,
            });
            

    } catch (error) {
        console.log(error);
        res
            .status(500)
            .send(
                {
                    message: "Error applying doctor account",
                    success: false,
                    error,
                })
            .json({auth:false,doctors,fromCache:isCached});

    }
});


router.get("/get-all-appointments", async (req, res) => {

    try {
        const apps = await Appointment.find({});
        res
            .status(200)
            .send({
                message: "Appointments fetched successfully",
                success: true,
                data: apps,
            });

    } catch (error) {
        console.log(error);
        res
            .status(500)
            .send(
                {
                    message: "Error fetching appointments account",
                    success: false,
                    error,
                });
    }
});

router.get("/get-all-users", async (req, res) => {

    try {
        const users = await User.find({});
        res
            .status(200)
            .send({
                message: "Users fetched successfully",
                success: true,
                data: users,
            });

    } catch (error) {
        console.log(error);
        res
            .status(500)
            .send(
                {
                    message: "Error applying Users account",
                    success: false,
                    error,
                });
    }
});

router.put("/change-account-doctor-status",authMiddleware, async (req, res) => {

    try {
        const { doctorId, status } = req.body;
        const doctor = await Doctor.findByIdAndUpdate(doctorId, {
            status,
        });

        const user = await User.findOne({ _id: doctor.userId });
        const unseenNotifications = user.unseenNotifications;
        unseenNotifications.push({
            type: "new-doctor-request-changed",
            message: `Your doctor account has been ${status}`,
            onClickPath: "/notifications",
        });
        user.isDoctor = status === "approved" ? true : false;
        await user.save();

        res.status(200).send({
            message: "Doctor status updated successfully",
            success: true,
            data: doctor,
        });
    } 
    catch(error) {
        console.log(error);
        res
            .status(500)
            .send(
                {
                    message: "Error applying doctor account",
                    success: false,
                    error,
                });
    }
});

router.get("/change-account-user-status", authMiddleware, async (req, res) => {

    try {
        const { email, status } = req.body;
        console.log(email);
        const doctor = await User.findOneAndUpdate(email, {
            status,
        });

        const user = await User.findOneAndDelete({ email:doctor.email });
        // const unseenNotifications = user.unseenNotifications;
        // user.status === "approved" ? true : false;
        await user.save();

        res.status(200).send({
            message: "User status updated successfully",
            success: true,
            data: doctor,
        });
    } 
    catch(error) {
        console.log(error);
        res
            .status(500)
            .send(
                {
                    message: "Error applying user account",
                    success: false,
                    error,
                });
    }
});


module.exports = router;
