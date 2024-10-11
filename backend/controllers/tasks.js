const { response, request } = require('express');
const db = require('../database/db');

const getTask = (req=request, res=response) => {
    const { id } = req.params;

    db.get(`SELECT * FROM tareas WHERE id = ?`, 
        [ id ],
        (err, row) => {
            if( err ) return res.status(400).json({ ok: false, message: err.message });

            return res.status(200).json(row);
        }
    );
}

const getAllTasks = (req=request, res=response) => {
    db.all(`SELECT * FROM tareas`, (err, rows) => {
        if( err ) return res.status(400).json({ ok: false, message: err.message });

        return res.status(200).json(rows);
    });
}

const createTask = (req=request, res=response) => {
    const { descripcion } = req.body;

    db.run(`INSERT INTO tareas (descripcion) VALUES (?) RETURNING id`, 
        [ descripcion ],
        function (err) {
            if( !err ) return res.status(200).json({ ok: true, task: {
                id: this.lastID,
                descripcion,
                completada: 0,
            } });

            return res.status(400).json({ ok: false, message: err.message });
        }
    );
}

const updateTask = (req=request, res=response) => {
    const { id } = req.params;
    const { completada } = req.body;

    db.run(
        `UPDATE tareas SET completada = ? WHERE id = ?`,
        [ completada, id ],
        function(err) {
            if( err ) return res.status(400).json({ ok: false, message: err.message });

            return res.status(200).json({ ok : true  });
        }
    );
}

const deleteTask = (req=request, res=response) => {
    const { id } = req.params;

    db.run(`DELETE FROM tareas WHERE id = ?`,
        [id],
        function(err) {
            if( err ) return res.status(400).json({ ok: false, message: err.message });
        
            return res.status(200).json({ ok : true  });
        }
    );
}

module.exports = {
    getTask,
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
}
