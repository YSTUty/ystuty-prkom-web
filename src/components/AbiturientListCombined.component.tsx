import * as React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import YstuPrkomIcon from '@mui/icons-material/RemoveRedEye';

import { AbiturientInfoResponse } from '../interfaces/prkom.interface';
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
  [`&:nth-of-type(odd):not(.${tableRowClasses.selected})`]: {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const ApplicationTableRow: React.FC<{
  response: AbiturientInfoResponse;
  showPositions?: boolean;
  hasBeforeGreens?: boolean;
  hasBeforeOriginals?: boolean;
  hasHightPriorities?: boolean;
  combineOriginalInfo?: boolean;
  hasContractNumber?: boolean;
}> = (props) => {
  const {
    response,
    response: { info, item },
    showPositions,
    hasBeforeGreens,
    hasBeforeOriginals,
    hasHightPriorities,
    combineOriginalInfo,
    hasContractNumber,
  } = props;
  const { formatMessage } = useIntl();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow
        sx={(theme) => ({
          '& > *': { borderBottom: 'unset' },
          backgroundColor: item.isGreen
            ? theme.palette.success[theme.palette.mode]
            : item.isRed
            ? theme.palette.warning[theme.palette.mode]
            : null,
        })}
      >
        <StyledTableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>

        {/* <StyledTableCell
          // align="center"
          sx={(theme) => ({
            backgroundColor: item.isGreen ? theme.palette.success.main : item.isRed ? theme.palette.warning.main : null,
            fontWeight: 'bold',
          })}
        >
          {item.position}/ {info.numbersInfo.toenroll}
        </StyledTableCell> */}
        <StyledTableCell>
          <WrapAbiturFieldType item={item} key_="priority" />
        </StyledTableCell>
        {hasHightPriorities && (
          <StyledTableCell align="center">
            <WrapAbiturFieldType item={item} key_="isHightPriority" />
          </StyledTableCell>
        )}
        {showPositions && (
          <>
            <StyledTableCell align="center">
              {info.numbersInfo.toenroll || formatMessage({ id: 'page.abiturient.list.enrollFinish' })}
            </StyledTableCell>
            {hasBeforeGreens && (
              <StyledTableCell align="center">
                {response.payload.beforeGreens ? response.payload.beforeGreens + 1 : '-'}
              </StyledTableCell>
            )}
            {!hasContractNumber && hasBeforeOriginals && (
              <StyledTableCell align="center">{(response.payload.beforeOriginals || 0) + 1}</StyledTableCell>
            )}
          </>
        )}
        <StyledTableCell>
          <Button
            component={Link}
            to={`/view/${response.filename}`}
            variant="outlined"
            color="inherit"
            endIcon={<YstuPrkomIcon />}
            sx={{ textTransform: 'none' }}
            // size="small"
            title={formatMessage({ id: 'page.user.list.viewFull' })}
          >
            <WrapAbiturFieldType item={info} key_="competitionGroupName" />
          </Button>
        </StyledTableCell>
        <StyledTableCell>
          <WrapAbiturFieldType item={item} key_="totalScore" />
        </StyledTableCell>
        <StyledTableCell>
          <WrapAbiturFieldType item={info} key_="formTraining" />
        </StyledTableCell>
        {/* <StyledTableCell>
          <WrapAbiturFieldType item={info} key_="levelTraining" />
        </StyledTableCell> */}
        <StyledTableCell align="center">
          <WrapAbiturFieldType item={item} key_="state" />
        </StyledTableCell>
        {!hasContractNumber ? (
          <>
            <StyledTableCell
              align="center"
              title={formatMessage({
                id: `page.abiturient.list.table.header.${
                  item.originalInUniversity
                    ? 'originalInUniversity'
                    : item.originalFromEGPU
                    ? 'originalFromEGPU'
                    : 'combineOriginalInfoNot'
                }`,
              })}
            >
              <WrapAbiturFieldType
                item={item}
                key_="originalInUniversity"
                val={combineOriginalInfo ? item.originalInUniversity || item.originalFromEGPU : undefined}
              />
            </StyledTableCell>
            {!combineOriginalInfo && (
              <StyledTableCell align="center">
                <WrapAbiturFieldType item={item} key_="originalFromEGPU" />
              </StyledTableCell>
            )}
          </>
        ) : (
          <StyledTableCell align="center">
            <WrapAbiturFieldType item={item} key_="contractNumber" />
          </StyledTableCell>
        )}
      </TableRow>
      <TableRow>
        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Paper elevation={2} sx={{ my: 2, p: { xs: 2, md: 3 } }}>
              <Typography>{response.originalInfo.buildDate}</Typography>
              <Typography>{response.originalInfo.prkomDate}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography>{response.originalInfo.competitionGroupName}</Typography>
              <Typography>{response.originalInfo.formTraining}</Typography>
              <Typography>{response.originalInfo.levelTraining}</Typography>
              <Typography>{response.originalInfo.directionTraining}</Typography>
              <Typography>{response.originalInfo.basisAdmission}</Typography>
              <Typography>{response.originalInfo.sourceFunding}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography>{response.originalInfo.numbersInfo}</Typography>

              <Divider sx={{ my: 1 }} />
              <Button component={Link} to={`/view/${response.filename}`}>
                <FormattedMessage id="page.user.list.viewFull" />
              </Button>
            </Paper>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </>
  );
};

const AbiturientListCombined: React.FC<{ listData: AbiturientInfoResponse[]; showPositions?: boolean }> = (props) => {
  const { listData, showPositions = true } = props;
  const hasBeforeGreens = listData.some((e) => !!e.payload.beforeGreens);
  const hasBeforeOriginals = listData.some((e) => !!e.payload.beforeOriginals);
  const hasHightPriorities = listData.some((e) => e.item.isHightPriority);

  const combineOriginalInfo = true;

  listData.sort((a, b) => a.item.priority - b.item.priority);

  const hasContractNumber = React.useMemo(() => listData.some((e) => 'contractNumber' in e.item), [listData]);

  const hasOriginalData = React.useMemo(
    // () => listData.some((e) => e.item.originalInUniversity || e.item.originalFromEGPU),
    () => listData.some((e) => 'originalInUniversity' in e.item || 'originalFromEGPU' in e.item),
    [listData],
  );

  if (listData.length === 0) {
    return null;
  }

  const drawTable = (withContractNumber = false) => (
    <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 120px)', py: 1 }}>
      <Table stickyHeader sx={{ minWidth: 650 }} size="small" aria-label="Abiturient list">
        <TableHead>
          <StyledTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <StyledTableCell />
            {/* <StyledTableCell>
              <FormattedMessage id="page.abiturient.list.table.header.position2" /> /{' '}
              <FormattedMessage id="page.abiturient.list.table.header.enroll" />
            </StyledTableCell> */}
            <StyledTableCell>
              <FormattedMessage id="page.abiturient.list.table.header.priority" />
            </StyledTableCell>
            {hasHightPriorities && (
              <StyledTableCell align="center">
                <FormattedMessage id="page.abiturient.list.table.header.isHightPriority" />
              </StyledTableCell>
            )}
            {showPositions && (
              <>
                <StyledTableCell align="center">
                  <FormattedMessage id="page.abiturient.list.table.header.enroll" />
                </StyledTableCell>
                {hasBeforeGreens && (
                  <StyledTableCell align="center">
                    <FormattedMessage id="page.abiturient.list.table.header.beforeGreens" />
                  </StyledTableCell>
                )}
                {!withContractNumber && hasBeforeOriginals && (
                  <StyledTableCell align="center">
                    <FormattedMessage id="page.abiturient.list.table.header.beforeOriginals" />
                  </StyledTableCell>
                )}
              </>
            )}
            <StyledTableCell>
              <FormattedMessage id="page.abiturient.list.table.header.competitionGroupName" />
            </StyledTableCell>
            <StyledTableCell>
              <FormattedMessage id="page.abiturient.list.table.header.totalScore" />
            </StyledTableCell>
            <StyledTableCell>
              <FormattedMessage id="page.abiturient.list.table.header.formTraining" />
            </StyledTableCell>
            {/* <StyledTableCell>
              <FormattedMessage id="page.abiturient.list.table.header.levelTraining" />
            </StyledTableCell> */}
            <StyledTableCell align="center">
              <FormattedMessage id="page.abiturient.list.table.header.state" />
            </StyledTableCell>
            {!withContractNumber ? (
              <>
                <StyledTableCell align="center" width={150}>
                  <FormattedMessage
                    id={`page.abiturient.list.table.header.${
                      combineOriginalInfo ? 'combineOriginalInfo' : 'originalInUniversity'
                    }`}
                  />
                </StyledTableCell>
                {!combineOriginalInfo && (
                  <StyledTableCell align="center" width={150}>
                    <FormattedMessage id="page.abiturient.list.table.header.originalFromEGPU" />
                  </StyledTableCell>
                )}
              </>
            ) : (
              <StyledTableCell align="center" width={150}>
                <FormattedMessage id="page.abiturient.list.table.header.contractNumber" />
              </StyledTableCell>
            )}
          </StyledTableRow>
        </TableHead>

        <TableBody>
          {listData.map(
            (response) =>
              ((withContractNumber && 'contractNumber' in response.item) ||
                (!withContractNumber && !('contractNumber' in response.item))) && (
                <ApplicationTableRow
                  key={response.filename}
                  response={response}
                  showPositions={showPositions}
                  hasBeforeGreens={hasBeforeGreens}
                  hasBeforeOriginals={hasBeforeOriginals}
                  hasHightPriorities={hasHightPriorities}
                  combineOriginalInfo={combineOriginalInfo}
                  hasContractNumber={withContractNumber /* hasContractNumber */}
                />
              ),
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      {hasOriginalData && drawTable()}
      {hasContractNumber && drawTable(true)}
    </>
  );
};
export default AbiturientListCombined;
