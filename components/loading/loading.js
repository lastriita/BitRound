import React from 'react';
import { styled } from '@mui/system';
import { keyframes } from '@emotion/react';

const spin = keyframes`
  0% {
    transform: rotate(45deg);
  }
  100% {
    transform: rotate(180deg);
  }
`;

const OctagonLoader = styled('div')`
position: absolute;
top: 0; right: 0; bottom: 0; left: 0;
overflow: hidden;

    width:100%;
    height:100%;
    position: center;
    margin: 0px;
    padding: 0px;
    min-width: 0px;
    transform: rotate(45deg);
  background: #333;

  ::after {
    position: absolute;
    transform: rotate(45deg);
    content: '';
    border: inherit;
}
&:hover{
  background: #333;
}
`;

const Octagon = styled('div')`
animation: ${spin} 1s linear infinite;
    width:70px;
    height:70px;
    float: center;
    position: relative;
    overflow: hidden;
`

const Loader = () => (
    <Octagon>
  <OctagonLoader />
  </Octagon>
);

export default Loader;
