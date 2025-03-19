import { Navbarow } from "./Navbarowcomponent/navbarow/index-ow";
import React from 'react';
import {
    TextField,
    Button,
    Container,
    Grid,
    IconButton,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Chip,
    Box,
    InputAdornment,
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@mui/material';
function ownerpage() {
    return (
        <div className="ow">
            <Navbarow />
            <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }} variant="h5" gutterBottom>ยินดีตอนรับ</Typography>
            

        </div>

        

    )
}




export default ownerpage