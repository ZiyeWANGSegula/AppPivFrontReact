import PropTypes from 'prop-types';
import { Box } from '@mui/material';



TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};


export default function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{
                width: '100%',
                p: 3,
                overflowY: 'scroll', // Add overflowY property
                height: 'calc(100% - 48px)', // Add height property adjusts the height according to the AppBar height (assuming AppBar height is 48px)
                '::-webkit-scrollbar': {
                    width: '0.4em',
                },
                '::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0, 0, 0, .2)',
                },// The ::-webkit-scrollbar and ::-webkit-scrollbar-thumb styles are added for customizing the scrollbar appearance.
            }}>{children}</Box>}
        </div>
    );
}
