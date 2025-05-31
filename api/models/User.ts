import mongoose, {HydratedDocument, Model} from "mongoose";
import {UserFields} from "../types";
import argon2 from "argon2";
import jwt from 'jsonwebtoken';

interface UserMethods {
    checkPassword: (password: string) => Promise<boolean>;
    generateToken(): void;
}

interface UserVirtuals {
    confirmPassword: string;
}

const ARGON2_OPTIONS = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1,
};

export const generateTokenJWT = (user: HydratedDocument<UserFields>) => {
    return jwt.sign({_id: user._id}, JWT_SECRET, { expiresIn: "365d" })
}

export const JWT_SECRET = process.env.JWT_SECRET || 'default_fallback_secret';

type UserModel = Model<UserFields, {}, UserMethods>;

const UserSchema = new mongoose.Schema<
    HydratedDocument<UserFields>,
    UserModel,
    UserMethods,
    {},
    UserVirtuals
>({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        validate: {
            validator: async function(value: string): Promise<boolean> {
                if (!this.isModified('email')) return true;
                const user = await User.findOne({email: value});
                return !user;
            },
            message: "This email is already registered"
        }
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'admin'],
    },
    token: {
        type: String,
        required: true,
    },

    displayName: {
        type: String,
        required: true,
    },
    googleID: String,

    joinedActivities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
    }],

}, {
    virtuals: {
        confirmPassword: {
            get() {
                return this.__confirmPassword;
            },
            set(confirmPassword: string) {
                this.__confirmPassword = confirmPassword;
            }
        }
    }
});

UserSchema.methods.checkPassword = async function (password: string){
    return await argon2.verify(this.password, password);
}

UserSchema.methods.generateToken = function (){
    this.token = generateTokenJWT(this);
}

UserSchema.path('password').validate(async function (v: string) {
    if (!this.isModified('password')) return;

    if (v !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Passwords do not match');
        this.invalidate('password', 'Passwords do not match');
    }
});

UserSchema.pre('save', async function (next){
    if (!this.isModified("password")) return next();

    this.password = await argon2.hash(this.password, ARGON2_OPTIONS);
    next();
});

UserSchema.set("toJSON", {
    transform: (_doc, ret) => {
        delete ret.password;
        return ret;
    }
})

const User = mongoose.model('User', UserSchema);
export default User;