import React, { useState } from "react";
import { Box, Typography, Divider, TextField } from "@mui/material";
import "./MiniTableList.css";
import { MiniTableListProps } from "../../types";

const MiniTableList: React.FC<MiniTableListProps> = ({
  data = [],
  headerLabels = {
    date: "日付",
    // title: "タイトル",
    customer_name: "顧客名",
    category: "カテゴリ",
    content: "内容"
  },
  onChange
}) => {
  const [editingContent, setEditingContent] = useState<{ [key: number]: string }>({});

  const handleContentChange = (index: number, newContent: string) => {
    if (onChange) {
      const newData = [...data];
      newData[index] = { ...newData[index], content: newContent };
      onChange(newData);
    }
  };

  const handleContentFocus = (index: number) => {
    setEditingContent(prev => ({ ...prev, [index]: data[index]?.content || '' }));
  };

  const handleContentBlur = (index: number) => {
    const tempContent = editingContent[index];
    if (tempContent !== undefined && tempContent !== data[index]?.content) {
      handleContentChange(index, tempContent);
    }
    setEditingContent(prev => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
  };

  const handleTempContentChange = (index: number, value: string) => {
    setEditingContent(prev => ({ ...prev, [index]: value }));
  };
  return (
    <Box className="customer-details-container">
      {/* Horizontal Scroll Wrapper */}
      <Box className="table-scroll-wrapper">
        <Box className="table-content">
          {/* Table Headers */}
          <Box className="table-header">
            <Box className="header-cell date-cell">
              <Typography variant="body2">{headerLabels.date}</Typography>
            </Box>
            {/* <Box className="header-cell title-cell">
              <Typography variant="body2">{headerLabels.title}</Typography>
            </Box> */}
            <Box className="header-cell customer-cell">
              <Typography variant="body2">{headerLabels.customer_name}</Typography>
            </Box>
            <Box className="header-cell category-cell">
              <Typography variant="body2">{headerLabels.category}</Typography>
            </Box>
            <Box className="header-cell content-cell">
              <Typography variant="body2">{headerLabels.content}</Typography>
            </Box>
          </Box>

          <Divider />

          {/* Data Rows */}
          {data.map((row, index) => (
            <React.Fragment key={index}>
              <Box className="table-row">
                <Box className="table-cell date-cell">
                  <Typography variant="body2">{row.date}</Typography>
                </Box>
                {/* <Box className="table-cell title-cell">
                  <Typography variant="body2">{row.title}</Typography>
                </Box> */}
                <Box className="table-cell customer-cell">
                  <Typography variant="body2">{row.customer_name}</Typography>
                </Box>
                <Box className="table-cell category-cell">
                  <Typography variant="body2">{row.category}</Typography>
                </Box>
                <Box className="table-cell content-cell">
                  {onChange ? (
                    <TextField
                      value={editingContent[index] !== undefined ? editingContent[index] : row.content}
                      onChange={(e) => handleTempContentChange(index, e.target.value)}
                      onFocus={() => handleContentFocus(index)}
                      onBlur={() => handleContentBlur(index)}
                      variant="standard"
                      size="small"
                      multiline
                      maxRows={3}
                      sx={{
                        width: '100%',
                        '& .MuiInput-underline:before': {
                          borderBottom: '1px solid transparent',
                        },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                          borderBottom: '1px solid #ccc',
                        },
                        '& .MuiInput-underline:after': {
                          borderBottom: '2px solid #1976d2',
                        },
                        '& .MuiInputBase-input': {
                          fontSize: '0.875rem',
                          padding: '4px 0',
                        },
                      }}
                    />
                  ) : (
                    <Typography variant="body2">{row.content}</Typography>
                  )}
                </Box>
              </Box>
              <Divider />
            </React.Fragment>
          ))}
        </Box>
      </Box>

      {/* Customer Correspondence Details Section */}
      <Box mt={4}>
      </Box>
    </Box>
  );
};

export default MiniTableList;