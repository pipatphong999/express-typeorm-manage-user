import Joi, { AnySchema } from "joi";

const myJoi = Joi.defaults((schema: AnySchema) => {
    return schema.options({
        abortEarly: false,
    });
});
export default myJoi;
