const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../model/User");
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

const registerContoller = async (req, res) => {
    console.log(req.body)
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(200).send({
                message: "User Already Exist",
                success: false,
            });
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt)
        req.body.password = hashPassword;

        const confirmPassword = await bcrypt.hash(req.body.passwordConfirm, salt);

        const otp = otpGenerator.generate(6, {
            digits: true,
            upperCase: false,
            specialChars: false,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
        });

        console.log(req.body.profileImage);

        req.body.passwordConfirm = confirmPassword;
        if (req.body.password === req.body.passwordConfirm) {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                profileImage: req.body.profileImage,
                password: req.body.password,
                passwordConfirm: req.body.passwordConfirm,
                otp: otp,
            });

            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
                expiresIn: 10 * 60 * 60 * 24 * 1000,
            });


            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "aadithda1@gmail.com",
                    pass: "fngslrptwfdowcpj",
                }
            });

            const mailOptions = {
                from: "Auth Client ",
                to: req.body.email,
                subject: "Otp for Email Verification",
                text: `Your Verify Otp is ${otp}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                    return res.status(500).send("Error Sending Email...");
                }
                res.send({
                    message: "Otp sent to email",
                });

            });

            return res.status(201).send({
                message: "Registeration Successfull",
                data: {
                    user: newUser,
                    token,
                },
                success: true,
            });
        } else {
            return res.status(201).send({
                message: "Password Not Match",
                success: false,
            });
        }
    } catch (error) {
        console.log("Error got printed");
        console.log(error);
        return res.status(500).send({
            message: "Register Error",
            success: false,
        });
    }
};

const authController = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        if (!user) {
            return res.status(200).send({
                message: "User Not Found",
                success: false,
            });
        } else {
            console.log(user);
            return res.status(200).send({
                message: "Successfully Registered",
                data: {
                    user,
                },
                success: true,
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: `Auth error`,
        });
    }
};

const loginController = async (req, res) => {
    try {
        console.log(req.body);
        const user = await User.findOne({ email: req.body.email }).select(
            "+password"
        );
        if (!user) {
            return res.status(200).send({
                message: "User not found",
                success: false,
            });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);

        const signuser = await User.findOne({ email: req.body.email })
        if (!isMatch) {
            return res.status(200).send({
                success: false,
                message: `Invalid Password and email`,
            });
        }

        const token = jwt.sign({ id: signuser._id }, process.env.JWT_SECRET, {
            expiresIn: 10 * 60 * 60 * 24 * 1000,
        });
        return res.status(201).send({
            message: "Login Successfull",
            data: {
                user: signuser,
                token,
            },
            success: true,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `Auth error`,
        });
    }
};

const verifyOtpController = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user.otp === req.body.combinedOtp) {
            user.isVerified = true;
            await user.save();
            res.status(200).send({
                success: true,
                message: `OTP verified`,
            });
        } else {
            res.status(200).send({
                success: false,
                message: `OTP not Verified`,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `Verification Failed`,
        });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const { name, profileImage, userId, street, city, state, zipcode, country } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(200).send({
                message: "User not found",
                success: false,
            });
        }

        user.name = name || user.name
        user.profileImage = profileImage || user.profileImage
        user.street = street || user.street
        user.city = city || user.city
        user.state = state || user.state
        user.zipcode = zipcode || user.zipcode
        user.country = country || user.country

        await user.save();
        return res.status(201).send({
            message: "Profile Updated",
            success: true,
        });

    } catch (error) {
        console.log(error)
        return res.status(200).send({
            message: "User Error",
            success: false,
        });
    }
};


module.exports = { registerContoller, authController, loginController, verifyOtpController, updateUserProfile, };