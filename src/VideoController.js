import React, { useState, useRef, useEffect } from "react";
import { findDOMNode } from "react-dom";

import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import ReactPlayer from "react-player";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import { Divider, IconButton } from "@material-ui/core";

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import screenful from "screenfull";
import Controls from "./components/Controls";
import MaterialTable from "material-table";
import { string } from "prop-types";

import VideoInput from "./components/VideoInput";

import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import AddCircleIcon from '@mui/icons-material/AddCircle';

import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import BookmarkIcon from '@mui/icons-material/Bookmark';

import AddchartIcon from '@mui/icons-material/Addchart';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

const useStyles = makeStyles((theme) => ({
  playerWrapper: {
    width: "100%",

    position: "relative",
    // "&:hover": {
    //   "& $controlsWrapper": {
    //     visibility: "visible",
    //   },
    // },
  },

  controlsWrapper: {
    visibility: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  topControls: {
    display: "flex",
    justifyContent: "flex-end",
    padding: theme.spacing(2),
  },
  middleControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomWrapper: {
    display: "flex",
    flexDirection: "column",

    // background: "rgba(0,0,0,0.6)",
    // height: 60,
    padding: theme.spacing(2),
  },

  bottomControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    // height:40,
  },

  button: {
    margin: theme.spacing(1),
  },
  controlIcons: {
    color: "#777",

    fontSize: 50,
    transform: "scale(0.9)",
    "&:hover": {
      color: "#fff",
      transform: "scale(1)",
    },
  },

  bottomIcons: {
    color: "#999",
    "&:hover": {
      color: "#fff",
    },
  },

  volumeSlider: {
    width: 100,
  },
}));

const PrettoSlider = withStyles({
  root: {
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const format = (seconds) => {
  if (isNaN(seconds)) {
    return `00:00`;
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
  }
  return `${mm}:${ss}`;
};

let count = 0;

function VideoController() {
  const classes = useStyles();
  const [showControls, setShowControls] = useState(false);
  // const [count, setCount] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [timeDisplayFormat, setTimeDisplayFormat] = React.useState("normal");
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkData, setBookmarkData] = useState([]);
  const [state, setState] = useState({
    pip: false,
    playing: true,
    controls: false,
    light: false,

    muted: true,
    played: 0,
    duration: 0,
    playbackRate: 1.0,
    volume: 1,
    loop: false,
    seeking: false,
  });

  const [tableData, setTableData] = React.useState({
    columns: [
      { title: "Time Stamp/Start Time", field: 'display', type: 'string'},
      { title: "Window", field: "window", type: 'number'},
      { title: "Keywords", field: "keywords", type: 'string'},
      { title: "Opacity", field: "opacity", type: "number", type: 'number'},
      { title: "End Time", field: 'endTime', type: 'string'},
    ],
    data: [ ]
  });

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsRef = useRef(null);
  const canvasRef = useRef(null);
  const {
    playing,
    controls,
    light,

    muted,
    loop,
    playbackRate,
    pip,
    played,
    seeking,
    volume,
  } = state;

  const handlePlayPause = () => {
    setState({ ...state, playing: !state.playing });
  };

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const handleProgress = (changeState) => {
    if (count > 3) {
      controlsRef.current.style.visibility = "hidden";
      count = 0;
    }
    if (controlsRef.current.style.visibility == "visible") {
      count += 1;
    }
    if (!state.seeking) {
      setState({ ...state, ...changeState });
    }
  };

  const handleSeekChange = (e, newValue) => {
    console.log({ newValue });
    setState({ ...state, played: parseFloat(newValue / 100) });
  };

  const handleSeekMouseDown = (e) => {
    setState({ ...state, seeking: true });
  };

  const handleSeekMouseUp = (e, newValue) => {
    console.log({ value: e.target });
    setState({ ...state, seeking: false });
    // console.log(sliderRef.current.value)
    playerRef.current.seekTo(newValue / 100, "fraction");
  };

  const handleDuration = (duration) => {
    setState({ ...state, duration });
  };

  const handleVolumeSeekDown = (e, newValue) => {
    setState({ ...state, seeking: false, volume: parseFloat(newValue / 100) });
  };
  const handleVolumeChange = (e, newValue) => {
    // console.log(newValue);
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };

  const toggleFullScreen = () => {
    screenful.toggle(playerContainerRef.current);
  };

  const handleMouseMove = () => {
    console.log("mousemove");
    controlsRef.current.style.visibility = "visible";
    count = 0;
  };

  const hanldeMouseLeave = () => {
    controlsRef.current.style.visibility = "hidden";
    count = 0;
  };

  const handleDisplayFormat = () => {
    setTimeDisplayFormat(
      timeDisplayFormat == "normal" ? "remaining" : "normal"
    );
  };

  const handlePlaybackRate = (rate) => {
    setState({ ...state, playbackRate: rate });
  };

  const hanldeMute = () => {
    setState({ ...state, muted: !state.muted });
  };

  const [formats, setFormats] = React.useState(() => []);

  const handleFormat = (event, newFormats) => {
    console.log(newFormats)
    setFormats(newFormats);
  };

  const addBookmark = () => {
    const canvas = canvasRef.current;
    canvas.width = 160;
    canvas.height = 90;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      playerRef.current.getInternalPlayer(),
      0,
      0,
      canvas.width,
      canvas.height
    );
    const dataUri = canvas.toDataURL();
    canvas.width = 0;
    canvas.height = 0;
    const bookmarksCopy = [...bookmarks];
    bookmarksCopy.push({
      time: playerRef.current.getCurrentTime(),
      display: format(playerRef.current.getCurrentTime()),
      image: dataUri,
      window: 0,
      keywords: "NULL",
      opacity: 1,
      endTime: "NULL"
    });
    setBookmarks(bookmarksCopy);
  };

  const currentTime =
    playerRef && playerRef.current
      ? playerRef.current.getCurrentTime()
      : "00:00";

  const duration =
    playerRef && playerRef.current ? playerRef.current.getDuration() : "00:00";
  const elapsedTime =
    timeDisplayFormat == "normal"
      ? format(currentTime)
      : `-${format(duration - currentTime)}`;

  const totalDuration = format(duration);

  const [url, setUrl] = React.useState("");

  return (
    <>
      {/*
        <AppBar position="fixed">
        <Toolbar>
          <Typography>React Video Player</Typography>
        </Toolbar>
      </AppBar>*/
      }
        <Grid style={{padding: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
            <ToggleButtonGroup
                value={formats}
                onChange={handleFormat}
                aria-label="text formatting"
                >
                <ToggleButton value="showChart" aria-label="chart">
                    Show Chart <AddchartIcon />
                </ToggleButton>
                <ToggleButton value="showBookmarks" aria-label="bookmarks">
                    Bookmarks <BookmarkIcon />
                </ToggleButton>
                <ToggleButton value="showInfo" aria-label="info">
                    Info <QuestionMarkIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        </Grid>
        
      <Container maxWidth="md">
      <Grid style={{border:'solid', borderColor:'#FF9A8D', borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',}}>
            <VideoInput setUrl ={setUrl}/>
        </Grid>
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={hanldeMouseLeave}
          ref={playerContainerRef}
          className={classes.playerWrapper}
        >
        
          <ReactPlayer
            ref={playerRef}
            width="100%"
            height="100%"
            url={url}
            //http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4
            pip={pip}
            playing={playing}
            controls={false}
            light={light}
            loop={loop}
            playbackRate={playbackRate}
            volume={volume}
            muted={muted}
            onProgress={handleProgress}
            config={{
              file: {
                attributes: {
                  crossorigin: "anonymous",
                },
              },
            }}
          />

          <Controls
            ref={controlsRef}
            onSeek={handleSeekChange}
            onSeekMouseDown={handleSeekMouseDown}
            onSeekMouseUp={handleSeekMouseUp}
            onDuration={handleDuration}
            onRewind={handleRewind}
            onPlayPause={handlePlayPause}
            onFastForward={handleFastForward}
            playing={playing}
            played={played}
            elapsedTime={elapsedTime}
            totalDuration={totalDuration}
            onMute={hanldeMute}
            muted={muted}
            onVolumeChange={handleVolumeChange}
            onVolumeSeekDown={handleVolumeSeekDown}
            onChangeDispayFormat={handleDisplayFormat}
            playbackRate={playbackRate}
            onPlaybackRateChange={handlePlaybackRate}
            onToggleFullScreen={toggleFullScreen}
            volume={volume}
            onBookmark={addBookmark}
          />
        </div>
        
        {
            formats.indexOf('showInfo') > -1 ?
                <>
                <Divider style={{marginTop: '1rem', height: 10, borderRadius: '50%'}}/>
                    <Typography style={{paddingLeft: '2rem', color: '#4A536B', opacity: '50%', fontSize: '1.5rem', marginTop: '0.4rem'}}>
                      "How To" Information:
                    </Typography>
                    <Divider style={{marginBottom: 30, width: '25%', marginLeft: '2rem'}}/>
                    <Typography style={{paddingLeft: '2rem', color: '#4A536B', opacity: '50%', fontSize: '1rem', marginTop: '0.4rem'}}>
                      Here, you have the ability to analyze your video and define keywords and opacities 
                      at certain frames.
                    </Typography>
                    <Typography style={{paddingLeft: '2rem', color: '#4A536B', opacity: '50%', fontSize: '1rem', marginTop: '0.6rem'}}>
                        Keywords are descriptors of how you want to modify your video. Write your keywords as so:
                    </Typography>
                    <Typography style={{paddingLeft: '2rem', color: '#4A536B', opacity: '50%', fontSize: '1rem', marginTop: '0.6rem'}}>
                      Green:.4|purple rain:.2
                    </Typography>
                    <Typography style={{paddingLeft: '2rem', color: '#4A536B', opacity: '50%', fontSize: '1rem', marginTop: '0.6rem'}}>
                      Here, we will apply Green and purple rain keywords to the video, with relative strengths of .4 and .2 respectively.
                    </Typography>
                    <Typography style={{paddingLeft: '2rem', color: '#4A536B', opacity: '50%', fontSize: '1rem', marginTop: '0.6rem'}}>
                      Start and End time stamp: the start and end timestamp classify the beginning time and end time of the video
                      where your keywords will be applied.
                    </Typography>
                    <Typography style={{paddingLeft: '2rem', color: '#4A536B', opacity: '50%', fontSize: '1rem', marginTop: '0.6rem'}}>
                      The window size is the specific window size around the timestamp, if only the start time is present, that the keywords will be applied
                      to, and the opacity toggles the relative strength of all keywords.
                    </Typography>
                </>
                :
            <Grid>
                <Grid>
                    {/*<IconButton style={{float: 'right'}} onClick={handleFormat([...formats, 'showBookmarks'])} >
                        <AddCircleIcon style={{color: '#FF9A8D', size:'3rem'}}/> 
                    </IconButton>handleFormat(formats.filter((item) => item !== 'bookmarks'*/}
                    <Divider style={{marginTop: '1rem', height: 10, borderRadius: '50%'}}/>
                    <Typography style={{marginLeft: '2rem', color: '#4A536B', opacity: '50%', fontSize: '1.5rem', marginTop: '0.4rem'}}>
                        Information Hidden
                    </Typography>
                </Grid>
            </Grid>
        }
        {
            formats.indexOf('showChart') > -1 ?
                <>
                <Divider style={{marginTop: '1rem', height: 10, borderRadius: '50%'}}/>
                <Typography style={{paddingLeft: '2rem', color: '#4A536B', opacity: '50%', fontSize: '1.5rem', marginTop: '0.4rem'}}>
                    Chart:
                </Typography>
                <Divider style={{marginBottom: 30, width: '25%', marginLeft: '2rem'}}/>
                <MaterialTable
                title=""
                icons={tableIcons}
                columns={tableData.columns}
                data={bookmarks}
                options={{
                    exportButton: true,
                    headerStyle: {
                    backgroundColor: "#FF9A8D",
                    color: "#FFF",
                    fontFamily: 'Poppins'
                    },
                    searchFieldStyle: {
                    color: "#969696",
                    fontFamily: 'Poppins'
                    },
                    cellStyle: {
                    color: "#969696",
                    fontFamily: 'Poppins'
                    },
                }}
                on
                editable={
                    {
                        onRowUpdate: (newData, oldData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                            resolve();
                            const data = [...bookmarks];
                            var checker = oldData['time'];
                            console.log(data.length)
                            for (var index = 0; index < data.length; index++) {
                                console.log('here')
                                if (data[index]['time'] == checker) {
                                    data[index] = newData;
                                    console.log(data);
                                    break;
                                }
                            }
                            //setTableData({ ...tableData, data });
                            console.log(data)
                            setBookmarks(data)
                            }, 600);
                        }),
                        onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                            const data = [...bookmarks];
                            data.splice(data.indexOf(oldData), 1);
                            //setTableData({ ...tableData, data });
                            setBookmarks(data)
                        }, 600);
                        })
                    }
                }
            />
            </>
            :
            <>
                <Divider style={{marginTop: '1rem', height: 10, borderRadius: '50%'}}/>
                <Typography style={{paddingLeft: '2rem', color: '#4A536B', opacity: '50%', fontSize: '1.5rem', marginTop: '0.4rem'}}>
                    Chart Hidden
                </Typography>
            </>
        }
        {
            formats.indexOf('showBookmarks') > -1 ?
                <>
                <Divider style={{marginTop: '1rem', height: 10, borderRadius: '50%'}}/>
                    <Typography style={{paddingLeft: '2rem', color: '#4A536B', opacity: '50%', fontSize: '1.5rem', marginTop: '0.4rem'}}>
                        Bookmarks:
                    </Typography>
                    <Divider style={{marginBottom: 30, width: '25%', marginLeft: '2rem'}}/>
                <Grid container style={{ marginTop: 20 }} spacing={3}>
                
                {bookmarks.map((bookmark, index) => (
                    <Grid key={index} item>
                    <Paper
                        onClick={() => {
                        playerRef.current.seekTo(bookmark.time);
                        controlsRef.current.style.visibility = "visible";

                        setTimeout(() => {
                            controlsRef.current.style.visibility = "hidden";
                        }, 1000);
                        }}
                        elevation={3}
                    >
                        <img crossOrigin="anonymous" src={bookmark.image} />
                        <Typography variant="body2" align="center">
                        Bookmark at {bookmark.display}
                        </Typography>
                    </Paper>
                    </Grid>
                ))}
                
                </Grid>
                <Divider style={{marginTop: '1rem', height: 10, borderRadius: '50%'}}/>
                </>
                :
            <Grid>
                <Grid>
                    {/*<IconButton style={{float: 'right'}} onClick={handleFormat([...formats, 'showBookmarks'])} >
                        <AddCircleIcon style={{color: '#FF9A8D', size:'3rem'}}/> 
                    </IconButton>handleFormat(formats.filter((item) => item !== 'bookmarks'*/}
                    <Divider style={{marginTop: '1rem', height: 10, borderRadius: '50%'}}/>
                    <Typography style={{marginLeft: '2rem', color: '#4A536B', opacity: '50%', fontSize: '1.5rem', marginTop: '0.4rem'}}>
                        Bookmarks Hidden
                    </Typography>
                    <Divider style={{marginTop: '1rem', height: 10, borderRadius: '50%'}}/>
                </Grid>
            </Grid>
        }
        <canvas ref={canvasRef} />
      </Container>
    </>
  );
}

export default VideoController;
