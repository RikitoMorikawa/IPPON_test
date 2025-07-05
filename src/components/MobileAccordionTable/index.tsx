import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Checkbox,
    Box,
    IconButton,
  } from '@mui/material';
import { useState } from 'react';
import { SPDropDownIcon } from '../../common/icons';
// import { useSelector } from 'react-redux';
  
  const MobileAccordionTable = ({ rows, selectedIds, fieldConfig, setSelectedIds,checkBoxOpen=false, onRowSelection }: any) => {
    const [expandedId, setExpandedId] = useState<number | null>(null);
  
    return (
      <Box>
        {rows.map((row: any) => {
          const isChecked = selectedIds?.includes(row?.id);

        const isExpanded = expandedId === row?.id;
          return (
            <Accordion key={row.id} sx={{ mb: '10px', boxShadow: '0px 0px 10px 0px #0000001A',
                borderRadius: '10px',
                '&.Mui-expanded': {
                    margin: '0 0 10px 0',
                },
                '&::before': {
                    display: 'none',
                },
                '&:first-of-type': {
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                },
                '&:last-of-type': {
                    borderBottomLeftRadius: '10px',
                    borderBottomRightRadius: '10px',
                },
                }} expanded={isExpanded} >
              <AccordionSummary 
                component="div"
                sx={{
                    padding: '0 13px', 
                    minHeight: '40px', 
                    height: '40px',
                    '&.Mui-expanded': {
                        minHeight: '40px',
                        borderBottom: '1px solid #D9D9D9',
                    },
                    '& .MuiAccordionSummary-content': {
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    },
                }}>
                <Box display="flex" alignItems="center" width="89%" flexDirection={'row'} sx={{
                  '@media (max-width:420px)': {
                    width: '84%',
                  },
                }}>
                  { checkBoxOpen && (
                    <Checkbox
                      checked={isChecked}
                      className='customCheckbox'
                      sx={{'&.Mui-checked': {color: '#3e3e3e'}}}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        const currentSelected = Array.isArray(selectedIds) ? selectedIds : [];
                    
                        const newSelected = isChecked
                          ? [...currentSelected, row?.id]
                          : currentSelected.filter((id: number) => id !== row.id);
                    
                        setSelectedIds(newSelected);
                        onRowSelection(newSelected);
                      }}
                    />
                  )}
                  {isExpanded ? (
                        <Box display={'flex'} flexDirection={'row'} width={'100%'}>
                            <Typography sx={{fontSize: '12px',color: '#3e3e3e'}} fontWeight={700} width={'50%'}>
                                {fieldConfig[0].label}
                            </Typography>
                            <Typography sx={{fontSize: '12px',color: '#3e3e3e'}} fontWeight={400} width={'50%'}>
                            {fieldConfig[0].render
                                ? fieldConfig[0].render(row[fieldConfig[0].key], row)
                                : row[fieldConfig[0].key] || '―'}
                            </Typography>
                        </Box>
                    ) : (
                    <Box display={'flex'} flexDirection={'row'} width={'100%'}>
                        <Typography sx={{fontSize: '12px',color: '#3e3e3e'}} fontWeight={400} width={'50%'}>
                        {fieldConfig[0].render
                            ? fieldConfig[0].render(row[fieldConfig[0].key], row)
                            : <Typography sx={{ fontSize: '12px', color: '#3e3e3e' }} fontWeight={400}>
                                {row[fieldConfig[0].key] || '―'}
                            </Typography>
                        }
                        </Typography>
                        <Typography sx={{fontSize: '12px'}} fontWeight={400} width={'50%'}>
                        {fieldConfig[1].render
                            ? fieldConfig[1].render(row[fieldConfig[1].key], row)
                            : <Typography sx={{ fontSize: '12px' }} fontWeight={400}>
                                {row[fieldConfig[1].key] || '―'}
                            </Typography>
                        }
                        </Typography>
                    </Box>
                    )}
                </Box>
                <IconButton
                    onClick={() => setExpandedId(isExpanded ? null : row.id)}
                    size="small"
                    sx={{ ml: 1, p: "6px 5px", height: '30px', width: '30px' }}
                    aria-label="Expand row"
                    >
                    <Box sx={{
                        transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
                        transition: 'transform 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        }}>
                        <SPDropDownIcon/>
                    </Box>
                </IconButton>
              </AccordionSummary>
              <AccordionDetails sx={{padding: '0'}}>
                    {fieldConfig.slice(1).map(({ label, key, render }:any) => (
                        <RowItem key={key} label={label} value={render ? render(row[key], row) : row[key]} checkBoxOpen={checkBoxOpen}/>
                    ))}
                </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    );
  };
  
  const RowItem = ({ label, value,style,checkBoxOpen }: { label: string; value: React.ReactNode,style?: React.CSSProperties,checkBoxOpen:boolean }) => (
    <Box display="flex" justifyContent="space-between" height='36px' alignItems="center" p={'0 13px'} sx={{borderBottom: '1px solid #D9D9D9','&:last-of-type': {
        borderBottom: 'none',
      },}}>
      <Typography width='45%' sx={{fontSize: '12px',color: '#3e3e3e',fontWeight: '700', paddingLeft: `${checkBoxOpen?'40px':''}`}}>{label}</Typography>
      <Box width="44%" style={style} paddingRight={'11%'}>
        {typeof value === 'string' ? (
          <Typography sx={{fontSize: '12px',color: '#3e3e3e',fontWeight: '400'}}>{value}</Typography>
        ) : (
          value
        )}
      </Box>
    </Box>
  );
  
  export default MobileAccordionTable;
  