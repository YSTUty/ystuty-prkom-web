import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

import TextField from '@mui/material/TextField';

import { RootState } from '../store';
import appSlice from '../store/reducer/app.slice';

const UserUidField = () => {
  const dispatch = useDispatch();
  const { userUid } = useSelector<RootState, RootState['app']>((state) => state.app);
  const { formatMessage } = useIntl();

  const onChangeValue = React.useCallback(
    (value: string) => {
      dispatch(appSlice.actions.setUserUid(value.trim()));
    },
    [dispatch],
  );

  return (
    <TextField
      size="small"
      sx={{ pl: 1 }}
      value={userUid}
      onChange={(e) => onChangeValue(e.target.value)}
      placeholder={formatMessage({ id: 'page.main.header.field.uid' })}
    />
  );
};

export default UserUidField;
