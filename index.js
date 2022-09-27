const app = require("express")();
const Stream = require("node-rtsp-stream");

const streams = {};

const stream_configs = [
    {
        key: "BunnyVideo",
        port: 9000,
        url: "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4",
    },
];

const startStream = (name, streamUrl, wsPort) =>{
    const stream = new Stream({
        name,
        streamUrl,
        wsPort,
        ffmpegOptions: { 
          "-stats": "", 
          "-r": 30, 
        },
      });

      streams[wsPort] = stream;
    };

app.get("start-stream", (req, res) => {
    //URL->RTSP link
    const { url, port, key = "stream"} = req.query;
    if(!url && !port){
        return res.json({
            message:'Bad input'
        })
    }
 
    if(streams[port]){
        return res.json({
            message:"Port is in use",
        })
    }

    startStream(key,url,port);

    res.json({
        message:'Started Stream'
    })    
})
app.listen(8080, ()=> {
    console.log('Server Running at 8080');
    stream_configs.forEach((config)=>{
        startStream(config.key, config.url,config.port);
    })
    // startStream();
});