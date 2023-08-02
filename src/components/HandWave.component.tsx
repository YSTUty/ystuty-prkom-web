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
    <div ref={intersectionRef} style={{ position: 'relative' }}>
      {props.children}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          bottom: 0,
          zIndex: 1,
          '& img': {
            display: 'block',
          },
        }}
      >
        {isActive() && show && (
          <a href={envUtils.handWaweUrl} target="_blank" style={{ width: '100%' }}>
            <img src={handWaveImg} width={100} height={80} alt="" />
          </a>
        )}
      </Box>
    </div>
  );
};

export default HandWave;
