import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, TextareaAutosize } from '@mui/material';

const TestWorkflowCommentDialog = ({ open, handleClose, comment, updateComment, editParams }) => {
    const [originalComment, setOriginalComment] = useState(comment);
    const [currentComment, setCurrentComment] = useState(comment);

    useEffect(() => {
        setCurrentComment(comment);
        setOriginalComment(comment);
    }, [comment]);

    const handleCommentChange = (e) => {
        setCurrentComment(e.target.value);
    };

    const handleSave = () => {
        updateComment(editParams, currentComment);
    };

    const isSaveButtonVisible = originalComment !== currentComment;

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="comment-dialog" maxWidth="md" fullWidth>
            <DialogTitle id="comment-dialog">Comment</DialogTitle>
            <DialogContent>
                <TextareaAutosize
                    autoFocus
                    margin="dense"
                    minRows={6}
                    style={{ width: '100%', padding: '5px' }}
                    label="Comment"
                    value={currentComment}
                    onChange={handleCommentChange}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                {isSaveButtonVisible && (
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                )}
                <Button onClick={handleClose} color="secondary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TestWorkflowCommentDialog;