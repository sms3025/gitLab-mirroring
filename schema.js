const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');
const nameJ = /^[가-힣]{2,6}$/;
const passwordJ = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
const loginidJ = /^[a-z]+[a-z0-9]{5,19}$/g;
const nicknameJ = /^[a-zA-Zㄱ-힣]+[a-zA-Zㄱ-힣 ]{1,9}$/;

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)


const UserSchema = Joi.object({
    User: Joi.object({
        name: Joi.string().pattern(new RegExp(nameJ)).required().escapeHTML(),
        password: Joi.string().pattern(new RegExp(passwordJ)).required(),
        loginid: Joi.string().pattern(new RegExp(loginidJ)).required(),
        nickname: Joi.string().pattern(new RegExp(nicknameJ)).required(),

    }).required()
});
