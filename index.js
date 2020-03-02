var spawn = require('child_process').spawn;
var axios = require('axios');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})
var liveStreamLink = 'http://172.16.20.86/livestream/live';
const pathToFfmpeg = './ffmpeg/bin/ffmpeg';
var pathToFile = ['/Applications/work/project/livesteam-benchmark/public/Dummy.mp4'];
var arg = ['-re', '-stream_loop', '-1', '-i', pathToFile[0], '-acodec', 'copy', '-vcodec', 'copy', '-f', 'flv']
var rtmpLink = '', child, scriptOutput = "", arrStream = [], countStream = 1, arrRunning = [], retry = {}, timeDelay = 0;

const auth = {
  username: '75Q1nECJD2',
  password: '6Ny7SgroqdGgnDmV7zua3yHIh6wL1Oud'
}
const getRtmpLink = () => {
  return axios.post(liveStreamLink, {}, {
    auth
  });
}
const createStreamProcess = (rtmpLink) => {
  let childStreamProcess = spawn(pathToFfmpeg, [...arg, rtmpLink]);
  return childStreamProcess;
}
const showLogProcess = (streamProcess) => {
  streamProcess.stream.stdout.setEncoding('utf8');
  streamProcess.stream.stdout.on('data', function (data) {
    data = data.toString();
    scriptOutput += data;
  });
  streamProcess.stream.stderr.setEncoding('utf8');
  streamProcess.stream.stderr.on('data', function (data) {
    arrRunning.push(`${streamProcess.rtmpLink} - ${streamProcess.file}`);
    process.stdout.write(data);
    // console.log(`${streamProcess.rtmpLink} - ${streamProcess.file} - ${data}`);
    data = data.toString();
    scriptOutput += data;
  });

  streamProcess.stream.on('close', function (code) {
    if (retry[streamProcess.rtmpLink] !== undefined) {
      retry[streamProcess.rtmpLink] += 1;
    } else {
      retry[streamProcess.rtmpLink] = 1;
    }
    if (retry[streamProcess.rtmpLink] > 3) {
      console.error(`${streamProcess.rtmpLink} - ${streamProcess.file} close (code = ${code})`);
      getRtmpLink().then((res) => {
        console.log('\r\n\r\n------open new rtmp link-----' + convertRtmpLink(res) + '\r\n\r\n');
        showLogProcess({ stream: createStreamProcess(convertRtmpLink(res)), rtmpLink: convertRtmpLink(res), file: streamProcess.file });
      })
    } else {
      process.stdout.write('\r\n\r\n---------retry---------lần ' + retry[streamProcess.rtmpLink] + '------' + streamProcess.rtmpLink + '\r\n\r\n');
      showLogProcess({ stream: createStreamProcess(streamProcess.rtmpLink), rtmpLink: streamProcess.rtmpLink, file: streamProcess.file });
    }
  });
}
const convertRtmpLink = (resFromServer) => {
  return resFromServer.data.data.streamUrl + '/' + resFromServer.data.data.streamToken;
}
const runStream = () => {
  for (let i = 0; i < countStream; i++) {
    arrStream.push(getRtmpLink());
  }
  axios.all(arrStream)
    .then((res) => {
      for (let i = 0; i < countStream; i++) {
        arg[4] = pathToFile[i] || pathToFile[pathToFile.length - 1];
        let rtmpLink = convertRtmpLink(res[i]);
        setTimeout(() => {
          showLogProcess({ stream: createStreamProcess(rtmpLink), rtmpLink, file: arg[4] });
        }, timeDelay * 1000 * i)
      }
    })
    .catch((error) => {
      console.log('error: ', error);
    })
}
const startStream = () => {
  readline.question(`Nhập link live (mặc định ${liveStreamLink}): `, (resLinkLive) => {
    if (resLinkLive) {
      liveStreamLink = resLinkLive;
    }
    if (countStream > 1) {
      readline.question('Nhập thời gian delay giữa các job (tính theo giây, mặc định là 0): ', (resDelay) => {
        if (resDelay && Number(resDelay)) {
          timeDelay = parseInt(resDelay);
        }
        runStream();
      })
    } else {
      runStream();
    }
  })
}
const main = () => {
  readline.question('Chọn số luồng muốn tạo (1-10):', (resCount) => {
    if (resCount && Number(resCount)) {
      if (parseInt(resCount) > 10) {
        resCount = 10;
      } else if (parseInt(resCount) < 1) {
        resCount = 1;
      } else {
        resCount = parseInt(resCount);
      }
      countStream = resCount;
    }
    readline.question('Chọn file (yes/no)?', (resChoice) => {
      if (!resChoice || ['n', 'no', 'n\n', 'no\n','\n'].indexOf(resChoice) !== -1) {
        startStream();
      } else {
        readline.question('Mời bạn nhập đường dẫn file (các file cách nhau bởi dấu ,):', (resFile) => {
          if (resFile && resFile.length) {
            let arrFile = resFile.split(','), arrFileFormat = [];
            if (arrFile.length) {
              arrFile.map((pathFile) => {
                pathFile = pathFile.indexOf('\n') !== -1 ? pathFile.trim().substr(0, pathFile.indexOf('\n')) : pathFile;
                arrFileFormat.push(pathFile);
              });
            }
            pathToFile = [...arrFileFormat];
          }
          startStream();
        })
      }
    })
  })
}
main();