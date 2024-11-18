const { model } = require('mongoose');
const assignModel = require('../models/assignModel');

class assignController {
    async saveAssign(req, res) {
        try {
            const { areaId } = req.params;
            const { driverUsername, vehicalReg } = req.body;

            const assigned = await assignModel.create({
                areaId,
                driverUsername,
                vehicalReg
            });

            if(assigned){
                return res.status(201).json({ message: "Assigned successfully", assigned: assigned });
            }
            else {
                return res.status(500).json({ message: "Failed to assign" });
            }
        }
        catch(err) {
            console.log(err);
            return res.status(500).json({ message: "Something went wrong", error: err.message });
        }

    }

    async deleteAssign(req, res) {
        try{

            const { areaId } = req.params;
    
            const deleted = await assignModel.deleteOne({areaId});
            if(deleted.deletedCount) {
                return res.status(201).json({ message: "Assignment deleted successfully" });
            }
            return res.status(500).json({ message: "Failed to delete" });

        }
        catch(err){
            console.log(err);
            return res.status(500).json({ message: "Something went wrong", error: err.message });
        }
    }

    async getAllAssigns(req, res) {
        try {
            const { areaId } = req.params;
            const { populateArea, populateDustbin, populateDriver, populateVehical } = req.query;

            if(areaId) {
                let assignment = await assignModel.findOne({areaId});
                
                if(assignment){
                    if(populateArea == 'true'){
                        // In your function to populate areaId
                        if (populateArea === 'true') {
                            assignment = await assignment.populate({
                                path: 'areaId',
                                localField: 'areaId',      // Field in assignModel to match
                                foreignField: 'areaId',    // Field in areaModel to match
                            });
                        }

                        if(populateDustbin == 'true'){
                            assignment = await assignment.populate({
                                path: 'areaId.dustbins',
                                localField: 'dustbins',
                                foreignField: 'dustbinId' 
                            })
                        }

                    }
                    if(populateDriver == 'true'){
                        assignment = assignment.populate({
                            path: driverId,
                            model: driver,
                            localField: 'driverId',
                            foreignField: 'driverId'
                        });
                    }
                    // if(populateVehical == 'true'){
                    //     assignment = assignment.populate({
                    //         path: vehicalId,
                    //         model: vehical,
                    //         localField: 'vehicalId',
                    //         foreignField: 'vehicalId'
                    //     });
                    // }
                    return res.status(200).json({ message: "Assignment fetched successfully", assignment: assignment });
                }
                return res.status(500).json({ message: "Could not fetch assignment details" });
            }

            const assignments = await assignModel.find();
            if(assignments){
                return res.status(200).json({ message: "Assignments fetched successfully", assignments: assignments });
            }
            return res.status(500).json({ message: "Could not fetch assignment details" });
        }
        catch(err) {
            console.log(err);
            return res.status(500).json({ message: "Something went wrong", error: err.message });
        }
    }
}

module.exports = new assignController;