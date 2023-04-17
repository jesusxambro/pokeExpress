export const pokeCardRequirements  = async (req :any, res:any, next:any) => {
    // console.log(req);
    
    try {
      const required = [
        "hp",
        "description",
        "name",
        "type",
      ];
      for (const requiredField of required) {
        if (!req.body?.[requiredField]) {
            console.log(req.body);
          return res
            .status(400)
            .json({ error: `${requiredField} is a required field` });
        }
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error Creating Card..." });
    }
  };
  