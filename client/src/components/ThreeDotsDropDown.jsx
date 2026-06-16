import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ITEM_HEIGHT = 48;

export default function ThreeDotsDropDown({ clickActions, postId=null, userId, commentId = null, commentUserId=null, convoId=null }) { 
    let options = [
        {
            type: 'Edit',
            action: () => 'Edit it'
        },
        {
            type: 'Delete',
            action: clickActions.handleDeletePost
        }
    ]
    if (commentId) {
        options = [
            {
                type: 'Report',
                action: () => 'Edit it'
            },
            {
                type: 'Delete',
                action: clickActions.handleCommentDelete
            }
        ];
    }else if(convoId){
        options = [
            {
                type:'Delete',
                action: clickActions.handleConvoDelete
            }
        ]
    }
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const deployAction = (option)=>{
        console.log(option)
        if(commentId){
            option.action(postId, commentId)
        
        }else if(convoId){
            option.action(convoId)
        }else{
            option.action(postId)
        }
        handleClose()
    }

    if(convoId){
        return (
            <div>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon fontSize='small' />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                        },
                    }}
                >
                    {options?.map((option) => (
                        <MenuItem key={userId + option.type} onClick={() => deployAction(option)}>
                            {option.type}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        )
    }

    if(commentId){

        return (
            <div>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon fontSize='small' />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                        },
                    }}
                >
                    {options?.filter(option=> {
                        if(option.type === "Delete" && userId===commentUserId) return true;
                        if(option.type !== "Delete") return true;
                    })
                    .map((option) => (
                        <MenuItem key={postId + option.type} onClick={() => deployAction(option)}>
                            {option.type}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        );
    }

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                }}
            >
                {options?.map((option) => (
                    <MenuItem key={postId + option.type} onClick={() => deployAction(option)}>
                        {option.type}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}