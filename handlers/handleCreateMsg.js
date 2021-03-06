const {exec} = require('child_process');
const short =  require("../modules/short");
const genCarbon = require("../modules/Carbon");
const removebg = require("../modules/removebg");
const fs = require("fs");
const handleCreateMsg = async (msg , client , MessageMedia) => {
    if(msg.fromMe) {
        if(msg.body.startsWith("!short ")){
            msg.delete(true);
            short(msg.body.split('!short ')[1]).then(url => {
            client.sendMessage(msg.to, `${url.startsWith("https://") ? `Here is the shorten URL ${url}` : 'PLease send a valid url to short.'}`);
            })
        }else if(msg.body.startsWith("!carbon ")){
            msg.delete(true);
            genCarbon(msg.body.split('!carbon ')[1]).then(data => {
                const carbon = new MessageMedia(data.mimetype , data.data);
                client.sendMessage(msg.to , carbon);
            })
        }else if(msg.body.startsWith('!term ')){
           msg.delete(true);
            exec(msg.body.split('!term ')[1] , (data , error) => {
                console.log(error);
                client.sendMessage(msg.to , data ? data : error);
            });
        }else /*if (msg.body.startsWith("!removebg")){ */
            if(msg.hasMedia){
                const media = await msg.downloadMedia();
                fs.writeFileSync('base.txt' , media.data)
                console.log(media.mimetype);
                await removebg(media.data).then(() => { 
                    const media = MessageMedia.fromFilePath('./Removebg@WhatsGram.png');
                    client.sendMessage(msg.to , media)
                })
            /*}*/
        }
    }
}

module.exports = handleCreateMsg;