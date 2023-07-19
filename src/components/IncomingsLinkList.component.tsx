import * as React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IncomingsLinkIcon from '@mui/icons-material/SubjectOutlined';
import SpecialityItemIcon from '@mui/icons-material/InsertComment';

import { IncomingsLink } from '../interfaces/prkom.interface';

const IncomingsLinkList: React.FC<{ list: IncomingsLink[] }> = (props) => {
  const { list } = props;

  return (
    <List
      sx={{ width: '100%', /* maxWidth: 360, */ bgcolor: 'background.paper' }}
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          <FormattedMessage id="page.incomings.list.subheader" />
        </ListSubheader>
      }
    >
      {list.map((info) => (
        <IncomingsLinkItem key={info.id} info={info} />
      ))}
    </List>
  );
};
export default IncomingsLinkList;

const IncomingsLinkItem: React.FC<{ info: IncomingsLink }> = (props) => {
  const { info } = props;
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <IncomingsLinkIcon />
        </ListItemIcon>

        <ListItemText primary={info.name} secondary={info.levelType} />

        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          subheader={
            <ListSubheader component="div" inset>
              {info.fullName}
            </ListSubheader>
          }
        >
          {info.specialties.map((spec) => (
            <SpecialityItem key={spec.id} spec={spec} />
          ))}
        </List>
      </Collapse>
    </>
  );
};

const SpecialityItem: React.FC<{ spec: IncomingsLink['specialties'][0] }> = (props) => {
  const { spec } = props;
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleClick} sx={{ pl: 4 }}>
        <ListItemIcon>
          <IncomingsLinkIcon />
        </ListItemIcon>

        <ListItemText primary={spec.name} secondary={spec.code} />

        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {spec.files.map((file) => {
            return (
              <ListItemButton key={file.filename} sx={{ pl: 8 }} to={`/view/${file.filename}`} component={Link}>
                <ListItemIcon>
                  <SpecialityItemIcon />
                </ListItemIcon>

                <ListItemText primary={file.name} />
              </ListItemButton>
            );
          })}
        </List>
      </Collapse>
    </>
  );
};
