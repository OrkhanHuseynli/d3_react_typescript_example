import React from 'react';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import 'typeface-roboto';
import './App.css';
import MainContainer from "./core/MainContainer";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.primary,
        },
        dataPreview: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.primary,
            border : '1px solid #e0e0e0',
            maxWidth: '350px',
            margin: '0 auto'
        },
        button: {
            margin: theme.spacing(1),
        },
        input: {
            display: 'none',
        },
    }),
);
const App: React.FC = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <MainContainer classes={classes} />
        </div>
    );
}

export default App;
