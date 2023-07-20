import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { useDebounce } from 'react-use';

import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

import SearchIcon from '@mui/icons-material/Search';

import { RootState } from '../store';
import appSlice from '../store/reducer/app.slice';
import * as otherUtils from '../utils/other.util';

const UserUidField = () => {
  const dispatch = useDispatch();
  const { userUid } = useSelector<RootState, RootState['app']>((state) => state.app);
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const [value, setValue] = React.useState<string>(userUid);
  const [formatedUid, setFormatedUid] = React.useState<string>();

  const onChangeValue = React.useCallback(
    (value: string) => {
      setValue(value);
    },
    [setValue],
  );

  useDebounce(
    () => {
      dispatch(appSlice.actions.setUserUid(value.trim()));
    },
    1e3,
    [value],
  );

  const handleSearchClick = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (!formatedUid) return;
      navigate(`/user/${formatedUid}`);
    },
    [formatedUid],
  );

  // * Formatting uid
  React.useEffect(() => {
    const uidNumber = userUid.replace(/[^0-9]+/g, '').trim();
    if (!uidNumber) {
      setFormatedUid('');
      return;
    }

    let formatedUid = '';
    if (uidNumber.startsWith('000') || (!userUid.includes('-') && uidNumber.length > 3 && uidNumber.length < 10)) {
      formatedUid = otherUtils.convertToNumericUid(uidNumber);
    } else if (!uidNumber.startsWith('0000') && uidNumber.length > 10) {
      try {
        otherUtils.validateSnils(uidNumber);
        formatedUid = otherUtils.convertToSnilsUid(uidNumber);
      } catch (err) {
        return;
      }
    }
    setFormatedUid(formatedUid);
  }, [userUid, setFormatedUid]);

  return (
    <Paper
      component="form"
      sx={{ ml: 1, display: 'flex', alignItems: 'center', maxWidth: 220 }}
      onSubmit={handleSearchClick}
    >
      <TextField
        size="small"
        sx={{ flex: 1 }}
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        placeholder={formatMessage({ id: 'page.main.header.field.uid' })}
      />
      {formatedUid && (
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearchClick}>
          <SearchIcon />
        </IconButton>
      )}
    </Paper>
  );
};

export default UserUidField;
