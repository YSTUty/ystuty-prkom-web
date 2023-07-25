import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useDebounce } from 'react-use';
import { TableVirtuoso, TableComponents, VirtuosoHandle } from 'react-virtuoso';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';

import YstuPrkomIcon from '@mui/icons-material/RemoveRedEye';

import { RootState } from '../store';
import { AbiturientInfo, AbiturientInfo_Bachelor } from '../interfaces/prkom.interface';
import * as egeScoresUtil from '../utils/ege-scores.util';

import TelegramButton from './TelegramButton.component';
import WrapAbiturFieldType from './WrapAbiturFieldType.component';

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
  [`&[data-is-even=true]:not(.${tableRowClasses.selected})`]: {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

type VirtuosoContextType = {
  isUserUid: (uid: string) => boolean;
};

const VirtuosoTableComponents: TableComponents<AbiturientInfo, VirtuosoContextType> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
  Table: (props) => (
    <Table
      {...props}
      stickyHeader
      sx={{ minWidth: 650, borderCollapse: 'separate', tableLayout: 'fixed' }}
      size="small"
      aria-label="Abiturient list"
    />
  ),
  TableHead,
  TableRow: ({ item: row, context, ...props }) => {
    const isItemUserUid = context!.isUserUid(row.uid);

    return (
      <StyledTableRow
        key={row.uid}
        data-is-even={row.position % 2 === 1}
        role="checkbox"
        aria-checked={isItemUserUid}
        selected={isItemUserUid}
        sx={{
          '&:last-child td, &:last-child th': { border: 0 },
          cursor: 'pointer',
        }}
        {...props}
      />
    );
  },
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => <TableBody {...props} ref={ref} />),
};

const AbiturientList: React.FC<{ list: AbiturientInfo[]; titles?: string[]; isPersonal?: boolean }> = (props) => {
  const { list, titles, isPersonal } = props;
  const { userUid } = useSelector<RootState, RootState['app']>((state) => state.app);

  const [alreadyScrolled, setAlreadyScrolled] = React.useState<boolean>(false);
  const tableHeaderRef = React.useRef<HTMLTableRowElement>(null);
  const virtuosoRef = React.useRef<VirtuosoHandle>(null);

  const isUserUid = React.useCallback(
    (uid: string) => {
      const numUserUid = userUid.replace(/[^0-9]+/g, '');
      return !!userUid && uid.replace(/[^0-9]+/g, '').includes(numUserUid);
    },
    [userUid],
  );

  const scrollToRow = React.useCallback(
    (toTable = true) => {
      if (!userUid) {
        return;
      }

      if (toTable && tableHeaderRef.current) {
        tableHeaderRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      setTimeout(
        () => {
          if (virtuosoRef.current) {
            const index = list.findIndex((e) => e.uid.startsWith(userUid) || e.uid === userUid);
            if (index !== -1) {
              virtuosoRef.current.scrollToIndex({ index, align: 'start', behavior: 'smooth' });
            }
          }
        },
        toTable ? 900 : 0,
      );
    },
    [tableHeaderRef, virtuosoRef, userUid],
  );

  useDebounce(
    () => {
      scrollToRow(false);
    },
    1e3,
    [userUid],
  );

  React.useEffect(() => {
    if (isPersonal || alreadyScrolled || list.length === 0) {
      return;
    }
    const interval = setTimeout(scrollToRow, 900);
    setAlreadyScrolled(true);
    return () => void alreadyScrolled && clearInterval(interval);
  }, [list, isPersonal, scrollToRow, setAlreadyScrolled]);

  const rowContent = React.useCallback(
    (_index: number, row: AbiturientInfo) => {
      let firstItem = list[0];
      let header = Object.keys(firstItem) as (keyof AbiturientInfo)[];
      let headerFiltered = header.filter((e) => !['isGreen', 'isRed'].includes(e));

      const isItemUserUid = isUserUid(row.uid);
      return (
        <>
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
              (row as AbiturientInfo_Bachelor).scoreSubjects.map(([score, title]) => {
                const minScore = row.isRed ? egeScoresUtil.getMaxSubjectMinScore(title, undefined, row.uid) : null;
                return (
                  <StyledTableCell
                    key={title}
                    // rowSpan={1}
                    // colSpan={1}
                    sx={(theme) => ({
                      backgroundColor: row.isGreen
                        ? theme.palette.success.main
                        : row.isRed
                        ? score === null || (minScore && score < minScore)
                          ? theme.palette.warning.main
                          : null
                        : null,
                    })}
                    align="center"
                  >
                    {score}
                    {score && minScore && score < minScore ? `/${minScore}` : null}
                  </StyledTableCell>
                );
              })
            ) : (
              <StyledTableCell
                key={e}
                rowSpan={1}
                colSpan={1}
                sx={(theme) => ({
                  backgroundColor:
                    e === 'uid' && isItemUserUid
                      ? theme.palette.primary.main
                      : row.isGreen
                      ? e === 'position'
                        ? theme.palette.success.main
                        : null
                      : row.isRed
                      ? (row[e] === null || e === 'uid' || e === 'position') && e !== 'isHightPriority'
                        ? theme.palette.warning.main
                        : null
                      : null,
                  ...(e === 'position' && {
                    fontWeight: 'bold',
                  }),
                })}
                align="center"
              >
                {e === 'uid' && !isPersonal ? (
                  <Button
                    component={Link}
                    to={`/user/${row.uid}`}
                    variant="outlined"
                    color="inherit"
                    endIcon={<YstuPrkomIcon />}
                    size="small"
                    sx={{ px: 1 }}
                  >
                    <WrapAbiturFieldType item={row} key_={e} />
                  </Button>
                ) : (
                  <WrapAbiturFieldType item={row} key_={e} />
                )}
              </StyledTableCell>
            ),
          )}
        </>
      );
    },
    [isPersonal, list, isUserUid],
  );

  if (list.length === 0) {
    return null;
  }

  let firstItem = list[0];
  let header = Object.keys(firstItem) as (keyof AbiturientInfo)[];
  let headerFiltered = header.filter((e) => !['isGreen', 'isRed'].includes(e));

  const hasSubjects = 'scoreSubjects' in firstItem && firstItem.scoreSubjects;

  return (
    <Paper style={{ height: 'calc(100vh - 130px)', width: '100%' }}>
      <TableVirtuoso
        ref={virtuosoRef}
        data={list}
        context={{ isUserUid }}
        components={VirtuosoTableComponents}
        fixedHeaderContent={() => (
          <>
            <StyledTableRow ref={tableHeaderRef} sx={{ '& > *': { borderBottom: 'grey' } }}>
              {!isPersonal && (
                <StyledTableCell rowSpan={2} width={66}>
                  Bot
                </StyledTableCell>
              )}
              {/* <StyledTableCell>#</StyledTableCell>
              <StyledTableCell>UID</StyledTableCell> */}

              {headerFiltered.map((e) => (
                <StyledTableCell
                  key={e}
                  width={
                    e === 'position'
                      ? 66
                      : e === 'uid'
                      ? 200
                      : e === 'totalScore'
                      ? 115
                      : e === 'scoreSubjectsSum'
                      ? 150
                      : e === 'scoreCompetitive'
                      ? 220
                      : (e as string) === 'scoreSubjects'
                      ? 250
                      : e === 'originalInUniversity' || e === 'originalFromEGPU' || e === 'preemptiveRight'
                      ? 135
                      : e === 'state' || e === 'priority' || e === 'isHightPriority'
                      ? 100
                      : 150
                  }
                  {...(hasSubjects && {
                    rowSpan: (e as string) === 'scoreSubjects' ? 1 : 2,
                    colSpan: (e as string) === 'scoreSubjects' ? hasSubjects.length : 0,
                    align: 'center',
                  })}
                >
                  <FormattedMessage id={`page.abiturient.list.table.header.${e}`} />
                </StyledTableCell>
              ))}
            </StyledTableRow>
            {hasSubjects && (
              <StyledTableRow sx={{ '& > *': { borderBottom: 'grey' } }}>
                {hasSubjects.map(([, title]) => (
                  <StyledTableCell
                    width={80}
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
          </>
        )}
        itemContent={rowContent}
      />
    </Paper>
  );
};
export default AbiturientList;
