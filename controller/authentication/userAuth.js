var Model= require("./../../db/schema");
const md5 = require('md5');
var bcrypt = require('bcryptjs');
async function createUser( req,res){
    let ifExists = await Model.userModel.findOne({email:req.body.email})
    if (ifExists) {
        return res.status(403).send({msg:'Email-ID already exists'})
    }
    var password = md5(req.body.password);
    let v_length = 6;
    var otp = Math.floor(Math.pow(10, v_length - 1) + Math.random() * (Math.pow(10, v_length) - Math.pow(10, v_length - 1) - 1));
    req.body.otp = otp;
    req.body.password = password;
    let newUser = await Model.userModel(req.body).save()
    var result = {
        username: newUser.username,
            phone: newUser.phone,
                email: newUser.email,
                    id: newUser._id
    }
    return res.status(200).send({ msg: "Successfuly register",  result})
}

const alluser = async (req, res) => {
    var getuser = await Model.userModel.find({}).select({"email":1, "username": 1, "_id": 1, "phone": 1,"verify":1 });
    if (getuser.length != 0){
        req.io.sockets.emit("user", getuser)
        return res.status(200).send({ msg: "Successfuly register", data: getuser });
    }else{
        return res.status(404).send({ msg: 'No Record Found' })
    }
        // return users.map(userItem =>   {
        //     console.log(userItem.username)
        //     // return { ...userItem, id: userItem._doc._id, username:  userItem._doc.username!==undefined ? userItem._doc.username :'',  }  //d structur 
        // })
        // return { users} 
    }

const login = async (req,res) => {
    let ifExists = await Model.userModel.findOne({email:req.body.email})
        if (!ifExists) {
            return res.status(403).send({ msg: 'User not found with given credentials'})
        }
    if (md5(req.body.password) != ifExists.password) {
        return res.status(403).send({ msg: 'Invalid credentials'})
        }
        if (ifExists.verified) {
            return res.status(403).send({ msg: 'Account is not verified'})
        }
    const authkey = await bcrypt.hash(ifExists._id + Date.now(), 2)
        // LoginLog({ secretkey: key, user: ifExists._id }).save()
    Model.userModel.findByIdAndUpdate(ifExists._id, { $set: { authkey: authkey } })
   .then(docs => {
            return res.status(200).send({ id: ifExists._id, email: ifExists.email, key: authkey })
        }).catch(err =>{
            return res.status(400).send({ msg: 'Please Try Again' })
        })
    }

module.exports ={
    createUser, login, alluser
} 


//login

        // var ip = req.headers['x-forwarded-for'] ||
        //     req.connection.remoteAddress ||
        //     req.socket.remoteAddress ||
        //     req.connection.socket.remoteAddress;
        // var ret = ip.replace('::ffff:', '');
        // /*PLEASE cheange on live time  var =>   ret in parameter insted of static ip address 
        //                                        /\
        //                                        ||                                                     */
        // var details = await otherservice.ipdetails('182.70.122.187');
        // var ip_data = JSON.parse(details);
        // var i_p = ip_data.ip;
        // var country = ip_data.country_name;
        // var city = ip_data.city;
        // var latitude = ip_data.latitude;
        // var longitude = ip_data.longitude;
        // var time_zone = ip_data.time_zone.current_time;
        // var ua = req.headers['user-agent'];

        // var browser = '';
        // if (/firefox/i.test(ua))
        //     browser = 'firefox';
        // else if (/chrome/i.test(ua))
        //     browser = 'chrome';
        // else if (/safari/i.test(ua))
        //     browser = 'safari';
        // else if (/msie/i.test(ua))
        //     browser = 'msie';
        // else
        //     browser = 'unknown';
        // var date = new Date();
        // var timestamp = date.getTime();
        // var secret_key = md5(memberFound.id + timestamp);
        // var loginlog = {
        //     user_id: memberFound._id,
        //     ip_address: i_p,
        //     country: country,
        //     city: city,
        //     latitude: latitude,
        //     longitude: longitude,
        //     time_zone: time_zone,
        //     web_browser: browser,
        //     operating_system: process.platform,
        //     platform: process.platform,
        //     your_port: "",
        //     secret_key: secret_key,
        //     device_token: req.body.dvice_token,
        //     login_type: req.body.login_type
        // };





 
