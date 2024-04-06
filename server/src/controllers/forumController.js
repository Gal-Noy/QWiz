import { Forum } from '../models/forumModel';
import { Message } from '../models/forumModal';


const getAllForums = (req, res) => {
    Forum.find()
        .then(forums => {
            res.status(200).json(forums);
        })
        .catch(err => {
            res.status(500).send(err.message);
        });
};


const getAllForumsByExam = (req, res) => {
    Forum.find({ exam: req.params.exam })
        .then(forums => {
            res.status(200).json(forums);
        })
        .catch(err => {
            res.status(500).send(err.message);
        });
};

const getAllForumsByCourse = (req, res) => {
    Forum.find({ course: req.params.course })
        .then(forums => {
            res.status(200).json(forums);
        })
        .catch(err => {
            res.status(500).send(err.message);
        });
};

const getForumById = (req, res) => {
    Forum.findById(req.params.forum)
        .populate({
            path: 'messages',
            options: { sort: { 'createdAt': 'asc' } } 
        })
        .exec((err, forum) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (!forum) {
                return res.status(404).json({ message: 'Forum not found' });
            }
            res.status(200).json(forum);
        });
    res.status(200).json(forum);
};

const createForum = (req, res) => { //todo : what data should be sent in the request body
    const newForum = new Forum(req.body);
    newForum.save()
        .then(forum => {
            res.status(201).json(forum);
        })
        .catch(err => {
            res.status(500).send(err.message);
        });
};

const updateForum = (req, res) => {
    Forum.findByIdAndUpdate(req.params.forum, req.body, { new: true })
        .then(forum => {
            if (!forum) {
                return res.status(404).json({ message: 'Forum not found' });
            }
            res.status(200).json(forum);
        })
        .catch(err => {
            res.status(500).send(err.message);
        });
};

const deleteForum = (req, res) => {
    Forum.findByIdAndDelete(req.params.forum)
        .then(() => {
            res.status(200).json({ message: 'Forum deleted successfully' });
        })
        .catch(err => {
            res.status(500).send(err.message);
        });
};

const getAllForumsByUser = (req, res) => {
        Forum.find({ createdBy: req.params.user })
            .then(forums => {
                res.status(200).json(forums);
            })
            .catch(err => {
                res.status(500).send(err.message);
            });
    };


const getAllForumsByTag = (req, res) => {
    Forum.find({ tags: { $in: [req.params.tag] } })
        .then(forums => {
            res.status(200).json(forums);
        })
        .catch(err => {
            res.status(500).send(err.message);
        });
};

const addCommentToForum = (req, res) => {
    const comment = req.body.comment;
    const newMessage = new Message({
        content: comment.content,
        sender: comment.sender,
        thread: req.params.forum
    });
    newMessage.save()
        .then(message => {
            Forum.findByIdAndUpdate(req.params.forum, { $push: { messages: message._id } }, { new: true })
                .then(forum => {
                    res.status(200).json(forum);
                })
                .catch(err => {
                    res.status(500).send(err.message);
                });
        })
        .catch(err => {
            res.status(500).send(err.message);
        });
        
};


const deleteCommentFromForum = (req, res) => {
    const commentId = req.body.commentId;
    Forum.findByIdAndUpdate(req.params.forum, { $pull: { messages: commentId } }, { new: true })
        .then(forum => {
            res.status(200).json(forum);
        })
        .catch(err => {
            res.status(500).send(err.message);
        });
};

// Export your controller functions
module.exports = {
    getAllForums,
    getAllForumsByExam,
    getAllForumsByCourse,
    getForumById,
    createForum,
    updateForum,
    deleteForum,
    getAllForumsByUser,
    getAllForumsByCategory,
    getAllForumsByTag,
    searchForums,
    addCommentToForum,
    deleteCommentFromForum
};