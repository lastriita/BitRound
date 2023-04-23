import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../components/theme2.js';
import { Link } from '../routes'

const HeaderContainer = styled(AppBar)`
  background-color: #2d82b5;
  box-shadow: inset 0 -4px 6px rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  margin-bottom: 15px
`;

const Title = styled(Typography)`
  flex-grow: 1;
`;

const OctagonButton = styled(Button)`
position: absolute;
top: 0; right: 0; bottom: 0; left: 0;
overflow: hidden;
transform: rotate(45deg);
background: transparent;

width:100%;
height:100%;
position: center;
margin: 0px;
padding: 0px;
min-width: 0px;
transform: rotate(45deg);

::after {
    position: absolute;
    transform: rotate(45deg);
    content: '';
    border: inherit;
}
&:hover{
  background: #53a7d8;
}
`;

const Octagon = styled('div')`
    width:40px;
    height:40px;
    float: right;
    position: relative;
    overflow: hidden;
`

const RotatedAddIcon = styled(AddIcon)`
    transform: rotate(-45deg);
    color: white;
`

const RequestsTitle = (address) => {
  return (
    <ThemeProvider theme={theme}>
      <HeaderContainer position="static">
        <Toolbar>
          <Title variant="h5">
            Requests
          </Title>
          
            <Octagon>
            <Link route={`/bitround/${address}/new-request`}>
              <OctagonButton onClick={() => console.log('Octagon button clicked')}>
                  <RotatedAddIcon/>
              </OctagonButton>
            </Link>
            </Octagon>
        </Toolbar>
      </HeaderContainer>
    </ThemeProvider>
  );
};

export default RequestsTitle;
