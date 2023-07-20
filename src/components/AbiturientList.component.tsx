import * as React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { styled, useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import CheckIcon from '@mui/icons-material/Check';

import { RootState } from '../store';
import { AbiturientInfo, AbiturientInfoStateType, AbiturientInfo_Bachelor } from '../interfaces/prkom.interface';
import TelegramButton from './TelegramButton.component';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  [`&:nth-of-type(odd):not(.${tableRowClasses.selected})`]: {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const WrapAbiturFieldType = (val: any, key: keyof AbiturientInfo) => {
  switch (key) {
    // * Number or null
    case 'position':
    case 'totalScore':
    case 'scoreSubjectsSum':
    case 'scoreCompetitive':
    case 'priority':
    case 'priorityHight':
      return val;
    // * Bool
    case 'preemptiveRight':
    case 'originalInUniversity':
    case 'originalFromEGPU':
      return val ? <CheckIcon color="success" /> : null;
    // * Enum
    case 'state':
      return <FormattedMessage id={`AbiturientInfoStateType.${AbiturientInfoStateType[val]}`} />;
    // * Strings
    case 'uid':
      return val.replace(/ /g, '\u00a0');
    default:
      return val;
  }
};

const AbiturientList: React.FC<{ list: AbiturientInfo[]; titles?: string[]; isPersonal?: boolean }> = (props) => {
  const { list, titles, isPersonal } = props;
  const { userUid } = useSelector<RootState, RootState['app']>((state) => state.app);
  const theme = useTheme();
  const navigate = useNavigate();

  const [alreadyScrolled, setAlreadyScrolled] = React.useState<boolean>(false);
  const userUidRowRef = React.useRef<HTMLTableRowElement>(null);

  const isUserUid = React.useCallback(
    (uid: string) => {
      const numUserUid = userUid.replace(/[^0-9]+/g, '');
      return !!userUid && uid.replace(/[^0-9]+/g, '').includes(numUserUid);
    },
    [userUid],
  );

  const scrollToRow = React.useCallback(() => {
    const { current } = userUidRowRef;
    if (current) {
      current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [userUidRowRef]);

  const handleRowClick = React.useCallback(
    (e: React.MouseEvent<unknown>, userUid: string) => {
      navigate(`/user/${userUid}`);
    },
    [navigate],
  );

  React.useEffect(() => {
    if (alreadyScrolled || list.length === 0) {
      return;
    }
    const interval = setTimeout(scrollToRow, 900);
    setAlreadyScrolled(true);
    return () => void alreadyScrolled && clearInterval(interval);
  }, [list, scrollToRow, setAlreadyScrolled]);

  if (list.length === 0) {
    return null;
  }

  let firstItem = list[0];
  let header = Object.keys(firstItem) as (keyof AbiturientInfo)[];
  let headerFiltered = header.filter((e) => !['isGreen', 'isRed'].includes(e));

  const hasSubjects = 'scoreSubjects' in firstItem && firstItem.scoreSubjects;

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 120px)' }}>
      <Table stickyHeader sx={{ minWidth: 650 }} size="small" aria-label="Abiturient list">
        <TableHead>
          <StyledTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            {!isPersonal && <StyledTableCell rowSpan={2}>Bot</StyledTableCell>}
            {/* <StyledTableCell>#</StyledTableCell>
            <StyledTableCell>UID</StyledTableCell> */}

            {headerFiltered.map((e: string) => (
              <StyledTableCell
                key={e}
                {...(hasSubjects && {
                  rowSpan: e === 'scoreSubjects' ? 1 : 2,
                  colSpan: e === 'scoreSubjects' ? hasSubjects.length : 0,
                  align: 'center',
                })}
              >
                <FormattedMessage id={`page.abiturient.list.table.header.${e}`} />
              </StyledTableCell>
            ))}
          </StyledTableRow>
          {hasSubjects && (
            <StyledTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
              {hasSubjects.map(([, title]) => (
                <StyledTableCell
                  key={title}
                  {...(hasSubjects && { rowSpan: 2, colSpan: 1 })}
                  align="center"
                  title={title}
                >
                  {title.slice(0, 5)}
                  {title.length > 5 ? '…' : ''}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          )}
        </TableHead>

        <TableBody>
          {list.map((row) => {
            const isItemUserUid = isUserUid(row.uid);

            return (
              <StyledTableRow
                key={row.uid}
                ref={isItemUserUid && !userUidRowRef.current ? userUidRowRef : null}
                hover={!isPersonal}
                onClick={(event) => !isPersonal && handleRowClick(event, row.uid)}
                role="checkbox"
                aria-checked={isItemUserUid}
                selected={isItemUserUid}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  cursor: 'pointer',
                }}
              >
                {!isPersonal && (
                  <StyledTableCell rowSpan={1} colSpan={1}>
                    <TelegramButton uid={row.uid} />
                  </StyledTableCell>
                )}
                {/* <StyledTableCell component="th" scope="row">
                  {row.position}
                </StyledTableCell>
                <StyledTableCell>{row.uid}</StyledTableCell> */}

                {headerFiltered.map((e) =>
                  (e as string) === 'scoreSubjects' ? (
                    hasSubjects &&
                    (row as AbiturientInfo_Bachelor).scoreSubjects.map(([score, title]) => (
                      <StyledTableCell
                        key={title}
                        // rowSpan={1}
                        // colSpan={1}
                        sx={{
                          backgroundColor: row.isGreen
                            ? theme.palette.success.main
                            : row.isRed
                            ? score === null
                              ? theme.palette.warning.main
                              : null
                            : null,
                        }}
                        align="center"
                      >
                        {score}
                      </StyledTableCell>
                    ))
                  ) : (
                    <StyledTableCell
                      key={e}
                      rowSpan={1}
                      colSpan={1}
                      sx={{
                        backgroundColor:
                          e === 'uid' && isItemUserUid
                            ? theme.palette.primary.main
                            : row.isGreen
                            ? e === 'position'
                              ? theme.palette.success.main
                              : null
                            : row.isRed
                            ? row[e] === null || e === 'uid' || e === 'position'
                              ? theme.palette.warning.main
                              : null
                            : null,
                        ...(e === 'uid' && {
                          minWidth: 140,
                        }),
                        ...(e === 'position' && {
                          fontWeight: isPersonal ? 'bold' : null,
                        }),
                      }}
                      align="center"
                    >
                      {WrapAbiturFieldType(row[e], e)}
                    </StyledTableCell>
                  ),
                )}
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default AbiturientList;
