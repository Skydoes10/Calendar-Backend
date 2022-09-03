const Event = require('../models/Event');

const getEvents = async (req, res) => {
    
    const events = await Event.find()
                            .populate('user', 'name'); 
    res.json({
        ok: true,
        events
    });
};

const createEvent = async (req, res) => {

    const event = new Event( req.body );

    try {
        event.user = req.uid;

        const eventSaved = await event.save();

        res.status(201).json({
            ok: true,
            event: eventSaved
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator',
        });
    }
};

const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { uid } = req;

    try {
        const event = await Event.findById( id );

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Event not found'
            });
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'Not authorized'
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const eventUpdated = await Event.findByIdAndUpdate( id, newEvent, { new: true } );

        res.json({
            ok: true,
            event: eventUpdated
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator',
        });
    }
};

const deleteEvent = async (req, res) => {

    const { id } = req.params;
    const { uid } = req;

    try {
        
        const event = await Event.findById( id );

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Event not found'
            });
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'Not authorized'
            });
        }

        await Event.findByIdAndDelete( id );

        res.json({
            ok: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator',
        });
    }
};


module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
};