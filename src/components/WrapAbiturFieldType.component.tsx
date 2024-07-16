import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import CheckIcon from '@mui/icons-material/Check';
import NoCheckIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';

import {
  AbiturientInfo,
  AbiturientInfoStateType,
  FormTrainingType,
  IncomingsPageInfo,
  LevelTrainingType,
} from '../interfaces/prkom.interface';

const WrapAbiturFieldType: React.FC<
  | { item: AbiturientInfo; key_: keyof AbiturientInfo }
  | { item: IncomingsPageInfo; key_: keyof IncomingsPageInfo }
  | { val: any; key_: string }
> = (props) => {
  const { key_: key } = props;

  let val: any = null;
  if ('val' in props && props.val !== undefined) {
    val = props.val;
  } else if ('item' in props) {
    val = (props.item as any)[key];
  }

  switch (key) {
    // * Number or null
    case 'position':
    case 'scoreSubjectsSum':
    case 'scoreCompetitive':
    case 'priority':
      return val;
    // * Number or '-'
    case 'totalScore':
      return val ?? '-';
    // * Bool
    case 'preemptiveRight':
    case 'originalFromEGPU':
    case 'isHightPriority':
      return val ? <CheckIcon color="success" /> : null;
    case 'originalInUniversity':
      return val ? (
        <CheckIcon color="success" />
      ) : val === false ? (
        <NoCheckIcon color="error" />
      ) : (
        <RemoveIcon color="secondary" />
      );
    // * Enum
    case 'state':
      return <FormattedMessage id={`AbiturientInfoStateType.${AbiturientInfoStateType[val]}`} />;
    case 'levelTraining':
      return <FormattedMessage id={`LevelTrainingType.${LevelTrainingType[val]}`} />;
    case 'formTraining':
      return <FormattedMessage id={`FormTrainingType.${FormTrainingType[val]}`} />;
    // * Strings
    case 'uid':
      return val.replace(/ /g, '\u00a0');
    case 'docType':
      return <FormattedMessage id={`DocType.${val || 'none'}`} />;
    case 'receptionFeatures':
      return <FormattedMessage id={`ReceptionFeatures.${val || 'none'}`} />;
    default:
      return val;
  }
};

export default WrapAbiturFieldType;
