type simpleSchema = {
  key: string,
  type: string | number
}[]

export const simpleBodyValidator = (requirements : simpleSchema) => async (req :any, res:any, next:any) => {
  
    try {
      for (const requiredField of requirements) {
        if (!req.body?.[requiredField.key] || (typeof req.body?.[requiredField.key] !== typeof requiredField.type)) {
            console.log(req.body);
          return res
            .status(400)
            .json({ error: `${requiredField.key} is a required field` });
        }
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error Creating Card..." });
    }
  };
  