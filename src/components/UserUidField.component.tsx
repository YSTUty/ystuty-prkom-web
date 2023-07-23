import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { useDebounce } from 'react-use';

import { styled, alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

import SearchIcon from '@mui/icons-material/Search';

import { RootState } from '../store';
import appSlice from '../store/reducer/app.slice';
import * as otherUtils from '../utils/other.util';

const Search = styled('form')(({ theme }) => ({
  position: 'relative',
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(1),
  maxWidth: 175,
  [theme.breakpoints.up('sm')]: {
    maxWidth: 200,
    marginLeft: theme.spacing(2),
  },
}));

const StyledInput = styled(TextField)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, `calc(1em + ${theme.spacing(2.5)})`),
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const UserUidField = () => {
  const dispatch = useDispatch();
  const { userUid } = useSelector<RootState, RootState['app']>((state) => state.app);
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const [value, setValue] = React.useState<string>(userUid);
  const [formatedUid, setFormatedUid] = React.useState<string>();
  const [helperText, setHelperText] = React.useState<string>();

  const onChangeValue = React.useCallback(
    (value: string) => {
      setValue(
        value
          .replace(/^\s/g, '')
          .replace(/[^0-9\-\s]+/g, '')
          .replace(/\s\s+/g, ' '),
      );
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
      if (!!helperText) {
        return;
      }
      navigate(`/user/${formatedUid}`);
    },
    [formatedUid, helperText],
  );

  // * Formatting uid
  React.useEffect(() => {
    const uidNumber = userUid.replace(/[^0-9]+/g, '').trim();
    if (!uidNumber) {
      setHelperText(undefined);
      setFormatedUid('');
      return;
    }

    let formatedUid = '';
    if (uidNumber.startsWith('000') || (!userUid.includes('-') && uidNumber.length > 3 && uidNumber.length < 10)) {
      formatedUid = otherUtils.convertToNumericUid(uidNumber);
    } else if (!uidNumber.startsWith('0000') && uidNumber.length > 10) {
      let num = Number(uidNumber);
      try {
        otherUtils.validateSnils(num);
        formatedUid = otherUtils.convertToSnilsUid(num);
      } catch (err) {
        setHelperText((err as Error).message);
        return;
      }
    }

    setHelperText(undefined);
    setFormatedUid(formatedUid);
    if (formatedUid) {
      setValue(formatedUid);
    }
  }, [userUid, setFormatedUid, setValue]);

  return (
    <Search onSubmit={handleSearchClick}>
      <IconButton
        type="button"
        sx={(theme) => ({
          position: 'absolute',
          zIndex: 10,
          m: 0.5,
          p: 0.5,
        })}
        aria-label="search"
        onClick={handleSearchClick}
        disabled={!!helperText}
      >
        <SearchIcon />
      </IconButton>
      <StyledInput
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        placeholder={formatMessage({ id: 'page.main.header.field.uid' })}
        inputProps={{ 'aria-label': 'search' }}
        error={!!helperText}
        helperText={helperText}
      />
    </Search>
  );
};

export default UserUidField;
