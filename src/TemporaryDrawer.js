import * as React from 'react';
import {  Box, 
          Drawer, 
          Button, 
          List, 
          ListItem, 
          ListItemText, 
          IconButton, 
          Grid, 
          Typography, 
          ListItemAvatar 
        } from '@material-ui/core';

import InfoIcon from '@mui/icons-material/Info';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import NolanHeadshot from './photos/1531590474667.jpg';
import GrantHeadshot from './photos/1570132229731.jpg';
import AsaphHeadshot from './photos/1617548218427.jpg';

const anchor = 'right';

function TemporaryDrawer() {
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 400 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      style={{maxWidth: 600, borderRadius: 20, border: 'solid', borderColor: '#FF9A8D', height: '100%'}}
    >
      <List>
        <ListItem button key={'Back Button'}>
          <Grid style={{width: '100%'}}>
            <ArrowForwardIosIcon style={{float: 'right', color: '#4A536B', opacity: '50%', fontSize: '1.5rem'}}/>
          </Grid>
        </ListItem>
        <ListItem button key={'Asaph Kupferman'}>
          <img src={AsaphHeadshot} style={{borderRadius: '50%'}}/>
          <Grid style={{paddingLeft: 10, display: 'flex', alignItems: 'left', justifyContent: 'left', flexDirection: 'column'}}>
            <Typography style={{color: '#4A536B', opacity: '50%', fontSize: '1.5rem'}}>Asaph Kupferman</Typography>
            <Typography style={{color: '#4A536B', opacity: '50%', fontSize: '0.9rem'}}>BSE in Electrical Engineering, MSE in Robotics at the University of Pennsylvania</Typography>
          </Grid>
        </ListItem>
        <ListItem button key={'Grant Brewster'}>
          <img src={GrantHeadshot} style={{borderRadius: '50%'}}/>
          <Grid style={{paddingLeft: 10, display: 'flex', alignItems: 'left', justifyContent: 'left', flexDirection: 'column'}}>
            <Typography style={{color: '#4A536B', opacity: '50%', fontSize: '1.5rem'}}>Grant Brewster</Typography>
            <Typography style={{color: '#4A536B', opacity: '50%', fontSize: '0.9rem'}}>BSE in Digital Media Design at the University of Pennsylvania</Typography>
            <Typography style={{color: '#4A536B', opacity: '50%', fontSize: '0.9rem'}}>Software Engineering at Rippling</Typography>
          </Grid>
        </ListItem>
        <ListItem button key={'Nolan Hendrickson'}>
          <img src={NolanHeadshot} style={{borderRadius: '50%'}}/>
          <Grid style={{paddingLeft: 10, display: 'flex', alignItems: 'left', justifyContent: 'left', flexDirection: 'column'}}>
            <Typography style={{color: '#4A536B', opacity: '50%', fontSize: '1.5rem'}}>Nolan Hendrickson</Typography>
            <Typography style={{color: '#4A536B', opacity: '50%', fontSize: '0.9rem'}}>BSE, MSE in Computer Science at the University of Pennsylvania</Typography>
            <Typography style={{color: '#4A536B', opacity: '50%', fontSize: '0.9rem'}}>Software Engineering at Microsoft</Typography>            
          </Grid>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <>
        <Grid style={{width: '100%'}}>
          <Grid style={{float: 'right'}}>
            <Grid>
              <Typography style={{float: 'left', color: '#4A536B', opacity: '50%', fontSize: '1.5rem', marginTop: '0.4rem'}}>
                Learn About Us
              </Typography>
              <IconButton style={{float: 'right'}} onClick={toggleDrawer(anchor, true)}>
                <InfoIcon style={{color: '#FF9A8D', size:'3rem'}}/> 
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Typography style={{color: '#FF9A8D', fontSize:'3rem', paddingTop: '2rem', paddingLeft: '2rem'}}>
          Create Your Masterpiece.
        </Typography>
        <Drawer
          anchor={anchor}
          open={state[anchor]}
          onClose={toggleDrawer(anchor, false)}
        >
          <Grid>{list(anchor)}</Grid>
          
        </Drawer>
      </>
    </div>
  );
}

export default TemporaryDrawer;