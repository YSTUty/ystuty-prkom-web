import * as React from 'react';
import Box from '@mui/material/Box';

import * as envUtils from '../utils/env.utils';
import handWaveImg from '../assets/img/hand_wave.gif';
import { useDebounce, useIntersection, useTimeout } from 'react-use';

const HandWave: React.FC<React.PropsWithChildren> = (props) => {
  const intersectionRef = React.useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px',
    threshold: 1,
  });
  const [isActive] = useTimeout(3e3);
  const [show, setShow] = React.useState(false);

  useDebounce(
    () => {
      setShow(!!intersection && intersection.intersectionRatio === 1);
    },
    1e3,
    [intersection],
  );

  if (!envUtils.useHandWawe) {
    return props.children as any;
  }

  return (
    <div ref={intersectionRef}>
      {props.children}
      <Box
        aria-hidden="true"
        component="a"
        href={envUtils.handWaweUrl}
        target="_blank"
        sx={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          left: 0,
          zIndex: 1,
          '& img': {
            display: 'block',
          },
        }}
      >
        {isActive() && show && <img src={handWaveImg} width={100} height={80} alt="" />}
      </Box>
    </div>
  );
};

export default HandWave;
