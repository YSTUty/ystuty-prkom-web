import * as React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

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

import { FormTrainingType, IncomingsLink } from '../interfaces/prkom.interface';
import WrapAbiturFieldType from './WrapAbiturFieldType.component';

const IncomingsLinkList: React.FC<{ list: IncomingsLink[] }> = (props) => {
  const { list } = props;

  const grouppedList = React.useMemo(() => {
    const result: { [key: string]: IncomingsLink & { formTraining: FormTrainingType } } = {};

    for (const item of list) {
      for (const spec of item.specialties) {
        const levelTraining = 1;
        const { formTraining /* , levelTraining */ } = spec.info;
        const key = `${formTraining}-${levelTraining}`;
        if (!result[key]) {
          const { specialties: _nope, ...rest } = item;
          result[key] = { ...rest, formTraining, specialties: [] };
        }
        result[key].specialties.push(spec);
      }
    }

    return result;
  }, [list]);

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
      {Object.values(grouppedList).map((info) => (
        <IncomingsLinkItem key={info.name + info.formTraining} info={info} />
      ))}
    </List>
  );
};
export default IncomingsLinkList;

const IncomingsLinkItem: React.FC<{ info: IncomingsLink & { formTraining: FormTrainingType } }> = (props) => {
  const { info } = props;
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const grouppedDivision = React.useMemo(() => {
    const result: {
      [key: string]: {
        spec: IncomingsLink['specialties'][0];
        specs: IncomingsLink['specialties'];
      };
    } = {};

    for (const spec of info.specialties) {
      const { division } = spec.originalInfo;
      const key = division;
      if (!result[key]) {
        result[key] = { spec, specs: [] };
      }
      result[key].specs.push(spec);
    }

    return result;
  }, [info.specialties]);

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <IncomingsLinkIcon />
        </ListItemIcon>

        <ListItemText
          primary={info.title + ' / ' + info.desc}
          secondary={<WrapAbiturFieldType val={info.formTraining} key_="formTraining" />}
          // primary={info.name} secondary={info.levelType}
        />

        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          // subheader={
          //   <ListSubheader component="div" inset>
          //     {/* {info.fullName} */}
          //   </ListSubheader>
          // }
        >
          {Object.entries(grouppedDivision).map(([key, { spec, specs }]) => (
            <SpecialityItem key={key} spec={spec} specs={specs} filename={info.name} />
          ))}
        </List>
      </Collapse>
    </>
  );
};

const SpecialityItem: React.FC<{
  filename: string;
  spec: IncomingsLink['specialties'][0];
  specs: IncomingsLink['specialties'];
}> = (props) => {
  const { filename, spec, specs } = props;
  const { formatMessage } = useIntl();
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

        <ListItemText primary={spec.originalInfo.division} /* secondary={spec.code} */ />

        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {specs.map((spec2) => {
            return (
              <ListItemButton
                key={spec2.hash + spec2.info.receptionFeatures}
                sx={{ pl: 8 }}
                // to={`/view/${file.filename}`}
                to={`/view/${filename}/${spec2.hash}`}
                component={Link}
                // disabled={!file.countApplications}
              >
                <ListItemIcon>
                  <SpecialityItemIcon />
                </ListItemIcon>

                <ListItemText
                  primary={spec2.originalInfo.admissionCategory}
                  // primary={file.name}

                  secondary={
                    <>
                      <WrapAbiturFieldType val={spec2.info.receptionFeatures} key_="receptionFeatures" /> -{' '}
                      {[
                        // spec2.countPlaces &&
                        formatMessage(
                          { id: 'page.incomings.list.specialityItem.fileInfo.countPlaces' },
                          { count: spec2.countPlaces || 0 },
                        ),
                        // spec2.countApplications &&
                        formatMessage(
                          { id: 'page.incomings.list.specialityItem.fileInfo.countApplications' },
                          { count: spec2.countApplications || 0 },
                        ),
                        spec2.countEnrolled &&
                          formatMessage(
                            { id: 'page.incomings.list.specialityItem.fileInfo.countEnrolled' },
                            { count: spec2.countEnrolled || 0 },
                          ),
                      ]
                        .filter(Boolean)
                        .join('; ')}
                    </>
                  }
                />
              </ListItemButton>
            );
          })}
        </List>
      </Collapse>
    </>
  );
};
