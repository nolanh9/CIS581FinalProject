import { Box, Typography } from "@material-ui/core";
import React from "react";
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function VideoInput(props) {
  const { width, height } = props;

  const inputRef = React.useRef();

  const [source, setSource] = React.useState();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    setSource(url);
    props.setUrl(url)
  };

  const handleChoose = (event) => {
    inputRef.current.click();
  };

  return (
    <div className="VideoInput">
      <input
        ref={inputRef}
        className="VideoInput_input"
        type="file"
        onChange={handleFileChange}
        accept=".mov,.mp4"
        style={{display: 'None'}}
      />
      {
      !source && 
      <Box onClick={handleChoose} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',  height: '50vh'}}>
          <UploadFileIcon style={{color: '#4A536B', opacity: '50%', fontSize: '7rem'}}/>
      </Box>
      }
        {
      source && 
        <Typography style={{paddingLeft: '2rem', color: '#4A536B', opacity: '50%', fontSize: '1rem', marginTop: '0.4rem'}}>
            {source}
        </Typography>
        }
    </div>
  );
}
